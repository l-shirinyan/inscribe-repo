import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import localFont from "next/font/local";
import { Geist } from "next/font/google";

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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "The Universal Principles of Liberty",
  description: "The foundations of ethical order, justice and peace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${oldFont.variable} ${geistSans.variable} antialiased font-oldFont bg-black`}
      >
        <Navbar />
        <div className="mt-[60px] sm:mt-16">{children}</div>
      </body>
    </html>
  );
}
