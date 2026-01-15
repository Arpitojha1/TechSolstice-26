"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function LoadingScreen({ fadeOut = false }) {
  const [mounted, setMounted] = useState(false);

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
          
          /* CRITICAL CHANGE: 
             1. Lowered min-size to 1rem (16px) so it can shrink tiny if needed.
             2. Uses 8vw to scale nicely on standard phones. 
          */
          font-size: clamp(1rem, 8vw, 5rem);
          
          font-weight: 900;
          letter-spacing: -2px;
          text-transform: uppercase;
          text-align: center;
          
          /* FORCE SINGLE LINE */
          white-space: nowrap;
          
          width: 100%;
          max-width: 100%;
          
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
        className={`loader-wrapper ${fadeOut ? "fade-out" : ""}`}
        style={{ pointerEvents: fadeOut ? "none" : "all" }}
      >
        <div className="tech-text">
          TechSolstice'26
        </div>
      </div>
    </>
  );

  return createPortal(loaderContent, document.body);
}