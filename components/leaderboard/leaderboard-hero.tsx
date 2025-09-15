"use client";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { useAuthStore } from "@/lib/store/auth";
import { DownloadIcon } from "lucide-react";
import * as htmlToImage from "html-to-image";
import Image from "next/image";

const LeaderboardHero = () => {
  const { user, loading, aliasName } = useAuthStore();
  const [showSignature, setShowSignature] = useState(false);

  const signatureRef = useRef<HTMLDivElement>(null);

  if (loading || !user) return null;

  const handleDownload = async () => {
    setShowSignature(true);
    await new Promise((r) => setTimeout(r, 100));

    if (!signatureRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(signatureRef.current);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "signature.png";
      link.click();
    } catch (err) {
      console.error("Error generating image:", err);
    } finally {
      setShowSignature(false);
    }
  };

  return (
    <div className="bg-[url('/assets/images/leaderboard-hero.png')] flex justify-center relative bg-no-repeat h-[45vw] md:h-[466px] bg-contain md:bg-size-[100%_100%] max-md:bg-center max-md:bg-size-[135%]">
      <div className="relative flex justify-center items-center">
        <Image
          src={"/assets/images/signature.png"}
          alt="signature"
          width={400}
          height={400}
          className="max-md:w-[36vw]"
        />
        <div className="flex flex-col items-center w-[40%] absolute mt-4 md:mt-12">
          {aliasName && (
            <div className="flex flex-col items-center w-max font-ludovico tracking-[1.1px] pl-2">
              <Text variant={"Lg"} className="max-lg:!text-lg max-md:hidden">
                Signed by:
              </Text>
              <Text
                variant={"2Xl"}
                className="max-lg:!text-base max-sm:!text-xs"
              >
                {aliasName}
              </Text>
            </div>
          )}
        </div>
      </div>
      <div className="flex w-full absolute bottom-2 sm:bottom-5 justify-center">
        <Button
          onClick={handleDownload}
          className="max-sm:text-xs max-sm:py-[2px] max-sm:w-max bg-orange max-lg:text-sm text-white mt-2 lg:mt-8 max-lg:w-max lg:max-w-[300px] w-full font-geist-sans gap-5"
        >
          Download Signature <DownloadIcon className="size-3 sm:size-4" />
        </Button>
      </div>
      {showSignature && (
        <div className="fixed left-[-9999px] top-[-9999px] w-full">
          <div
            ref={signatureRef}
            className="relative flex justify-center items-center w-max h-max"
          >
            <Image
              src="/assets/images/my-signature.png"
              width={600}
              height={500}
              alt="my_sinature"
            />
            <div className="flex flex-col items-center w-full absolute mt-10 pl-4">
              {aliasName && (
                <div className="flex flex-col items-center w-max font-ludovico tracking-[1.1px]">
                  <Text variant={"Lg"}>Signed by:</Text>
                  <Text variant={"2Xl"}>{aliasName}</Text>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardHero;
