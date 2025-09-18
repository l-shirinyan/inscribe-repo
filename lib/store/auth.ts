"use client";

import { create } from "zustand";
import {
  User,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { isEmailSigned, linkTwitter, signDoc, uploadSignatureImage } from "@/api/user";
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
    signedByText?: string;
  }) => Promise<void>;
  aliasName?: string;
  setAliasName: (name: string) => void;
  generateSignatureImage: (aliasName: string, signedByText?: string) => Promise<Blob>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  userSigned: false,
  aliasName: "",
  twitterLinked: false,
  twitterUsername: "",
  twitterProfilePic: "",

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setUserSigned: (signed) => set({ userSigned: signed }),
  setAliasName: (name) => set({ aliasName: name }),
  generateSignatureImage: async (aliasName: string, signedByText: string = 'Signed by:'): Promise<Blob> => {
    try {
      const htmlToImage = await import('html-to-image');
      
      // Helper function to calculate scale factor (same logic as AutoFitText component)
      const calculateScale = (text: string, containerWidth: number): number => {
        // Create a temporary element to measure text width
        const tempElement = document.createElement('div');
        tempElement.style.position = 'absolute';
        tempElement.style.visibility = 'hidden';
        tempElement.style.whiteSpace = 'nowrap';
        tempElement.style.fontSize = '48px'; // text-5xl equivalent
        tempElement.style.fontFamily = 'Ludovico, sans-serif';
        tempElement.style.letterSpacing = '1.1px';
        tempElement.textContent = text;
        
        document.body.appendChild(tempElement);
        const textWidth = tempElement.offsetWidth;
        document.body.removeChild(tempElement);
        
        // Calculate scale factor if text is too wide (same logic as AutoFitText)
        if (textWidth > containerWidth) {
          return containerWidth / textWidth;
        } else {
          return 1;
        }
      };
      
      // Calculate scale factor for the alias name (same as AutoFitText component)
      const containerWidth = 230; // sm:w-[230px] equivalent
      const scale = calculateScale(aliasName, containerWidth);
      
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '0';
      container.style.top = '0';
      container.style.zIndex = '-1';
      container.style.width = '600px';
      container.style.height = '500px';
      container.style.background = 'transparent';
      container.className = 'bg-stars flex justify-center relative bg-repeat-x bg-cover';
      
      container.innerHTML = `
        <div class="relative flex justify-center items-center w-max h-full">
          <img 
            src="/assets/images/my-signature.png" 
            alt="my_sinature" 
            width="600"
            height="500"
            class="h-full object-contain"
            crossOrigin="anonymous"
          />
          <div class="flex flex-col items-center w-full absolute mt-10 pl-5">
            <div class="flex flex-col items-center w-max font-ludovico tracking-[1.1px]">
              <div class="text-lg pb-2" style="color: black;">${signedByText}</div>
              <div class="w-[110px] min-[400px]:w-[170px] sm:w-[230px] h-max flex items-center justify-center overflow-hidden">
                <div style="transform: scale(${scale}); transform-origin: center;">
                  <div class="text-5xl whitespace-nowrap" style="color: black;">${aliasName}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(container);
      
      const img = container.querySelector('img') as HTMLImageElement;
      await new Promise((resolve, reject) => {
        if (img.complete) {
          resolve(true);
        } else {
          img.onload = () => resolve(true);
          img.onerror = () => reject(new Error('Failed to load signature image'));
        }
      });
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const dataUrl = await htmlToImage.toPng(container, {
        width: 600,
        height: 500,
        backgroundColor: 'transparent'
      });
      
      document.body.removeChild(container);
      
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      return blob;
    } catch (error) {
      console.error('Error generating signature image:', error);
      throw error;
    }
  },
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
    signedByText = 'Signed by:',
  }: {
    alias: string;
    wantNameInLeaderboard: boolean;
    signedByText?: string;
  }) => {
    try {
      const {
        user,
        twitterLinked,
        twitterUsername,
        twitterProfilePic,
        setUserSigned,
        setAliasName,
        generateSignatureImage
      } = useAuthStore.getState();

      if (!user) {
        throw new Error("User not authenticated");
      }

      if (!alias || alias.trim().length === 0) {
        throw new Error("Name or alias is required");
      }

      const trimmedName = alias.trim();

      let signatureImageUrl: string | null = null;
      try {
        const signatureBlob = await generateSignatureImage(trimmedName, signedByText);
        signatureImageUrl = await uploadSignatureImage(signatureBlob, user.uid);
      } catch (error) {
        console.error("Error generating/uploading signature image:", error);
        // Continue without signature image - don't fail the entire process
      }

      await signDoc({
        email: user.email ?? "",
        name: trimmedName,
        twitterUsername: twitterLinked ? twitterUsername : null,
        twitterProfilePic: twitterLinked ? twitterProfilePic : null,
        showNameInLeaderboard: wantNameInLeaderboard,
        uid: user.uid,
        signatureImageUrl,
      });
      
      setUserSigned(true);
      setAliasName(trimmedName);
    } catch (error) {
      console.error("Error signing document:", error);
      throw error;
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

      // Set user cookie for server-side access
      if (typeof document !== "undefined") {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
        document.cookie = `user=${JSON.stringify(
          userData
        )}; path=/; max-age=86400; SameSite=Lax`;
      }
    } catch (err) {
      console.error("Error checking if email is signed:", err);
      useAuthStore.setState({ user, userSigned: false, loading: false });

      // Clear cookie on error
      if (typeof document !== "undefined") {
        document.cookie =
          "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    }
  } else {
    useAuthStore.setState({ user: null, userSigned: false, loading: false });

    // Clear cookie when user logs out
    if (typeof document !== "undefined") {
      document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }
});
