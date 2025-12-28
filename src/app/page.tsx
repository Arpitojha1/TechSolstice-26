"use client";

import { HeroRobot } from "../components/hero-robot";
import ScrollExpansionVideo from "@/components/ui/scroll-expansion-video";
import { ScrollPathAnimation } from "@/components/ui/scroll-path-animation";
import ZoomParallax from "@/components/ui/zoom-parallax";
import FestInfo from "@/components/ui/fest-info";
import { LoadingScreen } from "../components/loading-screen";
import { useState, useEffect } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(true); // Default to true (safe mobile-first)

  useEffect(() => {
    // Check screen size on mount
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Check immediately
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Smooth scrolling using Lenis for nicer parallax experience
  useEffect(() => {
    // Dynamically import to avoid SSR issues
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
        // lenis not installed or failed to load — fail gracefully
        // console.warn('Lenis not loaded', e);
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
        {/* Hero section with robot */}
        <HeroRobot />

        {/* Video Section - ONLY RENDER ON DESKTOP/TABLET */}
        {!isMobile && (
          <div className="mt-12 md:mt-20 lg:mt-28">
            <ScrollExpansionVideo
              mediaSrc="/videos/logo-reveal.mp4"
              title="TechSolstice'26 — Reveal"
              scrollToExpand="Scroll to expand"
            />
          </div>
        )}

        {/* Fest information (placed after video, before parallax) */}
        <div className="mt-12">
          <FestInfo />
        </div>

        {/* Scroll Path Animation */}
        <div className="mt-8">
          <ScrollPathAnimation />
        </div>

        {/* Zoom parallax demo (integrates client component) */}
        <div className="mt-8">
          <ZoomParallax
            images={[
              { src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80', alt: 'Modern architecture building' },
              { src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80', alt: 'Urban cityscape at sunset' },
              { src: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80', alt: 'Abstract geometric pattern' },
              { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80', alt: 'Mountain landscape' },
              { src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80', alt: 'Minimalist design elements' },
              { src: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80', alt: 'Ocean waves and beach' },
              { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80', alt: 'Forest trees and sunlight' },
            ]}
          />
        </div>
      </div>
    </>
  );
}