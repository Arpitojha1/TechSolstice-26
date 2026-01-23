"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { type EventCategory } from "@/lib/constants/categories";
import PixelCard from "@/components/ui/pixel-card";

interface CategoryCardProps {
  category: EventCategory;
  index: number;
  size?: 'sm' | 'md' | 'lg';
  isFeatured?: boolean; // New Prop
}

const pixelVariants: Record<string, { variant: 'default' | 'blue' | 'yellow' | 'pink', colors?: string, speed?: number, gap?: number }> = {
  "default": { variant: 'blue', colors: '#cbd5e1,#64748b,#334155', speed: 20, gap: 5 },
  "coding-dev": { variant: 'blue', colors: '#dbeafe,#3b82f6,#1e40af', speed: 30, gap: 8 },
  "robotics-hardware": { variant: 'default', colors: '#fed7aa,#f97316,#ea580c', speed: 25, gap: 6 },
  "finance-strategy": { variant: 'default', colors: '#dcfce7,#16a34a,#15803d', speed: 20, gap: 7 },
  "quizzes-tech-games": { variant: 'default', colors: '#ede9fe,#8b5cf6,#7c3aed', speed: 35, gap: 5 },
  "creative-design": { variant: 'pink', speed: 40, gap: 4 },
  "gaming-zone": { variant: 'default', colors: '#e0e7ff,#6366f1,#4f46e5', speed: 50, gap: 3 },
  "conclave": { variant: 'yellow', colors: '#fef9c3,#eab308,#a16207', speed: 15, gap: 6 },
};

export function CategoryCard({ category, index, size = 'md', isFeatured = false }: CategoryCardProps) {
  const pixelConfig = pixelVariants[category.id] || pixelVariants["default"];

  const sizeClasses = {
    sm: 'min-h-[220px]',
    md: 'min-h-[280px]',
    lg: 'min-h-[340px]'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={`group relative w-full ${sizeClasses[size]} h-full`}
    >
      <Link href={`/events/${category.slug}`} className="block h-full">
        <PixelCard
          variant={pixelConfig.variant}
          colors={pixelConfig.colors}
          speed={pixelConfig.speed}
          gap={pixelConfig.gap}
          className="w-full h-full border-white/20 transition-all duration-500 hover:border-white/40 hover:shadow-2xl relative"
        >
          {/* Glass card background */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] via-black/40 to-black/80 backdrop-blur-sm pointer-events-none z-1 rounded-[inherit]" />

          {/* Card content */}
          <div className="absolute inset-0 z-2 flex flex-col p-6 sm:p-8">

            {/* Top Row: Title */}
            <div className={`flex ${isFeatured ? 'justify-center items-center' : 'justify-between items-start'} gap-4 relative`}>

              {/* Title Container */}
              <div className={`flex-1 min-w-0 ${isFeatured ? 'text-center' : ''}`}>
                <h3 className={`michroma-regular text-white leading-snug wrap-break-word drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] 
                  ${isFeatured
                    ? 'text-2xl sm:text-3xl lg:text-4xl'
                    : 'text-base sm:text-lg lg:text-xl'
                  }`}>
                  {category.title}
                </h3>
              </div>

              {/* Arrow Indicator */}
              <motion.div
                whileHover={{ x: 3, y: -3 }}
                className={`shrink-0 text-white/40 group-hover:text-white transition-colors duration-300
                  ${isFeatured ? 'absolute right-0 top-0' : ''}`}
              >
                <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.div>
            </div>

            {/* Spacer */}
            <div className="grow" />

            {/* Subtle divider */}
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Bottom: Description */}
            <div className={`${isFeatured ? 'text-center max-w-2xl mx-auto' : ''}`}>
              <p className="text-xs sm:text-sm text-white/50 leading-relaxed line-clamp-3 group-hover:text-white/80 transition-colors duration-500 font-light">
                {category.description}
              </p>
            </div>

          </div>
        </PixelCard>
      </Link>
    </motion.div>
  );
}