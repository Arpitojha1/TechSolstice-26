"use client";

import { cn } from "@/lib/utils";
import { Sparkles, Mail } from "lucide-react";
import { motion } from "framer-motion";

export function SponsorsSection() {
  const email = "balivada.mitblr2024@learner.manipal.edu";

  return (
    <section className="relative w-full py-20 md:py-32 bg-black/20 overflow-hidden">
      {/* Background Glow */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[50vh] w-[50vh] -translate-x-1/2 -translate-y-1/2 rounded-full",
          "blur-[80px] opacity-15"
        )}
        style={{ backgroundColor: "rgba(220, 38, 38, 0.3)" }} // Deep Red
      />

      <div className="relative mx-auto max-w-4xl px-6">
        <div className="text-center mb-10">
          <h2 className="michroma-regular mb-4 text-white text-2xl md:text-4xl tracking-wide uppercase">
            Our Sponsors
          </h2>
          <div className="mx-auto h-px max-w-[100px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
        </div>

        {/* Mystery Container */}
        <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl border border-dashed border-white/10 bg-black/60 backdrop-blur-md overflow-hidden group flex flex-col items-center justify-center">

          {/* Internal Tech Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />

          {/* SCROLLING MARQUEE LAYER */}
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-10 select-none pointer-events-none overflow-hidden">
            {/* Top Row - Scroll Left */}
            <div className="w-full overflow-hidden flex">
              <motion.div
                className="flex whitespace-nowrap"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
              >
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="text-[4rem] md:text-[6rem] font-black text-white px-4 leading-none tracking-tighter">
                    COMING SOON • REVEALING SOON •
                  </span>
                ))}
              </motion.div>
            </div>
            {/* Bottom Row - Scroll Right (Offset) */}
            <div className="w-full overflow-hidden flex mt-[-1rem] md:mt-[-2rem]">
              <motion.div
                className="flex whitespace-nowrap"
                animate={{ x: ["-50%", "0%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
              >
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="text-[4rem] md:text-[6rem] font-black text-white px-4 leading-none tracking-tighter">
                    SPONSORS • PARTNERS •
                  </span>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Foreground Content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center gap-6 p-6">

            <div className="space-y-3">
              <h3 className="michroma-regular text-2xl md:text-4xl font-bold text-white tracking-widest uppercase drop-shadow-lg">
                Revealing Soon
              </h3>
              <p className="text-sm md:text-base text-neutral-400 font-mono max-w-md mx-auto leading-relaxed">
                We are currently finalizing our partners for this year's fest.
              </p>
            </div>

            {/* Hyperlinked CTA */}
            <div className="pt-2">
              <a
                href={`mailto:${email}`}
                className="group/btn relative inline-flex items-center gap-3 px-6 py-3 bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 hover:border-red-500 text-red-100 text-sm md:text-base font-medium rounded-full transition-all duration-300 uppercase tracking-wider"
              >
                <Mail size={16} className="text-red-400 group-hover/btn:scale-110 transition-transform" />
                <span>Become a Sponsor</span>
                <Sparkles size={16} className="text-red-400 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              </a>
              <p className="mt-4 text-[10px] text-neutral-600 font-mono">
                {email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}