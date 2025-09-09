"use client";

import { create } from "zustand";
import {
  User,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { isEmailSigned, linkTwitter, signDoc } from "@/api/user";
import { auth, googleProvider } from "../firebase";
import { unlink } from "firebase/auth";

interface AuthState {
  user: User | null;
  loading: boolean;
  userSigned: boolean;
  signInWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setUserSigned: (signed: boolean) => void;
  twitterLinked: boolean;
  twitterUsername: string;
  twitterProfilePic: string;
  connectTwitter: () => Promise<void>;
  signDocument: (args: {
    alias: string;
    wantNameInLeaderboard: boolean;
  }) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  userSigned: false,

  twitterLinked: false,
  twitterUsername: "",
  twitterProfilePic: "",

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setUserSigned: (signed) => set({ userSigned: signed }),

  signInWithGoogle: async (): Promise<User | null> => {
    try {
      set({ loading: true });
      const userCredential = await signInWithPopup(auth, googleProvider);
      const providerData = userCredential.user.providerData;
      const hasTwitter = providerData.some(
        (info) => info.providerId === "twitter.com"
      );
      if (hasTwitter && auth.currentUser) {
        await unlink(auth.currentUser, "twitter.com");
      }
      set({ user: userCredential.user });

      return userCredential.user;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      return null;
    } finally {
      set({ loading: false });
    }
  },
  connectTwitter: async () => {
    try {
      const result = await linkTwitter();
      if (result) {
        set({
          twitterLinked: true,
          twitterUsername: result.username,
          twitterProfilePic: result.profilePic,
        });
      }
      return;
    } catch (error) {
      console.error("Error connecting Twitter:", error);
    }
  },
  signDocument: async ({
    alias,
    wantNameInLeaderboard = false,
  }: {
    alias: string;
    wantNameInLeaderboard: boolean;
  }) => {
    try {
      const {
        user,
        twitterLinked,
        twitterUsername,
        twitterProfilePic,
        setUserSigned,
      } = useAuthStore.getState();

      if (!user) return;
      const trimmedName = alias;

      await signDoc({
        email: user.email ?? "",
        name: trimmedName,
        twitterUsername: twitterLinked ? twitterUsername : null,
        twitterProfilePic: twitterLinked ? twitterProfilePic : null,
        showNameInLeaderboard: wantNameInLeaderboard,
        uid:user.uid
      });

      setUserSigned(true);
    } catch (error) {
      console.error("Error signing document:", error);
    }
  },
  logout: async () => {
    try {
      set({ loading: true });
      await signOut(auth);
      set({ user: null, userSigned: false });
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));

// 🔹 Initialize Firebase auth listener
onAuthStateChanged(auth, async (user) => {
  if (user?.email) {
    try {
      const signed = await isEmailSigned(user.email);
      useAuthStore.setState({ user, userSigned: signed, loading: false });
    } catch (err) {
      console.error("Error checking if email is signed:", err);
      useAuthStore.setState({ user, userSigned: false, loading: false });
    }
  } else {
    useAuthStore.setState({ user: null, userSigned: false, loading: false });
  }
});
