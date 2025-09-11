import { cookies } from 'next/headers';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export interface ServerUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  isSigned: boolean;
  name?: string;
  twitterUsername?: string | null;
  twitterProfilePic?: string | null;
}

export async function getServerUser(): Promise<ServerUser | null> {
  try {
    const cookieStore = await cookies() as any;
    const userCookie = cookieStore.get('user');
    
    if (!userCookie?.value) {
      return null;
    }

    const userData = JSON.parse(userCookie.value);
    
    // Get additional user data from Firestore
    const userRef = doc(db, "signers", userData.uid);
    const userSnap = await getDoc(userRef);
    
    const firestoreData = userSnap.exists() ? userSnap.data() : null;
    
    return {
      uid: userData.uid,
      email: userData.email,
      displayName: userData.displayName,
      photoURL: userData.photoURL,
      isSigned: !!firestoreData,
      name: firestoreData?.name,
      twitterUsername: firestoreData?.twitterUsername,
      twitterProfilePic: firestoreData?.twitterProfilePic,
    };
  } catch (error) {
    console.error('Error getting server user:', error);
    return null;
  }
}
