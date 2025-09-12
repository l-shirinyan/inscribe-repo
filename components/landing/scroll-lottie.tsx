"use client";
import React from "react";
import { Text } from "../ui/text";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const ScrollLottie = () => {
  return (
    <div
      className="absolute z-[1] w-full flex flex-col items-center justify-center top-[90px] cursor-pointer"
      onClick={() =>
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        })
      }
    >
      <Text variant={"2Xl"} className="max-sm:hidden">Scroll down to sign</Text>
      <DotLottieReact
        src="/assets/down.json"
        loop
        autoplay
        className="w-[120px] -mt-5"
      />
    </div>
  );
};

export default ScrollLottie;
