"use client";

import { ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Icons } from "./ui/icons";
import { useEffect, useRef, useState } from "react";

// Dynamically load the responsive flicker component on client only
const FlickeringGridResponsiveLazy = dynamic(
  () => import("./ui/flickering-grid").then((m) => m.FlickeringGridResponsive),
  { ssr: false }
);

export const siteConfig = {
  hero: {
    title: "TechSolstice'26",
    description:
      "Welcome to the future. Explore, innovate, and create with us.",
  },
  footerLinks: [
    {
      title: "Event",
      links: [
        { id: 1, title: "About", url: "#about" },
        { id: 2, title: "Schedule", url: "#schedule" },
        { id: 3, title: "Speakers", url: "#speakers" },
        { id: 4, title: "Venue", url: "#venue" },
      ],
    },
    {
      title: "Participate",
      links: [
        { id: 5, title: "Register", url: "#register" },
        { id: 6, title: "Workshops", url: "#workshops" },
        { id: 7, title: "Competitions", url: "#competitions" },
        { id: 8, title: "Sponsors", url: "#sponsors" },
      ],
    },
    {
      title: "Connect",
      links: [
        { id: 9, title: "Contact", url: "#contact" },
        { id: 10, title: "Team", url: "#team" },
        { id: 11, title: "Newsletter", url: "#newsletter" },
        { id: 12, title: "Social", url: "#social" },
      ],
    },
  ],
};

export type SiteConfig = typeof siteConfig;

export const Footer = () => {
  const isTabletOrLarger = useMediaQuery("(min-width: 768px)"); // 768px = tablet breakpoint
  const tablet = useMediaQuery("(max-width: 1024px)");

  return (
    <footer id="footer" className="w-full pb-0">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between p-6 sm:p-8 md:p-10 gap-8 md:gap-4">
        <div className="flex flex-col items-start justify-start gap-y-4 max-w-xs mx-0">
          <a href="#" className="flex items-center gap-2">
            <Icons.logo className="size-6 sm:size-8 text-white" />
            <p className="text-lg sm:text-xl font-semibold text-white">TechSolstice</p>
          </a>
          <p className="tracking-tight text-neutral-300 font-medium text-sm sm:text-base">
            {siteConfig.hero.description}
          </p>
        </div>
        <div className="w-full md:w-1/2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 lg:pl-10">
            {siteConfig.footerLinks.map((column, columnIndex) => (
              <ul key={columnIndex} className="flex flex-col gap-y-2">
                <li className="mb-2 text-xs sm:text-sm font-semibold text-white">
                  {column.title}
                </li>
                {column.links.map((link) => (
                  <li
                    key={link.id}
                    className="group inline-flex cursor-pointer items-center justify-start gap-1 text-[13px] sm:text-[15px]/snug"
                  >
                    <a
                      href={link.url}
                      className="text-neutral-400 hover:text-white transition-colors no-underline"
                    >
                      {link.title}
                    </a>
                    <div className="hidden sm:flex size-4 items-center justify-center border border-neutral-600 rounded translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100">
                      <ChevronRight className="h-4 w-4 text-neutral-400" />
                    </div>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>

      {/* Only show FlickeringGrid on tablet and larger devices */}
      {isTabletOrLarger && (
        <div className="w-full h-80 md:h-96 lg:h-[600px] relative mt-12 sm:mt-16 md:mt-24 z-0">
          {/* solid black background layer beneath the flicker */}
          <div className="absolute inset-0 bg-black z-0" />
          {/* flicker container - we lazy-load the flicker when this container enters the viewport */}
          <FlickerOnView
            text={tablet ? "Solstice'26" : "TechSolstice'26"}
            baseFontSize={tablet ? 90 : 140}
          />
        </div>
      )}
    </footer>
  );
};

function FlickerOnView({ text, baseFontSize }: { text: string; baseFontSize: number }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loadFlicker, setLoadFlicker] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // If already in DOM view, load immediately
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setLoadFlicker(true);
            io.disconnect();
            return;
          }
        }
      },
      { threshold: 0.05 }
    );

    io.observe(el);

    return () => io.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 mx-3 sm:mx-6 z-10">
      {loadFlicker ? (
        <FlickeringGridResponsiveLazy
          text={text}
          baseFontSize={baseFontSize}
          className="h-full w-full"
          squareSize={3}
          gridGap={3}
          color="#6B7280"
          maxOpacity={0.4}
          flickerChance={0.15}
        />
      ) : null}
    </div>
  );
}
