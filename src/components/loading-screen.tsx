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
          
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0.02em 0.02em 0 rgba(0,0,0,0.7);
          
          animation: scaleIn 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .tech-text::after {
          content: attr(data-shadow);
          position: absolute;
          top: 4px;
          left: 4px;
          z-index: -1;
          background: linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.25) 45%, rgba(255,255,255,0.25) 55%, transparent 0);
          background-size: 0.04em 0.04em;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: shadanim 20s linear infinite;
        }

        @media (min-width: 768px) {
          .tech-text::after {
            background: linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0.2) 55%, transparent 0);
          }
        }

        @media (max-width: 640px) {
          .tech-text::after {
            background: linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.3) 45%, rgba(255,255,255,0.3) 55%, transparent 0);
          }
        }

        @keyframes shadanim {
          0% { background-position: 0 0; }
          100% { background-position: 100% 100%; }
        }

        @keyframes scaleIn {
          0% { transform: scale(0.95); opacity: 0; filter: blur(10px); }
          100% { transform: scale(1); opacity: 1; filter: blur(0px); }
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