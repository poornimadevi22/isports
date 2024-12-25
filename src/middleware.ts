import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/', '/dashboard/:path*', '/profile/:path*'];

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');
  const { pathname } = req.nextUrl;

  if (!token && protectedRoutes.some(route => pathname.match(new RegExp(route)))) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If the user is authenticated and tries to access the login page, redirect to the dashboard
  if (token && pathname === '/login' || token && pathname === '/') {


    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/']
}
