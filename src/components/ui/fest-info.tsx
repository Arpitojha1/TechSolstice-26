"use client";

import React from "react";
import { GooeyText } from "@/components/ui/gooey-text-morphing";

export default function FestInfo() {
  return (
    <section className="relative w-full overflow-hidden bg-neutral-950 py-24 md:py-36 font-sans select-none">

      {/* --- Background: Minimalist Ambient Depth --- */}
      {/* 1. Very faint grid (barely visible texture) */}
      <div className="pointer-events-none absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]"></div>

      {/* 2. Soft, deep ambient glow (toned down) */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform opacity-40">
        <div className="h-[30rem] w-[30rem] rounded-full blur-[100px]" style={{ backgroundColor: "rgba(125, 13, 44, 0.2)" }}></div>
      </div>

      <div className="container relative mx-auto px-6 z-10 md:px-12 text-center">

        {/* --- Minimalist Wrapper --- */}
        {/* Removed the heavy glass background. Just a whisper of a border. */}
        <div className="mx-auto max-w-4xl p-4 md:p-12 relative">

          {/* Animated Gooey Text */}
          {/* STRATEGY: High contrast. 
             The text is pure, vibrant red. The background is deep black.
             No drop-shadows allows the "liquid" animation to be the main star.
          */}
          <div className="relative z-10 mb-8">
            <GooeyText
              texts={["Collaborate.", "Compete.", "Create."]}
              morphTime={1}
              cooldownTime={1.5}
              className="relative h-28 md:h-40"
              textClassName="font-bold tracking-tighter text-5xl md:text-8xl text-red-600"
            />
          </div>

          {/* Divider Line */}
          <div className="w-16 h-1 mx-auto rounded-full mb-8" style={{ backgroundColor: "rgba(125, 13, 44, 0.3)" }}></div>

          {/* Sub-header: Clean white, no gradients */}
          <p className="text-sm md:text-base font-medium tracking-[0.2em] uppercase text-neutral-400 mb-8">
            TechSolstice '26 <span className="text-red-900 px-2">//</span> MIT Bengaluru
          </p>

          {/* Body Text: Muted gray for elegance. High readability. */}
          <div className="max-w-2xl mx-auto text-sm md:text-lg text-neutral-500 leading-relaxed font-normal space-y-6">
            <p>
              A convergence of creativity, future tech, and entrepreneurship.
              Bridging the gap between <span className="text-neutral-300">bold ideas</span> and reality.
            </p>

            <p>
              From the 36-Hour Hackathon to high-stakes Esports.
              This is your platform to <span className="text-red-500/80">ignite the future</span>.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}