import { Suspense } from "react";
// import { motion } from "framer-motion";
import { type Event } from "@/components/event-card";
import { EventsClient } from "@/components/events-client";
import { createClient } from "@/utils/supabase/server";


async function getEvents(): Promise<Event[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }

  return data as Event[];
}


const EventsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;
  
  const allEvents = await getEvents();
  console.log("EVENTS ON CLIENT : ", allEvents);
  

  const category =
    typeof params?.category === "string"
      ? params.category.toLowerCase()
      : "all";
  const searchTerm =
    typeof params?.q === "string" ? params.q.toLowerCase() : "";

  const filteredEvents = allEvents
    .filter((event) => {
      if (category === "all") return true;
      return event.category.toLowerCase() === category;
    })
    .filter((event) => event.name.toLowerCase().includes(searchTerm));

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Starfield Background */}
      {/* <StarfieldBackground /> */}

      {/* Client Component handles filtering UI and display */}
      <Suspense fallback={<div className="p-8">Loading events...</div>}>
        <EventsClient
          initialEvents={filteredEvents}
          initialCategory={category}
          initialSearch={searchTerm}
        />
      </Suspense>
    </div>
  );
};

export default EventsPage;



