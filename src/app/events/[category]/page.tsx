import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { getCategoryBySlug } from "@/lib/constants/categories";
import { type Event } from "@/components/event-card";
import { CategoryEventsClient } from "@/components/categories/category-events-client";

// CRITICAL: Forces fresh data on every request to handle registration state changes instantly.
export const dynamic = "force-dynamic";

async function getData(categorySlug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const data = await getData(categorySlug);

  if (!data) {
    notFound();
  }

  const { category, events, registeredEventIds, accessibleEventIds } = data;

  return (
    <div className="min-h-screen w-full bg-black">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br ${category.gradient} opacity-10 rounded-full blur-3xl animate-pulse`}></div>
          <div className={`absolute top-40 right-1/4 w-96 h-96 bg-gradient-to-br ${category.gradient} opacity-10 rounded-full blur-3xl animate-pulse delay-500`}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Back Button */}
          <Link 
            href="/events"
            className="inline-flex items-center text-neutral-400 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Categories
          </Link>

          {/* Title Section */}
          <div className="space-y-4">
            <h1 className={`text-5xl md:text-7xl font-bold bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent`}>
              {category.title}
            </h1>
            <p className="text-lg md:text-xl text-neutral-400 max-w-3xl">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="max-w-7xl mx-auto">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px] text-cyan-400">
            Loading events...
          </div>
        }>
          <CategoryEventsClient
            events={events}
            registeredEventIds={registeredEventIds}
            accessibleEventIds={accessibleEventIds}
            categoryTitle={category.title}
          />
        </Suspense>
      </div>
    </div>
  );
}
