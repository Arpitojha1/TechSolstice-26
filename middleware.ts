import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase-middleware';

// Routes that require authentication
const protectedRoutes: string[] = [
  '/profile',
  '/complete-profile',
  '/passes',
];

// Routes that require admin access (checked server-side)
const adminRoutes: string[] = [
  '/admin-dashboard',
];

// Routes that should redirect to profile if authenticated
const authRoutes: string[] = [
  '/login',
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check route types
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => path.startsWith(route));
  const isAuthRoute = authRoutes.some(route => path.startsWith(route));

  // Get user and update session cookies
  const { user, supabaseResponse, supabase } = await updateSession(request);

  // Redirect to login if accessing protected/admin route without auth
  if ((isProtectedRoute || isAdminRoute) && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // SERVER-SIDE ADMIN CHECK for admin routes
  if (isAdminRoute && user) {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', user.id)
        .single();

      // If not admin (empty or error), redirect to profile
      if (error || !data) {
        return NextResponse.redirect(new URL('/profile', request.url));
      }
    } catch (error) {
      console.error('Admin check failed in middleware:', error);
      return NextResponse.redirect(new URL('/profile', request.url));
    }
  }

  // Redirect to profile if authenticated user tries to access login
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return supabaseResponse;
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
