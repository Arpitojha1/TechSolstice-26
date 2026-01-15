import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ChatbotWidget } from "@/components/chatbot-widget";
import ASMRStaticBackground from '@/components/ui/asmr-static-background';
import TechSolsticeNavbar from '@/components/navbar';
import { Footer } from '@/components/footer';
import Logo from '@/components/ui/logo';
import { ScrollToTop } from '@/components/scroll-to-top';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechSolstice'26",
  description: "Official website for TechSolstice - 2026",
  icons: {
    icon: '/favicon.ico',
  },
  // Performance optimization
  other: {
    'preload': 'true'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <SpeedInsights />
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
      </body>
    </html>
  );
}
