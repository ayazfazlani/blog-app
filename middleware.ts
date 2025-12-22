import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import type { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes and static files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // For login/register pages: if user is already logged in, redirect to dashboard
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    const cookieToken = request.cookies.get('auth-token')?.value;
    if (cookieToken && JWT_SECRET) {
      try {
        verify(cookieToken, JWT_SECRET);
        // User is logged in, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch {
        // Token invalid, allow access to login/register
        return NextResponse.next();
      }
    }
    // No token, allow access to login/register
    return NextResponse.next();
  }

  // Protect dashboard routes only
//   if (pathname.startsWith('/dashboard')) {
//     // First, check for token in cookie (set by login API)
//     const cookieToken = request.cookies.get('auth-token')?.value;

//     // Debug: Log all cookies and cookie presence
//     console.log('🔍 Middleware check for:', pathname);
//     console.log('🍪 All cookies:', Array.from(request.cookies.getAll()).map(c => c.name));
//     console.log('🍪 auth-token cookie present:', !!cookieToken);
//     if (cookieToken) {
//       console.log('🍪 Cookie length:', cookieToken.length);
//       console.log('🍪 Cookie first 20 chars:', cookieToken.substring(0, 20));
//     } else {
//       console.log('❌ auth-token cookie NOT found!');
//     }

//     // If no cookie token, check Authorization header (for API calls)
//     const authHeader = request.headers.get('authorization');
//     const headerToken = authHeader?.startsWith('Bearer ') 
//       ? authHeader.substring(7) 
//       : null;

//     const token = cookieToken || headerToken;

//     if (!token) {
//       console.log('🔒 No token found, redirecting to login');
//       const loginUrl = new URL('/login', request.url);
//       loginUrl.searchParams.set('callbackUrl', pathname);
//       return NextResponse.redirect(loginUrl);
//     }

//     // Verify token
//     try {
//       if (!JWT_SECRET) {
//         console.error('⚠️ JWT_SECRET is not set in environment variables');
//         return NextResponse.redirect(new URL('/login', request.url));
//       }
//       const decoded = verify(token, JWT_SECRET);
//       console.log('✅ Token verified, allowing access to:', pathname);
//       console.log('👤 User:', decoded);
//       return NextResponse.next();
//     } catch (error) {
//       // Token invalid or expired - clear cookie and redirect
//       console.log('❌ Token verification failed:', error);
//       const response = NextResponse.redirect(new URL('/login', request.url));
//       response.cookies.delete('auth-token');
//       return response;
//     }
//   }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
  ],
}