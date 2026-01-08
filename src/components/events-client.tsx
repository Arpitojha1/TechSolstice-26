"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Rocket, Cpu, Code, Gamepad2, Star, Medal } from "lucide-react";
import { motion } from "framer-motion";
import { EventCard, type Event } from "@/components/event-card";

interface EventsClientProps {
  initialEvents: Event[];
  initialCategory: string;
  initialSearch: string;
  registeredEventIds: string[];
  accessibleEventIds: string[];   
}


const filterCategories = [
  { name: "All", icon: <Rocket size={16} /> },
  { name: "Flagship", icon: <Star size={16} /> },
  { name: "Conference", icon: <Code size={16} /> },
  { name: "Technology", icon: <Cpu size={16} /> },
  { name: "Gaming", icon: <Gamepad2 size={16} /> },
  { name: "Sports", icon: <Medal size={16} /> }
];

export function EventsClient({
  initialEvents,
  initialCategory,
  initialSearch,
  registeredEventIds,
  accessibleEventIds
}: EventsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activeFilter, setActiveFilter] = useState(initialCategory || "all");
  const [searchTerm, setSearchTerm] = useState(initialSearch || "");

  const updateURL = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value.toLowerCase() !== "all") {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    updateURL("q", newSearchTerm);
  };

  const handleFilterChange = (filter: string) => {
    const newFilter = filter.toLowerCase();
    setActiveFilter(newFilter);
    updateURL("category", newFilter);
  };

  return (
    <>
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 px-4 pt-20">
        <div className="flex flex-wrap justify-center gap-2">
          {filterCategories.map((filter) => (
            <Button
              key={filter.name}
              variant={activeFilter === filter.name.toLowerCase() ? "default" : "outline"}
              onClick={() => handleFilterChange(filter.name)}
              className={`bg-transparent border-white/10 backdrop-blur-sm transition-all duration-300 ${activeFilter === filter.name.toLowerCase()
                ? "bg-white/10 text-white border-cyan-500/50"
                : "text-neutral-400 hover:bg-white/5 hover:text-white"
                }`}
            >
              {filter.icon}
              <span className="ml-2">{filter.name}</span>
            </Button>
          ))}
        </div>

        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
          <Input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 w-full md:w-64 bg-white/5 border-white/10 rounded-full focus:ring-1 focus:ring-cyan-500 transition-all text-white placeholder:text-neutral-500"
          />
        </div>
      </div>

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 px-4 pb-20"
      >
        {initialEvents.length > 0 ? (
          initialEvents.map((event) => {
          const isRegistered = registeredEventIds.includes(event.id);
          const hasAccess = accessibleEventIds.includes(event.id);
            return (
              <EventCard
                key={event.id}
                event={event}
                isRegistered={isRegistered}
                hasAccess={hasAccess}   
              />
            );
          })
        ) : (
          <div className="col-span-full text-center text-neutral-500 py-20">
            <p className="text-xl">No events found matching your criteria.</p>
          </div>
        )}
      </motion.div>
    </>
  );
}