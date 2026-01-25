/*
 * ============================================
 * TEMPORARILY DISABLED PAGE
 * This page is disabled for the current website display phase.
 * Access is blocked via middleware redirect to home page.
 * Remove the redirect in middleware.ts to re-enable.
 * ============================================
 */

import { requireAuth, getUserProfile, isProfileComplete } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Layout } from "@/components/common/layout";
import ProfileClient from "@/components/profile/profile-client";
import { createClient } from "@supabase/supabase-js";

// Supabase client for database operations only (not auth)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Ensure fresh data on navigation
export const dynamic = "force-dynamic";

const ProfilePage = async () => {
  // 1. Get Current User via NextAuth
  const session = await requireAuth();
  const userId = session.user.id;

  // 2. Check if profile is complete
  const profile = await getUserProfile(userId);

  if (!profile || !isProfileComplete(profile)) {
    redirect("/complete-profile");
  }

  // 3. Fetch Registered Events & Teams
  // We join: team_members -> teams -> events
  const { data: rawMemberships } = await supabase
    .from("team_members")
    .select(`
      id,
      is_captain,
      event_id,
      team:teams (
        id,
        name
      ),
      event:events (
        id,
        name,
        category,
        is_reg_open,
        min_team_size,
        max_team_size
      )
    `)
    .eq("user_id", userId);

  // Normalize data structure for Client Component to prevent type errors
  const joinedEvents = (rawMemberships || []).map((m: any) => ({
    reg_id: m.id,
    is_captain: m.is_captain,
    team: m.team,
    event: m.event,
  }));

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Ambient Background specific to Profile */}
        <div className="fixed inset-0 -z-10 bg-[#050505]">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[128px]" />
        </div>

        <ProfileClient
          userData={profile}
          joinedEvents={joinedEvents}
        />
      </div>
    </Layout>
  );
}

import { memo } from 'react';
export default memo(ProfilePage);