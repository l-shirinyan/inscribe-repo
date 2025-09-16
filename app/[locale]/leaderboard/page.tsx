import { fetchLeaderboardUsers, getNumberOfSigners } from "@/api/leaderboard";
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
  };
}

const LeaderBoardPage = async () => {
  const { users } = (await fetchLeaderboardUsers()) || {};

  return (
    <>
      <LeaderboardHero />
      <div className="font-circular bg-white min-h-screen flex flex-col items-center p-5">
        <div className="w-full max-w-6xl">
          <div className="flex justify-center w-full pt-4 sm:pt-8 pb-4 sm:pb-20 flex-col sm:flex-row gap-4">
            <Text
              variant={"4Xl"}
              className="font-normal text-center max-sm:text-xl"
            >
              Signers Leaderboard
            </Text>
            <div className="py-1 text-base sm:text-[32px] font-medium md:absolute md:right-5">
              {users.length}
              <p className="text-base">Total signers</p>
            </div>
          </div>
          <LeaderboardTable numberOfSigners={users.length} />
        </div>
      </div>
    </>
  );
};

export default LeaderBoardPage;
