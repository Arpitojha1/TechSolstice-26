"use client";

import { useEffect } from "react";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { type Event } from "@/components/cards/event-card";
import { type EventCategory } from "@/lib/constants/categories";
import { CategoryEventsClient } from "./category-events-client";

interface CategoryPageClientProps {
  category: EventCategory;
  events: Event[];
  registeredEventIds: string[];
  accessibleEventIds: string[];
}

export function CategoryPageClient({
  category,
  events,
  registeredEventIds,
  accessibleEventIds,
}: CategoryPageClientProps) {
  // No-op: Lenis is now global

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
            <h1 className={`text-5xl md:text-7xl font-bold bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent michroma-regular pb-2 leading-tight`}>
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
