import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ChatbotWidget } from "@/components/chat/chatbot-widget";
import LenisProvider from "@/components/common/LenisProvider";
import ASMRStaticBackground from '@/components/animations/asmr-static-background';
import TechSolsticeNavbar from '@/components/common/navbar';
import { Footer } from '@/components/common/footer';
import Logo from '@/components/misc/logo';
import { ScrollToTop } from '@/components/common/scroll-to-top';
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/components/common/providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TechSolstice'26 | MIT Bengaluru",
    template: "%s | TechSolstice'26"
  },
  description: "TechSolstice stands as the flagship annual tech and innovation fest of Manipal Institute of Technology, Bengaluru — a celebration of creativity, technology, and entrepreneurship.",
  keywords: [
    "TechSolstice", "mit bangalore techfest", "tech solstice", "manipal blr tech fest",
    "MIT Bengaluru", "MAHE", "Technical Fest", "Hackathon", "Robotics", "Coding",
    "Engineering", "College Fest", "Tech Fest India", "Innovation", "Entrepreneurship"
  ],
  authors: [{ name: "TechSolstice Team" }],
  creator: "TechSolstice Team",
  publisher: "Manipal Institute of Technology, Bengaluru",
  metadataBase: new URL('https://techsolstice.mitblr.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "TechSolstice'26 | MIT Bengaluru",
    description: "TechSolstice stands as the flagship annual tech and innovation fest of Manipal Institute of Technology, Bengaluru. A celebration of creativity, technology, and entrepreneurship.",
    url: 'https://techsolstice.mitblr.in',
    siteName: "TechSolstice'26",
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/logos/TechSolsticeLogo.png',
        width: 1200,
        height: 630,
        alt: "TechSolstice'26 Logo",
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "TechSolstice'26 | MIT Bengaluru",
    description: "Flagship annual tech and innovation fest of MIT Bengaluru. Feb 20-22, 2026.",
    images: ['/logos/TechSolsticeLogo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  // Performance optimization
  other: {
    'preload': 'true'
  }
};


const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <head>
        {/* Viewport meta tag for proper mobile rendering and keyboard handling */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no" />
        {/* Set browser theme color to black to prevent white flash on overscroll */}
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-navbutton-color" content="#000000" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {/* Critical resource preloading for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://prod.spline.design" />
        <link href="https://fonts.googleapis.com/css2?family=Michroma&display=swap" rel="stylesheet" />
        {/* Critical font optimization to prevent FOUT */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .michroma-regular { 
              font-family: 'Michroma', monospace; 
              font-display: swap;
              font-variation-settings: normal;
            }
            /* Prevent layout shift during font load */
            .michroma-regular::before {
              content: '';
              display: block;
              height: 0;
              width: 0;
            }
            /* Reduce animation on reduced motion */
            @media (prefers-reduced-motion: reduce) {
              *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
              }
            }
          `
        }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <LenisProvider>
            <SpeedInsights />
            <Analytics />
            <ScrollToTop />
            {/* Background layer - lowest z-index */}
            <ASMRStaticBackground />

            {/* Fixed Logo - same as homepage */}
            <div className="fixed top-4 left-4 md:top-6 md:left-8 z-50 flex items-center">
              <Logo />
            </div>

            {/* Global sticky navbar - high z-index to stay on top */}
            <div className="relative z-50">
              <TechSolsticeNavbar />
            </div>

            {/* Main content area - medium z-index; navbar is fixed so no top padding needed */}
            <div className="relative z-10">
              {children}
            </div>

            {/* Footer at the bottom */}
            <div className="relative z-10">
              <Footer />
            </div>

            {/* Chatbot widget - highest z-index */}
            <ChatbotWidget />
          </LenisProvider>
        </Providers>
      </body>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "name": "TechSolstice (MIT Bengaluru)",
                "url": "https://techsolstice.mitblr.in",
                "logo": "https://techsolstice.mitblr.in/logos/TechSolsticeLogo.png",
                "description": "Manipal Institute of Technology Bengaluru (MIT-BLR) is one of the leading Institutions of Manipal Academy of Higher Education (MAHE) that offers BTech programs. The MIT- BLR is approved by the All-India Council of Technical Education (AICTE) and the Ministry of Education (MHRD).",
                "sameAs": [
                  "https://www.instagram.com/techsolstice.mitblr",
                  "https://www.linkedin.com/company/techsolstice",
                  "https://www.youtube.com/@TechSolstice"
                ]
              },
              {
                "@type": "Event",
                "name": "TechSolstice'26",
                "description": "TechSolstice stands as the flagship annual tech and innovation fest of Manipal Institute of Technology, Bengaluru — a celebration of creativity, technology, and entrepreneurship. It brings together the brightest minds from premier institutions across India to collaborate, compete, and create. Organized entirely by students, TechSolstice’26 embodies the spirit of innovation, precision, and passion.",
                "startDate": "2026-02-20",
                "endDate": "2026-02-22",
                "eventStatus": "https://schema.org/EventScheduled",
                "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
                "location": {
                  "@type": "Place",
                  "name": "Manipal Institute of Technology, Bengaluru",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Govindapura, Yelahanka",
                    "addressLocality": "Bengaluru",
                    "postalCode": "560064",
                    "addressRegion": "Karnataka",
                    "addressCountry": "IN"
                  }
                },
                "organizer": {
                  "@type": "Organization",
                  "name": "MIT Bengaluru Student Council",
                  "url": "https://manipal.edu/mitblr"
                }
              }
            ]
          })
        }}
      />
    </html>
  );
}

import { memo } from 'react';
export default memo(RootLayout);
