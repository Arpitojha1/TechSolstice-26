'use client';

import { useScroll, useTransform, motion, useMotionValueEvent } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface Image {
  src: string;
  alt?: string;
}

interface ZoomParallaxProps {
  images: Image[];
}

// ============================================================================
// HELPERS
// ============================================================================

const TARGET_DATE = new Date('2026-02-20T00:00:00').getTime();

const getImagePositionClass = (index: number) => {
  switch (index) {
    case 1: return '[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]';
    case 2: return '[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]';
    case 3: return '[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]';
    case 4: return '[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]';
    case 5: return '[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]';
    case 6: return '[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]';
    default: return '';
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ZoomParallax({ images }: ZoomParallaxProps) {
  if (!images || images.length === 0) return null;

  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // --------------------------------------------------------------------------
  // MOBILE DETECTION
  // --------------------------------------------------------------------------
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // --------------------------------------------------------------------------
  // SCROLL LOGIC
  // --------------------------------------------------------------------------
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const [positionState, setPositionState] = useState<'absolute-top' | 'fixed' | 'absolute-bottom'>('absolute-top');

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (isMobile) return;
    if (latest > 0 && latest < 1) {
      setPositionState(prev => prev !== 'fixed' ? 'fixed' : prev);
    } else if (latest >= 1) {
      setPositionState(prev => prev !== 'absolute-bottom' ? 'absolute-bottom' : prev);
    } else {
      setPositionState(prev => prev !== 'absolute-top' ? 'absolute-top' : prev);
    }
  });

  // Animation Values
  const rawAnimationProgress = useTransform(scrollYProgress, [0, 0.9], [0, 1]);
  const smoothProgress = useTransform(rawAnimationProgress, v => v * (2 - v));

  // Scales
  const scale4 = useTransform(smoothProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(smoothProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(smoothProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(smoothProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(smoothProgress, [0, 1], [1, 9]);

  const getScaleForIndex = (index: number) => {
    const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];
    return scales[index % scales.length];
  };

  const imagesOpacity = useTransform(smoothProgress, [0, 1], [1, 0]);
  const timerOpacity = useTransform(smoothProgress, [0.3, 0.8], [0, 1]);
  const stayTunedOpacity = useTransform(smoothProgress, [0.4, 0.73], [0, 1]);
  const bgOpacity = useTransform(smoothProgress, [0, 1], [0, 0.98]);

  // --------------------------------------------------------------------------
  // COUNTDOWN
  // --------------------------------------------------------------------------
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, finished: false });

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const diff = TARGET_DATE - now;
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, finished: true });
        return;
      }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        finished: false
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const containerStyle: React.CSSProperties = {
    position: positionState === 'fixed' ? 'fixed' : 'absolute',
    top: positionState === 'absolute-bottom' ? 'auto' : 0,
    bottom: positionState === 'absolute-bottom' ? 0 : 'auto',
    left: 0,
    width: '100%',
    height: '100vh',
    zIndex: 10
  };

  // --------------------------------------------------------------------------
  // MOBILE RENDER 
  // --------------------------------------------------------------------------

  if (isMobile) {
    return (
      <div ref={containerRef} className="w-full min-h-[70vh] bg-black py-20 px-4 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Backdrop Grid */}
        <div className="absolute inset-0 bg-[#020202]">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.1]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)]" />
        </div>

        <div className="text-center relative z-10 w-full max-w-sm">
          {/* Top Label */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-white/5 bg-white/5 backdrop-blur-md">
              <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[9px] font-bold text-neutral-400 tracking-[0.4em] uppercase">The Countdown</span>
            </div>

            <h3 className="text-2xl font-bold tracking-[0.1em] text-white michroma-regular uppercase mb-2">
              TechSolstice'26
            </h3>
            <p className="text-[10px] text-red-500/80 tracking-[0.3em] font-bold uppercase mb-1">MIT Bengaluru</p>
            <p className="text-[9px] text-neutral-500 tracking-[0.2em] uppercase">Feb 20 - 22, 2026</p>
          </div>

          {!countdown.finished ? (
            <div className="relative">
              {/* Sleek Glass Card for Mobile */}
              <div className="relative p-8 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] shadow-2xl">
                {/* corner accents */}
                <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-white/10" />
                <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-white/10" />
                <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-white/10" />
                <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-white/10" />

                <div className="flex items-center justify-between gap-1">
                  <ResponsiveCounterUnit value={countdown.days} label="Days" />
                  <Separator mobile />
                  <ResponsiveCounterUnit value={countdown.hours} label="Hours" />
                  <Separator mobile />
                  <ResponsiveCounterUnit value={countdown.minutes} label="Mins" />
                  <Separator mobile />
                  <ResponsiveCounterUnit value={countdown.seconds} label="Secs" />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xl font-bold text-white tracking-widest uppercase michroma-regular">
              Now Live
            </div>
          )}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // DESKTOP RENDER
  // --------------------------------------------------------------------------

  return (
    <div ref={containerRef} className="relative w-full h-[200vh]">
      <motion.div className="absolute inset-0 bg-black" />

      <div style={containerStyle} className="flex items-center justify-center overflow-hidden">

        {/* Background Overlay */}
        <motion.div
          className="absolute inset-0 z-0 bg-black"
          style={{ opacity: bgOpacity }}
        >
          {/* The SVG Grid - High Visibility */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.2]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_95%)]" />
        </motion.div>

        {/* Cinematic Ambient Glow */}
        <motion.div
          style={{ opacity: timerOpacity }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-900/10 blur-[120px] rounded-full pointer-events-none z-0"
        />

        {/* Images */}
        {images.map(({ src, alt }, index) => {
          const scale = getScaleForIndex(index);
          const positionClass = getImagePositionClass(index);
          return (
            <motion.div
              key={index}
              style={{ scale, opacity: imagesOpacity }}
              className={`absolute top-0 flex h-full w-full items-center justify-center z-10 ${positionClass} will-change-transform`}
            >
              <div className="relative h-[25vh] w-[25vw] overflow-hidden rounded-sm shadow-2xl border border-white/5">
                <div className="absolute inset-0 bg-neutral-900" />
                <img src={src || '/placeholder.svg'} alt={alt || `Memory ${index + 1}`} className="h-full w-full object-cover opacity-90 grayscale-[20%] contrast-125" loading="eager" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/20 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]" />
              </div>
            </motion.div>
          );
        })}

        {/* Countdown Timer Overlay */}
        <motion.div
          style={{ opacity: timerOpacity }}
          className="absolute inset-0 flex items-center justify-center z-20"
        >
          {!countdown.finished ? (
            <div className="relative group text-center">
              {/* Event Info Header */}
              <div className="mb-12">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/20" />
                  <span className="text-[10px] uppercase tracking-[0.6em] text-red-500 font-bold">The Grand Reveal</span>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/20" />
                </div>

                <h3 className="text-4xl md:text-6xl font-bold tracking-[0.1em] text-white michroma-regular uppercase mb-6 drop-shadow-2xl">
                  TechSolstice '26
                </h3>

                <div className="flex items-center justify-center gap-8 text-neutral-400">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-500">Venue</span>
                    <span className="text-xs uppercase tracking-[0.1em] text-white">MIT Bengaluru</span>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-500">Date</span>
                    <span className="text-xs uppercase tracking-[0.1em] text-white">Feb 20-22, 2026</span>
                  </div>
                </div>
              </div>

              <div className="relative p-16 md:p-24 rounded-[3rem] bg-white/[0.01] backdrop-blur-2xl border border-white/[0.05] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden">
                {/* corner accents */}
                <div className="absolute top-8 left-8 w-6 h-6 border-t border-l border-white/10" />
                <div className="absolute top-8 right-8 w-6 h-6 border-t border-r border-white/10" />
                <div className="absolute bottom-8 left-8 w-6 h-6 border-b border-l border-white/10" />
                <div className="absolute bottom-8 right-8 w-6 h-6 border-b border-r border-white/10" />

                <div className="flex items-start gap-12 md:gap-24 text-white justify-center relative z-10">
                  <ResponsiveCounterUnit value={countdown.days} label="Days" />
                  <Separator />
                  <ResponsiveCounterUnit value={countdown.hours} label="Hours" />
                  <Separator />
                  <ResponsiveCounterUnit value={countdown.minutes} label="Minutes" />
                  <Separator />
                  <ResponsiveCounterUnit value={countdown.seconds} label="Seconds" />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center relative">
              <div className="absolute -inset-10 bg-red-500/20 blur-[100px] rounded-full" />
              <div className="relative">
                <div className="text-7xl md:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 mb-6">
                  Now Live
                </div>
                <p className="text-lg text-red-500 tracking-[0.5em] uppercase font-medium">Welcome to the future</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const Separator = ({ mobile }: { mobile?: boolean }) => (
  <div className={`flex flex-col justify-center gap-1 md:gap-3 opacity-20 ${mobile ? 'h-[30px] pt-1' : 'h-[80px]'}`}>
    <div className={`rounded-full bg-white/50 ${mobile ? 'w-[1px] h-1.5' : 'w-[1px] h-6'}`} />
  </div>
);

const ResponsiveCounterUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center group min-w-[2.5rem] md:min-w-0">
    <span className="text-3xl sm:text-4xl md:text-8xl font-normal tabular-nums tracking-tighter text-white michroma-regular leading-none">
      {String(value).padStart(2, '0')}
    </span>
    <span className="text-[7px] md:text-[10px] text-neutral-500 group-hover:text-red-400/80 transition-colors duration-500 uppercase tracking-[0.3em] md:tracking-[0.5em] mt-2 md:mt-8 font-bold">
      {label}
    </span>
  </div>
);

export default ZoomParallax;