import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'zh', 'es', 'hi', 'bn', 'pt', 'ru', 'ja', 'pa', 'mr', 'te', 'tr', 'ko', 'fr', 'de', 'vi', 'ta', 'ur', 'jv', 'it'],

  // Used when no locale matches
  defaultLocale: "en",

});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
