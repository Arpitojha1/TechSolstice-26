"use client";

import { SplineScene } from "./ui/spline-scene"

export function HeroRobot() {
  return (
    // Container for the hero section - full screen and responsive
    <section className="relative h-screen w-full overflow-hidden">
      {/* Dark base to contrast against background particles */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      
      {/* Spline 3D Scene - Touch-enabled for mobile */}
      <div className="absolute inset-0 z-10">
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full touch-none"
        />
      </div>

      {/* Centered Text Overlay - Above Spline scene */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-2 sm:px-4 md:px-6 lg:px-8">
        <h1
          className="michroma-regular text-3xl min-[360px]:text-4xl min-[420px]:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 text-center w-full max-w-full break-words leading-tight overflow-hidden drop-shadow-2xl"
          style={{
            fontOpticalSizing: 'auto',
            fontVariationSettings: '"ROND" 0',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          TechSolstice'26
        </h1>
      </div>
    </section>
  )
}