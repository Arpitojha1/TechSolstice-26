"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0]?.name ?? "");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!pathname) return;
    const match = items.find((it) => (it.url === "/" ? pathname === "/" : pathname.startsWith(it.url)));
    if (match) setActiveTab(match.name);
  }, [pathname, items]);

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 h-20 z-[98] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 40%, transparent 100%)",
        }}
      />

      <div className={cn("fixed top-4 left-1/2 -translate-x-1/2 z-[101] transition-all duration-300", className)}>
        <div
          className="flex items-center gap-3 bg-black/20 border border-white/10 backdrop-blur-xl py-1 px-4 rounded-full shadow-lg shadow-black/20"
          style={{
            boxShadow: "inset 0 0 2px 1px rgba(255,255,255,0.15), 0 24px 60px rgba(2,6,23,0.55)",
            WebkitBackdropFilter: "blur(24px)",
            backdropFilter: "blur(24px)",
          }}
        >
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;

            return (
              <Link
                key={item.name}
                href={item.url}
                prefetch={false}
                onClick={(e: any) => {
                  e.preventDefault();
                  router.push(item.url, { scroll: false });
                  setActiveTab(item.name);
                }}
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
                    className="absolute inset-0 w-full rounded-full -z-10"
                    style={{ background: "rgba(255,255,255,0.04)" }}
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
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default NavBar;