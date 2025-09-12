import { Text } from "@/components/ui/text";
import Link from "next/link";
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
        url: "https://inscribe-coral.vercel.app/api/og",
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
        url: `https://inscribe-coral.vercel.app/api/og`,
        alt: "Leaderboard - Top Signers",
      },
    ],
    site: "@Inscribe",
    creator: "@Inscribe",
  },
};

const AboutPage = () => {
  return (
    <div className="bg-stars bg-repeat bg-size-[50vw] bg-fixed min-h-[calc(100vh-64px)]">
      <div className="bg-[url('/assets/images/banner.png')] bg-no-repeat h-[46.6vw] sm:h-[34.6vw] bg-size-[100vw] max-sm:bg-center max-sm:bg-size-[135%]" />
      <div
        className="w-full min-h-[73vh] sm:min-h-[62vh] bg-merge -mt-1 sm:mt-[-1px] bg-[url('/assets/images/footer.png'),url('/assets/images/paper.png')] bg-[length:135%_auto,135%_auto] sm:bg-[length:100%_auto,100%_auto]"
        style={{
          backgroundRepeat: "no-repeat, repeat-y",
          backgroundPosition: "bottom,top",
        }}
      >
        <div className="text-black text-center pb-20 text-base sm:text-lg [&_a]:font-medium container items-center gap-5">
          <Text variant={"4Xl"} className="pb-5">
            About us
          </Text>
          The Universal Principles of Liberty were born from a shared
          conviction: that the essence of human freedom can, and must, be
          distilled into clear, timeless truths. Crafted through the
          collaboration of{" "}
          <Link href="https://x.com/NSKinsella" target="_blank">
            Stephan Kinsella
          </Link>
          ,{" "}
          <Link href="https://x.com/_Freemax" target="_blank">
            Freemax
          </Link>
          ,{" "}
          <Link href="https://x.com/AlessandroFusi9" target="_blank">
            Alessandro Fusillo
          </Link>
          , and David Dürr — and Hans-Hermann Hoppe as its godfather — this
          document expresses, in five simple principles, the foundational axioms
          of liberty. It is not a constitution, nor a manifesto of fleeting
          politics. It is a declaration — a recognition of the moral order that
          precedes and transcends states, parties, and rulers. By reading,
          endorsing, and adopting these principles, each signer performs more
          than a symbolic act. They affirm their commitment to a world free from
          systemic aggression — a world where human beings may live, create, and
          cooperate in peace. The Universal Principles of Liberty have been
          <Link href="https://www.ord.io/103525220" target="_blank">
            inscribed on the Bitcoin blockchain
          </Link>{" "}
          — immutable, borderless, and forever.
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
