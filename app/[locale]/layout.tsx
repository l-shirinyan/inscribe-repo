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
export async function generateMetadata({ params }: { params: Promise<any> }): Promise<Metadata> {


  return {
    title: "The Universal Principles of Liberty",
    description: "The foundations of ethical order, justice, and peace. Sign it. Endorse it. Share it.",
    openGraph: {
      title: "The Universal Principles of Liberty",
      description: "The foundations of ethical order, justice, and peace. Sign it. Endorse it. Share it.",
      images: [
        {
          url: "https://firebasestorage.googleapis.com/v0/b/inscribe-doc.firebasestorage.app/o/meta-image.png?alt=media&token=80407e7c-217f-4333-a728-78afedbc2508",
          width: 840,
          height: 633,
          alt: "The Universal Principles of Liberty",
          type: "image/png",
        },
      ],
      type: "website",
      siteName: "The Universal Principles of Liberty",
    },
    twitter: {
      card: "summary_large_image",
      title: "The Universal Principles of Liberty",
      description: "The foundations of ethical order, justice, and peace. Sign it. Endorse it. Share it.",
      images: [
        {
          url: 'https://theuniversalprinciplesofliberty.com/meta-image.png',
          alt: "The Universal Principles of Liberty",
        }
      ],
    },
  };
}

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
