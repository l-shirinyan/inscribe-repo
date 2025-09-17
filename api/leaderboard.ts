import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
interface SignersData {
  numberOfSigners: number;
  numberOfLeaderboardSigners: number;
}
export interface LeaderboardUser {
  id: string;
  createdAt: string;
  email: string;
  name: string;
  showNameInLeaderboard: boolean;
  twitterProfilePic: string | null;
  twitterUsername: string | null;
  inscriptionUrl?: string | null;
}

export interface LeaderboardPageData {
  users: LeaderboardUser[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
}

export async function fetchLeaderboardUsers(
  startAfterDoc?: QueryDocumentSnapshot<DocumentData> | null,
): Promise<LeaderboardPageData> {
  try {
    // let q = query(
    //   collection(db, "signers"),
    //   // where("showNameInLeaderboard", "==", true),
    //   orderBy("createdAt", "desc"),
    //   // limit(limitCount)
    // );

    // if (startAfterDoc) {
    //   q = query(
    //     collection(db, "signers"),
    //     // where("showNameInLeaderboard", "==", true),
    //     orderBy("createdAt", "desc"),
    //     // startAfter(startAfterDoc),
    //     // limit(limitCount)
    //   );
    // }
    let q = query(
      collection(db, "signers"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const users: LeaderboardUser[] = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Omit<LeaderboardUser, "id" | "createdAt" | "inscriptionUrl"> & {
        createdAt?: any;
      };

      return {
        id: doc.id,
        createdAt:
          typeof data.createdAt?.toDate === "function"
            ? data.createdAt.toDate().toISOString()
            : data.createdAt ?? "",
        email: data.email,
        name: data.name,
        showNameInLeaderboard: data.showNameInLeaderboard,
        twitterProfilePic: data.twitterProfilePic ?? null,
        twitterUsername: data.twitterUsername ?? null,
        inscriptionUrl: null,
      };
    });

    const inscriptionPromises = users.map(async (user) => {
      try {
        const inscriptionUrl = await getInscriptionUrlForUser(user.id);
        return { userId: user.id, inscriptionUrl };
      } catch (error) {
        return { userId: user.id, inscriptionUrl: null };
      }
    });

    const inscriptionResults = await Promise.allSettled(inscriptionPromises);
    
    inscriptionResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        const { userId, inscriptionUrl } = result.value;
        const user = users.find(u => u.id === userId);
        if (user) {
          user.inscriptionUrl = inscriptionUrl;
        }
      }
    });

    return {
      users,
      lastDoc:
        querySnapshot.docs.length > 0
          ? querySnapshot.docs[querySnapshot.docs.length - 1]
          : null,
    };

  } catch (error) {
    console.error("Error fetching leaderboard users:", error);
    return { users: [], lastDoc: null };
  }
}

export const getNumberOfSigners = async (): Promise<SignersData | null> => {
  try {
    const metadataRef = doc(db, "metadata", "signers_metadata");
    const metadataSnap = await getDoc(metadataRef);

    if (metadataSnap.exists()) {
      const data = metadataSnap.data();
      return {
        numberOfSigners: data.numberOfSigners || 0,
        numberOfLeaderboardSigners: data.numberOfLeaderboardSigners || 0,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting number of signers:", error);
    return null;
  }
};

export const getInscriptionUrlForUser = async (userId: string): Promise<string | null> => {
  try {
    const stampsQuery = query(
      collection(db, "stamps"),
      where("signer_ids", "array-contains", userId)
    );
    const stampsSnapshot = await getDocs(stampsQuery);

    if (stampsSnapshot.empty) {
      return null;
    }

    for (const stampDoc of stampsSnapshot.docs) {
      const stampData = stampDoc.data();
      
      if (stampData.confirmation_block) {
        const confirmationBlock = String(stampData.confirmation_block);
        return `https://www.blockchain.com/explorer/blocks/btc/${confirmationBlock}`;
      }
    }

    return null;
  } catch (error: any) {
    console.error("Error fetching inscription URL for user:", error);
    return null;
  }
};
