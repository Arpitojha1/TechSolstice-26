"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { User } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SPEAKER_CONTENT = {
  header: {
    title: {
      prefix: "THE",
      highlight: "KEYNOTE",
    },
  },
  card: {
    revealText: "Speaker Reveal",
    number: "01.",
    type: "Main Event",
    title: "Unveiling Excellence",
    description: [
      "We are honored to host a pioneer who has significantly influenced the intersection of technology and industry.",
      "This session will provide deep insights into the future of innovation, curated for those ready to lead the next era.",
    ],
    badge: "Coming Soon",
  },
};

const SpeakerShowcase: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tvRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (
      !sectionRef.current ||
      !containerRef.current ||
      !tvRef.current ||
      !descRef.current
    )
      return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // DESKTOP: >= 1024px
      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=150%",
            scrub: 1.5,
            pin: true,
            anticipatePin: 1,
            // markers: true, // debug if needed
          },
        });

        // Initial set: TV slightly right, small, rotated
        gsap.set(tvRef.current, {
          xPercent: 40,
          scale: 0.8,
          rotateY: 30,
        });

        gsap.set(descRef.current, {
          autoAlpha: 0,
          x: 100,
        });

        tl.to(tvRef.current, {
          xPercent: 0,
          scale: 1,
          rotateY: 0,
          ease: "power2.inOut",
          duration: 1,
        }).to(
          descRef.current,
          {
            autoAlpha: 1,
            x: 0,
            ease: "power2.out",
            duration: 0.8,
          },
          "-=0.4"
        );
      });

      // MOBILE: < 1024px
      mm.add("(max-width: 1023px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 90%",
            scrub: 1,
          },
        });

        tl.from([tvRef.current, descRef.current], {
          y: 60,
          autoAlpha: 0,
          stagger: 0.2,
          duration: 1,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-neutral-950 w-full relative">
      {/* 1. SCROLLABLE HEADER SECTION */}
      <div className="w-full py-12 md:py-20 px-6 sm:px-8 flex flex-col items-center lg:items-start max-w-7xl mx-auto">
        <h2 className="michroma-regular text-4xl sm:text-5xl md:text-6xl lg:text-8xl text-white tracking-tighter leading-none uppercase text-center lg:text-left">
          {SPEAKER_CONTENT.header.title.prefix}{" "}
          <span className="text-red-600">
            {SPEAKER_CONTENT.header.title.highlight}
          </span>
        </h2>
        <div className="h-1 w-16 md:w-24 bg-red-600 mt-4 hidden lg:block" />
      </div>

      {/* 2. ANIMATED PINNED SECTION */}
      <section
        ref={sectionRef}
        className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 md:px-8 pb-20"
        style={{ perspective: "2000px" }}
      >
        {/* Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-[500px] bg-red-600/10 blur-[90px] md:blur-[120px] rounded-full pointer-events-none" />

        <div
          ref={containerRef}
          className="relative w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-10 lg:gap-20 z-10"
        >
          {/* TV WRAPPER */}
          <div
            ref={tvRef}
            className="relative z-30 w-full max-w-2xl lg:w-1/2 aspect-video lg:aspect-4/3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden group"
          >
            <div className="absolute inset-3 md:inset-4 bg-neutral-950/40 rounded-xl md:rounded-2xl overflow-hidden border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-tr from-red-600/5 via-transparent to-blue-600/5 opacity-50" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 opacity-10 group-hover:opacity-20 transition-all duration-700">
                  <User
                    className="w-full h-full text-white"
                    strokeWidth={0.5}
                  />
                </div>
                <div className="absolute bottom-6 md:bottom-8 text-center">
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.4em] md:tracking-[0.5em] text-white/40">
                    {SPEAKER_CONTENT.card.revealText}
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 rounded-2xl md:rounded-3xl border border-white/10 pointer-events-none" />
          </div>

          {/* DESCRIPTION CARD */}
          <div
            ref={descRef}
            className="relative z-40 w-full max-w-2xl lg:w-1/2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 shadow-2xl"
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-widest text-red-500 font-bold michroma-regular">
                    {SPEAKER_CONTENT.card.number}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-white/50 font-medium">
                    {SPEAKER_CONTENT.card.type}
                  </span>
                </div>
                <h3 className="michroma-regular text-2xl sm:text-3xl lg:text-4xl text-white leading-tight">
                  {SPEAKER_CONTENT.card.title}
                </h3>
              </div>
              <div className="space-y-4 text-neutral-400 text-sm lg:text-base font-light leading-relaxed">
                {SPEAKER_CONTENT.card.description.map((desc, i) => (
                  <p key={i}>{desc}</p>
                ))}
              </div>
              <div className="pt-4 md:pt-6">
                <div className="w-full py-3 md:py-4 bg-red-600/10 border border-red-600/20 rounded-xl text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] text-red-500 font-bold text-center">
                  {SPEAKER_CONTENT.card.badge}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SpeakerShowcase;