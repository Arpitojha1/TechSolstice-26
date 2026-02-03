import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

/**
 * OAuth callback handler.
 * Supabase Auth redirects here after successful OAuth authentication.
 * This exchanges the auth code for a session and redirects to the profile.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/profile';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Successful authentication - redirect to intended destination
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';

      if (isLocalEnv) {
        // Local development - use origin
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        // Production with proxy
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Return to login with error if code exchange failed
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
