'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import Link from 'next/link';
import styles from './scroll-path-animation.module.css';
import { EVENT_CATEGORIES } from '@/lib/constants/categories';

// Register GSAP Plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

export function ScrollPathAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Track active index for highlighting
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  // Helper to sync refs array length
  markerRefs.current = markerRefs.current.slice(0, EVENT_CATEGORIES.length);
  cardRefs.current = cardRefs.current.slice(0, EVENT_CATEGORIES.length);

  useEffect(() => {
    let ctx: gsap.Context;
    let resizeTimer: NodeJS.Timeout;

    const initAnimation = () => {
      // Revert previous context if exists to prevent duplicate triggers
      if (ctx) ctx.revert();

      ctx = gsap.context(() => {
        const box = boxRef.current;
        const container = containerRef.current;
        const markers = markerRefs.current;

        // Safety check
        if (!box || !container || markers.length === 0) return;

        // Force layout refresh for accurate measurements
        ScrollTrigger.refresh();

        const containerRect = container.getBoundingClientRect();

        // 1. Point Calculation
        // Calculate the center x,y of each marker relative to the container center
        // This effectively creates the "path" the box will travel.
        const pathPoints = markers.map((marker) => {
          if (!marker) return { x: 0, y: 0 };
          const rect = marker.getBoundingClientRect();

          // Center of the marker
          const markerCenterX = rect.left + rect.width / 2;
          const markerCenterY = rect.top + rect.height / 2;

          // Container relative coordinates centered on the box
          // (Box is centered by CSS usually, but we drive x/y explicitly)
          // We subtract box half-width/height to align centers.
          const x = markerCenterX - containerRect.left - box.offsetWidth / 2;
          const y = markerCenterY - containerRect.top - box.offsetHeight / 2;

          return { x, y };
        });

        // 2. Set Initial Position (Snap check)
        if (pathPoints.length > 0) {
          gsap.set(box, { x: pathPoints[0].x, y: pathPoints[0].y });
        }

        // 3. Main Timeline
        // We use a single tween with motionPath for the physical movement
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top 60%", // Start when container top is near middle of viewport
            end: "bottom 30%", // End slightly before bottom leaves
            scrub: 1, // Smooth elasticity
            invalidateOnRefresh: true,
          }
        });

        tl.to(box, {
          motionPath: {
            path: pathPoints,
            curviness: 0, // Linear path between points (Zig Zag)
            autoRotate: false,
          },
          ease: "none", // Linear scroll mapping
          // On Update: check proximity to markers to trigger highlights
          onUpdate: function () {
            // Get current progress (0 to 1)
            const progress = this.progress();
            // Calculate which segment we are in.
            // There are N categories, so N-1 segments. 
            // Actually, we map 0 -> Index 0, 1 -> Index Last.
            // Simplest way: Map progress to index range [0, length-1]
            const totalPoints = pathPoints.length;
            const approximateIndex = Math.round(progress * (totalPoints - 1));

            // Set active index if it changed
            setActiveIndex((prev) => (prev !== approximateIndex ? approximateIndex : prev));
          }
        });

      }, containerRef);
    };

    // Initial load delay to allow CSS layout to settle
    const initialTimer = setTimeout(initAnimation, 200);

    // Debounced Resize Handler
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initAnimation, 300);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      if (ctx) ctx.revert();
    };
  }, []);

  // CONFIGURATION
  // Spacing between items in Viewport Height units
  const ITEM_SPACING_VH = 25;
  const totalHeightVh = EVENT_CATEGORIES.length * ITEM_SPACING_VH;

  return (
    <div className={styles.mainWrapper}>

      {/* Intro Section */}
      <div className={styles.introSpacer}>
        <h3 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight michroma-regular uppercase">
          Explore Categories
        </h3>
        <p className="text-red-500 font-bold text-[10px] uppercase tracking-[0.4em] animate-pulse">
          Scroll to navigate
        </p>
        <div className="w-[1px] h-12 bg-gradient-to-b from-red-600 via-red-900 to-transparent mx-auto mt-6" />
      </div>

      {/* Path Container */}
      <div
        ref={containerRef}
        className={styles.pathContainer}
        style={{ height: `${totalHeightVh}vh`, paddingBottom: '20vh' }}
      >
        <div ref={boxRef} className={styles.box}></div>

        {EVENT_CATEGORIES.map((category, index) => {
          const isRight = index % 2 === 0; // Even indices Right, Odd indices Left (0, 2, 4 -> Right)

          // CSS Logic:
          // We want visual zig-zag.
          // Index 0: Right
          // Index 1: Left
          // Index 2: Right ...

          // Positioning from Top
          const safeDenominator = EVENT_CATEGORIES.length > 1 ? EVENT_CATEGORIES.length - 1 : 1;
          const topPos = (index / safeDenominator) * 100;

          // Check if this item is currently active
          const isActive = index === activeIndex;

          return (
            <div
              key={category.id}
              className={`${styles.stepContainer} ${isRight ? styles.alignRight : styles.alignLeft} ${isActive ? styles.activeRow : ''}`}
              style={{ top: `${topPos}%` }}
            >
              {/* Content Card */}
              <div
                ref={(el) => { cardRefs.current[index] = el }}
                className={`${styles.textCard} ${isActive ? styles.cardActive : ''}`}
              >
                <h4 className={`${styles.categoryTitle} michroma-regular`}>{category.title}</h4>
                <p className={styles.categoryDesc}>{category.description}</p>
                <Link href={`/events/${category.slug}`} className={styles.ctaLink}>
                  Explore &rarr;
                </Link>
              </div>

              {/* Path Marker (The Number) */}
              <div
                ref={(el) => { markerRefs.current[index] = el }}
                className={`${styles.marker} ${isActive ? styles.markerActive : ''}`}
              >
                {(index + 1).toString().padStart(2, '0')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="relative z-10 py-32 flex flex-col items-center justify-center text-center px-4 bg-gradient-to-t from-black via-black/95 to-transparent">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-10 drop-shadow-lg michroma-regular uppercase tracking-tight">
          Ready to Compete?
        </h2>
        <Link
          href="/events"
          className="group relative inline-flex items-center justify-center px-12 py-5 bg-red-600 text-white font-bold text-[11px] uppercase tracking-[0.4em] rounded-full overflow-hidden transition-all duration-300 hover:bg-red-700 hover:scale-105 hover:shadow-[0_0_40px_rgba(220,38,38,0.4)] md:px-14 md:py-6"
        >
          <span className="relative z-10 michroma-regular">View All Events</span>
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </Link>
      </div>

    </div>
  );
}