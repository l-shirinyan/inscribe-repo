import PrinciplesContent from "@/components/landing";
import ScrollLottie from "@/components/landing/scroll-lottie";
import SignInGoogle from "@/components/landing/sign-in-google";
import { Text } from "@/components/ui/text";

export default function LandingPage() {
  return (
    <div className="bg-stars bg-repeat bg-size-[50vw] bg-fixed">
      <ScrollLottie />
      <div className="bg-banner bg-no-repeat h-[46.6vw] sm:h-[34.6vw] bg-size-[100vw] max-sm:bg-center max-sm:bg-size-[135%]" />
      <div
        className="w-full min-h-[600px] bg-merge -mt-1 sm:mt-[-1px] bg-[url('/assets/images/test-3.png'),url('/assets/images/test-2.png')] bg-[length:135%_auto,135%_auto] sm:bg-[length:100%_auto,100%_auto]"
        style={{
          backgroundRepeat: "no-repeat, repeat-y",
          backgroundPosition: "bottom,top",
        }}
      >
        <div className="text-black container last:pb-5">
          <PrinciplesContent />
          <div className="text-black container flex flex-col items-center mb-20 sm:mb-40">
            <Text className="sm:text-3xl font-bold text-center mb-4 text-2xl">
              Signature
            </Text>
            <div
              className="max-w-[550px] w-full mx-auto flex flex-col gap-5 items-center"
              id="signature"
            >
              <Text variant={"Base"} className="text-center">
                I hereby adapt the Iniveral Principle of Liberty, and to the
                legitimacy of any laws and legal system based thereon.
              </Text>
              <SignInGoogle />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
