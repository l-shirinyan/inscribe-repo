import { auth, db, storage } from "@/lib/firebase";
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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface SignDocParams {
  email: string;
  name: string;
  showNameInLeaderboard?: boolean;
  twitterUsername?: string | null;
  twitterProfilePic?: string | null;
  uid: string;
  signatureImageUrl?: string | null;
}

// Size validation constant
const MAX_FIRESTORE_DOCUMENT_SIZE = 512 * 1024; // 512 KB in bytes

const compressImage = async (imageBlob: Blob, maxSizeBytes: number = MAX_FIRESTORE_DOCUMENT_SIZE): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      let { width, height } = img;
      let quality = 0.9;
      
      const compress = () => {
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }
          
          if (blob.size <= maxSizeBytes) {
            resolve(blob);
            return;
          }
          
          if (quality > 0.1) {
            quality -= 0.1;
          } else if (width > 100 && height > 100) {
            width = Math.floor(width * 0.9);
            height = Math.floor(height * 0.9);
            quality = 0.9;
          } else {
            resolve(blob);
            return;
          }
          
          compress();
        }, 'image/jpeg', quality);
      };
      
      compress();
    };
    
    img.onerror = () => reject(new Error('Failed to load image for compression'));
    img.src = URL.createObjectURL(imageBlob);
  });
};

export const uploadSignatureImage = async (
  signatureImageBlob: Blob,
  uid: string
): Promise<string> => {
  try {
    let finalBlob = signatureImageBlob;
    
    if (signatureImageBlob.size > MAX_FIRESTORE_DOCUMENT_SIZE) {
      finalBlob = await compressImage(signatureImageBlob);
    }

    const signatureRef = ref(storage, `signature_images/${uid}.png`);
    const snapshot = await uploadBytes(signatureRef, finalBlob);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading signature image:", error);
    throw error;
  }
};

/**
 * Validates that a Firestore document doesn't exceed the size limit
 * @param data - The data object to validate
 * @returns boolean - True if within size limit, false otherwise
 */
export const validateFirestoreDocumentSize = (data: any): boolean => {
  try {
    const jsonString = JSON.stringify(data);
    const sizeInBytes = new Blob([jsonString]).size;
    return sizeInBytes <= MAX_FIRESTORE_DOCUMENT_SIZE;
  } catch (error) {
    console.error("Error validating document size:", error);
    return false;
  }
};

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
  signatureImageUrl,
}: SignDocParams) => {
  try {
    // Validate required parameters
    if (!email || !name || !uid) {
      throw new Error("Missing required parameters: email, name, or uid");
    }

    const userRef = doc(db, "signers", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Prepare the document data
      const documentData = {
        email: email.trim(),
        name: name.trim(),
        showNameInLeaderboard,
        twitterUsername: twitterUsername?.trim() || null,
        twitterProfilePic: twitterProfilePic || null,
        signatureImageUrl: signatureImageUrl || null,
        createdAt: new Date(),
      };

      // Validate document size before saving
      if (!validateFirestoreDocumentSize(documentData)) {
        throw new Error("Document size exceeds the 512KB limit");
      }

      // Create the user document
      await setDoc(userRef, documentData);

      // Handle metadata updates with proper error handling
      try {
        const metadataRef = doc(db, "metadata", "signers_metadata");
        const metadataSnap = await getDoc(metadataRef);
        
        if (metadataSnap.exists()) {
          // Update existing metadata
          await updateDoc(metadataRef, {
            numberOfSigners: increment(1),
          });
          if (showNameInLeaderboard) {
            await updateDoc(metadataRef, {
              numberOfLeaderboardSigners: increment(1),
            });
          }
        } else {
          // Create new metadata document
          await setDoc(metadataRef, {
            numberOfSigners: 1,
            numberOfLeaderboardSigners: showNameInLeaderboard ? 1 : 0,
            lastUpdated: new Date(),
          });
        }
      } catch (metadataError) {
        console.error("Error updating metadata:", metadataError);
        // Don't fail the entire operation if metadata update fails
        // The user document was already created successfully
      }
    } else {
      console.log("User already exists in signers collection");
    }
  } catch (error) {
    console.error("Error signing document:", error);
    throw error;
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

    const username =
      //@ts-ignore
      (credential._tokenResponse.screenName || credential.user.displayName) ??
      "";

    const twitterData = credential.user.providerData.find(
      (p) => p.providerId === "twitter.com"
    );

    const profilePic = twitterData?.photoURL ?? "";

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

export const getUserData = async (email: string | null) => {
  if (!email) return;
  const q = query(collection(db, "signers"), where("email", "==", email));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  const users: any[] = [];
  querySnapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() });
  });

  return users.length === 1 ? users[0] : users;
};
