import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// ============================================
// TEMPORARILY DISABLED ROUTES - Redirect to home
// These routes are disabled for the current website display phase
// ============================================
const temporarilyDisabledRoutes = [
  '/login',
  '/complete-profile',
  '/profile',
  '/admin-dashboard',
]

// Routes that require authentication
const protectedRoutes = [
  // '/profile',        // TEMPORARILY DISABLED
  // '/complete-profile', // TEMPORARILY DISABLED
  '/passes',
]

// Routes that require admin access (checked server-side)
const adminRoutes: string[] = [
  // '/admin-dashboard', // TEMPORARILY DISABLED
]

// Routes that should redirect to profile if authenticated
const authRoutes: string[] = [
  // '/login' // TEMPORARILY DISABLED
]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // TEMPORARY: Redirect disabled routes to home page
  const isDisabledRoute = temporarilyDisabledRoutes.some(route => path.startsWith(route))
  if (isDisabledRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Check if route is protected, admin, or auth route
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => path.startsWith(route))
  const isAuthRoute = authRoutes.some(route => path.startsWith(route))

  // Get the token from the request (JWT stored in cookie)
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Redirect to login if accessing protected/admin route without auth
  if ((isProtectedRoute || isAdminRoute) && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // SERVER-SIDE ADMIN CHECK for admin routes
  if (isAdminRoute && token) {
    const userId = token.id as string

    try {
      // Query Supabase admins table
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/admins?user_id=eq.${userId}&select=user_id`,
        {
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
          },
        }
      )

      const data = await response.json()

      // If not admin (empty array), redirect to profile
      if (!data || data.length === 0) {
        return NextResponse.redirect(new URL('/profile', request.url))
      }
    } catch (error) {
      console.error('Admin check failed in middleware:', error)
      return NextResponse.redirect(new URL('/profile', request.url))
    }
  }

  // Redirect to profile if authenticated user tries to access login
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/profile', request.url))
  }

  return NextResponse.next()
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
     * - api routes (except auth)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
