"use client";

import { HeroRobot } from "../components/hero-robot";
import ScrollExpansionVideo from "@/components/ui/scroll-expansion-video";
import { LoadingScreen } from "../components/loading-screen";
import { useState, useEffect } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} minDuration={2000} />}

      <div
        className={`w-full transition-opacity duration-700 ${isLoading ? "opacity-0" : "opacity-100"
          }`}
      >
        {/* Hero section - ensure it takes full viewport */}
        <div className="min-h-screen">
          <HeroRobot />
        </div>

        {/* Video section - no margin needed, it's already full height */}
        <ScrollExpansionVideo
          mediaSrc="/videos/logo-reveal.mp4"
          title="TechSolstice'26 — Reveal"
          scrollToExpand="Scroll to expand"
        />

        {/* Next section placeholder removed — global Footer is provided by layout */}
      </div>
    </>
  );
}