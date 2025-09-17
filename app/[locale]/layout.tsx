import type { Metadata } from "next";
import "../globals.css";
import localFont from "next/font/local";
import { Geist } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import InitializeUser from "@/components/layout/initialize-user";
const oldFont = localFont({
  variable: "--font-oldFont",
  src: [
    {
      path: "../../public/assets/fonts/font.ttf",
      weight: "500",
      style: "normal",
    },
  ],
});

const circular = localFont({
  variable: "--font-circular",
  src: [
    {
      path: "../../public/assets/fonts/circular.ttf",
      weight: "500",
      style: "normal",
    },
  ],
});

const ludovico = localFont({
  variable: "--font-ludovico",
  src: [
    {
      path: "../../public/assets/fonts/ludovico.ttf",
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
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<any>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${oldFont.variable} ${geistSans.variable} ${circular.variable} ${ludovico.variable} antialiased font-oldFont bg-black`}
      >
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <InitializeUser />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
