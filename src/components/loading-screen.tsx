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

    const availableWidth = container.clientWidth - 40; // 20px padding on each side

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fontFamily = "Michroma, sans-serif";
    const weight = "900";

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
          padding: 0 20px; 
        }

        .loader-wrapper.fade-out {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .tech-text {
          font-family: 'Michroma', sans-serif;
          font-weight: 900;
          letter-spacing: -2px;
          text-transform: uppercase;
          text-align: center;
          
          /* FORCE SINGLE LINE */
          white-space: nowrap;
          
          width: 100%;
          max-width: 100%;
          line-height: 1.1;
          
          background: linear-gradient(
            135deg, 
            #4a0417 0%,   
            #7D0D2C 30%,  
            #ff1a1a 50%,  
            #7D0D2C 70%,  
            #4a0417 100%  
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          
          animation: shine 3s linear infinite, scaleIn 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes shine {
          to {
            background-position: 200% center;
          }
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
        <div 
          ref={textRef}
          className="tech-text"
          style={{ fontSize: `${fontSize}px` }}
        >
          TechSolstice'26
        </div>
      </div>
    </>
  );

  return createPortal(loaderContent, document.body);
}