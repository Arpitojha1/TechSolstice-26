"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

export default function LoadingScreen({ fadeOut = false }) {
  const [mounted, setMounted] = useState(false);
  const [fontSize, setFontSize] = useState<number>(120);
  const textRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const measureText = useCallback(() => {
    if (!containerRef.current || !textRef.current) return;

    const container = containerRef.current;
    const text = textRef.current;
    if (container.clientWidth === 0) return;

    const availableWidth = container.clientWidth - 32; // Match hero-robot padding

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fontFamily = "Michroma, Doto, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif";
    const weight = "700";

    let size = 120;
    ctx.font = `${weight} ${size}px ${fontFamily}`;

    const textContent = text.textContent || "TechSolstice'26";
    let metrics = ctx.measureText(textContent);

    let iterations = 0;
    while (metrics.width > availableWidth && size > 20 && iterations < 100) {
      size -= 2;
      ctx.font = `${weight} ${size}px ${fontFamily}`;
      metrics = ctx.measureText(textContent);
      iterations++;
    }

    setFontSize(size);
  }, []);

  useEffect(() => {
    setMounted(true);

    if (!fadeOut) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [fadeOut]);

  useEffect(() => {
    if (!mounted) return;
    
    measureText();

    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        requestAnimationFrame(measureText);
      }, 100);
    };

    window.addEventListener("resize", handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [mounted, measureText]);

  if (!mounted) return null;

  const loaderContent = (
    <>
      <style>{`
        .loader-wrapper {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
          z-index: 2147483647;
          opacity: 1;
          visibility: visible;
          transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), visibility 1.2s step-end;
          overflow: hidden;
        }

        .loader-wrapper.fade-out {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .tech-text-container {
          text-align: center;
          width: 100%;
          max-width: 100%;
          overflow: visible;
          position: relative;
          padding: 0 16px;
        }

        .tech-text {
          font-family: 'Michroma', 'Doto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-weight: 700;
          text-align: center;
          white-space: nowrap;
          line-height: 1.1;
          display: inline-block;
          position: relative;
          
          /* Red gradient matching site theme */
          background: linear-gradient(
            135deg, 
            #7a0c0c 0%,
            #ff1a1a 25%,
            #ff4444 50%,
            #ff1a1a 75%,
            #7a0c0c 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          
          /* Subtle glow effect */
          filter: drop-shadow(0 0 20px rgba(255, 26, 26, 0.3));
          
          animation: scaleIn 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards, 
                     shimmer 3s ease-in-out infinite,
                     pulse 2s ease-in-out infinite;
        }

        .tech-text::after {
          content: attr(data-shadow);
          position: absolute;
          top: 4px;
          left: 4px;
          z-index: -1;
          background: linear-gradient(45deg, transparent 45%, rgba(255, 50, 50, 0.3) 45%, rgba(255, 50, 50, 0.3) 55%, transparent 0);
          background-size: 0.04em 0.04em;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: shadanim 20s linear infinite;
        }

        @media (min-width: 768px) {
          .tech-text::after {
            background: linear-gradient(45deg, transparent 45%, rgba(255, 40, 40, 0.25) 45%, rgba(255, 40, 40, 0.25) 55%, transparent 0);
          }
        }

        @media (max-width: 640px) {
          .tech-text::after {
            background: linear-gradient(45deg, transparent 45%, rgba(255, 60, 60, 0.35) 45%, rgba(255, 60, 60, 0.35) 55%, transparent 0);
          }
        }

        @keyframes shadanim {
          0% { background-position: 0 0; }
          100% { background-position: 100% 100%; }
        }

        @keyframes shimmer {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 200% center; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 20px rgba(255, 26, 26, 0.3)); }
          50% { transform: scale(1.02); filter: drop-shadow(0 0 30px rgba(255, 26, 26, 0.5)); }
        }

        @keyframes scaleIn {
          0% { transform: scale(0.92); opacity: 0; filter: drop-shadow(0 0 40px rgba(255, 26, 26, 0.6)) blur(15px); }
          100% { transform: scale(1); opacity: 1; filter: drop-shadow(0 0 20px rgba(255, 26, 26, 0.3)) blur(0px); }
        }
      `}</style>

      <div
        ref={containerRef}
        className={`loader-wrapper ${fadeOut ? "fade-out" : ""}`}
        style={{ pointerEvents: fadeOut ? "none" : "all" }}
      >
        <div className="tech-text-container" style={{ fontSize: `${fontSize}px` }}>
          <span 
            ref={textRef}
            className="tech-text"
            data-shadow="TechSolstice'26"
            style={{ fontSize: '1em' }}
          >
            TechSolstice'26
          </span>
        </div>
      </div>
    </>
  );

  return createPortal(loaderContent, document.body);
}