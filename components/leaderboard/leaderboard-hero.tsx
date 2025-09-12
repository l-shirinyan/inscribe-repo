"use client";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { useAuthStore } from "@/lib/store/auth";
import { DownloadIcon } from "lucide-react";

const LeaderboardHero = () => {
  const { user, loading } = useAuthStore();

  if (loading || !user) return null;

  const handleDownload = () => {
    const imageUrl = `/api/og?user=${user.displayName}`;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "my-signature.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex flex-col items-center absolute bottom-[20vw] sm:bottom-[14vw] lg:bottom-[12vw] xl:bottom-[13vw] w-full pb-2 lg:pb-10">
        <div className="flex flex-col items-center w-max">
          <Text variant={"2Xl"} className="max-lg:!text-lg max-sm:hidden">
            Signed by:
          </Text>
          <Text
            variant={"2Xl"}
            className="max-lg:!text-base max-sm:!text-xs backdrop-blur-lg"
          >
            {user?.displayName}
          </Text>
        </div>
      </div>
      <div className="flex w-full absolute bottom-5 justify-center">
        <Button
          onClick={handleDownload}
          className="text-sm bg-orange max-lg:text-sm text-white mt-2 lg:mt-8 max-lg:w-max lg:max-w-[300px] w-full font-geist-sans gap-5"
        >
          Download Signature <DownloadIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export default LeaderboardHero;
