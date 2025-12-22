"use client";

import { HeroRobot } from "../components/hero-robot";
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
        {/* Hero section with robot - no background here, let global bg show */}
        <HeroRobot />

        {/* Content section with gradient overlay to separate from hero */}
        <div className="min-h-screen bg-gradient-to-b from-black/80 via-neutral-900/80 to-black/80 backdrop-blur-sm p-4 sm:p-6 md:p-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Welcome to TechSolstice'26
          </h2>
          <p className="mt-2 text-sm sm:text-base md:text-lg text-neutral-300">
            Explore, innovate, and create with us.
          </p>
        </div>
      </div>
    </>
  );
}