"use client";

import { Suspense, lazy, useEffect, useRef, useState } from 'react'

// Lazy load the Spline component - only loads when component renders
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

/**
 * A component to load a 3D Spline scene with a loading fallback.
 * Optimized for mobile with touch event handling and intersection observer.
 * Only loads the heavy Spline library when the component is in viewport.
 */
export function SplineScene({ scene, className }: SplineSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Only load Spline when element is near viewport (intersection observer)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true)
            observer.disconnect() // Stop observing once loaded
          }
        })
      },
      {
        rootMargin: '100px', // Start loading 100px before it's visible
        threshold: 0.01
      }
    )

    observer.observe(container)

    // Prevent default touch behavior on mobile to allow scrolling
    const handleTouchStart = (e: TouchEvent) => {
      e.stopPropagation()
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: true })

    return () => {
      observer.disconnect()
      container.removeEventListener('touchstart', handleTouchStart)
    }
  }, [])

  return (
    <div ref={containerRef} className={className} style={{ touchAction: 'pan-y' }}>
      {shouldLoad ? (
        <Suspense fallback={
          <div className="h-full w-full bg-transparent flex items-center justify-center">
            <div className="text-center text-white/20">
              <div className="text-lg font-semibold mb-2">Loading 3D Scene...</div>
              <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white/40 rounded-full mx-auto"></div>
            </div>
          </div>
        }>
          <Spline
            scene={scene}
            style={{ width: '100%', height: '100%' }}
          />
        </Suspense>
      ) : (
        <div className="h-full w-full bg-transparent flex items-center justify-center">
          <div className="text-center text-white/10">
            <div className="text-lg font-semibold mb-2">3D Scene Ready</div>
            <div className="text-sm">Scroll to load</div>
          </div>
        </div>
      )}
    </div>
  )
}