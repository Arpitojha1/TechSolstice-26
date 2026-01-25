"use client";

import { useEffect, memo } from "react";
import { motion } from "framer-motion";
import { EVENT_CATEGORIES } from "@/lib/constants/categories";
import { CategoryCard } from "@/components/events/category-card";
import { PatternText } from "@/components/animations/pattern-text";

const EventsPage = () => {
  // Separate conclave as the featured category
  const conclaveCategory = EVENT_CATEGORIES.find(cat => cat.slug === 'conclave');
  const otherCategories = EVENT_CATEGORIES.filter(cat => cat.slug !== 'conclave');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative min-h-100 md:min-h-125 lg:min-h-150 px-4 z-10 flex items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 max-w-7xl mx-auto text-center"
        >
          <div className="flex justify-center">
            <div className="min-h-16 md:min-h-24 lg:min-h-32 flex items-center justify-center">
              <PatternText
                text="Events"
                className="michroma-regular text-[3.5rem]! sm:text-[5rem]! md:text-[6rem]! lg:text-[8rem]! text-white/90! drop-shadow-2xl"
              />
            </div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-neutral-500 text-[10px] md:text-xs font-black tracking-[0.4em] uppercase mt-4"
          >
            Explore the Solstice Arena
          </motion.p>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto px-4 pb-32 relative z-10"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

          {/* Featured Conclave Card */}
          {conclaveCategory && (
            <motion.div
              variants={itemVariants}
              className="col-span-1 sm:col-span-2 lg:col-span-3 h-70 sm:h-80 md:h-90 lg:h-105"
            >
              <CategoryCard
                category={conclaveCategory}
                index={0}
                isFeatured={true}
              />
            </motion.div>
          )}

          {/* Other Event Category Cards */}
          {otherCategories.map((category, index) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              className="h-70 sm:h-80 md:h-90 lg:h-105"
            >
              <CategoryCard
                category={category}
                index={index + 1}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default memo(EventsPage);