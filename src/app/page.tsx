"use client";

import { HeroRobot } from "../components/hero-robot";
import ScrollExpansionVideo from "@/components/ui/scroll-expansion-video";
import { ScrollPathAnimation } from "@/components/ui/scroll-path-animation";
import ZoomParallax from "@/components/ui/zoom-parallax";
import FestInfo from "@/components/ui/fest-info";
import { LoadingScreen } from "../components/loading-screen";
import { useState, useEffect } from "react";
import Image from "next/image";
import Logo from "@/components/ui/logo";
import { SponsorsSection } from "@/components/sponsors-section";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    let rafId: number;
    (async () => {
      try {
        const Lenis = (await import('@studio-freight/lenis')).default;
        const lenis = new Lenis();

        function raf(time: number) {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);
      } catch (e) {
        // lenis optional
      }
    })();

    return () => cancelAnimationFrame(rafId);
  }, []);

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
        {/* --- FIXED LOGO HEADER --- */}
        <div className="fixed top-4 left-4 md:top-6 md:left-8 z-50">
          <Logo />
        </div>

        {/* Hero section */}
        <HeroRobot />

        {/* Video Section - Desktop Only */}
        {!isMobile && (
          <ScrollExpansionVideo
            mediaSrc="/videos/logo-reveal.mp4"
            title="TechSolstice'26 — Reveal"
            scrollToExpand="Scroll to expand"
          />
        )}

        {/* Fest information */}
        <div className="mt-12">
          <FestInfo />
        </div>

        {/* Scroll Path Animation */}
        <div className="mt-8">
          <ScrollPathAnimation />
        </div>

        {/* Zoom parallax */}
        <div className="mt-8">
          <ZoomParallax
            images={[
              { src: '/photos/IMG_0162.jpg', alt: 'Landscape center image' },
              { src: '/photos/IMG_1510.jpg', alt: 'Landscape image 1' },
              { src: '/photos/IMG_0110.jpg', alt: 'Portrait of an artist' },
              { src: '/photos/IMG-20250405-WA0141.jpg', alt: 'Landscape image 3' },
              { src: '/photos/IMG_1588.jpg', alt: 'Landscape image 2' },
              { src: '/photos/IMG_1510.jpg', alt: 'Landscape image 1 (repeated)' },
              { src: '/photos/IMG_1588.jpg', alt: 'Landscape image 2 (repeated)' },
            ]}
          />
        </div>

        {/* Sponsors Section */}
        <div className="mt-16">
          <SponsorsSection />
        </div>
      </div>
    </>
  );
}