"use client";

import React from "react";
import { GooeyText } from "@/components/animations/gooey-text-morphing";

// ============================================================================
// CONFIGURATION
// ============================================================================

const FEST_INFO_CONFIG = {
  /** Event name */
  eventName: "TechSolstice'26",
  /** Event date display */
  eventDate: "February 20-22",
  /** Event location */
  location: "Manipal Institute of Technology, Bengaluru",
  /** Rotating tagline words */
  taglineWords: ["Collaborate.", "Compete.", "Create."],
  /** Stats displayed at bottom */
  stats: [
    { value: "30", label: "Categories", highlight: false },
    { value: "₹6.7L", label: "In Rewards", highlight: true },
    { value: "3", label: "Days of Innovation", highlight: false },
  ],
} as const;

// ============================================================================
// COMPONENT
// ============================================================================

export default function FestInfo() {
  return (
    <section className="relative w-full overflow-hidden bg-black py-24 md:py-32 font-sans select-none">

      {/* Background: Minimalist Ambient Depth */}
      <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M60 0H0V60\' fill=\'none\' stroke=\'white\' stroke-opacity=\'0.02\' stroke-width=\'1\'/%3E%3C/svg%3E')] opacity-50" />

      {/* Soft ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform opacity-30">
        <div className="h-160 w-160 rounded-full blur-[120px] bg-red-600/5" />
      </div>

      <div className="container relative mx-auto px-6 z-10 md:px-12 text-center">

        {/* Minimalist Wrapper */}
        <div className="mx-auto max-w-4xl p-4 md:p-8 relative">

          {/* Animated Gooey Text - Core Values */}
          <div className="relative z-10 mb-8">
            <GooeyText
              texts={FEST_INFO_CONFIG.taglineWords as unknown as string[]}
              morphTime={1}
              cooldownTime={1.5}
              className="relative h-28 md:h-40"
              textClassName="font-bold tracking-tighter text-5xl md:text-8xl text-red-600"
            />
          </div>

          {/* Divider Line */}
          <div className="w-12 h-px mx-auto bg-red-600/30 mb-8" />

          {/* Sub-header: Event Details */}
          <div className="space-y-3 mb-12">
            {/* Event name and date - reduced tracking on mobile for overflow safety */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-0 text-[10px] md:text-xs font-bold tracking-[0.15em] md:tracking-[0.5em] uppercase text-red-500 michroma-regular max-w-full overflow-hidden">
              <span>{FEST_INFO_CONFIG.eventName}</span>
              <span className="hidden md:inline text-white/20 px-2">|</span>
              <span>{FEST_INFO_CONFIG.eventDate}</span>
            </div>

            <p className="text-[10px] md:text-xs font-medium tracking-[0.15em] md:tracking-[0.3em] uppercase text-neutral-500 max-w-full">
              {FEST_INFO_CONFIG.location}
            </p>
          </div>

          {/* Body Text: Professional and Impactful */}
          <div className="max-w-2xl mx-auto text-sm md:text-base text-neutral-400 leading-relaxed space-y-6">
            <p className="text-neutral-300 font-light tracking-wide italic">
              TechSolstice represents the pinnacle of collegiate innovation—a convergence of technical excellence and creative vision.
            </p>

            <p className="font-light">
              We bring together aspiring engineers and visionaries from across the nation for an intensive three-day symposium. From <span className="text-white border-b border-white/10 pb-0.5">36-hour hackathons</span> to large-scale <span className="text-white border-b border-white/10 pb-0.5">robotic engineering</span> challenges, this is the definitive arena for technical mastery.
            </p>

            <div className="pt-4">
              <span className="text-[10px] uppercase tracking-[0.2em] md:tracking-[0.4em] text-neutral-600 font-black">
                Scale of Impact
              </span>
            </div>
          </div>

          {/* Call-to-Action Stats */}
          <div className="grid grid-cols-3 gap-6 md:gap-16 mt-12 max-w-3xl mx-auto">
            {FEST_INFO_CONFIG.stats.map((stat, idx) => (
              <div key={idx} className={`space-y-1 ${idx === 1 ? 'border-x border-white/5' : ''}`}>
                <div className={`text-2xl md:text-4xl font-bold michroma-regular ${stat.highlight ? 'text-red-600' : 'text-white'}`}>
                  {stat.value}
                </div>
                <div className="text-[9px] md:text-[10px] text-neutral-500 uppercase tracking-[0.15em] md:tracking-[0.3em] font-bold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}