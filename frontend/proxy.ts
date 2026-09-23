import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { TOKEN_COOKIE_NAME } from './lib/auth/cookies';

export function proxy(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute = ['/dashboard', '/doctors', '/patients'].some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  // If attempting to access a protected route without a token, redirect to /login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If already authenticated and trying to visit /login, redirect to /dashboard
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/doctors/:path*',
    '/patients/:path*',
    '/login',
  ],
};
