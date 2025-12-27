"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@/hooks/use-media-query";

const SplineScene = dynamic(() => import("./ui/spline-scene").then((m) => m.SplineScene), { ssr: false });

export function HeroRobot() {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [fontSize, setFontSize] = useState<number>(120);
  const isLaptopOrLarger = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    if (!containerRef.current || !titleRef.current) return;

    let raf = 0;

    const measure = () => {
      const container = containerRef.current!;
      const title = titleRef.current!;
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
      {/* Dark base to contrast against background particles
          Cover the entire hero area so the navbar blends seamlessly */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

      {/* Spline 3D Scene - only render on laptop+ to avoid loading heavy assets on small screens */}
      {isLaptopOrLarger && (
        <div className="absolute inset-0 z-10">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full touch-none"
          />
        </div>
      )}

      {/* Centered Text Overlay - Above Spline scene */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-2 sm:px-4 md:px-6 lg:px-8">
        <h1
          ref={titleRef}
          className="michroma-regular font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 text-center w-full max-w-full leading-tight overflow-hidden drop-shadow-2xl whitespace-nowrap"
          style={{
            fontSize: `${fontSize}px`,
            fontOpticalSizing: "auto",
            fontVariationSettings: '"ROND" 0',
            whiteSpace: "nowrap",
            overflowWrap: "normal",
          }}
        >
          TechSolstice'26
        </h1>
      </div>
    </section>
  );
}