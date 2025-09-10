import { getNumberOfSigners } from "@/api/leaderboard";
import LeaderboardHero from "@/components/leaderboard/leaderboard-hero";
import LeaderboardTable from "@/components/leaderboard/leaderboard-table";
import { Text } from "@/components/ui/text";

export const metadata = {
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
        url: "https://inscribe-coral.vercel.app/assets/images/meta.png",
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
      url: "https://inscribe-coral.vercel.app/assets/images/meta.png",
      alt: "Leaderboard - Top Signers",
    },
    ],
    site: "@Inscribe",
    creator: "@Inscribe",
  },
};

const LeaderBoardPage = async () => {
  const { numberOfLeaderboardSigners = 0, numberOfSigners = 0 } =
    (await getNumberOfSigners()) || {};

  return (
    <>

      <div className="bg-leaderboard relative bg-no-repeat h-[54vw] sm:h-[40vw] bg-size-[100vw] max-sm:bg-center max-sm:bg-size-[135%]">
        <LeaderboardHero />
      </div>
      <div className="font-geist-sans bg-white min-h-screen flex flex-col items-center p-5">
        <div className="flex justify-between w-full pt-4 sm:pt-8 pb-8 sm:pb-16 flex-col sm:flex-row gap-4">
          <Text variant={"3Xl"} className="">
            Signers Leaderboard
          </Text>
          <div className="flex gap-3">
            <div className="tag py-1">Total signers {numberOfSigners}</div>
            <div className="tag py-1">{numberOfLeaderboardSigners} names</div>
          </div>
        </div>
        <LeaderboardTable />
      </div>
    </>
  );
};

export default LeaderBoardPage;
