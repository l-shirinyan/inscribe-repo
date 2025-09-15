import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import localFont from "next/font/local";
import { Geist } from "next/font/google";
import { getServerUser } from "@/lib/server-auth";
import InitializeUser from "@/components/layout/initialize-user";

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

const ludovico = localFont({
  variable: "--font-ludovico",
  src: [
    {
      path: "../public/assets/fonts/ludovico.ttf",
    },
  ],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export async function generateMetadata({ params }: any): Promise<Metadata> {
  return {
    title: `Leaderboard `,
    description: `Check out the leaderboard!`,
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
        className={`${oldFont.variable} ${geistSans.variable} ${circular.variable} ${ludovico.variable} antialiased font-oldFont bg-black`}
      >
        <InitializeUser />
        <Navbar />
        <div className="mt-[60px] sm:mt-16">{children}</div>
      </body>
    </html>
  );
}
