import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 1. Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Determine the auth provider from the user's app_metadata
        const provider = user.app_metadata?.provider || 'unknown'
        const authProvider = provider === 'azure' ? 'microsoft' : provider

        // 2. Fetch Profile to check if name exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()

        // 3. If profile doesn't exist or needs provider update, upsert it
        if (!profile) {
          // Create profile with auth_provider for new users
          await supabase.from('profiles').upsert({
            id: user.id,
            email: user.email,
            auth_provider: authProvider,
            // For Microsoft users, we can get name from user metadata
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || null
          }, { onConflict: 'id' })
        } else {
          // Update auth_provider if not set
          await supabase
            .from('profiles')
            .update({ auth_provider: authProvider })
            .eq('id', user.id)
        }

        // 4. Re-fetch profile after potential update
        const { data: updatedProfile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()

        // 5. Logic Gate:
        
        // A. If Name is MISSING (Google Users) -> Go to Onboarding
        if (!updatedProfile?.full_name) {
           return NextResponse.redirect(`${origin}/complete-profile`)
        }

        // B. If Name EXISTS (Manipal or Returning Users) -> Check if Admin
        const { data: admin } = await supabase
          .from('admins')
          .select('id')
          .eq('id', user.id)
          .single()

        if (admin) {
          return NextResponse.redirect(`${origin}/admin-dashboard`)
        }
        
        // C. Standard User -> Go to Passes
        return NextResponse.redirect(`${origin}/passes`)
      }
    }
  }

  // If something broke
  return NextResponse.redirect(`${origin}/login?error=true`)
}