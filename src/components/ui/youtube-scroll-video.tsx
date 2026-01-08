"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

type Props = {
  videoId: string;
  title?: string;
  scrollToExpand?: string;
};

export default function YouTubeScrollVideo({
  videoId,
  // Props kept for API compatibility, but unused in render as requested
  title = "Reveal",
  scrollToExpand = "Scroll to expand"
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controls = useAnimation();

  const [isMobile, setIsMobile] = useState(false);
  const [expansionProgress, setExpansionProgress] = useState(0);
  const [hasFlashed, setHasFlashed] = useState(false);
  const [positionState, setPositionState] = useState<'absolute-top' | 'fixed' | 'absolute-bottom'>('absolute-top');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // --- DESKTOP SCROLL LOGIC ---
  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // 1. PINNING LOGIC
      if (rect.top <= 0 && rect.bottom >= windowHeight) {
        setPositionState('fixed');
      } else if (rect.bottom < windowHeight) {
        setPositionState('absolute-bottom');
      } else {
        setPositionState('absolute-top');
      }

      // 2. PROGRESS LOGIC
      const scrollableDistance = rect.height - windowHeight;
      const scrolled = -rect.top;

      let rawProgress = scrolled / scrollableDistance;
      rawProgress = Math.max(0, Math.min(1, rawProgress));

      // 3. BUFFER LOGIC 
      const animationCutoff = 0.90;
      let mappedProgress = rawProgress / animationCutoff;
      mappedProgress = Math.min(1, mappedProgress);

      setExpansionProgress(mappedProgress);

      // Flash Effect
      if (mappedProgress >= 0.99 && !hasFlashed) {
        setHasFlashed(true);
        controls.start({ opacity: [0, 0.7, 0] }, { duration: 0.8 });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [controls, hasFlashed, isMobile]);

  // --- CALCULATIONS ---
  const getVideoSize = () => {
    const startWidth = 40;
    const endWidth = 100;
    const startHeight = 30;
    const endHeight = 100;
    const startRadius = 24;
    const endRadius = 0;

    const smoothProgress = expansionProgress * (2 - expansionProgress);

    return {
      width: `${startWidth + (endWidth - startWidth) * smoothProgress}%`,
      height: `${startHeight + (endHeight - startHeight) * smoothProgress}vh`,
      borderRadius: `${startRadius + (endRadius - startRadius) * smoothProgress}px`,
    };
  };

  const videoSize = getVideoSize();
  const overlayOpacity = Math.max(0, 0.4 * (1 - expansionProgress * 1.5));

  const getContainerStyle = (): React.CSSProperties => {
    if (positionState === 'fixed') {
      return { position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 10 };
    }
    if (positionState === 'absolute-bottom') {
      return { position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100vh', zIndex: 10 };
    }
    return { position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 10 };
  };

  // 1. QUALITY URL FIX: &vq=hd1080 (Force HD)
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&rel=0&showinfo=0&modestbranding=1&disablekb=1&iv_load_policy=3&vq=hd1080`;

  // --- MOBILE RENDER ---
  if (isMobile) {
    return <MobileVideo embedUrl={embedUrl} />;
  }

  // --- DESKTOP RENDER ---
  return (
    <div
      ref={containerRef}
      className="relative w-full h-[200vh] bg-black"
    >
      <div
        style={getContainerStyle()}
        className="flex items-center justify-center overflow-hidden"
      >
        <motion.div
          style={{
            width: videoSize.width,
            height: videoSize.height,
            borderRadius: videoSize.borderRadius,
          }}
          className="relative overflow-hidden border border-white/10 bg-black/50 shadow-2xl z-10"
        >
          {/* YOUTUBE IFRAME WRAPPER */}
          <div className="absolute inset-0 w-full h-full">
            <iframe
              src={embedUrl}
              // 2. SUPER-SAMPLING CSS FIX:
              // w-[300%] h-[300%] -> Makes the iframe physically huge so YouTube sends 1080p.
              // top-[-100%] left-[-100%] -> Centers this huge iframe.
              // scale-[0.333] -> Shrinks the huge clear video back to fit the container size.
              className="absolute top-[-100%] left-[-100%] w-[300%] h-[300%] scale-[0.333] pointer-events-none object-cover"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title="YouTube video player"
            />
            {/* 3. CLICK BLOCKER */}
            <div className="absolute inset-0 z-50 bg-transparent pointer-events-auto" />
          </div>

          <div
            className="absolute inset-0 bg-black/40 pointer-events-none transition-opacity duration-300"
            style={{ opacity: overlayOpacity }}
          />

          <motion.div
            animate={controls}
            initial={{ opacity: 0 }}
            className="absolute inset-0 bg-white pointer-events-none z-20 mix-blend-overlay"
          />
        </motion.div>
      </div>
    </div>
  );
}

// Sub-component for Mobile
const MobileVideo = ({ embedUrl }: { embedUrl: string }) => {
  const mobileRef = useRef(null);
  const isInView = useInView(mobileRef, { amount: 0.6, once: false });

  return (
    <div className="w-full bg-black py-20 flex items-center justify-center">
      <div ref={mobileRef} className="w-full max-w-md px-4">
        <motion.div
          initial={{ scale: 0.9, borderRadius: 20, filter: "brightness(0.6)" }}
          animate={isInView ? {
            scale: 1,
            borderRadius: 0,
            filter: "brightness(1)",
            marginLeft: "-1rem",
            marginRight: "-1rem",
            width: "calc(100% + 2rem)"
          } : {
            scale: 0.9,
            borderRadius: 20,
            filter: "brightness(0.6)",
            marginLeft: "0",
            marginRight: "0",
            width: "100%"
          }}
          transition={{ duration: 0.6, ease: "circOut" }}
          className="relative aspect-video overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10"
        >
          {/* Mobile also gets the super-sampling to force quality on phones */}
          <div className="absolute inset-0 w-full h-full overflow-hidden rounded-[inherit]">
            <iframe
              src={embedUrl}
              className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] scale-[0.5] pointer-events-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>

          <div className="absolute inset-0 z-50 bg-transparent" />

          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[size:100%_4px] pointer-events-none opacity-30" />
          <motion.div
            animate={isInView ? { opacity: 0 } : { opacity: 1 }}
            className="absolute inset-0 border-2 border-white/20 rounded-[20px] pointer-events-none"
          />
        </motion.div>
      </div>
    </div>
  );
};