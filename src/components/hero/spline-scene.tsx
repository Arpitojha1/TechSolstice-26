"use client";

import { Suspense, lazy, useEffect, useRef, useState } from 'react';

// Lazy load the heavy Spline library
const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // IntersectionObserver ensures we don't load WebGL contexts until they are actually on screen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.01
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {shouldLoad ? (
        <Suspense fallback={
          <div className="h-full w-full bg-transparent flex items-center justify-center">
            {/* Fallback can be a simple spinner or empty div */}
          </div>
        }>
          <Spline
            scene={scene}
            style={{ width: '100%', height: '100%' }}
          />
        </Suspense>
      ) : (
        <div className="h-full w-full bg-transparent" />
      )}
    </div>
  );
}