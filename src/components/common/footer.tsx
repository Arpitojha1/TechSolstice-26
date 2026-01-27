"use client";

import { Mail, Phone, Linkedin, Instagram, Youtube } from "lucide-react";
import Image from "next/image";
import Logo from "@/components/misc/logo";
import { useMediaQuery } from "@/hooks/use-media-query";

import { FlickeringGridResponsive } from "@/components/animations/flickering-grid";

// ============================================================================
// CONFIGURATION
// ============================================================================

/** Footer flickering grid display settings */
const FOOTER_GRID_CONFIG = {
  /** Text displayed on desktop (>=1024px) */
  desktopText: "TechSolstice'26",
  /** Text displayed on tablet (768px-1023px) */
  tabletText: "Solstice'26",
  /** Font size for desktop */
  desktopFontSize: 80,
  /** Font size for tablet */
  tabletFontSize: 50,
  /** Grid square size */
  squareSize: 3,
  /** Gap between squares */
  gridGap: 3,
  /** Brand color */
  color: "#D33A4A",
  /** Maximum opacity of squares */
  maxOpacity: 0.4,
  /** Probability of flicker */
  flickerChance: 0.15,
} as const;

// ============================================================================
// SITE CONFIG (EXPORTED)
// ============================================================================
export const siteConfig = {
  contactData: {
    eventName: "TechSolstice'26",
    address: [
      "Manipal Institute of Technology (MIT)",
      "Manipal Academy of Higher Education (MAHE), Bengaluru Campus",
      "BSF Campus, Yelahanka",
      "Bengaluru, Karnataka 560064",
    ],
    generalEmail: "fest.mitblr@manipal.edu",
    contacts: [
      {
        name: "Samaira Malik",
        role: "PR Head",
        phone: "+91 84462 03821",
        email: "samaira1.mitblr2024@learner.manipal.edu",
      },
      {
        name: "Mahek Sethi",
        role: "PR Head",
        phone: "+91 98219 01461",
        email: "mahek.mitblr2024@learner.manipal.edu",
      },
    ],
  },
};

export type SiteConfig = typeof siteConfig;

