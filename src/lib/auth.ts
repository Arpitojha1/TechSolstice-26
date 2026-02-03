import { redirect } from 'next/navigation';
import { createClient, createAdminClient } from './supabase-server';

/**
 * Get the current authenticated user from Supabase Auth.
 * Returns null if not authenticated.
 */
export async function getUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Get the current session (alias for getUser for compatibility).
 * Returns user data in a session-like structure.
 */
export async function getSession() {
  const user = await getUser();

  if (!user) {
    return null;
  }

  return {
    user: {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.full_name || user.user_metadata?.name || '',
      image: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
    }
  };
}

/**
 * Require authentication or redirect to login.
 * Use this in protected Server Components.
 */
export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return session;
}

/**
 * Get user profile from the database.
 * Returns null if profile doesn't exist.
 */
export async function getUserProfile(userId: string) {
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    return null;
  }

  return profile;
}

/**
 * Check if user is an admin.
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', userId)
    .single();

  return !error && !!data;
}

/**
 * Require admin access or redirect to profile.
 */
export async function requireAdmin() {
  const session = await requireAuth();
  const adminStatus = await isAdmin(session.user.id);

  if (!adminStatus) {
    redirect('/profile');
  }

  return session;
}

/**
 * Check if profile is complete.
 * Profile is complete if user has all required fields.
 */
export function isProfileComplete(profile: any): boolean {
  return !!(
    profile &&
    profile.full_name &&
    profile.mobile_number &&
    profile.college_name &&
    profile.registration_number
  );
}

/**
 * Sign out the current user.
 * For use in Server Actions.
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
