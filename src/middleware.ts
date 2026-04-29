import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
  const userCookie = request.cookies.get('user')?.value;

  const pathname = request.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register', '/courses', '/about', '/contact'];
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));

  // If accessing public route, allow
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Handle /dashboard route - redirect based on role
  if (pathname === '/dashboard' || pathname === '/dashboard/') {
    if (!token || !userCookie) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    try {
      const user = JSON.parse(decodeURIComponent(userCookie));
      const url = request.nextUrl.clone();

      if (user.role === 'admin') {
        url.pathname = '/admin/dashboard';
      } else if (user.role === 'student') {
        url.pathname = '/student/dashboard';
      } else {
        url.pathname = '/unauthorized';
      }

      return NextResponse.redirect(url);
    } catch (error) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // Check for student routes
  if (pathname.startsWith('/student')) {
    if (!token || !userCookie) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    try {
      const user = JSON.parse(decodeURIComponent(userCookie));
      if (user.role !== 'student' && user.role !== 'admin') {
        const url = request.nextUrl.clone();
        url.pathname = '/unauthorized';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // Check for admin routes
  if (pathname.startsWith('/admin')) {
    if (!token || !userCookie) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    try {
      const user = JSON.parse(decodeURIComponent(userCookie));
      if (user.role !== 'admin' && user.role !== 'super_admin') {
        const url = request.nextUrl.clone();
        url.pathname = '/unauthorized';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // Redirect /my-courses to /student/dashboard/my-courses for authenticated students
  if (pathname === '/my-courses' || pathname === '/my-courses/') {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    try {
      const user = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null;
      const url = request.nextUrl.clone();

      // Redirect students to their dashboard
      if (user?.role === 'student') {
        url.pathname = '/student/dashboard/my-courses';
        return NextResponse.redirect(url);
      }
      // Admins accessing /my-courses go to student view
      else if (user?.role === 'admin' || user?.role === 'super_admin') {
        url.pathname = '/student/dashboard/my-courses';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
};
