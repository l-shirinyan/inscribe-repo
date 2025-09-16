"use client";

import { fetchLeaderboardUsers, getNumberOfSigners } from "@/api/leaderboard";
import LeaderboardHero from "@/components/leaderboard/leaderboard-hero";
import LeaderboardTable from "@/components/leaderboard/leaderboard-table";
import { Text } from "@/components/ui/text";
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

const LeaderBoardPage = () => {
  const t = useTranslations('Leaderboard');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchLeaderboardUsers();
        setUsers(data?.users || []);
      } catch (error) {
        console.error('Error loading leaderboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="font-circular bg-white min-h-screen flex flex-col items-center justify-center p-5">
        <Text variant={"4Xl"} className="font-normal text-center">
          {t('loading')}
        </Text>
      </div>
    );
  }

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
              {t('title')}
            </Text>
            <div className="py-1 text-base sm:text-[32px] font-medium md:absolute md:right-5">
              {users.length}
              <p className="text-base">{t('totalSigners')}</p>
            </div>
          </div>
          <LeaderboardTable numberOfSigners={users.length} />
        </div>
      </div>
    </>
  );
};

export default LeaderBoardPage;
