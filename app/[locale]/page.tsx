"use client";
import { useEffect, useState } from "react";
import PrinciplesContent from "@/components/landing";
import ScrollLottie from "@/components/landing/scroll-lottie";
import SignInGoogle from "@/components/landing/sign-in-google";
import { Text } from "@/components/ui/text";
import { useImagePreloader } from "@/lib/hooks/usePreload";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useTranslations } from 'next-intl';

export default function LandingPage() {
  const isLoaded = useImagePreloader();
  const [scrollY, setScrollY] = useState(0);
  const t = useTranslations('Signature');

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isLoaded)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <DotLottieReact
          src="/assets/loader.json"
          loop
          autoplay
          className="max-w-[200px] sm:max-w-[350px] w-full"
        />
      </div>
    );

  return (
    <div
      className="bg-mobile-stars sm:bg-stars bg-repeat bg-size-[50vw] bg-fixed"
      style={{
        backgroundPosition: `center ${-scrollY * 0.3}px`, // Parallax effect
      }}
    >
      <ScrollLottie />
      <div className="bg-banner-mobile sm:bg-banner sticky -top-14 bg-no-repeat h-[46.6vw] sm:h-[34.6vw] bg-size-[100vw] max-sm:bg-center max-sm:bg-size-[135%]" />
      <div className="bg-[url('/assets/images/1-mobile.png')] sm:bg-[url('/assets/images/1.png')] top-[64px] absolute w-full bg-no-repeat h-[46.6vw] sm:h-[34.6vw] bg-size-[100vw] max-sm:bg-center max-sm:bg-size-[135%]" />
      <div
        className="w-full min-h-[600px] relative bg-merge mt-[62px] bg-[url('/assets/images/footer-mobile.png'),url('/assets/images/paper-mobile.png')] sm:bg-[url('/assets/images/footer.png'),url('/assets/images/paper.png')] bg-[length:135%_auto,135%_auto] sm:bg-[length:100%_auto,100%_auto]"
        style={{
          backgroundRepeat: "no-repeat, repeat-y",
          backgroundPosition: "bottom,top",
        }}
      >
        <div className="text-black container last:pb-5">
          <PrinciplesContent />
          <div className="text-black container flex flex-col items-center mb-20 sm:mb-40">
            <Text className="sm:text-3xl font-bold text-center mb-4 text-2xl">
              {t('title')}
            </Text>
            <div
              className="max-w-[550px] w-full mx-auto flex flex-col gap-5 items-center"
              id="signature"
            >
              <Text variant={"Base"} className="text-center">
                {t('text')}
              </Text>
              <SignInGoogle />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
