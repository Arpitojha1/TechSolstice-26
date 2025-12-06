import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // 1. PERFORMANCE: Refresh the session at the Edge
  // This keeps the user logged in as they navigate without hitting the DB heavily
  const response = await updateSession(request)

  // 2. SECURITY: Create a client to inspect the user's role
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll() {} // Middleware can't set cookies directly, updateSession handled it
      }
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const url = request.nextUrl.clone()

  // Define our protected zones
  const isAdminPage = url.pathname.startsWith('/admin-dashboard')
  const isPassesPage = url.pathname.startsWith('/passes')
  const isOnboarding = url.pathname === '/complete-profile'
  const isLoginPage = url.pathname === '/login'

  // --- LOGIC GATES ---

  // GATE 1: Unauthenticated Users
  // If a stranger tries to visit Admin, Passes, or Onboarding -> Kick to Login
  if (!user && (isAdminPage || isPassesPage || isOnboarding)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // GATE 2: Authenticated Users
  if (user) {
    // We need to fetch their profile to see if they are an Admin or need Onboarding
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()

    // A. GOOGLE USERS (Missing Name)
    // If they have no name and try to go anywhere else -> Force Onboarding
    if (!profile?.full_name && !isOnboarding) {
      return NextResponse.redirect(new URL('/complete-profile', request.url))
    }
    
    // B. COMPLETED USERS (Manipal or Fixed Google users)
    // If they have a name but try to go to Onboarding -> Send to Passes (Don't let them get stuck)
    if (profile?.full_name && isOnboarding) {
      return NextResponse.redirect(new URL('/passes', request.url))
    }

    // C. ADMIN SECURITY
    if (isAdminPage) {
       const { data: admin } = await supabase
         .from('admins')
         .select('id')
         .eq('id', user.id)
         .single()
       
       // If they are not in the admins table -> Kick to Passes
       if (!admin) {
         return NextResponse.redirect(new URL('/passes', request.url))
       }
    }

    // D. USER EXPERIENCE
    // If a logged-in user visits /login -> Send to Passes
    if (isLoginPage) {
      return NextResponse.redirect(new URL('/passes', request.url))
    }
  }

  return response
}

export const config = {
  // PERFORMANCE: Don't run this middleware on static assets (images, fonts, etc.)
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}