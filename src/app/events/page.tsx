"use client";

import { useEffect } from "react";
import Link from "next/link";
import { EVENT_CATEGORIES } from "@/lib/constants/categories";
import { CategoryCard } from "@/components/categories/category-card";
import { PatternText } from "@/components/ui/pattern-text";
import PixelCard from "@/components/ui/pixel-card";

const EventsPage = () => {
  // Initialize smooth scrolling with Lenis
  // Handles dynamic import to ensure it only runs on the client-side
  useEffect(() => {
    let lenis: any;
    let rafId: number;
    let isMounted = true;

    const initLenis = async () => {
      try {
        const LenisModule = await import('@studio-freight/lenis');
        const Lenis = LenisModule.default;

        // Prevent initialization if the component unmounted during the async import
        if (!isMounted) return;

        lenis = new Lenis();

        const raf = (time: number) => {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
      } catch (e) {
        console.warn("Lenis failed to load", e);
      }
    };

    initLenis();

    // Cleanup function to kill the animation loop and destroy instance on unmount
    return () => {
      isMounted = false;
      if (lenis) lenis.destroy();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="min-h-screen w-full relative">
      
      {/* Hero Section */}
      {/* Min-height is set to prevent Cumulative Layout Shift (CLS) during loading */}
      <div className="relative min-h-[400px] md:min-h-[500px] lg:min-h-[600px] px-4 z-10 flex items-center justify-center py-20">
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="flex justify-center">
            <div className="min-h-[4rem] md:min-h-[6rem] lg:min-h-[8rem] flex items-center justify-center">
              <PatternText
                text="Events"
                className="michroma-regular !text-[3.5rem] sm:!text-[5rem] md:!text-[6rem] lg:!text-[8rem] !text-white/90 drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-32 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Featured Conclave Card */}
          {/* Spans all available columns to sit at the top of the grid */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 h-[300px] sm:h-[400px] md:h-[450px]">
            <Link href="/events/conclave" className="block h-full w-full group relative overflow-hidden rounded-xl">
              <div className="h-full w-full transition-transform duration-300 ease-out group-hover:scale-[0.99]">
                <PixelCard 
                  variant="yellow" 
                  colors="#fff6d6,#fde68a,#f59e0b" 
                  speed={30} 
                  gap={6} 
                  className="w-full h-full"
                >
                  {/* Overlay Content */}
                  {/* Absolute positioning places text on top of the PixelCard canvas */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-10 z-10 text-center pointer-events-none">
                    <PatternText 
                      text="Conclave" 
                      className="michroma-regular !text-2xl sm:!text-4xl md:!text-5xl !text-white/95 tracking-wide mb-4 leading-tight" 
                    />
                    
                    <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-[90%] sm:max-w-2xl leading-relaxed font-medium">
                      A curated summit of talks, panels and deep-dive workshops — join leaders and makers.
                    </p>
                  </div>
                </PixelCard>
              </div>
            </Link>
          </div>

          {/* Standard Event Category Cards */}
          {EVENT_CATEGORIES.map((category, index) => (
            <div key={category.id} className="h-[280px] sm:h-[320px] md:h-[360px] lg:h-[420px]">
              <CategoryCard category={category} index={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;