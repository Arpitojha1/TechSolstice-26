import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCategoryBySlug } from "@/lib/constants/categories";
import { type Event } from "@/components/cards/event-card";
import { CategoryPageClient } from "@/components/events/category-page-client";
import { createClient } from "@/lib/supabase-server";

// CRITICAL: Forces fresh data on every request to handle registration state changes instantly.
export const dynamic = "force-dynamic";

async function getData(categorySlug: string) {
  const session = await getSession();
  const user = session?.user;

  // Use authenticated client for everything to ensure RLS policies work
  const supabase = await createClient();

  // Get category details
  const category = getCategoryBySlug(categorySlug);
  if (!category) return null;

  // Fetch Events for this category
  const { data: rawEvents, error } = await supabase
    .from("events")
    .select("*, teams(count)")
    .eq("category", category.dbValue)
    .order("starts_at", { ascending: true });

  if (error) console.error("Error fetching events:", error);

  // Normalize events to include registered_count
  const events = (rawEvents || []).map((e: any) => ({
    ...e,
    registered_count: e.teams?.[0]?.count || 0,
    // Remove the teams array from the object to match Event type cleanly
    teams: undefined
  })) as Event[];

  // Fetch User's Registrations (if logged in)
  let registeredEventIds: string[] = [];
  let accessibleEventIds: string[] = [];

  if (user) {
    const { data: regs } = await supabase
      .from("team_members")
      .select("event_id")
      .eq("user_id", user.id);

    if (regs) {
      registeredEventIds = regs.map(r => r.event_id);
    }

    // Get accessible events from user passes
    const { data: passEvents } = await supabase
      .from("user_passes")
      .select(`
        passes (
          event_passes (
            event_id
          )
        )
      `)
      .eq("user_id", user.id)
      .eq("ticket_cut", false);

    if (passEvents) {
      accessibleEventIds = passEvents
        .flatMap(p => {
          const passes = Array.isArray(p.passes) ? p.passes : (p.passes ? [p.passes] : []);
          return passes.flatMap((pass: any) => pass.event_passes || []);
        })
        .map((e: any) => e.event_id);
    }
  }

  return {
    category,
    events: (events || []) as Event[],
    registeredEventIds,
    accessibleEventIds
  };
}

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ category: string }>;
}) => {
  const { category: categorySlug } = await params;
  const data = await getData(categorySlug);

  if (!data) {
    notFound();
  }

  const { category, events, registeredEventIds, accessibleEventIds } = data;

  return (
    <CategoryPageClient
      category={category}
      events={events}
      registeredEventIds={registeredEventIds}
      accessibleEventIds={accessibleEventIds}
    />
  );
}

import { memo } from 'react';
export default memo(CategoryPage);
