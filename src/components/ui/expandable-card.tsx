"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ExpandableCardProps {
  title: string;
  src?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  classNameExpanded?: string;
  [key: string]: any;
}

export function ExpandableCard({
  title,
  src = "",
  description = "",
  children,
  className,
  classNameExpanded,
  ...props
}: ExpandableCardProps) {
  const [active, setActive] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const id = React.useId();

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(false);
      }
    };

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setActive(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/30 backdrop-blur-md h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && (
          <div
            className={cn(
              "fixed inset-0 grid place-items-center z-[100] sm:mt-16 before:pointer-events-none",
            )}
          >
            <motion.div
              layoutId={`card-${title}-${id}`}
              ref={cardRef}
              className={cn(
                "w-full max-w-[850px] h-full flex flex-col overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] sm:rounded-t-3xl bg-white/5 shadow-sm relative",
                classNameExpanded,
              )}
              {...props}
            >
              <motion.div layoutId={`image-${title}-${id}`}>
                <div className="relative before:absolute before:inset-x-0 before:bottom-[-1px] before:h-[70px] before:z-50 before:bg-gradient-to-t before:from-transparent before:to-white/5">
                  {src ? (
                    <img src={src} alt={title} className="w-full h-80 object-cover object-center" />
                  ) : (
                    <div className="w-full h-80 bg-gradient-to-br from-gray-800 to-transparent" />
                  )}
                </div>
              </motion.div>
              <div className="relative h-full before:fixed before:inset-x-0 before:bottom-0 before:h-[70px] before:z-50 before:bg-gradient-to-t before:from-transparent before:to-white/5">
                <div className="flex justify-between items-start p-6 h-auto">
                  <div>
                    <motion.p
                      layoutId={`description-${description}-${id}`}
                      className="text-zinc-500 dark:text-zinc-400 text-base"
                    >
                      {description}
                    </motion.p>
                    <motion.h3
                      layoutId={`title-${title}-${id}`}
                      className="font-semibold text-black dark:text-white text-2xl sm:text-3xl mt-1"
                    >
                      {title}
                    </motion.h3>
                  </div>
                  <motion.button
                    aria-label="Close card"
                    layoutId={`button-${title}-${id}`}
                    className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-white/5 text-neutral-700 hover:bg-white/10 text-black/70 border border-gray-200/50 hover:border-gray-300/70 hover:text-black transition-colors duration-300 focus:outline-none"
                    onClick={() => setActive(false)}
                  >
                    <motion.div animate={{ rotate: active ? 45 : 0 }} transition={{ duration: 0.4 }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                    </motion.div>
                  </motion.button>
                </div>
                <div className="relative px-4 sm:px-6 pb-10">
                  <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-zinc-500 dark:text-zinc-400 text-base pb-10 flex flex-col items-start gap-4 overflow-auto">
                    {children}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div
        role="dialog"
        aria-labelledby={`card-title-${id}`}
        aria-modal="true"
        layoutId={`card-${title}-${id}`}
        onClick={() => setActive(true)}
        className={cn(
          "p-3 flex flex-col justify-between items-center bg-white/5 shadow-sm rounded-2xl cursor-pointer border border-gray-200/70",
          className,
        )}
      >
        <div className="flex gap-4 flex-col sm:flex-row items-start">
          <motion.div layoutId={`image-${title}-${id}`}>{src ? <img src={src} alt={title} className="w-full sm:w-64 h-40 sm:h-56 rounded-lg object-cover object-center" /> : <div className="w-full sm:w-64 h-40 sm:h-56 rounded-lg bg-gradient-to-br from-gray-800 to-transparent" />}</motion.div>
          <div className="flex-1">
            <motion.p layoutId={`description-${description}-${id}`} className="text-zinc-500 dark:text-zinc-400 md:text-left text-sm font-medium">
              {description}
            </motion.p>
            <motion.h3 layoutId={`title-${title}-${id}`} className="text-black dark:text-white md:text-left font-semibold text-lg sm:text-xl">
              {title}
            </motion.h3>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default ExpandableCard;
