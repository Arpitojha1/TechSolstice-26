'use client';

import { useScroll, useTransform, motion, useMotionValueEvent } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ImageType {
  src: string;
  alt?: string;
}

interface ZoomParallaxProps {
  images: ImageType[];
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
// SUB-COMPONENTS
// ============================================================================

const Separator = ({ mobile }: { mobile?: boolean }) => (
  <div className={`flex flex-col justify-center opacity-20 ${mobile ? 'h-8' : 'h-full py-4'}`}>
    <div className={`rounded-full bg-white/50 w-[1px] ${mobile ? 'h-2' : 'h-1/2'}`} />
  </div>
);

const ResponsiveCounterUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center group min-w-0 flex-1">
    {/* Fluid typography: Min 1.5rem, Scales with width, Max 8rem */}
    <span className="text-[clamp(1.5rem,6vw,4rem)] lg:text-[clamp(3rem,7vw,7rem)] font-normal tabular-nums tracking-tighter text-white michroma-regular leading-none">
      {String(value).padStart(2, '0')}
    </span>
    <span className="text-[clamp(6px,0.8vw,10px)] text-neutral-500 group-hover:text-red-400/80 transition-colors duration-500 uppercase tracking-[0.2em] lg:tracking-[0.4em] mt-2 lg:mt-6 font-bold truncate w-full text-center">
      {label}
    </span>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ZoomParallax({ images }: ZoomParallaxProps) {
  if (!images || images.length === 0) return null;

  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const [positionState, setPositionState] = useState<'absolute-top' | 'fixed' | 'absolute-bottom'>('absolute-top');

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

  const rawAnimationProgress = useTransform(scrollYProgress, [0, 0.9], [0, 1]);
  const smoothProgress = useTransform(rawAnimationProgress, v => v * (2 - v));

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
  const timerOpacity = useTransform(smoothProgress, [0.3, 0.85], [0, 1]);
  const bgOpacity = useTransform(smoothProgress, [0, 1], [0, 0.98]);

  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, finished: false });

  useEffect(() => {
    const update = () => {
      const diff = TARGET_DATE - Date.now();
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

  if (isMobile) {
    return (
      <div ref={containerRef} className="w-full min-h-[80vh] bg-black py-20 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[#020202]">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.1]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)]" />
        </div>
        <div className="text-center relative z-10 w-full max-w-sm px-4">
          <div className="flex flex-col items-center mb-8">
            <h3 className="text-2xl font-bold tracking-[0.1em] text-white michroma-regular uppercase mb-2">TechSolstice'26</h3>
            <p className="text-[10px] text-red-500/80 tracking-[0.3em] font-bold uppercase">Feb 20 - 22, 2026</p>
          </div>
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
  }

  return (
    <div ref={containerRef} className="relative w-full h-[300vh]">
      <div style={containerStyle} className="flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0 z-0 bg-black" style={{ opacity: bgOpacity }}>
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.2]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_95%)]" />
        </motion.div>

        {images.map(({ src, alt }, index) => (
          <motion.div
            key={index}
            style={{ scale: getScaleForIndex(index), opacity: imagesOpacity }}
            className={`absolute top-0 flex h-full w-full items-center justify-center z-10 ${getImagePositionClass(index)} will-change-transform`}
          >
            <div className="relative h-[25vh] w-[25vw] overflow-hidden rounded-sm border border-white/5">
              <img src={src} alt={alt} className="h-full w-full object-cover grayscale-[20%]" />
            </div>
          </motion.div>
        ))}

        <motion.div style={{ opacity: timerOpacity }} className="absolute inset-0 flex items-center justify-center z-20 px-6">
          {!countdown.finished ? (
            <div className="relative group text-center w-full max-w-7xl">
              <div className="mb-8 lg:mb-16">
                <h3 className="text-[clamp(1.5rem,5vw,5rem)] font-bold tracking-[0.1em] text-white michroma-regular uppercase mb-4">TechSolstice '26</h3>
                <div className="flex items-center justify-center gap-4 lg:gap-8">
                  <span className="text-[clamp(8px,1vw,12px)] uppercase tracking-[0.3em] text-neutral-400">MIT Bengaluru</span>
                  <div className="w-px h-4 bg-white/20" />
                  <span className="text-[clamp(8px,1vw,12px)] uppercase tracking-[0.3em] text-neutral-400">Feb 20-22, 2026</span>
                </div>
              </div>

              <div className="relative p-8 md:p-12 lg:p-20 rounded-[2.5rem] lg:rounded-[4rem] bg-white/[0.01] backdrop-blur-3xl border border-white/[0.05] shadow-2xl">
                <div className="flex items-center justify-between gap-[2vw] text-white relative z-10">
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
            <div className="text-7xl md:text-9xl font-bold text-white michroma-regular uppercase">Now Live</div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default ZoomParallax;