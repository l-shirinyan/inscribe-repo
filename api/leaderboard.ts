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
}

export interface LeaderboardPageData {
  users: LeaderboardUser[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
}

export async function fetchLeaderboardUsers(
  startAfterDoc?: QueryDocumentSnapshot<DocumentData> | null,
  limitCount: number = 50
): Promise<LeaderboardPageData> {
  try {
    let q = query(
      collection(db, "signers"),
      where("showNameInLeaderboard", "==", true),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    if (startAfterDoc) {
      q = query(
        collection(db, "signers"),
        where("showNameInLeaderboard", "==", true),
        orderBy("createdAt", "desc"),
        startAfter(startAfterDoc),
        limit(limitCount)
      );
    }

    const querySnapshot = await getDocs(q);

    const users: LeaderboardUser[] = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Omit<LeaderboardUser, "id" | "createdAt"> & {
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
      };
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
