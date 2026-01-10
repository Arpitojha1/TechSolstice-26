"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@/hooks/use-media-query";
import { PatternText } from "@/components/ui/pattern-text";

const SplineScene = dynamic(() => import("./ui/spline-scene").then((m) => m.SplineScene), { ssr: false });

export function HeroRobot() {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [fontSize, setFontSize] = useState<number>(120);
  const isLaptopOrLarger = useMediaQuery("(min-width: 1024px)");

  useLayoutEffect(() => {
    if (!containerRef.current || !titleRef.current) return;

    let raf = 0;

    const measure = () => {
      const container = containerRef.current!;
      const title = titleRef.current!;
      if (container.clientWidth === 0) return;
      const available = container.clientWidth - 32; // small padding

      // Create offscreen canvas to measure text width
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const fontFamily = "Michroma, Doto, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif";
      const weight = "700";

      // Start from a large font and shrink until it fits
      let size = 120;
      ctx.font = `${weight} ${size}px ${fontFamily}`;
      let metrics = ctx.measureText(title.textContent || "");

      while (metrics.width > available && size > 20) {
        size -= 2;
        ctx.font = `${weight} ${size}px ${fontFamily}`;
        metrics = ctx.measureText(title.textContent || "");
      }

      setFontSize(size);
    };

    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("resize", onResize);

    const ro = new ResizeObserver(onResize);
    ro.observe(containerRef.current as Element);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, []);

  return (
    // Container for the hero section - full screen and responsive
    <section className="relative h-screen w-full overflow-hidden" ref={containerRef}>
      {/* Hero background no tint/blur (removed tint/blur per request) */}

      {/* Spline 3D Scene - only render on laptop+ to avoid loading heavy assets on small screens */}
      {isLaptopOrLarger && (
        <div className="absolute inset-0 z-10">
          {/* Add priority loading optimization for LCP */}
          <React.Suspense fallback={<div className="w-full h-full bg-black/10" />}>
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full touch-none"
            />
          </React.Suspense>
        </div>
      )}

      {/* Centered Text Overlay - Above Spline scene */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-2 sm:px-4 md:px-6 lg:px-8">
        <div
          ref={titleRef}
          className="text-center w-full max-w-full overflow-visible relative"
          style={{
            fontSize: `${fontSize}px`,
          }}
        >
          <PatternText
            text="TechSolstice'26"
            className="michroma-regular !text-[1em] !text-white/90 drop-shadow-2xl whitespace-nowrap"
          />
        </div>
      </div>
    </section>
  );
}