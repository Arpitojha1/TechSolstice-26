import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { User } from "lucide-react";

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
    if (!sectionRef.current || !containerRef.current || !tvRef.current || !descRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ============================================
      // DESKTOP ANIMATION (>= 1024px)
      // ============================================
      mm.add("(min-width: 1024px)", () => {
        // Initial State:
        // tvRef is visibly centered (we utilize layout + transform to achieve this 'centered' start look)
        // descRef is hidden and slightly offset to the right

        // We'll calculate the center position relative to the container for the "start" state
        // ideally getting the TV in the center. 
        // A simple way is to rely on the fact that flex aligns them.
        // If we want the *animation* of sliding from center to left, we can construct a from() tween.

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

        // ANIMATION STRATEGY:
        // The CSS positions them side-by-side with a gap.
        // We set the "from" state to look like the TV is in the center and desc is gone.

        // 1. Calculate approximate offset to center the TV
        // If the container is centered, and we have [TV] [gap] [Desc], 
        // shifting the TV right by (DescWidth + Gap) / 2 would roughly center it.
        // However, a simplier visual hack is often sufficient:
        // just push it right and scale it down slightly.

        // Initial setup for the timeline to animate FROM
        gsap.set(tvRef.current, {
          xPercent: 50, // Push TV right to appear more centered initially
          scale: 0.9,
          rotateY: 25,
        });

        gsap.set(descRef.current, {
          autoAlpha: 0,
          x: 50, // Push content slightly right
        });

        // Animation TO the final layout state (natural flex position)
        tl.to(tvRef.current, {
          xPercent: 0, // Return to natural flex position
          scale: 1,
          rotateY: 0,
          rotateX: 0,
          boxShadow: "0 0 50px rgba(220, 38, 38, 0.15)",
          ease: "power3.inOut",
          duration: 1,
        })
          .to(descRef.current, {
            autoAlpha: 1,
            x: 0,
            ease: "expo.out",
            duration: 0.8,
          }, "-=0.2"); // Overlap slightly
      });

      // ============================================
      // MOBILE/TABLET ANIMATION (< 1024px)
      // ============================================
      mm.add("(max-width: 1023px)", () => {
        gsap.set(tvRef.current, {
          scale: 0.9,
          y: 50,
          opacity: 0,
          // Ensure no residual desktop transforms interfere if resizing
          xPercent: 0,
          left: "auto",
          top: "auto",
        });

        gsap.set(descRef.current, {
          autoAlpha: 0,
          y: 50,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "center center",
            scrub: 1,
          },
        });

        tl.to(tvRef.current, {
          scale: 1,
          y: 0,
          opacity: 1,
          ease: "power2.out",
        })
          .to(descRef.current, {
            autoAlpha: 1,
            y: 0,
            ease: "power2.out",
          }, "-=0.3");
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-transparent overflow-hidden flex flex-col items-center justify-center py-20 px-4 md:px-8"
      style={{ perspective: "2000px" }}
    >
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-125 h-125 bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-125 h-125 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      {/* 
        MAIN CONTAINER 
        - Desktop: Flex Row, Centered, Gap
        - Mobile: Flex Col (inherited from section), but we wrap specific content
      */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[90rem] h-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 xl:gap-24 z-10"
      >

        {/* HEADER - Absolute on desktop to stay out of flex flow, or part of flow?
            Design implies it's separate typically. Let's keep it absolute top-left for desktop
            to match the 'bg' feel, or stick it in the flow if it shifts.
            Original was absolute on desktop. Let's keep it that way for clean separation.
        */}
        <div className="mb-6 lg:mb-0 lg:absolute lg:top-12 lg:left-12 lg:w-auto text-center lg:text-left z-20">
          <div className="flex flex-col items-center lg:items-start gap-2">
            <h2 className="michroma-regular text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-none uppercase">
              THE <span className="text-red-600">KEYNOTE</span>
            </h2>
          </div>
        </div>

        {/* TV WRAPPER - Flex Item */}
        <div
          ref={tvRef}
          className="relative z-30 w-full max-w-[20rem] sm:max-w-[24rem] md:max-w-[28rem] lg:max-w-[32rem] xl:max-w-[36rem] aspect-4/3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden group flex-shrink-0"
        >
          {/* Inner Display Area */}
          <div className="absolute inset-4 bg-neutral-950/40 rounded-2xl overflow-hidden border border-white/5">
            {/* Soft Ambient Light */}
            <div className="absolute inset-0 bg-gradient-to-tr from-red-600/5 via-transparent to-blue-600/5 opacity-50" />

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Simple Silhouette */}
              <div className="relative w-40 h-40 md:w-52 md:h-52 opacity-10 transition-all duration-700 group-hover:opacity-20 group-hover:scale-105">
                <User className="w-full h-full text-white" strokeWidth={0.5} />
              </div>

              {/* Status Indicator */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                <span className="text-[9px] uppercase tracking-[0.6em] text-white/30 font-medium">To Be Announced</span>
                <div className="h-px w-8 bg-white/10" />
              </div>
            </div>

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
          </div>

          {/* Bezel */}
          <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none" />
        </div>

        {/* DESCRIPTION CARD - Flex Item */}
        <div
          ref={descRef}
          className="relative z-40 w-full max-w-[24rem] lg:max-w-[28rem] bg-white/2 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl flex-shrink-0"
        >
          <div className="space-y-6 md:space-y-8">
            <div className="space-y-3">
              <div className="text-[10px] uppercase tracking-[0.3em] text-red-500/80 font-bold michroma-regular">Keynote Speaker</div>
              <h3 className="michroma-regular text-2xl md:text-3xl text-white leading-tight">
                Unveiling Excellence.
              </h3>
            </div>

            <div className="space-y-4 md:space-y-5">
              <p className="text-sm md:text-base leading-relaxed text-neutral-400 font-light">
                We are honored to host a pioneer who has significantly influenced the intersection of technology and industry.
              </p>
              <p className="text-sm md:text-base leading-relaxed text-neutral-400 font-light">
                This session will provide deep insights into the future of innovation, curated for those ready to lead the next era of development.
              </p>
            </div>

            <div className="pt-2 md:pt-4">
              <div className="w-full py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] uppercase tracking-[0.5em] text-white/40 font-bold text-center">
                Revealing Soon
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SpeakerShowcase;