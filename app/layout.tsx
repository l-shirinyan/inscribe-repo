import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import localFont from "next/font/local";
import { Geist } from "next/font/google";
import { getServerUser } from "@/lib/server-auth";

const oldFont = localFont({
  variable: "--font-oldFont",
  src: [
    {
      path: "../public/assets/fonts/font.ttf",
      weight: "500",
      style: "normal",
    },
  ],
});

const circular = localFont({
  variable: "--font-circular",
  src: [
    {
      path: "../public/assets/fonts/circular.ttf",
      weight: "500",
      style: "normal",
    },
  ],
});



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const resolvedParams = await getServerUser();
  const user = resolvedParams?.displayName;

  // Decode the user parameter to handle URL encoding
  const decodedUser = user ? decodeURIComponent(user) : "user";

  // Add cache-busting to the page URL as well to force Twitter to fetch fresh metadata
  const pageUrlWithCache = new URL(
    `https://inscribe-coral.vercel.app/leaderboard/${user || "user"}`
  );
  pageUrlWithCache.searchParams.set(
    "cb",
    Math.random().toString(36).substring(2, 8)
  );
  const pageUrl = pageUrlWithCache.toString();

  // Create a strong cache-busting parameter that changes every hour to prevent Twitter caching issues
  // This ensures Twitter fetches fresh preview data instead of using stale cache
  const now = new Date();
  const hour = Math.floor(now.getTime() / (1000 * 60 * 60)); // Changes every hour
  const userHash = user
    ? Buffer.from(user).toString("base64").slice(0, 8)
    : "default";

  // Add a random component that changes on each page load to force fresh cache
  const random = Math.random().toString(36).substring(2, 8);

  // Properly encode the URL parameters to avoid HTML encoding issues
  const imageUrl = new URL("https://inscribe-coral.vercel.app/api/og");
  imageUrl.searchParams.set("user", user || "user");
  imageUrl.searchParams.set("v", userHash);
  imageUrl.searchParams.set("t", hour.toString()); // Hour-based timestamp
  imageUrl.searchParams.set("r", random); // Random component for extra cache busting

  return {
    title: `Leaderboard - Signed by ${decodedUser}`,
    description: `Check out the leaderboard! Signed by ${decodedUser}`,
    openGraph: {
      title: `Leaderboard - Signed by ${decodedUser}`,
      description: `Check out the leaderboard! Signed by ${decodedUser}`,
      type: "website",
      url: pageUrl,
      siteName: "The Universal Principles of Liberty",
      images: [
        {
          url: imageUrl.toString(),
          width: 1200,
          height: 630,
          alt: `Leaderboard - Signed by ${decodedUser}`,
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `Leaderboard - Signed by ${decodedUser}`,
      description: `Check out the leaderboard! Signed by ${decodedUser}`,
      images: [
        {
          url: imageUrl.toString(),
          alt: `Leaderboard - Signed by ${decodedUser}`,
        },
      ],
      site: "@Inscribe",
      creator: "@Inscribe",
    },
    // Additional meta tags to help with social media previews
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${oldFont.variable} ${geistSans.variable} ${circular.variable} antialiased font-oldFont bg-black`}
      >
        <Navbar />
        <div className="mt-[60px] sm:mt-16">{children}</div>
      </body>
    </html>
  );
}
