'use client';

import { useScroll, useTransform, motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Image {
  src: string;
  alt?: string;
}

interface ZoomParallaxProps {
  /** Array of images to be displayed in the parallax effect (max 7 images recommended) */
  images: Image[];
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ZoomParallax({ images }: ZoomParallaxProps) {
  if (!images || images.length === 0) return null;

  // --------------------------------------------------------------------------
  // REFS & SCROLL TRACKING
  // --------------------------------------------------------------------------

  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress within this container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // --------------------------------------------------------------------------
  // MOBILE DETECTION
  // --------------------------------------------------------------------------

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // --------------------------------------------------------------------------
  // COUNTDOWN TIMER STATE
  // --------------------------------------------------------------------------

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    finished: false
  });

  useEffect(() => {
    const target = new Date('2026-02-20T00:00:00');

    const update = () => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, finished: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setCountdown({ days, hours, minutes, seconds, finished: false });
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // --------------------------------------------------------------------------
  // SCROLL PROGRESS & POSITION STATE (Desktop/Tablet)
  // --------------------------------------------------------------------------

  const [expansionProgress, setExpansionProgress] = useState(0);
  const [positionState, setPositionState] = useState<'absolute-top' | 'fixed' | 'absolute-bottom'>('absolute-top');

  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // PINNING LOGIC - pin the content while scrolling through the container
      if (rect.top <= 0 && rect.bottom >= windowHeight) {
        setPositionState('fixed');
      } else if (rect.bottom < windowHeight) {
        setPositionState('absolute-bottom');
      } else {
        setPositionState('absolute-top');
      }

      // PROGRESS CALCULATION
      const scrollableDistance = rect.height - windowHeight;
      const scrolled = -rect.top;
      let rawProgress = scrolled / scrollableDistance;
      rawProgress = Math.max(0, Math.min(1, rawProgress));

      // Use 90% for animation, 10% for hold at the end
      const animationCutoff = 0.90;
      let mappedProgress = rawProgress / animationCutoff;
      mappedProgress = Math.min(1, mappedProgress);

      setExpansionProgress(mappedProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  // --------------------------------------------------------------------------
  // ANIMATION TRANSFORMS - Smooth easing (Desktop/Tablet)
  // --------------------------------------------------------------------------

  // Smooth progress with easing
  const smoothProgress = expansionProgress * (2 - expansionProgress);

  // Scale transformations - start small, zoom to fill screen
  const scale4 = 1 + (4 - 1) * smoothProgress;
  const scale5 = 1 + (5 - 1) * smoothProgress;
  const scale6 = 1 + (6 - 1) * smoothProgress;
  const scale8 = 1 + (8 - 1) * smoothProgress;
  const scale9 = 1 + (9 - 1) * smoothProgress;

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  // Images fade out as they zoom
  const imagesOpacity = Math.max(0, 1 - smoothProgress * 1.0);

  // Timer fades in as images fade out
  const timerOpacity = Math.min(1, Math.max(0, (smoothProgress - 0.3) * 2));

  // Hype text appears early and fades as timer appears
  const hypeTextOpacity = Math.max(0, 1 - smoothProgress * 2);

  // "Stay Tuned" appears after images fade
  const stayTunedOpacity = Math.min(1, Math.max(0, (smoothProgress - 0.4) * 3));

  // Background gradient effect
  const bgOpacity = Math.min(0.5, smoothProgress * 0.5);

  // --------------------------------------------------------------------------
  // CONTAINER STYLE CALCULATION (Desktop/Tablet)
  // --------------------------------------------------------------------------

  const getContainerStyle = (): React.CSSProperties => {
    if (positionState === 'fixed') {
      return { position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 10 };
    }
    if (positionState === 'absolute-bottom') {
      return { position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100vh', zIndex: 10 };
    }
    return { position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 10 };
  };

  // --------------------------------------------------------------------------
  // MOBILE VERSION - Simple Carousel Animation
  // --------------------------------------------------------------------------

  if (isMobile) {
    return (
      <div className="w-full min-h-screen bg-black py-20 px-4 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-900/30 to-black" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <h2 className="text-4xl font-semibold tracking-tight text-white mb-3">
            The Legacy
          </h2>
          <div className="h-[1px] w-12 bg-white/20 mx-auto mb-3" />
          <p className="text-neutral-500 text-sm tracking-wide">
            Moments that defined us
          </p>
        </div>

        {/* Carousel Container */}
        <div className="w-full max-w-sm mb-12 relative z-10">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-2xl bg-neutral-900">
            {/* Main carousel wrapper */}
            <motion.div
              animate={{
                x: ['0%', '-100%', '-200%', '-300%', '-400%', '-500%', '0%'],
              }}
              transition={{
                duration: 20,
                ease: "linear",
                repeat: Infinity,
              }}
              className="flex absolute left-0 top-0 h-full"
              style={{ width: `${images.length * 2 * 100}%` }}
            >
              {/* Duplicate images for seamless loop */}
              {[...images.slice(0, 6), ...images.slice(0, 6)].map((img, idx) => (
                <div
                  key={idx}
                  className="relative flex-shrink-0 h-full"
                  style={{ width: `${100 / (images.length * 2)}%` }}
                >
                  <img
                    src={img.src}
                    alt={img.alt || `Memory ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Carousel indicators */}
          <div className="flex justify-center gap-1.5 mt-4">
            {images.slice(0, 6).map((_, idx) => (
              <motion.div
                key={idx}
                className="w-1.5 h-1.5 rounded-full bg-white/20"
                animate={{
                  backgroundColor: ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0.2)']
                }}
                transition={{
                  duration: 20 / 6,
                  delay: (20 / 6) * idx,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>
        </div>

        {/* Countdown Section */}
        <div className="text-center relative z-10">
          <p className="text-white/30 text-xs font-medium tracking-[0.5em] uppercase mb-6">
            Coming Soon
          </p>

          {!countdown.finished ? (
            <div className="py-8 px-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl">
              <h3 className="text-xs font-medium tracking-[0.4em] text-white/70 mb-8 uppercase">
                TechSolstice '26
              </h3>

              <div className="flex items-start justify-center gap-4 text-white">
                {/* Days */}
                <div className="flex flex-col items-center min-w-[55px]">
                  <span className="text-4xl font-light tabular-nums tracking-tight">{countdown.days}</span>
                  <span className="text-[9px] text-neutral-600 uppercase tracking-widest mt-2">Days</span>
                </div>

                <div className="text-3xl font-thin text-white/10 relative -top-1">:</div>

                {/* Hours */}
                <div className="flex flex-col items-center min-w-[55px]">
                  <span className="text-4xl font-light tabular-nums tracking-tight">{String(countdown.hours).padStart(2, '0')}</span>
                  <span className="text-[9px] text-neutral-600 uppercase tracking-widest mt-2">Hrs</span>
                </div>

                <div className="text-3xl font-thin text-white/10 relative -top-1">:</div>

                {/* Minutes */}
                <div className="flex flex-col items-center min-w-[55px]">
                  <span className="text-4xl font-light tabular-nums tracking-tight">{String(countdown.minutes).padStart(2, '0')}</span>
                  <span className="text-[9px] text-neutral-600 uppercase tracking-widest mt-2">Min</span>
                </div>

                <div className="text-3xl font-thin text-white/10 relative -top-1">:</div>

                {/* Seconds */}
                <div className="flex flex-col items-center min-w-[55px]">
                  <span className="text-4xl font-light tabular-nums tracking-tight">{String(countdown.seconds).padStart(2, '0')}</span>
                  <span className="text-[9px] text-neutral-600 uppercase tracking-widest mt-2">Sec</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-2xl font-light text-white tracking-wide">Event Started</div>
          )}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // DESKTOP & TABLET VERSION - Full Zoom Parallax Experience
  // --------------------------------------------------------------------------

  return (
    <div ref={containerRef} className="relative w-full h-[500vh]">
      {/* Dynamic Background */}
      <motion.div
        className="absolute inset-0 bg-black"
        style={{ opacity: 1 }}
      />

      <div
        style={getContainerStyle()}
        className="flex items-center justify-center overflow-hidden"
      >
        {/* Animated Background Glow (Subtle) */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-black to-neutral-900 transition-opacity duration-1000"
          style={{ opacity: bgOpacity }}
        />

        {/* Minimal Grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '100px 100px',
          }}
        />

        {/* 1. INITIAL HYPE TEXT */}
        <motion.div
          style={{ opacity: hypeTextOpacity }}
          className="absolute inset-0 flex flex-col items-center justify-center z-5 pointer-events-none"
        >
          <h2 className="text-7xl md:text-9xl font-semibold tracking-tighter text-white/90 mb-8 px-4 mix-blend-difference">
            The Legacy
          </h2>
          <div className="h-[1px] w-24 bg-white/30 mb-8" />
          <p className="text-neutral-500 text-lg tracking-[0.2em] uppercase font-light text-center max-w-2xl px-4">
            Moments that defined us
          </p>

          {/* Scroll Indicator */}
          <div className="absolute bottom-20 flex flex-col items-center gap-4 opacity-50">
            <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white to-transparent" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">Scroll</span>
          </div>
        </motion.div>

        {/* 2. PREPARE TEXT */}
        <motion.div
          style={{ opacity: Math.max(0, 1 - Math.abs(smoothProgress - 0.5) * 4) }}
          className="absolute inset-0 flex flex-col items-center justify-center z-5 pointer-events-none"
        >
          <h2 className="text-5xl md:text-7xl font-thin tracking-tight text-white mb-6 text-center px-4">
            TechSolstice <span className="font-normal text-white/50">'26</span>
          </h2>
          <p className="text-neutral-400 text-sm tracking-[0.5em] uppercase text-center max-w-xl px-4">
            Where innovation meets celebration
          </p>
        </motion.div>

        {/* 3. IMAGES LAYER */}
        {images.map(({ src, alt }, index) => {
          const scale = scales[index % scales.length];

          const positionClass =
            index === 1 ? '[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]' :
              index === 2 ? '[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]' :
                index === 3 ? '[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]' :
                  index === 4 ? '[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]' :
                    index === 5 ? '[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]' :
                      index === 6 ? '[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]' : '';

          return (
            <motion.div
              key={index}
              style={{
                transform: `scale(${scale})`,
                opacity: imagesOpacity,
                willChange: 'transform, opacity',
              }}
              className={`absolute top-0 flex h-full w-full items-center justify-center z-10 ${positionClass}`}
            >
              <div className="relative h-[25vh] w-[25vw] overflow-hidden rounded-sm shadow-2xl">
                <div className="absolute inset-0 bg-neutral-900" />
                <img
                  src={src || '/placeholder.svg'}
                  alt={alt || `Memory ${index + 1}`}
                  className="h-full w-full object-cover opacity-90 grayscale-[20%] contrast-125"
                  loading="eager"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
              </div>
            </motion.div>
          );
        })}

        {/* 4. STAY TUNED LABEL */}
        <motion.div
          style={{ opacity: stayTunedOpacity }}
          className="absolute top-24 left-0 right-0 text-center z-20 pointer-events-none"
        >
          <p className="text-white/30 text-xs font-medium tracking-[0.8em] uppercase">
            Mark Your Calendar
          </p>
        </motion.div>

        {/* 5. MINIMAL TIMER */}
        <motion.div
          style={{ opacity: timerOpacity }}
          className="absolute inset-0 flex items-center justify-center z-20"
        >
          {!countdown.finished ? (
            <div className="text-center p-12 md:p-16 rounded-[2rem] bg-black/20 backdrop-blur-2xl border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.5)]">

              <div className="mb-12">
                <h3 className="text-sm font-medium tracking-[0.5em] text-white/70 mb-3 uppercase">
                  TechSolstice '26
                </h3>
                <div className="h-[1px] w-8 bg-white/20 mx-auto" />
              </div>

              <div className="flex items-start gap-8 md:gap-12 text-white justify-center">

                {/* Days */}
                <div className="flex flex-col items-center">
                  <span className="text-6xl md:text-8xl font-thin tabular-nums tracking-tighter text-white">
                    {countdown.days}
                  </span>
                  <span className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-[0.3em] mt-4 font-medium">Days</span>
                </div>

                <div className="text-6xl md:text-8xl font-thin text-white/5 relative -top-2">:</div>

                {/* Hours */}
                <div className="flex flex-col items-center">
                  <span className="text-6xl md:text-8xl font-thin tabular-nums tracking-tighter text-white">
                    {String(countdown.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-[0.3em] mt-4 font-medium">Hours</span>
                </div>

                <div className="text-6xl md:text-8xl font-thin text-white/5 relative -top-2">:</div>

                {/* Minutes */}
                <div className="flex flex-col items-center">
                  <span className="text-6xl md:text-8xl font-thin tabular-nums tracking-tighter text-white">
                    {String(countdown.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-[0.3em] mt-4 font-medium">Mins</span>
                </div>

                <div className="text-6xl md:text-8xl font-thin text-white/5 relative -top-2">:</div>

                {/* Seconds */}
                <div className="flex flex-col items-center">
                  <span className="text-6xl md:text-8xl font-thin tabular-nums tracking-tighter text-white">
                    {String(countdown.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] md:text-xs text-neutral-500 uppercase tracking-[0.3em] mt-4 font-medium">Secs</span>
                </div>

              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-6xl md:text-8xl font-thin tracking-tighter text-white mb-6">
                Now Live
              </div>
              <p className="text-lg text-neutral-400 tracking-[0.5em] uppercase">Welcome to the future</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default ZoomParallax;