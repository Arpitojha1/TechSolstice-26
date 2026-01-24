"use client";

import { useState, useEffect, memo } from "react";
import dynamic from "next/dynamic";
import { HeroRobot } from "../components/hero-robot";
import FestInfo from "@/components/ui/fest-info";
import LoadingScreen from "../components/loading-screen";
import ReactDOM from "react-dom";

// --- DYNAMIC IMPORTS (Fixed for correct Export Types) ---

// 1. SpeakerShowcase (Default Export)
const SpeakerShowcase = dynamic(() => import("@/components/ui/speaker-showcase"), {
  ssr: true,
});

// 2. ScrollPathAnimation (Named Export)
const ScrollPathAnimation = dynamic(
  () => import("@/components/ui/scroll-path-animation").then((mod) => mod.ScrollPathAnimation),
  { ssr: false }
);

// 3. Trailer (Default Export)
const Trailer = dynamic(() => import("@/components/ui/trailer"), {
  ssr: false,
});

// 4. ZoomParallax (Default Export)
const ZoomParallax = dynamic(() => import("@/components/ui/zoom-parallax"), {
  ssr: false,
});

// 5. SponsorsSection (Named Export)
const SponsorsSection = dynamic(
  () => import("@/components/sponsors-section").then((mod) => mod.SponsorsSection),
  { ssr: true }
);

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Attempt to preload font if available
    // @ts-ignore
    if (typeof ReactDOM.preload === 'function') {
      // @ts-ignore
      ReactDOM.preload("/fonts/Michroma-Regular.ttf", { as: "font" });
    }
  }, []);

  useEffect(() => {
    // Clean up loading state
    const readyTimer = setTimeout(() => {
      setIsReady(true);
    }, 2000);

    const finishTimer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => {
      clearTimeout(readyTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  return (
    <main className="min-h-screen w-full relative">
      <LoadingScreen fadeOut={!loading} />

      {/* Critical LCP Element - Rendered Immediately */}
      <div className="relative z-0">
        <HeroRobot />
      </div>

      {/* Below Fold Content - Lazy Loaded */}
      {isReady && (
        <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-forwards">

          <div className="relative z-10 mt-0 md:-mt-1 bg-black">
            <FestInfo />
          </div>

          <div className="mt-8">
            <SpeakerShowcase />
          </div>

          <div className="mt-8">
            <ScrollPathAnimation />
          </div>

          <div>
            <Trailer videoId="comtgOhuXIg" />
          </div>

          <div>
            <ZoomParallax
              images={[
                // Center: TechSolstice Logo
                {
                  src: '/logos/TechSolsticeLogo.png',
                  alt: 'TechSolstice Logo',
                  fit: 'contain',
                  className: 'bg-transparent border-none'
                },
                // Student Council Logo
                {
                  src: '/logos/SCLogo.png',
                  alt: 'Student Council Logo',
                  fit: 'contain',
                  className: 'bg-transparent border-none'
                },
              ]}
            />
          </div>

          <div className="pb-0">
            <SponsorsSection />
          </div>
        </div>
      )}
    </main>
  );
}

export default memo(Home);