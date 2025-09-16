import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Geist } from "next/font/google";
import { headers } from 'next/headers';

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

export const metadata: Metadata = {
  title: "Inscribe",
  description: "Inscribe your digital signature",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const locale = pathname.split('/')[1] || 'en';
  
  return (
    <html lang={locale}>
      <body
        className={`${oldFont.variable} ${geistSans.variable} ${circular.variable} ${ludovico.variable} antialiased font-oldFont bg-black`}
      >
        {children}
      </body>
    </html>
  );
}