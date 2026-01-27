'use client';

import { useScroll, useTransform, motion, useMotionValueEvent } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

// ============================================================================
// CONFIGURATION
// ============================================================================

const COUNTDOWN_CONFIG = {
  /** Event name displayed in countdown */
  eventName: "TechSolstice'26",
  /** Target date for countdown */
  targetDate: new Date('2026-02-20T00:00:00').getTime(),
  /** Event date display string */
  eventDateDisplay: "Feb 20-22, 2026",
  /** Event location */
  eventLocation: "MIT Bengaluru",
  /** Breakpoint for mobile detection */
  mobileBreakpoint: 1024,
  /** Time units for countdown calculations */
  timeUnits: {
    day: 1000 * 60 * 60 * 24,
    hour: 1000 * 60 * 60,
    minute: 1000 * 60,
    second: 1000,
  },
} as const;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ImageType {
  src: string;
  alt?: string;
  fit?: "cover" | "contain";
  className?: string;
}

interface ZoomParallaxProps {
  images: ImageType[];
}

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  finished: boolean;
}

// ============================================================================
// HELPERS
// ============================================================================

const getImagePositionClass = (index: number): string => {
  const positions: Record<number, string> = {
    0: '[&>div]:!top-0 [&>div]:!translate-x-[-65%] [&>div]:!h-[25vh] [&>div]:!w-[25vw]',
    1: '[&>div]:!top-0 [&>div]:!translate-x-[65%] [&>div]:!h-[25vh] [&>div]:!w-[25vw]',
    2: '[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]',
    3: '[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]',
    4: '[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]',
    5: '[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]',
    6: '[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]',
  };
  return positions[index] || '';
};

/**
 * Calculate countdown values from target date
 */
const calculateCountdown = (targetDate: number): CountdownState => {
  const diff = targetDate - Date.now();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };
  }

  const { day, hour, minute, second } = COUNTDOWN_CONFIG.timeUnits;

  return {
    days: Math.floor(diff / day),
    hours: Math.floor((diff / hour) % 24),
    minutes: Math.floor((diff / minute) % 60),
    seconds: Math.floor((diff / second) % 60),
    finished: false,
  };
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface SeparatorProps {
  mobile?: boolean;
}

const Separator = ({ mobile }: SeparatorProps) => (
  <div className={`flex flex-col justify-center opacity-20 ${mobile ? 'h-8' : 'h-full py-4'}`}>
    <div className={`rounded-full bg-white/50 w-px ${mobile ? 'h-2' : 'h-1/2'}`} />
  </div>
);

interface CounterUnitProps {
  value: number;
  label: string;
}

const ResponsiveCounterUnit = ({ value, label }: CounterUnitProps) => (
  <div className="flex flex-col items-center group min-w-0 flex-1">
    {/* Fluid typography with clamp for all screen sizes */}
    <span className="text-[clamp(1.25rem,5vw,3.5rem)] lg:text-[clamp(3rem,6vw,7rem)] font-normal tabular-nums tracking-tighter text-white michroma-regular leading-none">
      {String(value).padStart(2, '0')}
    </span>
    <span className="text-[clamp(0.375rem,0.8vw,0.625rem)] text-neutral-500 group-hover:text-red-400/80 transition-colors duration-500 uppercase tracking-widest lg:tracking-[0.4em] mt-2 lg:mt-6 font-bold truncate w-full text-center">
      {label}
    </span>
  </div>
);

// ============================================================================
// MOBILE LAYOUT
// ============================================================================

interface MobileCountdownProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  countdown: CountdownState;
}

