import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';
 
const intlMiddleware = createMiddleware(routing);

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
