"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/ui/logo";
import { motion } from "framer-motion";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
  minDuration?: number;
}

export function LoadingScreen({ onLoadingComplete, minDuration = 2000 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // --- THE NUCLEAR SCROLL LOCK ---

    // 1. Target both HTML and BODY
    const html = document.documentElement;
    const body = document.body;

    // 2. Save original values (good practice, though we reset to empty usually)
    const originalHtmlOverflow = html.style.overflow;
    const originalBodyOverflow = body.style.overflow;
    const originalBodyHeight = body.style.height;

    // 3. Apply the Lock
    // We lock HTML to prevent the "rubber band" effect
    html.style.overflow = "hidden";
    // We lock Body and force it to visual viewport height
    body.style.overflow = "hidden";
    body.style.height = "100vh";
    // This stops mobile touch dragging
    body.style.touchAction = "none";

    // Simple simulated loading progress
    const startTime = Date.now();
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 15;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 150);

    const timeout = setTimeout(() => {
      setProgress(100);
      setIsComplete(true);
      setTimeout(() => {
        // --- UNLOCK EVERYTHING ---
        html.style.overflow = originalHtmlOverflow;
        body.style.overflow = originalBodyOverflow;
        body.style.height = originalBodyHeight;
        body.style.touchAction = "";

        onLoadingComplete();
      }, 500);
    }, minDuration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      // Safety cleanup in case component unmounts unexpectedly
      html.style.overflow = originalHtmlOverflow;
      body.style.overflow = originalBodyOverflow;
      body.style.height = originalBodyHeight;
      body.style.touchAction = "";
    };
  }, [minDuration, onLoadingComplete]);

  if (isComplete) return null;

  return (
    // Z-INDEX 999999 ensures it is above your Navbar (which is likely z-50 or z-100)
    // overscroll-none prevents the browser bounce effect
    <div
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-black transition-opacity duration-500 overscroll-none touch-none ${isComplete ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
    >
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        <Logo variant="stacked" />

        <p className="font-mono text-red-500/80 text-xs tracking-[0.3em] animate-pulse mt-3">
          SYSTEM_INITIALIZING...
        </p>

        {/* Cyberpunk Progress Bar */}
        <div className="mt-10 w-64 h-1 bg-neutral-900 relative overflow-hidden">
          <motion.div
            className="absolute top-0 bottom-0 left-0 shadow-[0_0_15px_rgba(125,13,44,0.8)]"
            style={{ backgroundColor: "#7D0D2C" }}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>

        {/* Percentage Counter */}
        <div className="mt-2 w-64 flex justify-between font-mono text-[10px] text-neutral-500">
          <span>LOADING_ASSETS</span>
          <span className="text-red-500">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}