const MobileCountdown = ({ containerRef, countdown }: MobileCountdownProps) => (
  <div
    ref={containerRef}
    className="w-full min-h-[80vh] bg-black py-20 flex flex-col items-center justify-center relative overflow-hidden"
  >
    {/* Background */}
    <div className="absolute inset-0 bg-[#020202]">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.1]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)]" />
    </div>

    {/* Content - with safe area padding */}
    <div className="text-center relative z-10 w-full max-w-sm px-4" style={{ paddingLeft: 'max(1rem, env(safe-area-inset-left))', paddingRight: 'max(1rem, env(safe-area-inset-right))' }}>
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <h3 className="text-[clamp(1.125rem,4.5vw,1.75rem)] font-bold tracking-[0.02em] text-white michroma-regular uppercase mb-2 max-w-full overflow-hidden">
          {COUNTDOWN_CONFIG.eventName}
        </h3>
        <p className="text-[clamp(0.5rem,1.5vw,0.625rem)] text-red-500/80 tracking-[0.15em] font-bold uppercase">
          {COUNTDOWN_CONFIG.eventDateDisplay}
        </p>
      </div>

      {/* Countdown Box */}
      <div className="relative p-6 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.05]">
        <div className="flex items-center justify-between gap-2">
          <ResponsiveCounterUnit value={countdown.days} label="Days" />
          <Separator mobile />
          <ResponsiveCounterUnit value={countdown.hours} label="Hrs" />
          <Separator mobile />
          <ResponsiveCounterUnit value={countdown.minutes} label="Min" />
          <Separator mobile />
          <ResponsiveCounterUnit value={countdown.seconds} label="Sec" />
        </div>
      </div>
    </div>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ZoomParallax({ images }: ZoomParallaxProps) {
  if (!images || images.length === 0) return null;

  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [countdown, setCountdown] = useState<CountdownState>(
    calculateCountdown(COUNTDOWN_CONFIG.targetDate)
  );
  const [positionState, setPositionState] = useState<'absolute-top' | 'fixed' | 'absolute-bottom'>('absolute-top');

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < COUNTDOWN_CONFIG.mobileBreakpoint);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Countdown timer
  useEffect(() => {
    const update = () => setCountdown(calculateCountdown(COUNTDOWN_CONFIG.targetDate));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // Scroll handling
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (isMobile) return;
    if (latest > 0 && latest < 1) {
      setPositionState('fixed');
    } else if (latest >= 1) {
      setPositionState('absolute-bottom');
    } else {
      setPositionState('absolute-top');
    }
  });

  // Animation transforms
  const rawAnimationProgress = useTransform(scrollYProgress, [0, 0.9], [0, 1]);
  const smoothProgress = useTransform(rawAnimationProgress, v => v * (2 - v));

  const scale4 = useTransform(smoothProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(smoothProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(smoothProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(smoothProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(smoothProgress, [0, 1], [1, 9]);

  const getScaleForIndex = (index: number) => {
    const scales = [scale4, scale4, scale6, scale5, scale6, scale8, scale9];
    return scales[index % scales.length];
  };

  const imagesOpacity = useTransform(smoothProgress, [0, 1], [1, 0]);
  const timerOpacity = useTransform(smoothProgress, [0.3, 0.85], [0, 1]);
  const bgOpacity = useTransform(smoothProgress, [0, 1], [0, 0.98]);

  const containerStyle: React.CSSProperties = {
    position: positionState === 'fixed' ? 'fixed' : 'absolute',
    top: positionState === 'absolute-bottom' ? 'auto' : 0,
    bottom: positionState === 'absolute-bottom' ? 0 : 'auto',
    left: 0,
    width: '100%',
    height: '100vh',
    zIndex: 10,
  };

  // Mobile layout
  if (isMobile) {
    return <MobileCountdown containerRef={containerRef} countdown={countdown} />;
  }

  // Desktop layout
  return (
    <div ref={containerRef} className="relative w-full h-[300vh]">
      <div style={containerStyle} className="flex items-center justify-center overflow-hidden">
        {/* Background */}
        <motion.div className="absolute inset-0 z-0 bg-black" style={{ opacity: bgOpacity }}>
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.2]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_95%)]" />
        </motion.div>

        {/* Parallax Images */}
        {images.map(({ src, alt, fit = "cover", className }, index) => (
          <motion.div
            key={index}
            style={{ scale: getScaleForIndex(index), opacity: imagesOpacity }}
            className={`absolute top-0 flex h-full w-full items-center justify-center z-10 ${getImagePositionClass(index)} will-change-transform`}
          >
            <div className={`relative h-[25vh] w-[25vw] overflow-hidden rounded-sm border border-white/5 ${className || ''}`}>
              <img
                src={src}
                alt={alt}
                className={`h-full w-full object-${fit} ${fit === 'contain' ? '' : 'grayscale-[20%]'}`}
              />
            </div>
          </motion.div>
        ))}

        {/* Countdown Timer */}
        <motion.div style={{ opacity: timerOpacity }} className="absolute inset-0 flex items-center justify-center z-20 px-6">
          {!countdown.finished ? (
            <div className="relative group text-center w-full max-w-7xl">
              {/* Header */}
              <div className="mb-8 lg:mb-16">
                <h3 className="text-[clamp(1.25rem,3.5vw,3.5rem)] font-bold tracking-[0.02em] text-white michroma-regular uppercase mb-4 max-w-full">
                  {COUNTDOWN_CONFIG.eventName}
                </h3>
                <div className="flex items-center justify-center gap-4 lg:gap-8 flex-wrap">
                  <span className="text-[clamp(0.5rem,1vw,0.75rem)] uppercase tracking-[0.2em] text-neutral-400">
                    {COUNTDOWN_CONFIG.eventLocation}
                  </span>
                  <div className="w-px h-4 bg-white/20 hidden sm:block" />
                  <span className="text-[clamp(0.5rem,1vw,0.75rem)] uppercase tracking-[0.2em] text-neutral-400">
                    {COUNTDOWN_CONFIG.eventDateDisplay}
                  </span>
                </div>
              </div>

              {/* Countdown Box */}
              <div className="relative p-8 md:p-12 lg:p-20 rounded-[2rem] lg:rounded-[4rem] bg-white/[0.01] backdrop-blur-3xl border border-white/[0.05] shadow-2xl">
                <div className="flex items-center justify-between gap-[2vw] text-white relative z-10 min-w-0">
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
            <div className="text-[clamp(3rem,10vw,9rem)] font-bold text-white michroma-regular uppercase">
              Now Live
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default ZoomParallax;