"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, Code2, Cpu, TrendingUp, Brain, Palette, Lightbulb, Gamepad2, Sparkles } from "lucide-react";
import { type EventCategory } from "@/lib/constants/categories";
import PixelCard from "@/components/ui/pixel-card";
import { PatternText } from "@/components/ui/pattern-text";

interface CategoryCardProps {
  category: EventCategory;
  index: number;
  size?: 'sm' | 'md' | 'lg';
}

const categoryIcons: Record<string, any> = {
  "coding-dev": Code2,
  "robotics-hardware": Cpu,
  "finance-strategy": TrendingUp,
  "quizzes-tech-games": Brain,
  "creative-design": Palette,
  "innovation-ideation": Lightbulb,
  "gaming-zone": Gamepad2,
  "other-events": Sparkles,
};

// Define pixel variants for each category
const pixelVariants: Record<string, { variant: 'default' | 'blue' | 'yellow' | 'pink', colors?: string, speed?: number, gap?: number }> = {
  "coding-dev": { 
    variant: 'blue', 
    colors: '#dbeafe,#3b82f6,#1e40af',
    speed: 30,
    gap: 8
  },
  "robotics-hardware": { 
    variant: 'default',
    colors: '#fed7aa,#f97316,#ea580c',
    speed: 25,
    gap: 6
  },
  "finance-strategy": { 
    variant: 'default',
    colors: '#dcfce7,#16a34a,#15803d',
    speed: 20,
    gap: 7
  },
  "quizzes-tech-games": { 
    variant: 'default',
    colors: '#ede9fe,#8b5cf6,#7c3aed',
    speed: 35,
    gap: 5
  },
  "creative-design": { 
    variant: 'pink',
    speed: 40,
    gap: 4
  },
  "innovation-ideation": { 
    variant: 'yellow',
    speed: 25,
    gap: 6
  },
  "gaming-zone": { 
    variant: 'default',
    colors: '#e0e7ff,#6366f1,#4f46e5',
    speed: 50,
    gap: 3
  },
  "other-events": { 
    variant: 'default',
    colors: '#f1f5f9,#64748b,#475569',
    speed: 15,
    gap: 8
  },
};

export function CategoryCard({ category, index, size = 'md' }: CategoryCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "100px" });

  const Icon = categoryIcons[category.id];
  const pixelConfig = pixelVariants[category.id] || pixelVariants["other-events"];

  // Responsive height classes - better proportions to fit content
  const heightClasses = {
    sm: 'h-[240px]',
    md: 'h-[280px]',
    lg: 'h-[320px]'
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.21, 1, 0.45, 1] }}
      className="group relative w-full h-full"
    >
      <Link href={`/events/${category.slug}`} className="block h-full">
        <PixelCard
          variant={pixelConfig.variant}
          colors={pixelConfig.colors}
          speed={pixelConfig.speed}
          gap={pixelConfig.gap}
          className="w-full h-full transition-all duration-500 group-hover:scale-[1.02] group-active:scale-[0.98] shadow-xl hover:shadow-2xl border-white/30"
        >
          {/* Enhanced glass overlay with gradient tint */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-black/[0.15] rounded-3xl pointer-events-none" />
          
          {/* Content positioned absolutely inside PixelCard */}
          <div className="absolute inset-0 flex flex-col p-6 md:p-8 z-10">
            
            {/* Arrow icon only - top right */}
            <div className="flex justify-end mb-4">
              <motion.div 
                className="opacity-0 group-hover:opacity-100 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
              >
                <ArrowUpRight className="w-5 h-5 text-white/60" />
              </motion.div>
            </div>

            {/* Main Content - Left aligned, positioned from top */}
            <div className="flex-1 flex flex-col justify-start text-left">
              <div className="mb-3 md:mb-4">
                <PatternText
                  text={category.title}
                  className="michroma-regular !text-lg md:!text-xl lg:!text-2xl !text-white/90 drop-shadow-sm leading-tight whitespace-nowrap"
                />
              </div>
              
              <p className="text-white/70 text-sm md:text-base leading-relaxed group-hover:text-white/90 transition-colors duration-300 drop-shadow-sm line-clamp-3">
                {category.description}
              </p>
            </div>

            {/* Bottom indicator */}
            <div className="flex items-center justify-between pt-4">
              <div className="text-xs text-white/40 uppercase tracking-[0.1em] font-medium group-hover:text-white/60 transition-colors duration-300">
                Explore Category
              </div>
              <motion.div 
                className={`h-0.5 bg-gradient-to-r ${category.gradient} rounded-full transition-all duration-500 group-hover:w-16 w-0`}
                initial={false}
              />
            </div>
          </div>
        </PixelCard>
      </Link>
    </motion.div>
  );
}