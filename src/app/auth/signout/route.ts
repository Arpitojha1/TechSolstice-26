import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  // Sign out from Supabase
  await supabase.auth.signOut()

  // Revalidate the home page so it shows "Login" instead of "Dashboard"
  revalidatePath('/', 'layout')

  return NextResponse.redirect(new URL('/', req.url), {
    status: 302,
  })
}