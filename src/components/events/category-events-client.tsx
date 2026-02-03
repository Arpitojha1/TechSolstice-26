"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { EventCard, type Event } from "@/components/cards/event-card";

export function CategoryEventsClient({
  events: initialEvents,
  registeredEventIds,
  accessibleEventIds,
  categoryTitle,
  categoryDbValue,
}: {
  events: Event[];
  registeredEventIds: string[];
  accessibleEventIds: string[];
  categoryTitle: string;
  categoryDbValue: string;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState<Event[]>(initialEvents);

  useEffect(() => {
    // Fetch fresh stats (registered counts) from API to bypass RLS
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/events/stats?category=${categoryDbValue}`);
        const data = await res.json();
        if (data.success && data.stats) {
          setEvents(prevEvents => prevEvents.map(e => ({
            ...e,
            registered_count: data.stats[e.id] ?? e.registered_count
          })));
        }
      } catch (err) {
        console.error("Failed to fetch event stats", err);
      }
    };
    fetchStats();
  }, [categoryDbValue]);

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Search Bar */}
      <div className="flex justify-center items-center mb-12 px-4 pt-8">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
          <Input
            type="text"
            placeholder={`Search in ${categoryTitle}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full bg-white/5 border-white/10 rounded-full focus:ring-1 focus:ring-cyan-500 transition-all text-white placeholder:text-neutral-500"
          />
        </div>
      </div>

      {/* Events Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 pb-20"
      >
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isRegistered={registeredEventIds.includes(event.id)}
              hasAccess={accessibleEventIds.includes(event.id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-neutral-500 py-20">
            <p className="text-xl">
              {searchTerm
                ? "No events found matching your search."
                : "No events in this category yet."}
            </p>
          </div>
        )}
      </motion.div>
    </>
  );
}
