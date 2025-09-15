"use client";
import { getUserData } from "@/api/user";
import { useAuthStore } from "@/lib/store/auth";
import { useEffect } from "react";

const InitializeUser = () => {
  const { user, setAliasName } = useAuthStore();
  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.email) return;
      const signer = await getUserData(user.email);
      if (signer) {
        setAliasName(signer.name);
      }
    };

    fetchUser();
  }, [user?.email]);
  return null;
};

export default InitializeUser;
