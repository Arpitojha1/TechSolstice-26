/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense } from "react";
import { type Event } from "@/components/event-card";
import { EventsClient } from "@/components/events-client";
import { createClient } from "@/utils/supabase/server";
import { Hourglass } from 'ldrs/react';

// CRITICAL: Forces fresh data on every request to handle registration state changes instantly.
export const dynamic = "force-dynamic";

async function getData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Fetch Events
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("starts_at", { ascending: true });

  // 2. Fetch registrations
  let registeredEventIds: string[] = [];
  let accessibleEventIds: string[] = [];

  if (user) {
    // Already registered
    const { data: regs } = await supabase
      .from("team_members")
      .select("event_id")
      .eq("user_id", user.id);

    if (regs) {
      registeredEventIds = regs.map(r => r.event_id);
    }

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


      console.log("DATA : ", passEvents);

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
    events: (events || []) as Event[],
    registeredEventIds,
    accessibleEventIds
  };
}

const EventsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;
  const { events: allEvents, registeredEventIds, accessibleEventIds } = await getData();


  // "Coming Soon" Screen (Only if DB is empty)
  if (allEvents.length === 0) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E5E5E5]/20 rounded-full blur-3xl animate-spin"></div>
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gray-400/20 rounded-full blur-3xl animate-spin delay-500"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#6C7A89]/20 rounded-full blur-3xl animate-spin delay-1000"></div>
        </div>

        <div className="relative z-10 text-center space-y-8 max-w-4xl">
          <h1 className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            Coming Soon
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300 font-light tracking-wide">
            Exciting events are on the way!
          </p>
          <Hourglass size="40" bgOpacity="0.1" speed="1.75" color="cyan" />
        </div>
        <style>{`.animate-gradient { animation: gradient 3s ease infinite; } @keyframes gradient { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }`}</style>
      </div>
    );
  }

  // Filter Logic
  const category = typeof params?.category === "string" ? params.category.toLowerCase() : "all";
  const searchTerm = typeof params?.q === "string" ? params.q.toLowerCase() : "";

  const filteredEvents = allEvents
    .filter((event) => {
      if (category === "all") return true;
      return event.category?.toLowerCase() === category;
    })
    .filter((event) => event.name.toLowerCase().includes(searchTerm));

  return (
    <div className="min-h-screen w-full">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-cyan-400">Loading events...</div>}>
        <EventsClient
        initialEvents={filteredEvents}
        initialCategory={category}
        initialSearch={searchTerm}
        registeredEventIds={registeredEventIds}
        accessibleEventIds={accessibleEventIds}
      />
      </Suspense>
    </div>
  );
};

export default EventsPage;