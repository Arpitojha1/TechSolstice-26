"use client";

import { useEffect, useState } from 'react'

interface LoadingScreenProps {
  onLoadingComplete: () => void
  minDuration?: number // Minimum time to show loader (in ms)
}

export function LoadingScreen({ onLoadingComplete, minDuration = 1500 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let mounted = true
    const startTime = Date.now()

    // Track actual loading states
    const loadingStates = {
      fonts: false,
      document: false,
      images: false
    }

    const updateProgress = () => {
      if (!mounted) return

      const loaded = Object.values(loadingStates).filter(Boolean).length
      const total = Object.keys(loadingStates).length
      const actualProgress = (loaded / total) * 100

      // Smooth progress updates
      setProgress(prev => {
        const diff = actualProgress - prev
        return prev + Math.min(diff * 0.3, 10)
      })

      if (actualProgress >= 100) {
        const elapsed = Date.now() - startTime
        const remaining = Math.max(0, minDuration - elapsed)

        setTimeout(() => {
          if (!mounted) return
          setProgress(100)
          setIsComplete(true)
          setTimeout(() => {
            if (!mounted) return
            onLoadingComplete()
          }, 300)
        }, remaining)
      }
    }

    // Wait for fonts
    if (document.fonts) {
      document.fonts.ready.then(() => {
        loadingStates.fonts = true
        updateProgress()
      })
    } else {
      loadingStates.fonts = true
    }

    // Wait for DOM
    if (document.readyState === 'complete') {
      loadingStates.document = true
    } else {
      window.addEventListener('load', () => {
        loadingStates.document = true
        updateProgress()
      })
    }

    // Wait for images (check after a small delay to let page render)
    const checkImages = () => {
      const images = Array.from(document.images)
      if (images.length === 0) {
        loadingStates.images = true
        updateProgress()
        return
      }

      Promise.all(
        images.map(img => {
          if (img.complete) return Promise.resolve()
          return new Promise(resolve => {
            img.onload = () => resolve(undefined)
            img.onerror = () => resolve(undefined) // Don't block on errors
          })
        })
      ).then(() => {
        loadingStates.images = true
        updateProgress()
      })
    }

    // Start checking images after a brief delay
    setTimeout(checkImages, 100)

    // Progressive updates
    const interval = setInterval(updateProgress, 100)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [minDuration, onLoadingComplete])

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md transition-opacity duration-500 ${isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
    >
      {/* Logo or Title */}
      <div className="mb-8 text-center">
        <h1
          className="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent"
          style={{ fontFamily: '"Doto", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
        >
          TechSolstice'26
        </h1>
        <p className="mt-4 text-sm sm:text-base text-neutral-400 tracking-wider">
          LOADING EXPERIENCE
        </p>
      </div>

      {/* Minimal Progress Bar */}
      <div className="w-64 sm:w-80 md:w-96 h-1 bg-neutral-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-neutral-500 via-white to-neutral-500 rounded-full transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress Percentage */}
      <div className="mt-4 text-neutral-500 text-sm font-mono">
        {Math.round(progress)}%
      </div>

      {/* Subtle pulsing dot */}
      <div className="mt-8 flex gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}