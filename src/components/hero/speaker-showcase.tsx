"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { User } from "lucide-react";

// --- TYPES & DATA LAYER ---

export interface SpeakerProfile {
  id: string;
  name: string; // The "main" title, e.g. "Unveiling Excellence" or actual name later
  role: string | null;
  designation: string | null;
  description: string[];
  imageUrl: string | null; // For future use
  badgeText: string;
  revealText: string; // "Speaker Reveal"
  eventNumber: string; // "01."
  eventType: string; // "TechConclave"
}

const DEFAULT_SPEAKER: SpeakerProfile = {
  id: "keynote-01",
  name: "Unveiling Excellence",
  role: "Keynote Speaker",
  designation: "Industry Pioneer",
  description: [
    'Get ready to hear from a visionary mind shaping the future of technology.',
    'We’re bringing a trailblazer from the tech world to the Tech Conclave — and the reveal is happening soon!',
    'Tech Conclave is about to level up. Stay tuned!',
  ],
  imageUrl: null, // Set to a URL string to replace the User icon
  badgeText: "Coming Soon",
  revealText: "Speaker Reveal",
  eventNumber: "01.",
  eventType: "TechConclave",
};

// --- COMPONENT ---

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SpeakerShowcase: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const tvRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // --- DESKTOP ANIMATION (> 1024px) ---
      mm.add("(min-width: 1024px)", () => {
        // Initial States
        gsap.set(tvRef.current, {
          xPercent: 40,
          scale: 0.8,
          rotateY: 30,
        });

        gsap.set(cardRef.current, {
          autoAlpha: 0,
          x: 100,
        });

        // Timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=150%", // Scroll distance to complete animation
            scrub: 1.5,
            pin: true,
            anticipatePin: 1,
          },
        });

        tl.to(tvRef.current, {
          xPercent: 0,
          scale: 1,
          rotateY: 0,
          ease: "power2.inOut",
          duration: 1,
        })
          .to(cardRef.current, {
            autoAlpha: 1,
            x: 0,
            ease: "power2.out",
            duration: 0.8,
          }, "-=0.4");
      });

      // --- MOBILE ANIMATION (< 1024px) ---
      mm.add("(max-width: 1023px)", () => {
        // Simple fade/slide up on scroll
        gsap.from([tvRef.current, cardRef.current], {
          scrollTrigger: {
            trigger: contentWrapperRef.current, // Trigger on the content part specifically
            start: "top 75%",
            end: "bottom 90%",
            scrub: 1,
          },
          y: 50,
          autoAlpha: 0,
          stagger: 0.2,
          duration: 1,
        });
      });
    }, containerRef); // Scope to container

    return () => ctx.revert();
  }, []);

  const speaker = DEFAULT_SPEAKER;

  return (
    <section
      ref={containerRef}
      className="bg-neutral-950 w-full relative overflow-hidden flex flex-col justify-start lg:justify-center min-h-[50vh] lg:min-h-screen"
      style={{ perspective: "2000px" }}
    >
      {/* Background Effects (Pinned with container) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-[500px] bg-red-600/10 blur-[90px] md:blur-[120px] rounded-full pointer-events-none" />

      {/* 1. HEADER SECTION */}
      <div
        ref={headerRef}
        className="w-full py-12 lg:py-0 lg:mb-12 px-6 sm:px-8 flex flex-col items-center lg:items-start max-w-7xl mx-auto z-20"
      >
        <h2 className="michroma-regular text-4xl sm:text-5xl md:text-6xl lg:text-8xl text-white tracking-tighter leading-none uppercase text-center lg:text-left">
          THE <span className="text-red-600">KEYNOTE</span>
        </h2>
        <div className="h-1 w-16 md:w-24 bg-red-600 mt-4 hidden lg:block" />
      </div>

      {/* 2. CONTENT SECTION */}
      <div
        ref={contentWrapperRef}
        className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-10 lg:gap-20 z-30 pb-20 lg:pb-0"
      >
        {/* LEFT: TV SCREEN */}
        <div
          ref={tvRef}
          className="relative w-full max-w-2xl lg:w-1/2 aspect-video lg:aspect-4/3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden group"
        >
          {/* Screen Glare & Content */}
          <div className="absolute inset-3 md:inset-4 bg-neutral-950/40 rounded-xl md:rounded-2xl overflow-hidden border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-tr from-red-600/5 via-transparent to-blue-600/5 opacity-50" />

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {speaker.imageUrl ? (
                <img
                  src={speaker.imageUrl}
                  alt={speaker.name}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                // Placeholder Icon
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 opacity-10 group-hover:opacity-20 transition-all duration-700">
                  <User className="w-full h-full text-white" strokeWidth={0.5} />
                </div>
              )}

              {/* Reveal Text Overlay (if no image or always visible) */}
              {!speaker.imageUrl && (
                <div className="absolute bottom-6 md:bottom-8 text-center">
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.4em] md:tracking-[0.5em] text-white/40">
                    {speaker.revealText}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Screen Gloss/Frame */}
          <div className="absolute inset-0 rounded-2xl md:rounded-3xl border border-white/10 pointer-events-none" />
        </div>

        {/* RIGHT: INFO CARD */}
        <div
          ref={cardRef}
          className="w-full max-w-2xl lg:w-1/2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 shadow-2xl"
        >
          <div className="space-y-6">
            {/* Meta Tags */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-widest text-red-500 font-bold michroma-regular">
                  {speaker.eventNumber}
                </span>
                <span className="text-xs uppercase tracking-widest text-white/50 font-medium">
                  {speaker.eventType}
                </span>
              </div>
              <h3 className="michroma-regular text-2xl sm:text-3xl lg:text-4xl text-white leading-tight">
                {speaker.name}
              </h3>
            </div>

            {/* Description */}
            <div className="space-y-4 text-neutral-400 text-sm lg:text-base font-light leading-relaxed">
              {speaker.description.map((desc, i) => (
                <p key={i}>{desc}</p>
              ))}
            </div>

            {/* Footer / Badge */}
            <div className="pt-4 md:pt-6">
              <div className="w-full py-3 md:py-4 bg-red-600/10 border border-red-600/20 rounded-xl text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] text-red-500 font-bold text-center">
                {speaker.badgeText}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpeakerShowcase;