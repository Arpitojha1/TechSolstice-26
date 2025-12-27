"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";

type Props = {
  mediaSrc: string;
  title?: string;
  scrollToExpand?: string;
};

export default function ScrollExpansionVideo({ mediaSrc }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controls = useAnimation();

  // Check if mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Track expansion progress
  const [expansionProgress, setExpansionProgress] = useState(0);
  const [hasFlashed, setHasFlashed] = useState(false);

  // Video Playback Optimization
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => { });
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  // Track scroll and update expansion progress
  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate how much of the container is in view
      // Progress goes from 0 (just entering) to 1 (fully covering viewport)
      let progress = 0;

      if (rect.top > windowHeight) {
        // Container is below viewport
        progress = 0;
      } else if (rect.top <= 0 && rect.bottom >= windowHeight) {
        // Container fully covers viewport
        progress = 1;
      } else if (rect.top < windowHeight && rect.top > 0) {
        // Container is entering from bottom
        progress = (windowHeight - rect.top) / windowHeight;
      } else if (rect.bottom < windowHeight && rect.bottom > 0) {
        // Container is exiting from top
        progress = 1; // Keep it at 1 once it's past
      }

      // Clamp between 0 and 1
      progress = Math.max(0, Math.min(1, progress));

      setExpansionProgress(progress);

      // Trigger flash when fully expanded
      if (progress >= 0.95 && !hasFlashed) {
        setHasFlashed(true);
        controls.start(
          { opacity: [0, 0.7, 0] },
          { duration: 0.8 }
        );
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [controls, hasFlashed, isMobile]);

  // Calculate video size based on expansion progress
  const getVideoSize = () => {
    const startWidth = 50; // 50%
    const endWidth = 100; // 100%

    const startHeight = 40; // 40vh
    const endHeight = 100; // 100vh

    const startRadius = 20; // 20px
    const endRadius = 0; // 0px

    const width = startWidth + (endWidth - startWidth) * expansionProgress;
    const height = startHeight + (endHeight - startHeight) * expansionProgress;
    const radius = startRadius + (endRadius - startRadius) * expansionProgress;

    return {
      width: `${width}%`,
      height: `${height}vh`,
      borderRadius: `${radius}px`,
    };
  };

  const videoSize = getVideoSize();

  // Calculate overlay opacity (fades out as it expands)
  const overlayOpacity = Math.max(0, 0.3 * (1 - expansionProgress * 2));

  // On mobile, render simple static video
  if (isMobile) {
    return (
      <div className="relative w-full min-h-screen flex items-center justify-center bg-black py-20">
        <div className="w-[90%] max-w-4xl mx-auto">
          <div className="relative w-full aspect-video overflow-hidden rounded-xl border border-white/10 bg-black/50 shadow-2xl">
            <video
              ref={videoRef}
              src={mediaSrc}
              className="w-full h-full object-cover"
              playsInline
              muted
              loop
              autoPlay
              preload="metadata"
            />
          </div>
        </div>
      </div>
    );
  }

  // Desktop: Scroll-driven expansion
  return (
    <div
      ref={containerRef}
      className="relative w-full h-[200vh] flex items-start justify-center bg-black"
    >
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          animate={{
            width: videoSize.width,
            height: videoSize.height,
            borderRadius: videoSize.borderRadius,
          }}
          transition={{
            duration: 0,
            ease: "linear",
          }}
          className="relative overflow-hidden border border-white/10 bg-black/50 shadow-2xl"
        >
          <video
            ref={videoRef}
            src={mediaSrc}
            className="w-full h-full object-cover"
            playsInline
            muted
            loop
            preload="metadata"
          />

          {/* Dark overlay that fades as video expands */}
          <div
            className="absolute inset-0 bg-black/30 pointer-events-none transition-opacity duration-300"
            style={{ opacity: overlayOpacity }}
          />

          {/* Flash overlay for animation */}
          <motion.div
            animate={controls}
            initial={{ opacity: 0 }}
            className="absolute inset-0 bg-white pointer-events-none"
          />
        </motion.div>
      </div>
    </div>
  );
}