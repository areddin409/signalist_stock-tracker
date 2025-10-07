import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add pathname and full URL to headers for server-side access
  response.headers.set('x-pathname', request.nextUrl.pathname);
  response.headers.set('x-url', request.url);

  // For auth pages, don't redirect - just add the pathname header
  if (
    request.nextUrl.pathname.startsWith('/sign-in') ||
    request.nextUrl.pathname.startsWith('/sign-up') ||
    request.nextUrl.pathname.startsWith('/onboarding')
  ) {
    return response;
  }

  const sessionCookie = getSessionCookie(request);

  // Check cookie presence - prevents obviously unauthorized users
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets).*)'],
};
