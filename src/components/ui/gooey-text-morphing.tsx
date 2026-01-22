'use client';

import * as React from "react";
import { cn } from "@/lib/utils";

interface GooeyTextProps {
  texts: string[];
  morphTime?: number;
  cooldownTime?: number;
  className?: string;
  textClassName?: string;
}

export function GooeyText({
  texts,
  morphTime = 3.5,
  cooldownTime = 3.5,
  className,
  textClassName,
}: GooeyTextProps) {
  const text1Ref = React.useRef<HTMLSpanElement>(null);
  const text2Ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    let textIndex = 0;
    let time = Date.now();
    let morph = 0;
    let cooldown = cooldownTime;
    let animationFrameId: number;

    if (text1Ref.current && text2Ref.current && texts.length > 0) {
      text1Ref.current.textContent = texts[textIndex % texts.length];
      text2Ref.current.textContent = texts[(textIndex + 1) % texts.length];
    }

    const setMorph = (fraction: number) => {
      if (text1Ref.current && text2Ref.current) {
        // Use power easing for opacity to ensure a smoother "blobby" cross-fade
        // This keeps the combined alpha higher in the middle
        const opacity1 = Math.pow(1 - fraction, 0.4);
        const opacity2 = Math.pow(fraction, 0.4);

        text1Ref.current.style.opacity = `${opacity1 * 100}%`;
        text2Ref.current.style.opacity = `${opacity2 * 100}%`;

        // Blur peaking in the center - slightly lower intensity for "relaxed" look
        const blurAmount = Math.sin(fraction * Math.PI) * 10;
        text1Ref.current.style.filter = `blur(${blurAmount}px)`;
        text2Ref.current.style.filter = `blur(${blurAmount}px)`;
      }
    };

    const doMorph = () => {
      morph += (Date.now() - time) / 1000;
      time = Date.now();

      let fraction = morph / morphTime;

      if (fraction >= 1) {
        cooldown = cooldownTime;
        fraction = 1;
      }

      setMorph(fraction);
    };

    const doCooldown = () => {
      cooldown -= (Date.now() - time) / 1000;
      time = Date.now();

      if (cooldown <= 0) {
        textIndex++;
        if (text1Ref.current && text2Ref.current) {
          text1Ref.current.textContent = texts[textIndex % texts.length];
          text2Ref.current.textContent = texts[(textIndex + 1) % texts.length];
        }
        morph = 0;
      }
    };

    function animate() {
      if (cooldown > 0) {
        doCooldown();
      } else {
        doMorph();
      }
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [texts, morphTime, cooldownTime]);

  return (
    <div className={cn("relative overflow-hidden w-full max-w-full", className)}>
      {/* High-tech Grid Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0H0V60H60V0ZM1 1H59V59H1V1Z' fill='%23FFFFFF' fill-opacity='0.1'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)'
        }}
      />
      
      {/* The SVG filter that creates the gooey effect */}
      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="threshold">
            {/* Softened the threshold for a less clinical, more organic feel */}
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 19 -9"
            />
          </filter>
        </defs>
      </svg>

      <div className="flex items-center justify-center w-full h-full relative z-10 overflow-hidden" style={{ filter: "url(#threshold)" }}>
        <span
          ref={text1Ref}
          className={cn(
            "absolute inline-block select-none text-center w-full max-w-full overflow-hidden px-2",
            textClassName,
          )}
          style={{ willChange: "filter, opacity" }}
        />
        <span
          ref={text2Ref}
          className={cn(
            "absolute inline-block select-none text-center w-full max-w-full overflow-hidden px-2",
            textClassName,
          )}
          style={{ willChange: "filter, opacity" }}
        />
      </div>
    </div>
  );
}