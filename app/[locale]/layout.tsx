import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import { getServerUser } from "@/lib/server-auth";
import InitializeUser from "@/components/layout/initialize-user";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['en', 'zh', 'es', 'hi', 'bn', 'pt', 'ru', 'ja', 'pa', 'mr', 'te', 'tr', 'ko', 'fr', 'de', 'vi', 'ta', 'ur', 'jv', 'it'];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `Inscribe - ${locale.toUpperCase()}`,
    description: `Inscribe your digital signature`,
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <InitializeUser />
      <Navbar />
      <div className="mt-[60px] sm:mt-16">{children}</div>
    </NextIntlClientProvider>
  );
}
