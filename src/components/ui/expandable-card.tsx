"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import ASMRStaticBackground from "./asmr-static-background";


interface ExpandableCardProps {
  title: string;
  src?: string;
  description?: string;
  collapsedChildren?: React.ReactNode;
  children?: React.ReactNode;
  backContent?: React.ReactNode;
  isFlipped?: boolean;
  className?: string;
  classNameExpanded?: string;
  [key: string]: any;
}

export function ExpandableCard({
  title,
  src = "",
  description = "",
  children,
  backContent,
  isFlipped = false,
  className,
  classNameExpanded,
  collapsedChildren,
  ...props
}: ExpandableCardProps) {
  const [active, setActive] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const id = React.useId();

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(false);
    };

    if (active) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active]);

  const expandedContent = (
    <AnimatePresence>
      {active && (
        <>
          {/* Backdrop - click to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-99999"
          />

          {/* Card Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-99999 pointer-events-none"
            style={{
              paddingTop: "calc(env(safe-area-inset-top, 0px) + 80px)",
              paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 32px)",
              paddingLeft: "calc(env(safe-area-inset-left, 0px) + 16px)",
              paddingRight: "calc(env(safe-area-inset-right, 0px) + 16px)",
            }}
          >
            <motion.div
              layoutId={`card-${title}-${id}`}
              ref={cardRef}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "w-full max-w-[90vw] sm:max-w-[85vw] md:max-w-[75vw] lg:max-w-175 h-[85vh] relative perspective-[1000px] pointer-events-auto",
                classNameExpanded
              )}

              {...props}
            >
              {/* 3D flip wrapper */}

              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-md rounded-3xl transition-transform duration-500 ease-out border border-white/10 shadow-2xl"
                style={{
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >

                {/* FRONT face */}
                <div
                  className="absolute inset-0 rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col bg-black/40 backdrop-blur-md"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <ASMRStaticBackground />
                  {/* Image Section - only show if src exists */}
                  {src && (
                    <motion.div layoutId={`image-${title}-${id}`}>
                      <div className="relative">
                        <img
                          src={src}
                          alt={title}
                          className="w-full h-48 sm:h-56 object-cover object-center"
                        />
                      </div>
                    </motion.div>
                  )}
                  {/* Header + Content */}
                  <div className="relative flex-1 flex flex-col">
                    <div className="flex justify-between items-start p-3 sm:p-6">
                      <div className="flex-1">
                        <motion.h3
                          layoutId={`title-${title}-${id}`}
                          className="michroma-regular font-bold text-white text-xl sm:text-2xl md:text-3xl drop-shadow-sm leading-tight"
                        >
                          {title}
                        </motion.h3>
                        <motion.p
                          layoutId={`description-${description}-${id}`}
                          className="text-zinc-400 text-sm sm:text-base"
                        >
                          {description}
                        </motion.p>
                      </div>

                      {/* Close button */}
                      <button
                        aria-label="Close card"
                        className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-black transition-colors duration-300"
                        onClick={() => setActive(false)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>

                    {/* Scrollable front content */}
                    <div className="flex-1 px-3 sm:px-6 pb-3 sm:pb-6 overflow-auto flex items-center justify-center">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-zinc-300 text-sm sm:text-base flex flex-col items-center gap-4 w-full"
                      >
                        {children}
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* BACK face */}
                <div
                  className="absolute inset-0 rounded-3xl bg-black/40 backdrop-blur-md shadow-2xl border border-white/10 overflow-hidden flex flex-col"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div className="flex-1 overflow-auto px-3 sm:px-6 py-3 sm:py-6">
                    {backContent}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {mounted && createPortal(expandedContent, document.body)}

      {/* Collapsed card */}
      <motion.div
        layoutId={`card-${title}-${id}`}
        onClick={() => setActive(true)}
        className={cn(
          "p-5 flex flex-col bg-white/5 hover:bg-white/10 transition-colors shadow-sm rounded-2xl cursor-pointer border border-white/10 min-h-[220px]",
          className
        )}
      >
        <div className="flex gap-4 flex-col sm:flex-row items-center sm:items-start flex-1">
          {src && (
            <motion.div layoutId={`image-${title}-${id}`} className="w-full sm:w-auto">
              <img src={src} alt={title} className="w-full sm:w-64 h-40 sm:h-48 rounded-lg object-cover" />
            </motion.div>
          )}

          <div className={`flex-1 ${src ? "text-center sm:text-left" : "text-center"} flex flex-col justify-between h-full`}>
            <motion.h3
              layoutId={`title-${title}-${id}`}
              className="michroma-regular text-white font-semibold text-lg sm:text-xl md:text-2xl mb-4"
            >
              {title}
            </motion.h3>
            <motion.p
              layoutId={`description-${description}-${id}`}
              className="text-zinc-400 text-sm font-medium hidden"
            >
              {description}
            </motion.p>
          </div>
        </div>

        {/* Collapsed summary area (meta) */}
        {collapsedChildren ? <div className="mt-auto pt-3">{collapsedChildren}</div> : null}
      </motion.div>
    </>
  );
}

export default ExpandableCard;
