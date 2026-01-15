"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!pathname) return;
    const match = items.find((it) => (it.url === "/" ? pathname === "/" : pathname.startsWith(it.url)));
    if (match) setActiveTab(match.name);
  }, [pathname, items]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (item: NavItem, e: React.MouseEvent) => {
    e.preventDefault();
    router.push(item.url);
    setActiveTab(item.name);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 h-20 z-[98] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 40%, transparent 100%)",
        }}
      />

      {/* Desktop Navigation */}
      <div className={cn("hidden md:flex fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[101] transition-all duration-300", className)}>
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
                onClick={(e: any) => handleNavClick(item, e)}
                className={cn(
                  "relative cursor-pointer text-sm font-semibold px-4 py-2 rounded-full transition-colors",
                  "text-neutral-300 hover:text-white",
                  isActive && "text-white",
                )}
              >
                <span className="relative z-10">{item.name}</span>

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

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden fixed top-4 right-4 z-[102] p-3 bg-black/30 border border-white/10 backdrop-blur-xl rounded-full shadow-lg transition-all duration-300 hover:bg-black/40"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <X className="w-5 h-5 text-white" strokeWidth={2.5} />
        ) : (
          <Menu className="w-5 h-5 text-white" strokeWidth={2.5} />
        )}
      </button>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 z-[101]"
            style={{
              background: "linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(20,20,20,0.3) 50%, rgba(0,0,0,0.4) 100%)",
              WebkitBackdropFilter: "blur(40px) saturate(180%)",
              backdropFilter: "blur(40px) saturate(180%)",
              boxShadow: "inset 0 0 200px rgba(255,255,255,0.03)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
            <div className="absolute inset-0 border border-white/10 pointer-events-none" />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex flex-col items-center justify-center h-full gap-8 px-8 relative z-10"
            >
              {items.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.name;

                return (
                  <motion.div
                    key={item.name}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      href={item.url}
                      prefetch={false}
                      onClick={(e: any) => handleNavClick(item, e)}
                      className={cn(
                        "flex items-center gap-4 text-3xl font-semibold transition-all duration-300",
                        isActive ? "text-white scale-110" : "text-neutral-400 hover:text-white hover:scale-105"
                      )}
                    >
                      <Icon className="w-8 h-8" strokeWidth={2.5} />
                      <span>{item.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default NavBar;