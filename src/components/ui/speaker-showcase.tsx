"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register Plugin outside component to avoid re-registration
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SpeakerShowcase: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tvRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // Safety check for SSR
    if (!sectionRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ============================================
      // DESKTOP ANIMATION (>= 1024px)
      // ============================================
      mm.add("(min-width: 1024px)", () => {
        // Initial State for Desktop
        gsap.set(tvRef.current, {
          scale: 0.6,
          rotateY: 40,
          rotateX: 10,
          z: 0,
          xPercent: 0,
          left: "50%",
          top: "50%",
          x: "-50%",
          y: "-50%",
          position: "absolute",
        });

        gsap.set(descRef.current, {
          autoAlpha: 0,
          x: 50,
          position: "absolute",
          right: "12%",
          top: "50%",
          y: "-50%",
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=150%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });

        // 1. Bring TV to front and center
        tl.to(tvRef.current, {
          scale: 1,
          rotateY: 0,
          rotateX: 0,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          ease: "power2.inOut",
          duration: 1,
        })
          // 2. Slide TV to the left
          .to(tvRef.current, {
            left: "28%",
            x: "-50%",
            ease: "power2.inOut",
            duration: 1,
          }, ">-0.2")
          // 3. Reveal Description
          .to(descRef.current, {
            autoAlpha: 1,
            x: 0,
            ease: "power2.out",
            duration: 0.8,
          }, "<0.2");
      });

      // ============================================
      // MOBILE/TABLET ANIMATION (< 1024px)
      // ============================================
      mm.add("(max-width: 1023px)", () => {
        gsap.set(tvRef.current, {
          scale: 0.9,
          rotateY: 10,
          y: 30,
          opacity: 0,
          position: "relative",
          left: "auto",
          top: "auto",
          x: 0,
          yPercent: 0,
        });

        gsap.set(descRef.current, {
          autoAlpha: 0,
          y: 30,
          position: "relative",
          right: "auto",
          top: "auto",
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "center center",
            scrub: 1,
          },
        });

        tl.to(tvRef.current, {
          scale: 1,
          rotateY: 0,
          y: 0,
          opacity: 1,
          ease: "power2.out",
        })
          .to(descRef.current, {
            autoAlpha: 1,
            y: 0,
            ease: "power2.out",
          }, "-=0.2");
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[100vh] bg-transparent overflow-hidden flex flex-col items-center justify-center py-20 lg:py-0"
      style={{ perspective: "1500px" }}
    >
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none z-0" />

      <div
        ref={containerRef}
        className="relative w-full max-w-[1400px] h-full flex flex-col lg:block items-center justify-center gap-12 px-6 z-10"
      >

        {/* HEADER */}
        <div className="relative z-50 text-center lg:absolute lg:top-[12%] lg:left-0 lg:right-0 lg:w-full space-y-2">

          <h2 className="vintage-font text-3xl sm:text-4xl md:text-5xl text-white/90 drop-shadow-lg">
            THE KEYNOTE
          </h2>
        </div>

        {/* TV WRAPPER */}
        <div
          ref={tvRef}
          className="relative z-30 w-full max-w-[500px] aspect-video lg:h-[55vh] lg:w-auto lg:aspect-[4/3] bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center group"
        >
          {/* Subtle Outer Glow/Border */}
          <div className="absolute inset-0 border border-white/10 rounded-2xl z-50 pointer-events-none" />
          <div className="absolute inset-0 ring-1 ring-white/5 rounded-2xl z-50 pointer-events-none" />

          {/* Screen Content: Standby Mode */}
          <div className="w-full h-full bg-neutral-950 relative overflow-hidden flex flex-col items-center justify-center">
            {/* Scanlines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-20 opacity-40" />

            {/* Soft Central Glow */}
            <div className="absolute w-[200px] h-[200px] bg-white/5 blur-[80px] rounded-full animate-pulse z-10" />

            {/* Minimal Icon / Logo Placeholder */}
            <div className="relative z-30 flex flex-col items-center gap-4 opacity-60">
              <div className="h-12 w-12 rounded-full border border-white/20 flex items-center justify-center">
                <div className="h-1.5 w-1.5 bg-white/80 rounded-full animate-ping" />
              </div>
              <div className="text-[10px] tracking-[0.4em] text-white/40 uppercase">
                Speaker to be revealed soon
              </div>
            </div>

            {/* Reflection/Glare */}
            <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-white/[0.03] to-transparent z-20 pointer-events-none" />
          </div>
        </div>

        {/* DESCRIPTION CARD */}
        <div
          ref={descRef}
          className="relative z-40 w-full max-w-[500px] bg-neutral-900/60 backdrop-blur-md border border-white/10 rounded-xl p-8 md:p-10 text-left shadow-2xl"
        >
          <h3 className="vintage-font text-2xl md:text-3xl font-normal text-white mb-4 leading-tight">
            Unveiling the <br /> <span className="text-white/50">Visionary.</span>
          </h3>

          <div className="space-y-4">
            <p className="text-sm md:text-base leading-relaxed text-neutral-400 font-light">
              We are curating a session with a pioneer who has redefined the boundaries of technology and entrepreneurship.
            </p>
            <p className="text-sm md:text-base leading-relaxed text-neutral-400 font-light">
              A voice that shapes the industry is coming to TechSolstice. Prepare for insights that don't just inform, but inspire the next generation of leaders.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SpeakerShowcase;