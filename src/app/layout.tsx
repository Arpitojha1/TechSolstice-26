import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ChatbotWidget } from "@/components/chatbot-widget";
import ASMRStaticBackground from '@/components/ui/asmr-static-background';
import TechSolsticeNavbar from '@/components/navbar';
import { Footer } from '@/components/footer';

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Michroma&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <SpeedInsights />
        {/* Background layer - lowest z-index */}
        <ASMRStaticBackground />

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
