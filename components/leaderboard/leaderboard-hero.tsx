"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { useAuthStore } from "@/lib/store/auth";
import { DownloadIcon } from "lucide-react";
import * as htmlToImage from "html-to-image";
import Image from "next/image";
const AutoFitText = ({ aliasName }: { aliasName: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const textWidth = textRef.current.scrollWidth;

    if (textWidth > containerWidth) {
      setScale(containerWidth / textWidth);
    } else {
      setScale(1);
    }
  }, [aliasName]);

  return (
    <div
      ref={containerRef}
      className="w-[110px] min-[400px]:w-[170px] sm:w-[230px] h-max flex items-center justify-center overflow-hidden"
    >
      <div
        ref={textRef}
        style={{ transform: `scale(${scale})`, transformOrigin: "center" }}
      >
        <Text className="text-5xl whitespace-nowrap">{aliasName}</Text>
      </div>
    </div>
  );
};
const LeaderboardHero = () => {
  const { user, loading, aliasName } = useAuthStore();

  const signatureRef = useRef<HTMLDivElement>(null);

  if (loading || !user) return null;

  const handleDownload = async () => {
    if (!signatureRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(signatureRef.current);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "signature.png";
      link.click();
    } catch (err) {
      console.error("Error generating image:", err);
    }
  };

  return (
    <div className="bg-stars flex justify-center relative bg-repeat-x sm:h-[460px] sm:min-h-[50vh] bg-cover">
      <div
        ref={signatureRef}
        className="relative flex justify-center items-center w-max h-full"
      >
        <Image
          src="/assets/images/my-signature.png"
          width={600}
          height={500}
          alt="my_sinature"
          className="h-full object-contain sm:object-cover"
        />
        <div className="flex flex-col items-center w-full absolute mt-10 pl-5 sm:pl-10">
          {aliasName && (
            <div className="flex flex-col items-center w-max font-ludovico tracking-[1.1px]">
              <Text variant={"Lg"} className="pb-2">Signed by:</Text>
              <AutoFitText aliasName={aliasName} />
            </div>
          )}
        </div>
      </div>
      <div className="flex w-full absolute bottom-2 sm:bottom-3 justify-center">
        <Button
          onClick={handleDownload}
          className="bg-orange max-lg:text-sm text-white mt-2 lg:mt-8 max-lg:w-max lg:max-w-[300px] w-full font-geist-sans gap-5"
        >
          Download Signature <DownloadIcon className="size-3 sm:size-4" />
        </Button>
      </div>
    </div>
  );
};

export default LeaderboardHero;
