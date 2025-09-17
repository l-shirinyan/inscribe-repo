import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBoy8hpdSwa48SN_h5lxCqpkj_AHmp5zqI",
  appId: "1:216110440373:web:c64acb8db69c9ac8e443fc",
  messagingSenderId: "216110440373",
  projectId: "inscribe-doc",
  authDomain: "inscribe-doc.firebaseapp.com",
  storageBucket: "inscribe-doc.firebasestorage.app",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
