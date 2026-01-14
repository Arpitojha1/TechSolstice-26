"use client";

import { useEffect } from "react";
import { EVENT_CATEGORIES } from "@/lib/constants/categories";
import { CategoryCard } from "@/components/categories/category-card"; // Make sure path matches your structure
import { PatternText } from "@/components/ui/pattern-text";

const EventsPage = () => {
  // Separate conclave as the featured category
  const conclaveCategory = EVENT_CATEGORIES.find(cat => cat.slug === 'conclave');
  const otherCategories = EVENT_CATEGORIES.filter(cat => cat.slug !== 'conclave');

  // Initialize smooth scrolling with Lenis
  useEffect(() => {
    let lenis: any;
    let rafId: number;
    let isMounted = true;

    const initLenis = async () => {
      try {
        const LenisModule = await import('@studio-freight/lenis');
        const Lenis = LenisModule.default;

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

    return () => {
      isMounted = false;
      if (lenis) lenis.destroy();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="min-h-screen w-full relative">

      {/* Hero Section */}
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

          {/* Featured Conclave Card - Spans full width at the top */}
          {conclaveCategory && (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 h-[300px] sm:h-[400px] md:h-[450px]">
              <CategoryCard
                category={conclaveCategory}
                index={0}
                isFeatured={true} // <--- Added this prop
              />
            </div>
          )}

          {/* Other Event Category Cards */}
          {otherCategories.map((category, index) => (
            <div key={category.id} className="h-[280px] sm:h-[320px] md:h-[360px] lg:h-[420px]">
              <CategoryCard
                category={category}
                index={index + 1}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;