export const Footer = () => {
  const isTabletOrLarger = useMediaQuery("(min-width: 768px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <footer
      id="footer"
      className="w-full bg-white/2 backdrop-blur-xl border-t border-white/5 relative z-10"
    >
      {/* Subtle top border glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl">
          <div className="h-px w-full bg-linear-to-r from-transparent via-red-500/10 to-transparent" />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="w-full relative z-20 px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* Mobile Layout (< 768px) */}
        {/* FIXED: Added 'pb-20' to ensure content clears mobile nav bars */}
        <div className="block md:hidden space-y-6 pb-10">
          {/* Logos Section - Mobile */}
          <div className="space-y-4">
            {/* Horizontal Logos */}
            <div className="flex items-center justify-center gap-4">
              <a
                href="/"
                className="relative h-10 w-auto aspect-3/1 hover:opacity-90 transition-opacity"
                aria-label="Go to homepage"
              >
                <Image
                  src="/logos/TechSolsticeLogo.png"
                  alt="TechSolstice Wordmark"
                  fill
                  className="object-contain"
                  priority
                  sizes="96px"
                />
              </a>
              <div className="h-10 w-[1.5px] bg-white/30 rounded-full" />
              <a
                href="https://www.manipal.edu/mu/campuses/mahe-bengaluru/academics/institution-list/mitblr.html"
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-10 w-10 hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/logos/SCLogo.png"
                  alt="Student Council Logo"
                  fill
                  className="object-contain"
                  priority
                  sizes="40px"
                />
              </a>
            </div>

            {/* Address below logos */}
            <a
              href="https://maps.app.goo.gl/3s3Ew5LkqtLbJEor6"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-[10px] text-neutral-500 font-medium uppercase tracking-wider space-y-1 hover:text-neutral-300 transition-colors"
            >
              {siteConfig.contactData.address.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </a>
          </div>

          {/* Divider */}
          <div className="h-px w-16 mx-auto bg-white/5" />

          {/* Contact Info - Mobile */}
          <div className="text-center space-y-5">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 michroma-regular">Contact Us</h3>

            {/* Email */}
            <a
              href={`mailto:${siteConfig.contactData.generalEmail}`}
              className="flex items-center justify-center gap-2 text-[10px] text-neutral-400 font-medium tracking-wider hover:text-white transition-colors"
            >
              <Mail className="h-3 w-3 shrink-0 text-red-500/50" />
              <span>{siteConfig.contactData.generalEmail}</span>
            </a>

            {/* Contacts Grid */}
            <div className="grid grid-cols-1 gap-4 pt-1">
              {siteConfig.contactData.contacts.map((contact, idx) => (
                <div key={idx} className="space-y-1.5">
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center justify-center gap-2 text-white text-[13px] font-bold hover:text-neutral-300 transition-colors"
                  >
                    <Phone className="h-3 w-3 text-red-500/50" />
                    <span className="tracking-tight">{contact.phone}</span>
                  </a>
                  <div className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">
                    {contact.name} <span className="text-neutral-800 mx-1">/</span> {contact.role}
                  </div>
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center justify-center gap-2 text-[10px] text-neutral-500 font-medium hover:text-white transition-colors break-all"
                  >
                    <Mail className="h-3 w-3 shrink-0 text-neutral-700" />
                    <span>{contact.email}</span>
                  </a>
                </div>
              ))}
            </div>

            {/* Social icons - mobile */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <a
                href="https://www.linkedin.com/company/techsolstice/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TechSolstice on LinkedIn"
                className="text-neutral-300 hover:text-white transition-colors p-2"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/techsolstice.mitblr/#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TechSolstice on Instagram"
                className="text-neutral-300 hover:text-white transition-colors p-2"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/@TechSolstice"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TechSolstice on YouTube"
                className="text-neutral-300 hover:text-white transition-colors p-2"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Desktop Layout (>= 768px) */}
        <div className="hidden md:block">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-6 lg:gap-12 items-start">

              {/* Left: Logos + Address */}
              <div className="space-y-3 lg:space-y-4">
                {/* Horizontal Logos */}
                <div className="flex items-center gap-3 lg:gap-4">
                  <a
                    href="/"
                    className="relative h-12 lg:h-14 w-auto aspect-3/1 hover:opacity-90 transition-opacity"
                    aria-label="Go to homepage"
                  >
                    <Image
                      src="/logos/TechSolsticeLogo.png"
                      alt="TechSolstice Wordmark"
                      fill
                      className="object-contain object-left"
                      priority
                      sizes="144px"
                    />
                  </a>
                  <div className="h-12 lg:h-14 w-[1.5px] bg-white/30 rounded-full" />
                  <a
                    href="https://www.manipal.edu/mu/campuses/mahe-bengaluru/academics/institution-list/mitblr.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative h-12 lg:h-14 w-12 lg:w-14 hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src="/logos/SCLogo.png"
                      alt="Student Council Logo"
                      fill
                      className="object-contain"
                      priority
                      sizes="56px"
                    />
                  </a>
                </div>

                {/* Address */}
                <a
                  href="https://maps.app.goo.gl/3s3Ew5LkqtLbJEor6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[11px] lg:text-[13px] text-neutral-500 font-medium leading-relaxed tracking-wide hover:text-neutral-300 transition-colors"
                >
                  {siteConfig.contactData.address.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </a>
              </div>

              {/* Center: Vertical Divider */}
              <div className="self-stretch w-px bg-white/5 mx-auto" />

              {/* Right: Contact Info */}
              <div className="space-y-4 lg:space-y-5 text-right">
                <h3 className="text-xs lg:text-sm font-black uppercase tracking-[0.4em] text-neutral-500 michroma-regular">Contact Us</h3>

                {/* Email */}
                <a
                  href={`mailto:${siteConfig.contactData.generalEmail}`}
                  className="flex items-center justify-end gap-2 text-[10px] lg:text-xs text-neutral-400 font-medium tracking-wider hover:text-white transition-colors group"
                >
                  <span>{siteConfig.contactData.generalEmail}</span>
                  <Mail className="h-4 w-4 shrink-0 text-red-500/50 group-hover:text-red-500 transition-colors" />
                </a>

                {/* Contacts */}
                <div className="space-y-3 lg:space-y-4 pt-1">
                  {siteConfig.contactData.contacts.map((contact, idx) => (
                    <div key={idx} className="space-y-1">
                      <a
                        href={`tel:${contact.phone}`}
                        className="flex items-center justify-end gap-2 text-white text-sm font-bold hover:text-neutral-300 transition-colors group"
                      >
                        <span className="tracking-tight">{contact.phone}</span>
                        <Phone className="h-4 w-4 text-red-500/50 group-hover:text-red-500 transition-colors" />
                      </a>
                      <div className="text-[10px] lg:text-[11px] text-neutral-500 font-bold uppercase tracking-widest">
                        {contact.name} <span className="text-neutral-800 mx-1">/</span> {contact.role}
                      </div>
                      <a
                        href={`mailto:${contact.email}`}
                        className="flex items-center justify-end gap-2 text-[10px] lg:text-xs text-neutral-400 font-medium hover:text-white transition-colors group"
                      >
                        <span>{contact.email}</span>
                        <Mail className="h-4 w-4 text-neutral-700 group-hover:text-neutral-400 transition-colors" />
                      </a>
                    </div>
                  ))}
                </div>
                {/* Social icons - desktop */}
                <div className="flex items-center justify-end gap-4 mt-3">
                  <a
                    href="https://www.linkedin.com/company/techsolstice/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TechSolstice on LinkedIn"
                    className="text-neutral-300 hover:text-white transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.instagram.com/techsolstice.mitblr/#"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TechSolstice on Instagram"
                    className="text-neutral-300 hover:text-white transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.youtube.com/@TechSolstice"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TechSolstice on YouTube"
                    className="text-neutral-300 hover:text-white transition-colors"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flickering Grid Background - Only on tablet+ */}
      {isTabletOrLarger && (
        <div
          className="w-full h-[150px] md:h-[180px] relative z-0 mt-4 overflow-hidden"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 20%)",
            maskImage: "linear-gradient(to bottom, transparent, black 20%)",
          }}
        >
          <FlickerOnView
            text={isDesktop ? FOOTER_GRID_CONFIG.desktopText : FOOTER_GRID_CONFIG.tabletText}
            baseFontSize={isDesktop ? FOOTER_GRID_CONFIG.desktopFontSize : FOOTER_GRID_CONFIG.tabletFontSize}
          />
        </div>
      )}
    </footer>
  );
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface FlickerOnViewProps {
  text: string;
  baseFontSize: number;
}

function FlickerOnView({ text, baseFontSize }: FlickerOnViewProps) {
  return (
    <div className="absolute inset-0 z-10 w-full overflow-hidden">
      <FlickeringGridResponsive
        text={text}
        baseFontSize={baseFontSize}
        className="h-full w-full"
        squareSize={FOOTER_GRID_CONFIG.squareSize}
        gridGap={FOOTER_GRID_CONFIG.gridGap}
        color={FOOTER_GRID_CONFIG.color}
        maxOpacity={FOOTER_GRID_CONFIG.maxOpacity}
        flickerChance={FOOTER_GRID_CONFIG.flickerChance}
      />
    </div>
  );
}