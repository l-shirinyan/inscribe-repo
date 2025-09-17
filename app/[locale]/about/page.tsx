import { Text } from "@/components/ui/text";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export const metadata = {
  title: "About Us - Inscribe",
  description: "Learn about the Universal Principles of Liberty and our mission.",
};

const AboutPage = () => {
  const t = useTranslations('About');
  
  return (
    <div className="bg-stars bg-repeat bg-size-[50vw] bg-fixed min-h-[calc(100vh-64px)]">
      <div className="bg-[url('/assets/images/banner.png')] bg-no-repeat h-[46.6vw] sm:h-[34.6vw] bg-size-[100vw] max-sm:bg-center max-sm:bg-size-[135%]" />
      <div
        className="w-full min-h-[75vh] sm:min-h-screen xl:min-h-[88vh] bg-merge -mt-1 sm:mt-[-1px] bg-[url('/assets/images/footer.png'),url('/assets/images/paper.png')] bg-[length:135%_auto,135%_auto] sm:bg-[length:100%_auto,100%_auto]"
        style={{
          backgroundRepeat: "no-repeat, repeat-y",
          backgroundPosition: "bottom,top",
        }}
      >
        <div className="text-black text-center pb-20 text-base sm:text-lg [&_a]:font-medium container items-center gap-5">
          <Text variant={"4Xl"} className="pb-5">
            {t('title')}
          </Text>
          {t('intro')}{" "}
          <Link href="https://x.com/NSKinsella" target="_blank">
            {t('stephanKinsella')}
          </Link>
          ,{" "}
          <Link href="https://x.com/_Freemax" target="_blank">
            {t('freemax')}
          </Link>
          ,{" "}
          <Link href="https://x.com/AlessandroFusi9" target="_blank">
            {t('alessandroFusillo')}
          </Link>
          , {t('andDavidDurr')} — {t('andHansHermannHoppe')} — {t('documentExpresses')}
          {t('notConstitution')}
          {t('declaration')}
          {t('byReading')}
          {t('theyAffirm')}
          {t('takingInspiration')}
          {t('everySignature')}
          {t('morePeople')}
          {t('missionClear')}
          {t('universalPrinciples')}{" "}
          <Link href="https://www.ord.io/103525220" target="_blank">
            {t('inscribedOnBitcoin')}
          </Link>{" "}
          — {t('immutableBorderless')}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;