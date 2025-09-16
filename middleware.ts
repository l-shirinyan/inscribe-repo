import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
 
const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'zh', 'es', 'hi', 'bn', 'pt', 'ru', 'ja', 'pa', 'mr', 'te', 'tr', 'ko', 'fr', 'de', 'vi', 'ta', 'ur', 'jv', 'it'],
 
  // Used when no locale matches
  defaultLocale: 'en'
});

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);
  
  // Add pathname to headers for the root layout
  response.headers.set('x-pathname', request.nextUrl.pathname);
  
  return response;
}
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(zh|es|hi|bn|pt|ru|ja|pa|mr|te|tr|ko|fr|de|vi|ta|ur|jv|it)/:path*']
};
