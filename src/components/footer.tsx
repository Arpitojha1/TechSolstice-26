"use client";

import { Mail, Phone, Linkedin, Instagram } from "lucide-react";
// Removed: import dynamic from "next/dynamic";
import Image from "next/image";
import Logo from "@/components/ui/logo";
import { useMediaQuery } from "@/hooks/use-media-query";

// CHANGED: Static import to ensure the animation code is loaded immediately with the page
import { FlickeringGridResponsive } from "./ui/flickering-grid";

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
      className="w-full pb-0 bg-black/40 backdrop-blur-md border-t border-white/10 relative z-10"
    >
      {/* Subtle top border glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 pointer-events-none">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-500/20 to-transparent opacity-70" />
      </div>

      {/* Main Content Container */}
      <div className="w-full relative z-20 px-4 sm:px-6 lg:px-8 py-10 md:py-12 lg:py-14">

        {/* Mobile Layout (< 768px) */}
        <div className="block md:hidden space-y-8">
          {/* Logos Section - Mobile */}
          <div className="space-y-6">
            {/* Horizontal Logos */}
            <div className="flex items-center justify-center">
              <Logo variant="compact" />
            </div>

            {/* Address below logos */}
            <div className="text-center text-base text-neutral-400 space-y-0.5">
              {siteConfig.contactData.address.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-16 mx-auto bg-gradient-to-r from-transparent via-neutral-600 to-transparent" />

          {/* Contact Info - Mobile */}
          <div className="text-center space-y-5">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>

            {/* Email */}
            <a
              href={`mailto:${siteConfig.contactData.generalEmail}`}
              className="flex items-center justify-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
            >
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span>{siteConfig.contactData.generalEmail}</span>
            </a>

            {/* Contacts Grid */}
            <div className="grid grid-cols-1 gap-4 pt-2">
              {siteConfig.contactData.contacts.map((contact, idx) => (
                <div key={idx} className="space-y-1.5">
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center justify-center gap-2 text-white font-medium hover:text-neutral-300 transition-colors"
                  >
                    <Phone className="h-4 w-4 text-neutral-400" />
                    <span>{contact.phone}</span>
                  </a>
                  <div className="text-sm text-neutral-400">
                    {contact.name} <span className="text-neutral-500">•</span> {contact.role}
                  </div>
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center justify-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    <span>{contact.email}</span>
                  </a>
                </div>
              ))}
            </div>

            {/* Social icons - mobile, placed at bottom of contact area */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <a
                href="https://www.linkedin.com/company/techsolstice/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TechSolstice on LinkedIn"
                className="text-neutral-300 hover:text-white transition-colors"
              >
                <Linkedin className="w-7 h-7" />
              </a>
              <a
                href="https://www.instagram.com/techsolstice.mitblr/#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TechSolstice on Instagram"
                className="text-neutral-300 hover:text-white transition-colors"
              >
                <Instagram className="w-7 h-7" />
              </a>
            </div>
          </div>
        </div>

        {/* Desktop Layout (>= 768px) */}
        <div className="hidden md:block">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-8 lg:gap-16 items-start">

              {/* Left: Logos + Address */}
              <div className="space-y-5 lg:space-y-6">
                {/* Horizontal Logos */}
                <div className="flex items-center gap-3 lg:gap-4 -ml-2">
                  <Logo variant="compact" />
                </div>

                {/* Address */}
                <div className="text-base lg:text-lg text-neutral-400 space-y-1 leading-relaxed">
                  {siteConfig.contactData.address.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </div>

              {/* Center: Vertical Divider */}
              <div className="h-full w-px bg-gradient-to-b from-transparent via-neutral-700 to-transparent" />

              {/* Right: Contact Info */}
              <div className="space-y-6 lg:space-y-7 text-right">
                <h3 className="text-xl lg:text-2xl font-semibold text-white">Contact Us</h3>

                {/* Email */}
                <a
                  href={`mailto:${siteConfig.contactData.generalEmail}`}
                  className="flex items-center justify-end gap-2.5 text-sm lg:text-base text-neutral-400 hover:text-white transition-colors group"
                >
                  <span>{siteConfig.contactData.generalEmail}</span>
                  <Mail className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0 group-hover:text-white transition-colors" />
                </a>

                {/* Contacts */}
                <div className="space-y-5 lg:space-y-6 pt-1">
                  {siteConfig.contactData.contacts.map((contact, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <a
                        href={`tel:${contact.phone}`}
                        className="flex items-center justify-end gap-2.5 text-white font-medium hover:text-neutral-300 transition-colors group"
                      >
                        <span className="text-sm lg:text-base">{contact.phone}</span>
                        <Phone className="h-4 w-4 lg:h-5 lg:w-5 text-neutral-400 group-hover:text-white transition-colors" />
                      </a>
                      <div className="text-sm lg:text-base text-neutral-400">
                        {contact.name} <span className="text-neutral-600">•</span> {contact.role}
                      </div>
                      <a
                        href={`mailto:${contact.email}`}
                        className="flex items-center justify-end gap-2.5 text-sm lg:text-base text-neutral-400 hover:text-white transition-colors"
                      >
                        <span className="text-sm lg:text-base">{contact.email}</span>
                        <Mail className="h-4 w-4 lg:h-5 lg:w-5 text-neutral-400 group-hover:text-white transition-colors" />
                      </a>
                    </div>
                  ))}
                </div>
                {/* Social icons - desktop contact side bottom */}
                <div className="flex items-center justify-end gap-4 mt-4">
                  <a
                    href="https://www.linkedin.com/company/techsolstice/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TechSolstice on LinkedIn"
                    className="text-neutral-300 hover:text-white transition-colors"
                  >
                    <Linkedin className="w-7 h-7" />
                  </a>
                  <a
                    href="https://www.instagram.com/techsolstice.mitblr/#"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TechSolstice on Instagram"
                    className="text-neutral-300 hover:text-white transition-colors"
                  >
                    <Instagram className="w-7 h-7" />
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
          className="w-full md:min-h-[35vh] lg:min-h-[40vh] relative mt-8 md:mt-10 z-0 pb-8 md:pb-10"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 20%)",
            maskImage: "linear-gradient(to bottom, transparent, black 20%)",
          }}
        >
          <FlickerOnView
            text={isDesktop ? "TechSolstice'26" : "Solstice'26"}
            baseFontSize={isDesktop ? 160 : 80}
          />
        </div>
      )}
    </footer>
  );
};

function FlickerOnView({ text, baseFontSize }: { text: string; baseFontSize: number }) {
  return (
    <div className="absolute inset-0 z-10 w-full">
      {/* CHANGED: Using the statically imported component directly */}
      <FlickeringGridResponsive
        text={text}
        baseFontSize={baseFontSize}
        className="h-full w-full"
        squareSize={3}
        gridGap={3}
        color="#D33A4A"
        maxOpacity={0.4}
        flickerChance={0.15}
      />
    </div>
  );
}