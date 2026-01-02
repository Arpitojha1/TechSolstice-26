import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // 1. PERFORMANCE: Refresh session
  const response = await updateSession(request)

  // 2. SECURITY: Create client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll() { }
      }
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const url = request.nextUrl.clone()

  // Define protected zones
  const isAdminPage = url.pathname.startsWith('/admin-dashboard')
  const isPassesPage = url.pathname.startsWith('/passes')
  const isOnboarding = url.pathname === '/complete-profile'
  const isLoginPage = url.pathname === '/login'

  // --- GATE 1: Unauthenticated Users ---
  if (!user && (isAdminPage || isPassesPage || isOnboarding)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // --- GATE 2: Authenticated Users ---
  if (user) {
    // UPDATED: Fetch 'mobile_number' too!
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, mobile_number')
      .eq('id', user.id)
      .single()

    // A. INCOMPLETE PROFILE CHECK
    // If Name OR Mobile is missing -> Force Onboarding
    const isProfileIncomplete = !profile?.full_name || !profile?.mobile_number

    if (isProfileIncomplete && !isOnboarding) {
      // Force them to complete profile
      return NextResponse.redirect(new URL('/complete-profile', request.url))
    }

    // B. ALREADY COMPLETE CHECK
    // If they ARE complete but try to visit Onboarding -> Send to Passes
    if (!isProfileIncomplete && isOnboarding) {
      return NextResponse.redirect(new URL('/passes', request.url))
    }

    // C. ADMIN SECURITY
    if (isAdminPage) {
      const { data: admin } = await supabase
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!admin) {
        return NextResponse.redirect(new URL('/passes', request.url))
      }
    }

    // D. LOGIN REDIRECT
    if (isLoginPage) {
      // If profile incomplete, Gate A will catch them later. If complete, go to Passes.
      return NextResponse.redirect(new URL('/passes', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth/callback (IMPORTANT: Allow auth callback to run without redirects)
     * - api (API routes usually handle their own auth)
     */
    '/((?!_next/static|_next/image|favicon.ico|auth/callback|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}