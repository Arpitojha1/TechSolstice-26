"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
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

  const content = (
    <AnimatePresence mode="wait">
      {!fadeOut && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            transition: {
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1],
              when: "afterChildren"
            }
          }}
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black overflow-hidden"
        >
          {/* Subtle Ambient Background Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-red-600/10 blur-[120px] rounded-full pointer-events-none"
          />

          <div className="relative z-10 flex flex-col items-center">
            {/* Logo Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 1,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="relative w-[70vw] max-w-72 md:max-w-96 aspect-[3/1]"
            >
              <Image
                src="/logos/TechSolsticeLogo.png"
                alt="TechSolstice"
                fill
                className="object-contain"
                priority
              />

              {/* Animated Progress Line */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                transition={{
                  delay: 0.5,
                  duration: 2,
                  ease: "easeInOut"
                }}
                className="absolute -bottom-4 left-0 h-px bg-linear-to-r from-transparent via-red-600/50 to-transparent"
              />
            </motion.div>

            {/* Futuristic Label */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-8 text-[10px] text-white uppercase tracking-[0.5em] font-black italic michroma-regular"
            >
              Loading
            </motion.p>
          </div>

          {/* Background Grid Pattern (Matching Homepage) */}
          <div className="pointer-events-none absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
