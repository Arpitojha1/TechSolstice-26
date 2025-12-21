"use client";

import { useState } from "react"
import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0]?.name ?? "")

  return (
    <>
      {/* Full-width background strip that matches the gradient */}
      <div className="fixed top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/95 via-black/80 to-transparent backdrop-blur-sm z-[99] pointer-events-none" />
      
      {/* Navbar pill */}
      <div
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300",
          className,
        )}
      >
      <div className="flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-xl py-1 px-2 rounded-full shadow-[0_8px_32px_0_rgba(255,255,255,0.08)]">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <a
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-4 py-2 rounded-full transition-colors",
                "text-neutral-300 hover:text-white",
                isActive && "text-white",
              )}
            >
              <span className="hidden md:inline relative z-10">{item.name}</span>
              <span className="md:hidden relative z-10">
                <Icon size={18} strokeWidth={2.5} />
              </span>

              {isActive && (
                <motion.div
                  layoutId="tubelight"
                  className="absolute inset-0 w-full bg-white/5 rounded-full -z-10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-t-full">
                    <div className="absolute w-12 h-6 bg-white/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-white/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-white/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </a>
          )
        })}
      </div>
    </div>
    </>
  )
}

export default NavBar