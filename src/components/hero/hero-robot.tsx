"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@/hooks/use-media-query";
import { PatternText } from "@/components/animations/pattern-text";

// ============================================================================
// CONFIGURATION
// ============================================================================

const HERO_CONFIG = {
  /** Text displayed in the hero section */
  heroText: "TechSolstice'26",
  /** Font stack for text measurement (must match CSS) */
  fontFamily: 'Michroma, Doto, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  /** Font weight for text measurement */
  fontWeight: "700",
  /** Maximum font size in pixels */
  maxFontSize: 120,
  /** Minimum font size in pixels (readability floor for mobile) */
  minFontSize: 24,
  /** Horizontal padding in rem (matches px-4 = 1rem each side) */
  horizontalPaddingRem: 2,
  /** Debounce delay for resize events in ms */
  resizeDebounceMs: 100,
  /** Max iterations for font size calculation (safety limit) */
  maxIterations: 100,
  /** Font size step for binary search */
  fontSizeStep: 2,
  /** Spline 3D scene URL */
  splineSceneUrl: "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode",
  /** Breakpoint for loading 3D scene */
  desktopBreakpoint: "(min-width: 1024px)",
} as const;

// ============================================================================
// DYNAMIC IMPORTS
// ============================================================================

const SplineScene = dynamic(
  () => import("@/components/hero/spline-scene").then((m) => m.SplineScene),
  {
    ssr: false,
    loading: () => <div className="w-full h-full bg-transparent" />,
  }
);

// ============================================================================
// COMPONENT
// ============================================================================

export function HeroRobot() {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [fontSize, setFontSize] = useState<number>(HERO_CONFIG.maxFontSize);

  // Only load heavy 3D elements on desktop
  const isDesktop = useMediaQuery(HERO_CONFIG.desktopBreakpoint);

  /**
   * Measures text width and calculates optimal font size to fit container
   */
  const measureText = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return;

    const container = containerRef.current;
    const title = titleRef.current;
    if (container.clientWidth === 0) return;

    // Calculate available width accounting for padding
    const remInPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const paddingPx = HERO_CONFIG.horizontalPaddingRem * remInPx;
    const availableWidth = container.clientWidth - paddingPx;

    // Create measurement context
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get text content
    const text = title.textContent || HERO_CONFIG.heroText;

    // Binary search for optimal font size
    let size = HERO_CONFIG.maxFontSize;
    ctx.font = `${HERO_CONFIG.fontWeight} ${size}px ${HERO_CONFIG.fontFamily}`;
    let metrics = ctx.measureText(text);

    let iterations = 0;
    while (
      metrics.width > availableWidth &&
      size > HERO_CONFIG.minFontSize &&
      iterations < HERO_CONFIG.maxIterations
    ) {
      size -= HERO_CONFIG.fontSizeStep;
      ctx.font = `${HERO_CONFIG.fontWeight} ${size}px ${HERO_CONFIG.fontFamily}`;
      metrics = ctx.measureText(text);
      iterations++;
    }

    setFontSize(size);
  }, []);

  useEffect(() => {
    measureText();

    // Debounced resize handler
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        requestAnimationFrame(measureText);
      }, HERO_CONFIG.resizeDebounceMs);
    };

    window.addEventListener("resize", handleResize);

    // ResizeObserver for container-specific changes
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [measureText]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-10">
        {isDesktop ? (
          <React.Suspense fallback={<div className="w-full h-full bg-transparent" />}>
            <SplineScene
              scene={HERO_CONFIG.splineSceneUrl}
              className="w-full h-full"
            />
          </React.Suspense>
        ) : (
          <div className="w-full h-full bg-transparent" />
        )}
      </div>

      {/* Text Overlay Layer - with safe area padding for notched devices */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-4 sm:px-6 lg:px-8" style={{ paddingLeft: 'max(1rem, env(safe-area-inset-left))', paddingRight: 'max(1rem, env(safe-area-inset-right))' }}>
        <div
          ref={titleRef}
          className="text-center w-full max-w-screen overflow-hidden relative"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: 1.1,
          }}
        >
          {/* ========== HERO TEXT COLOR OPTIONS ========== */}
          {/* 
           * TEXT COLOR: !text-white/90
           *   - white/90 = White at 90% opacity (slightly transparent)
           *   - Change 'white' to any Tailwind color: red-500, pink-500, cyan-400, etc.
           *   - Change /90 to adjust opacity: /100 (full), /75, /50 (half transparent)
           *   - Examples: !text-pink-400/90, !text-cyan-300/80, !text-red-500/100
           *
           * DROP SHADOW: drop-shadow-2xl
           *   - Adds depth/glow behind text for readability
           *   - Options: drop-shadow-sm, drop-shadow, drop-shadow-md, drop-shadow-lg, drop-shadow-xl, drop-shadow-2xl
           *   - For colored glow, use custom: drop-shadow-[0_0_15px_rgba(255,0,100,0.8)]
           */}
          <PatternText
            text={HERO_CONFIG.heroText}
            className="michroma-regular !text-[1em] !text-white/90 drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}