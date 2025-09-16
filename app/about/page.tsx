import { Text } from "@/components/ui/text";
import Link from "next/link";
export const metadata = {
  title: "Leaderboard - Signers",
  description: "Check out the top signers on our leaderboard!",
};

const AboutPage = () => {
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
            About us
          </Text>
          In an age where even those who speak peacefully can be struck down, where rational debate is met not with dialogue but with deathly silence, the need for an unshakable moral compass has never been greater. The Universal Principles of Liberty were born from a shared conviction: that the essence of human freedom can, and must, be distilled into clear, timeless truths. Crafted through the collaboration of{" "}
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
          ,  and David Dürr — and Hans-Hermann Hoppe as its godfather — this document expresses,
          in five simple principles, the foundational axioms of liberty.
          It is not a constitution, nor a manifesto of fleeting politics.
          It is a declaration — a recognition of the moral order that precedes and transcends states, parties, and rulers.
          By reading, endorsing, and adopting these principles, each signer performs more than a symbolic act.
          They affirm their commitment to a world free from systemic aggression.
          Taking inspiration from the phenomenon of Bitcoin — first embraced by individuals, then by millions,
          before entire nations could no longer ignore it and recognise it — this declaration is a strategy to make freedom real.
          Every signature is fuel. A proof-of-liberty. Each name added is a signal of strength, a proof of demand.
          The more people who stand behind the principles of liberty, the stronger the signal we send to the world:
          that liberty has unstoppable support. The mission is clear — to gather enough strength so that, for the first time in history,
          real-world territories can adopt true liberty and finally live in a genuine ethical order. The Universal Principles of Liberty have been
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
