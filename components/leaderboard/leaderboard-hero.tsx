"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { useAuthStore } from "@/lib/store/auth";

const LeaderboardHero = () => {
  const { user, loading } = useAuthStore();
  if (loading || !user) return;
  const tweetUrl = `https://twitter.com/intent/tweet?text=Check%20out%20the%20leaderboard!&url=${encodeURIComponent(`${window.location.origin}/leaderboard?user=${encodeURIComponent(user?.displayName || "user")}`)}`;

  const handleShare = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const width = 550;
    const height = 420;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
   
    window.open(
      tweetUrl,
      "Share to Twitter",
      `width=${width},height=${height},top=${top},left=${left},resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no,status=no`
    );
  };
  return (
    <div className="flex flex-col items-center absolute bottom-0 w-full pb-2 lg:pb-10">
      <div className="flex flex-col items-center backdrop-blur-[2px] w-max">
        <Text variant={"3Xl"} className="max-lg:!text-lg max-sm:hidden">
          Signed by:
        </Text>
        <Text variant={"4Xl"} className="max-lg:!text-base">
          {user?.displayName}
        </Text>
        <Button
          onClick={handleShare}
          className="text-xl lg:py-3 bg-orange max-lg:text-sm text-white mt-2 lg:mt-8 max-lg:w-max lg:max-w-[300px] w-full font-geist-sans gap-5"
        >
          Share Now{" "}
          <Image
            src="/assets/images/twitter.png"
            alt="twitter"
            width={30}
            height={30}
            className="max-sm:size-5"
          />
        </Button>
      </div>
    </div>
  );
};

export default LeaderboardHero;
