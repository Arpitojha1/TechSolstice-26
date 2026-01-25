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
      {/* Top Gradient Overlay */}
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
              background: "linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(10,10,10,0.5) 50%, rgba(0,0,0,0.6) 100%)",
              WebkitBackdropFilter: "blur(40px) saturate(180%)",
              backdropFilter: "blur(40px) saturate(180%)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full relative z-10"
            >
              <div className="flex flex-col gap-8">
                {items.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.name;

                  return (
                    <motion.div
                      key={item.name}
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -30, opacity: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
                    >
                      <Link
                        href={item.url}
                        prefetch={false}
                        onClick={(e: any) => handleNavClick(item, e)}
                        className={cn(
                          "flex items-center gap-6 transition-all duration-300 group",
                          isActive ? "scale-110" : "scale-100 hover:translate-x-2"
                        )}
                      >
                        {/* Perfect Alignment Icon Box */}
                        <div className={cn(
                          "w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 border",
                          isActive
                            ? "bg-white/10 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                            : "bg-white/5 border-white/5 group-hover:border-white/20"
                        )}>
                          {item.name === "LinkedIn" ? (
                            <svg
                              viewBox="0 0 24 24"
                              className={cn(
                                "w-6 h-6 transition-colors fill-current",
                                isActive ? "text-white" : "text-neutral-500 group-hover:text-neutral-300"
                              )}
                            >
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.981 0 1.778-.773 1.778-1.729V1.729C24 .774 23.206 0 22.225 0z" />
                            </svg>
                          ) : (
                            <Icon
                              className={cn(
                                "w-6 h-6 transition-colors",
                                isActive ? "text-white" : "text-neutral-500 group-hover:text-neutral-300"
                              )}
                              strokeWidth={2}
                            />
                          )}
                        </div>

                        {/* Text Alignment */}
                        <span
                          className={cn(
                            "text-3xl font-bold tracking-tight transition-colors",
                            isActive ? "text-white" : "text-neutral-500 group-hover:text-neutral-300"
                          )}
                        >
                          {item.name}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default NavBar;