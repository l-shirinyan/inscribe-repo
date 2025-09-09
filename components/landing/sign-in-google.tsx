"use client";

import { useState } from "react";
import NameOrAlias from "./name-or-alias";
import { Button } from "../ui/button";
import Image from "next/image";
import { useAuthStore } from "@/lib/store/auth";
import { Text } from "../ui/text";

const SignInGoogle = () => {
  const { user, signInWithGoogle, loading, userSigned } =
    useAuthStore();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign in failed:", error);
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <Button disabled className="rounded-4xl w-full max-w-[220px] h-[46px]">
        Loading...
      </Button>
    );
  }
  if (userSigned) {
    return (
      <Text variant={"3Xl"} className="text-center">
        You have already signed the document. Thank you!
      </Text>
    );
  }
  if (user) {
    return <NameOrAlias />;
  }

  return (
    <Button
      onClick={handleSignIn}
      disabled={isSigningIn}
      className="rounded-4xl w-full max-w-[220px] backdrop-blur-lg bg-black/20 text-white"
    >
      <Image
        src="/assets/images/google.svg"
        alt="google"
        width={30}
        height={30}
      />
      {isSigningIn ? "Signing in..." : "Sign in with Google"}
    </Button>
  );
};

export default SignInGoogle;
