import { getNumberOfSigners } from "@/api/leaderboard";
import LeaderboardHero from "@/components/leaderboard/leaderboard-hero";
import LeaderboardTable from "@/components/leaderboard/leaderboard-table";
import { Text } from "@/components/ui/text";
import { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: any): Promise<Metadata> {
  const param = await searchParams;
  const user = encodeURIComponent(param.user);

  return {
    title: "Leaderboard - Signers",
    description: "Check out the top signers on our leaderboard!",
    openGraph: {
      title: "Leaderboard - Signers",
      description: "Check out the top signers on our leaderboard!",
      type: "website",
      url: "https://inscribe-coral.vercel.app/leaderboard",
      siteName: "The Universal Principles of Liberty",
      images: [
        {
          url: "https://inscribe-coral.vercel.app/api/og?user=${user}",
          width: 1200,
          height: 630,
          alt: "Leaderboard - Top Signers",
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: "Leaderboard - Signers",
      description: "Check out the top signers on our leaderboard!",
      images: [
        {
          url: `https://inscribe-coral.vercel.app/api/og?user=${user}`,
          alt: "Leaderboard - Top Signers",
        },
      ],
      site: "@Inscribe",
      creator: "@Inscribe",
    },
  };
}

const LeaderBoardPage = async () => {
  const { numberOfSigners = 0 } = (await getNumberOfSigners()) || {};

  return (
    <>
      <div className="bg-[url('/assets/images/leaderboard-hero.png'),url('/assets/images/stars.png')] relative bg-no-repeat h-[60vw] sm:h-[45vw] bg-size-[100vw] max-sm:bg-center max-sm:bg-size-[135%]">
        <LeaderboardHero />
      </div>
      <div className="font-circular bg-white min-h-screen flex flex-col items-center p-5">
        <div className="w-full max-w-6xl">
          <div className="flex justify-center w-full pt-4 sm:pt-8 pb-4 sm:pb-20 flex-col sm:flex-row gap-4">
            <Text variant={"4Xl"} className="font-normal text-center max-sm:text-xl">
              Signers Leaderboard
            </Text>
            <div className="py-1 text-base sm:text-[32px] font-medium md:absolute md:right-5">
              {numberOfSigners}
              <p className="text-base">Total signers</p>
            </div>
          </div>
          <LeaderboardTable numberOfSigners={numberOfSigners} />
        </div>
      </div>
    </>
  );
};

export default LeaderBoardPage;
