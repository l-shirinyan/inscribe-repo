import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Redirect root '/' to '/en'
  if (request.nextUrl.pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/en';
    return NextResponse.redirect(url);
  }

  // Otherwise, use next-intl middleware
  const response = intlMiddleware(request);

  // Add pathname to headers for the root layout
  response.headers.set('x-pathname', request.nextUrl.pathname);

  return response;
}

export const config = {
  matcher: ['/', '/(en|zh|es|hi|bn|pt|ru|ja|pa|mr|te|tr|ko|fr|de|vi|ta|ur|jv|it)/:path*']
};
