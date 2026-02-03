/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserProfile, isProfileComplete } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Layout } from "@/components/common/layout";
import ProfileClient from "@/components/profile/profile-client";
import { createClient } from "@/lib/supabase-server";

// Ensure fresh data on navigation
export const dynamic = "force-dynamic";

const ProfilePage = async () => {
  const supabase = await createClient();

  // 1. Get Current User via Supabase Auth
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }
  const userId = user.id;

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

  // 4. Fetch User Passes
  const { data: userPasses } = await supabase
    .from("user_passes")
    .select(`
      id,
      user_id,
      pass_id,
      ticket_cut,
      phone_no,
      reg_no,
      pass:passes (
        name,
        price
      )
    `)
    .eq("user_id", userId);

  // Normalize passes data structure
  const formattedPasses = (userPasses || []).map((p: any) => ({
    ...p,
    pass: Array.isArray(p.pass) ? p.pass[0] : p.pass
  }));

  // Normalize data structure for Client Component to prevent type errors
  const joinedEvents = (rawMemberships || [])
    .filter((m: any) => m.event && m.team)
    .map((m: any) => ({
      reg_id: m.id,
      is_captain: m.is_captain,
      team: m.team,
      event: m.event,
    }));

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Ambient Background specific to Profile - Updated to match FestInfo Theme */}


        <ProfileClient
          userData={profile}
          joinedEvents={joinedEvents}
          passes={formattedPasses}
        />
      </div>
    </Layout>
  );
}

import { memo } from 'react';
export default memo(ProfilePage);