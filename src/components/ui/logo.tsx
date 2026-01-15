"use client";

import Image from "next/image";
import React from "react";
import { usePathname, useRouter } from "next/navigation";

type Variant = "header" | "compact" | "stacked";

interface LogoProps {
  variant?: Variant;
  className?: string;
}

export function Logo({ variant = "header", className = "" }: LogoProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (pathname === "/") {
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    router.push("/");
  };

  const mitUrl = "https://www.manipal.edu/mu/campuses/mahe-bengaluru/academics/institution-list/mitblr.html";

  if (variant === "stacked") {
    return (
      <div 
        className={`flex flex-col items-center gap-4 bg-black/20 border border-white/10 backdrop-blur-xl px-6 py-4 rounded-xl shadow-lg ${className}`}
        style={{
          boxShadow: "inset 0 0 2px 1px rgba(255,255,255,0.15), 0 24px 60px rgba(2,6,23,0.55)",
          WebkitBackdropFilter: "blur(24px)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Stacked: Student Council Logo (smaller) */}
        <a
          href={mitUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative h-16 w-16 sm:h-20 sm:w-20 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/logos/SCLogo.png"
            alt="Student Council Logo"
            fill
            className="object-contain"
            priority
            sizes="(max-width: 640px) 64px, 80px"
          />
        </a>
        {/* Stacked: Wordmark (smaller) */}
        <a
          href="/"
          onClick={handleHomeClick}
          className="relative h-8 w-auto aspect-[3/1] sm:h-12 hover:opacity-90 transition-opacity"
          aria-label="Go to homepage"
        >
          <Image
            src="/logos/TechSolsticeLogo.png"
            alt="TechSolstice Wordmark"
            fill
            className="object-contain"
            priority
            sizes="(max-width: 640px) 96px, 144px"
          />
        </a>
      </div>
    );
  }

  return (
    <div 
      className={`flex items-center gap-4 bg-black/20 border border-white/10 backdrop-blur-xl px-4 py-2 rounded-xl shadow-lg ${className}`}
      style={{
        boxShadow: "inset 0 0 2px 1px rgba(255,255,255,0.15), 0 24px 60px rgba(2,6,23,0.55)",
        WebkitBackdropFilter: "blur(24px)",
        backdropFilter: "blur(24px)",
      }}
    >
      {/* Header: Wordmark (smaller) */}
      <a
        href="/"
        onClick={handleHomeClick}
        className={`relative w-auto ${variant === "compact" ? "h-10 md:h-14" : "h-8 md:h-12"} aspect-[3/1] hover:opacity-90 transition-opacity`}
        aria-label="Go to homepage"
      >
        <Image
          src="/logos/TechSolsticeLogo.png"
          alt="TechSolstice Wordmark"
          fill
          className="object-contain object-left"
          priority
          sizes="(max-width: 768px) 96px, 144px"
        />
      </a>

      <div className={`${variant === "compact" ? "h-10 md:h-14" : "h-7 md:h-9"} w-[1.5px] bg-white/30 rounded-full -ml-[25px]`} />

      {/* Header: Student Council Logo (smaller) */}
      <a
        href={mitUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative w-auto ${variant === "compact" ? "h-10 md:h-14 aspect-square" : "h-8 md:h-12 aspect-square"} hover:opacity-80 transition-opacity -ml-[5px]`}
      >
        <Image
          src="/logos/SCLogo.png"
          alt="Student Council Logo"
          fill
          className="object-contain"
          priority
          sizes="(max-width: 768px) 32px, 48px"
        />
      </a>
    </div>
  );
}

export default Logo;