"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { X, ChevronRight, Maximize2 } from "lucide-react";

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
  collapsedChildren, // Optional: Can be used for small badges in collapsed state
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
          {/* Backdrop with heavy blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9998]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none p-4 md:p-8"
          >
            <motion.div
              layoutId={`card-${title}-${id}`}
              ref={cardRef}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "w-full max-w-4xl max-h-[90vh] flex flex-col relative pointer-events-auto",
                "bg-black/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden",
                "backdrop-blur-2xl ring-1 ring-white/5",
                classNameExpanded
              )}
              {...props}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between p-6 border-b border-white/5 bg-white/[0.02]">
                <div className="flex flex-col gap-1">
                  <motion.h3
                    layoutId={`title-${title}-${id}`}
                    className="text-2xl md:text-3xl font-bold text-white michroma-regular tracking-wide"
                  >
                    {title}
                  </motion.h3>
                </div>
                <button
                  onClick={() => setActive(false)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-6"
                >
                  {/* Optional Image */}
                  {src && (
                    <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden border border-white/10 mb-6">
                      <img
                        src={src}
                        alt={title}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    </div>
                  )}

                  {/* Main Content (Meta Grid, Description, etc.) */}
                  {children}
                </motion.div>
              </div>

              {/* Back Content (if flipped - preserved functionality) */}
              {isFlipped && backContent && (
                <div className="absolute inset-0 z-20 bg-black/95 backdrop-blur-xl flex flex-col">
                  {backContent}
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {mounted && createPortal(expandedContent, document.body)}

      {/* Collapsed Card - Sleek Glassy Design */}
      <motion.div
        layoutId={`card-${title}-${id}`}
        onClick={() => setActive(true)}
        className={cn(
          "group relative flex flex-col justify-between h-full min-h-[200px] cursor-pointer overflow-hidden",
          "bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 hover:border-red-500/30",
          "backdrop-blur-sm rounded-xl transition-all duration-500 ease-out",
          "hover:shadow-[0_0_30px_-10px_rgba(220,38,38,0.2)]", // Subtle red glow on hover
          className
        )}
      >
        {/* Animated Gradient Background on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-transparent to-transparent group-hover:from-red-900/10 transition-colors duration-700" />

        {/* Card Content */}
        <div className="relative z-10 p-6 flex flex-col h-full">

          {/* Top: Title & Icon */}
          <div className="flex justify-between items-start gap-4">
            <motion.h3
              layoutId={`title-${title}-${id}`}
              className="text-xl font-bold text-white michroma-regular tracking-wide leading-tight group-hover:text-red-100 transition-colors"
            >
              {title}
            </motion.h3>
            <div className="p-2 rounded-full bg-white/5 text-neutral-500 group-hover:text-white group-hover:bg-red-500 transition-all duration-300">
              <Maximize2 size={14} />
            </div>
          </div>

          {/* Middle: Spacer */}
          <div className="flex-grow" />

          {/* Bottom: Minimal Details or Text */}
          <div className="mt-4">
            {collapsedChildren ? (
              <div className="text-sm text-neutral-400">
                {collapsedChildren}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 uppercase tracking-widest group-hover:text-red-400 transition-colors">
                <span>View Details</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default ExpandableCard;