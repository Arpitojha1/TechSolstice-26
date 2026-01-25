import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCategoryBySlug } from "@/lib/constants/categories";
import { type Event } from "@/components/cards/event-card";
import { CategoryPageClient } from "@/components/events/category-page-client";
import { createClient } from "@supabase/supabase-js";

// Supabase client for database operations only
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// CRITICAL: Forces fresh data on every request to handle registration state changes instantly.
export const dynamic = "force-dynamic";

async function getData(categorySlug: string) {
  const session = await getSession();
  const user = session?.user;

  // Get category details
  const category = getCategoryBySlug(categorySlug);
  if (!category) return null;

  // Fetch Events for this category
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .eq("category", category.dbValue)
    .order("starts_at", { ascending: true });

  if (error) console.error("Error fetching events:", error);

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
