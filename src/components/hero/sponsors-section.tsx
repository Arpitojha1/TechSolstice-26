"use client";

import { cn } from "@/lib/utils";
import { Sparkles, Mail } from "lucide-react";
import { motion } from "framer-motion";

export function SponsorsSection() {
  const email = "balivada.mitblr2024@learner.manipal.edu";

  return (
    <section className="relative w-full py-32 md:py-48 bg-gradient-to-b from-black via-[#050505] to-transparent overflow-hidden">
      {/* Background Grid - Consistent with other sections */}
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0H0V60H60V0ZM1 1H59V59H1V1Z' fill='%23FFFFFF' fill-opacity='0.1'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
        }}
      />

      {/* Stronger Red Glow (Returning to the 'Old' Vibe) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[50vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] opacity-40 bg-red-900/40"
      />

      <div className="relative w-full flex flex-col items-center justify-center">
        {/* Top Header Reveal */}
        <div className="text-center mb-16 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="michroma-regular text-xs md:text-sm text-neutral-500 tracking-[0.8em] uppercase mb-4">
              Partnership & Support
            </h2>
            <div className="w-12 h-px mx-auto bg-red-500/40" />
          </motion.div>
        </div>

        {/* Content Belt */}
        <div className="relative w-full py-16 md:py-24 group">
          {/* Edge-to-Edge Accents */}
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

          {/* Marquee Background (More subtle and sleek) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-[0.03] select-none pointer-events-none overflow-hidden grayscale">
            <div className="w-full flex">
              <motion.div
                className="flex whitespace-nowrap"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
              >
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="text-[6rem] md:text-[10rem] font-bold text-white px-20 leading-none tracking-tighter michroma-regular">
                    TECHSOLSTICE • SPONSORS • PARTNERS •
                  </span>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Core Content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center gap-10 px-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="michroma-regular text-3xl md:text-6xl font-black text-white tracking-widest uppercase">
                Revealing Soon
              </h3>
              <p className="text-[10px] md:text-xs text-neutral-400 tracking-[0.4em] uppercase max-w-lg mx-auto leading-relaxed">
                Forging technical excellence with industry leaders
              </p>
            </motion.div>

            {/* Hyperlinked CTA - Minimalist version */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              viewport={{ once: true }}
              className="group/btn relative"
            >
              <a
                href={`mailto:${email}`}
                className="relative inline-flex items-center gap-4 px-10 py-5 bg-white/2 hover:bg-white/5 border border-white/10 hover:border-red-500/50 text-white text-[10px] md:text-xs font-bold rounded-full transition-all duration-500 uppercase tracking-[0.4em] backdrop-blur-xl"
              >
                <span>Partner With Us</span>
                <Mail size={12} className="text-red-500" />
              </a>
              
              <div className="mt-8 flex flex-col items-center gap-2">
                <span className="text-[8px] text-neutral-600 font-bold tracking-[0.2em] uppercase">Contact Liaison</span>
                <p className="text-[9px] text-neutral-500 hover:text-white transition-colors duration-300">
                  {email}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}