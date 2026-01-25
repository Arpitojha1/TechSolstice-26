"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(false)}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[9999]"
          />

          {/* Card Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none"
            style={{
              paddingTop: "calc(env(safe-area-inset-top, 0px) + 40px)",
              paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)",
              paddingLeft: "16px",
              paddingRight: "16px",
            }}
          >
            <motion.div
              layoutId={`card-${title}-${id}`}
              ref={cardRef}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "w-full max-w-[800px] h-[80vh] relative perspective-[1000px] pointer-events-auto",
                classNameExpanded
              )}
              {...props}
            >
              <div
                className="absolute inset-0 bg-neutral-950 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                style={{
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  transition: "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
                }}
              >
                {/* Tech Grid Background Pattern for Expanded State */}
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                  }}
                />

                {/* FRONT face */}
                <div
                  className="absolute inset-0 flex flex-col bg-neutral-950/80 backdrop-blur-md"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  {/* Expanded Header */}
                  <div className="relative border-b border-white/10 bg-neutral-900/50 p-6 flex justify-between items-start z-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-mono">System.Active</span>
                      </div>
                      <motion.h3
                        layoutId={`title-${title}-${id}`}
                        className="michroma-regular font-bold text-white text-2xl tracking-wide"
                      >
                        {title}
                      </motion.h3>
                    </div>
                    <button
                      className="h-8 w-8 flex items-center justify-center rounded border border-white/10 hover:bg-white hover:text-black hover:border-white transition-all duration-200"
                      onClick={() => setActive(false)}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 1L13 13M1 13L13 1" />
                      </svg>
                    </button>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative z-10 scrollbar-thin scrollbar-track-neutral-950 scrollbar-thumb-neutral-800">
                    {src && (
                      <motion.div layoutId={`image-${title}-${id}`} className="mb-6 rounded-lg overflow-hidden border border-white/10">
                        <img
                          src={src}
                          alt={title}
                          className="w-full h-48 object-cover opacity-80"
                        />
                      </motion.div>
                    )}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {children}
                    </motion.div>
                  </div>
                </div>

                {/* BACK face */}
                <div
                  className="absolute inset-0 bg-neutral-950 flex flex-col z-20"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div className="flex-1 overflow-auto p-6 scrollbar-thin scrollbar-track-neutral-950 scrollbar-thumb-neutral-800">
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

      {/* Collapsed Card - Industrial Module */}
      <motion.div
        layoutId={`card-${title}-${id}`}
        onClick={() => setActive(true)}
        className={cn(
          "group relative flex flex-col bg-gradient-to-b from-neutral-900 to-black border border-white/10 hover:border-red-500/50 transition-all duration-300 rounded-xl cursor-pointer overflow-hidden",
          className
        )}
      >
        {/* Subtle Tech Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {/* Corner Accents (Top Right & Bottom Left) */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/20 rounded-tr-xl pointer-events-none group-hover:border-red-500/50 transition-colors" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/20 rounded-bl-xl pointer-events-none group-hover:border-red-500/50 transition-colors" />

        <div className="flex flex-col h-full relative z-10">

          {/* Header Section */}
          <div className="p-5 flex-1 flex flex-col items-center text-center">
            {/* ID Tag */}
            <div className="w-full flex justify-between items-center mb-4 opacity-40">
              <span className="text-[9px] font-mono tracking-widest text-white">EVENT.LOG</span>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-white rounded-full" />
                <div className="w-1 h-1 bg-white rounded-full" />
              </div>
            </div>

            {/* Title */}
            <div className="flex-1 flex flex-col justify-center w-full">
              <motion.h3
                layoutId={`title-${title}-${id}`}
                className="michroma-regular text-white font-bold text-lg sm:text-xl tracking-wide group-hover:text-red-500 transition-colors duration-300 drop-shadow-lg"
              >
                {title}
              </motion.h3>
              <motion.p
                layoutId={`description-${description}-${id}`}
                className="hidden"
              >{description}</motion.p>

              <div className="w-8 h-[2px] bg-red-500/50 mt-4 mx-auto group-hover:w-16 transition-all duration-500" />
            </div>
          </div>

          {/* Footer Section - Distinct Compartment */}
          {collapsedChildren && (
            <div className="mt-auto border-t border-white/5 bg-white/[0.02] p-4 backdrop-blur-sm">
              {collapsedChildren}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

export default ExpandableCard;