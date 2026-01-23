"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { User } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SpeakerShowcase: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tvRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current || !containerRef.current || !tvRef.current || !descRef.current) return;

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
          },
        });

        // Use xPercent to center the TV relative to the whole container initially
        // We set the Card (descRef) to 0 alpha and pushed right
        gsap.set(tvRef.current, {
          xPercent: 40, // Visually centers the TV even though its flex-position is left
          scale: 0.8,
          rotateY: 30,
        });

        gsap.set(descRef.current, {
          autoAlpha: 0,
          x: 100,
        });

        tl.to(tvRef.current, {
          xPercent: 0, // Returns to its natural flex-row position
          scale: 1,
          rotateY: 0,
          ease: "power2.inOut",
          duration: 1,
        })
          .to(descRef.current, {
            autoAlpha: 1,
            x: 0,
            ease: "power2.out",
            duration: 0.8,
          }, "-=0.4");
      });

      // MOBILE: < 1024px
      mm.add("(max-width: 1023px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1,
          },
        });

        tl.from([tvRef.current, descRef.current], {
          y: 100,
          autoAlpha: 0,
          stagger: 0.2,
          duration: 1,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-neutral-950">
      {/* 1. SCROLLABLE HEADER SECTION */}
      <div className="w-full py-20 px-8 flex flex-col items-center lg:items-start max-w-7xl mx-auto">
        <h2 className="michroma-regular text-4xl sm:text-5xl md:text-6xl lg:text-8xl text-white tracking-tighter leading-none uppercase">
          THE <span className="text-red-600">KEYNOTE</span>
        </h2>
        <div className="h-1 w-24 bg-red-600 mt-4 hidden lg:block" />
      </div>

      {/* 2. ANIMATED PINNED SECTION */}
      <section
        ref={sectionRef}
        className="relative w-full min-h-screen flex items-center justify-center overflow-hidden px-4 md:px-8"
        style={{ perspective: "2000px" }}
      >
        {/* Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-[500px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div
          ref={containerRef}
          className="relative w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 z-10"
        >
          {/* TV WRAPPER */}
          <div
            ref={tvRef}
            className="relative z-30 w-full max-w-[500px] lg:w-1/2 aspect-video lg:aspect-4/3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden group"
          >
            <div className="absolute inset-4 bg-neutral-950/40 rounded-2xl overflow-hidden border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-tr from-red-600/5 via-transparent to-blue-600/5 opacity-50" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="relative w-32 h-32 md:w-48 md:h-48 opacity-10 group-hover:opacity-20 transition-all duration-700">
                  <User className="w-full h-full text-white" strokeWidth={0.5} />
                </div>
                <div className="absolute bottom-8 text-center">
                  <span className="text-[10px] uppercase tracking-[0.5em] text-white/40">Speaker Reveal</span>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none" />
          </div>

          {/* DESCRIPTION CARD */}
          <div
            ref={descRef}
            className="relative z-40 w-full max-w-[450px] lg:w-1/2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl"
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-widest text-red-500 font-bold michroma-regular">01. Main Event</div>
                <h3 className="michroma-regular text-2xl lg:text-4xl text-white">Unveiling Excellence</h3>
              </div>
              <div className="space-y-4 text-neutral-400 text-sm lg:text-base font-light leading-relaxed">
                <p>We are honored to host a pioneer who has significantly influenced the intersection of technology and industry.</p>
                <p>This session will provide deep insights into the future of innovation, curated for those ready to lead the next era.</p>
              </div>
              <div className="pt-6">
                <div className="w-full py-4 bg-red-600/10 border border-red-600/20 rounded-xl text-xs uppercase tracking-[0.4em] text-red-500 font-bold text-center">
                  Coming Soon
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Buffer Space for scrolling after pin */}
      <div className="h-screen" />
    </div>
  );
};

export default SpeakerShowcase;