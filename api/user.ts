import { auth, db } from "@/lib/firebase";
import { linkWithPopup, TwitterAuthProvider } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";

interface SignDocParams {
  email: string;
  name: string;
  showNameInLeaderboard?: boolean;
  twitterUsername?: string | null;
  twitterProfilePic?: string | null;
  uid: string;
}

export async function isEmailSigned(email: string): Promise<boolean> {
  if (!email) return false;

  try {
    // Example: suppose you have a "users" collection with "email" field
    const q = query(collection(db, "signers"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty; // true if email exists in Firestore
  } catch (error) {
    console.error("Error checking email:", error);
    return false;
  }
}

export const signDoc = async ({
  email,
  name,
  showNameInLeaderboard = false,
  twitterUsername,
  twitterProfilePic,
  uid,
}: SignDocParams) => {
  try {
    const userRef = doc(db, "signers", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Create the user document
      await setDoc(userRef, {
        email,
        name,
        showNameInLeaderboard,
        twitterUsername: twitterUsername || null,
        twitterProfilePic: twitterProfilePic || null,
        createdAt: new Date(),
      });

      const metadataRef = doc(db, "metadata", "signers_metadata");
      await updateDoc(metadataRef, {
        numberOfSigners: increment(1),
      });
      if (showNameInLeaderboard) {
        await updateDoc(metadataRef, {
          numberOfLeaderboardSigners: increment(1),
        });
      }
    }
  } catch (error) {
    console.error("Error signing document:", error);
  }
};

export const linkTwitter = async (): Promise<{
  username: string;
  profilePic: string;
} | null> => {
  if (!auth.currentUser) return null;

  try {
    const existingTwitter = auth.currentUser.providerData.find(
      (p) => p.providerId === "twitter.com"
    );
    if (existingTwitter) {
      const username = existingTwitter.displayName ?? "";
      let profilePic = existingTwitter.photoURL ?? "";
      if (profilePic) profilePic = profilePic.replace("_normal", "_400x400");

      return { username, profilePic };
    }

    const twitterProvider = new TwitterAuthProvider();
    const credential = await linkWithPopup(auth.currentUser, twitterProvider);
    //@ts-ignore
    const username = ((credential._tokenResponse.screenName) || credential.user.displayName) ?? "";
    let profilePic = credential.user.photoURL ?? "";
    if (profilePic) profilePic = profilePic.replace("_normal", "_400x400");

    return { username, profilePic };
  } catch (error: any) {
    if (error.code === "auth/credential-already-in-use") {
      console.warn("Twitter account already linked to another user.");
      return null;
    }
    console.error("Error linking Twitter account:", error);
    return null;
  }
};
