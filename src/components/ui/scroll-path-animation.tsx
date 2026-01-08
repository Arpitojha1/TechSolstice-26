'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import Link from 'next/link';
import styles from './scroll-path-animation.module.css';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// --- DATA CONFIGURATION ---
type Zone = {
  title: string;
  description: string;
};

const zones: Zone[] = [
  {
    title: "Coding & Dev",
    description: "Hackathons and competitive coding battles. Prove your logic dominates the syntax.",
  },
  {
    title: "Robotics & Hardware",
    description: "Drone racing, line followers, and combat bots. Witness metal clash and circuits spark.",
  },
  {
    title: "Finance & Strategy",
    description: "Master the markets. Where high stakes meet sharp business acumen and strategy.",
  },
  {
    title: "Quizzes & Tech Games",
    description: "Test your trivia. It’s not just what you know, but how fast you can recall it.",
  },
  {
    title: "Creative & Design",
    description: "UI/UX face-offs and digital art. Where aesthetics meet functionality.",
  },
  {
    title: "Innovation & Ideation",
    description: "Startup prototypes and research. The launchpad for the next big disruption.",
  },
  {
    title: "Gaming Zone",
    description: "Valorant, FIFA, and Tekken tournaments for ultimate bragging rights.",
  },
  {
    title: "Other Events",
    description: "Treasure hunts, fun stalls, and informal events. Because a fest is nothing without vibes.",
  }
];

export function ScrollPathAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let ctx: gsap.Context;

    const initAnimation = () => {
      if (ctx) ctx.revert();

      ctx = gsap.context(() => {
        const box = boxRef.current;
        const container = containerRef.current;

        // FIX: Added Type Guard (m is HTMLDivElement) so TS knows 'markers' has no nulls
        const markers = markerRefs.current.filter((m): m is HTMLDivElement => m !== null);

        if (!box || !container || markers.length === 0) return;

        const containerRect = container.getBoundingClientRect();

        // 1. Build Path Data relative to container
        const pathPoints = markers.map((marker) => {
          const rect = marker.getBoundingClientRect();
          const x = (rect.left - containerRect.left) + (rect.width / 2) - (box.offsetWidth / 2);
          const y = (rect.top - containerRect.top) + (rect.height / 2) - (box.offsetHeight / 2);
          return { x, y };
        });

        // 2. Set Initial Position (Start at the first point)
        if (pathPoints.length > 0) {
          gsap.set(box, { x: pathPoints[0].x, y: pathPoints[0].y });
        }

        // 3. Create Timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            // START: When the top of the container hits the CENTER of the viewport
            start: "top center",
            // END: When the bottom of the container hits the CENTER of the viewport
            end: "bottom center",
            scrub: 0.5,
          }
        });

        tl.to(box, {
          motionPath: {
            path: pathPoints,
            curviness: 1.2,
            autoRotate: false,
            alignOrigin: [0.5, 0.5],
          },
          ease: "none",
        });

      }, containerRef);
    };

    const timer = setTimeout(initAnimation, 200);
    window.addEventListener('resize', initAnimation);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', initAnimation);
      if (ctx) ctx.revert();
    };
  }, []);

  // SPACING: 45vh per item
  const totalHeight = zones.length * 45;

  return (
    <div className={styles.mainWrapper}>

      {/* Intro */}
      <div className={styles.introSpacer}>
        <h3 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight">
          Explore Categories
        </h3>
        <p className="text-red-500 font-mono text-xs uppercase tracking-[0.2em] animate-pulse">
          Scroll to navigate
        </p>
        <div className="w-[1px] h-16 bg-gradient-to-b from-red-600 via-red-900 to-transparent mx-auto mt-8" />
      </div>

      <div
        ref={containerRef}
        className={styles.pathContainer}
        style={{ height: `${totalHeight}vh` }}
      >
        {/* The Moving Object */}
        <div ref={boxRef} className={styles.box}></div>

        {zones.map((zone, index) => {
          const isRight = index % 2 === 0;

          // Distribution Logic:
          const topPos = (index / (zones.length - 1)) * 100;

          // Number Formatting (01, 02...)
          const indexStr = (index + 1).toString().padStart(2, '0');

          return (
            <div
              key={index}
              className={`${styles.stepContainer} ${isRight ? styles.alignRight : styles.alignLeft}`}
              style={{ top: `${topPos}%` }}
            >
              {/* TEXT CARD */}
              <div className={styles.textCard}>
                <h4 className={styles.categoryTitle}>{zone.title}</h4>
                <p className={styles.categoryDesc}>{zone.description}</p>
                <Link href="/events" className={styles.ctaLink}>
                  Explore &rarr;
                </Link>
              </div>

              {/* MARKER (Target for Diamond) */}
              <div
                ref={(el) => { markerRefs.current[index] = el }}
                className={styles.marker}
              >
                {indexStr}
              </div>
            </div>
          );
        })}
      </div>

      {/* Final Spacer */}
      <div className={styles.introSpacer}>
        <h2 className="text-3xl font-bold text-white mb-6">Ready to Compete?</h2>
        <Link
          href="/events"
          className="px-10 py-4 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-all hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.5)]"
        >
          View All Events
        </Link>
      </div>

    </div>
  );
}