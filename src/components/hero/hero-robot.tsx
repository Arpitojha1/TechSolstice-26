"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@/hooks/use-media-query";
import { PatternText } from "@/components/animations/pattern-text";

// Dynamic import with transparent fallback for ASMR background visibility
const SplineScene = dynamic(() => import("@/components/hero/spline-scene").then((m) => m.SplineScene), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-transparent" />
});

export function HeroRobot() {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [fontSize, setFontSize] = useState<number>(120);

  // Logic: Only load heavy 3D elements if width >= 1024px (Laptops/Desktops)
  const isLaptopOrLarger = useMediaQuery("(min-width: 1024px)");

  const measureText = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return;

    const container = containerRef.current;
    const title = titleRef.current;
    if (container.clientWidth === 0) return;

    const availableWidth = container.clientWidth - 32;

    // Create canvas only once per measure call
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fontFamily = "Michroma, Doto, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif";
    const weight = "700";

    let size = 120;
    ctx.font = `${weight} ${size}px ${fontFamily}`;

    // Get text content safely
    const text = title.textContent || "TechSolstice'26";
    let metrics = ctx.measureText(text);

    let iterations = 0;
    // Cap iterations to prevent infinite loops if something goes wrong
    while (metrics.width > availableWidth && size > 20 && iterations < 100) {
      size -= 2;
      ctx.font = `${weight} ${size}px ${fontFamily}`;
      metrics = ctx.measureText(text);
      iterations++;
    }

    setFontSize(size);
  }, []);

  useEffect(() => {
    measureText();

    // Debounce resize handling
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        requestAnimationFrame(measureText);
      }, 100);
    };

    window.addEventListener("resize", handleResize);

    // Use ResizeObserver for container-specific changes
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

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
    <section className="relative h-screen w-full overflow-hidden" ref={containerRef}>

      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-10">
        {isLaptopOrLarger ? (
          <React.Suspense fallback={<div className="w-full h-full bg-transparent" />}>
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </React.Suspense>
        ) : (
          // Mobile Fallback: Transparent to show ASMR background
          <div className="w-full h-full bg-transparent" />
        )}
      </div>

      {/* Text Overlay Layer */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-4">
        <div
          ref={titleRef}
          className="text-center w-full max-w-full overflow-visible relative"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: 1.1,
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