'use client';

import React from 'react';
import { Instagram, Linkedin, Globe, Ticket, ExternalLink } from 'lucide-react';

const SocialsPage = () => {
  const socials = [
    {
      name: 'Instagram',
      handle: '@techsolstice.mitblr',
      url: 'https://www.instagram.com/techsolstice.mitblr/#',
      borderColor: 'group-hover:border-pink-500/50',
      glowColor: 'bg-pink-500/20',
      icon: <Instagram className="w-6 h-6 text-pink-500" />,
    },
    {
      name: 'LinkedIn',
      handle: 'TechSolstice MIT-B',
      url: 'https://www.linkedin.com/company/techsolstice/',
      borderColor: 'group-hover:border-blue-500/50',
      glowColor: 'bg-blue-500/20',
      icon: <Linkedin className="w-6 h-6 text-blue-500" />,
    },
  ];

  return (
    <div className="relative w-full min-h-screen text-white flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Dynamic Background Glow - Adjusted to a neutral white/blue to let the Red CTA pop */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-sm w-full z-10">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-extrabold tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent drop-shadow-sm">
            TechSolstice'26
          </h1>
        </header>

        <div className="space-y-4">
          {/* REDESIGNED "BUY PASS" - Ruby Glass Aesthetic */}
          <a
            href="/passes"
            className="group relative flex items-center justify-between p-5 rounded-2xl bg-red-500/10 border border-red-500/30 backdrop-blur-xl transition-all duration-500 hover:bg-red-500/20 hover:border-red-400/60 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-400/30 transition-transform duration-500 group-hover:scale-110 shadow-[inset_0_0_10px_rgba(239,68,68,0.2)]">
                <Ticket className="w-6 h-6 text-red-400 group-hover:text-red-300 transition-colors" />
              </div>
              <div>
                <h2 className="font-bold text-lg leading-none tracking-tight text-red-50">Get Your Fest Pass</h2>
                <p className="text-xs text-red-200/50 mt-1 uppercase tracking-wider font-medium">Limited Slots Available</p>
              </div>
            </div>
            <div className="bg-red-500/10 p-2 rounded-lg group-hover:bg-red-500/30 transition-colors">
              <ExternalLink className="w-4 h-4 text-red-400 group-hover:text-white" />
            </div>
          </a>

          {/* SEAMLESS "WEBSITE" */}
          <a
            href="/"
            className="group relative flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md transition-all duration-500 hover:border-white/40 hover:bg-white/[0.08]"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 transition-transform duration-500 group-hover:scale-110">
                <Globe className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h2 className="font-bold text-lg leading-none tracking-tight">Official Website</h2>
                <p className="text-xs text-white/40 mt-1">techsolstice.mitblr.in</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
          </a>

          {/* HR Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-medium">Connect</span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>

          {/* SOCIALS */}
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md transition-all duration-500 ${social.borderColor} hover:bg-white/[0.08]`}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 transition-transform duration-500 group-hover:scale-110 relative overflow-hidden">
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${social.glowColor} blur-xl`} />
                  <span className="relative z-10">{social.icon}</span>
                </div>
                <div>
                  <h2 className="font-bold text-lg leading-none tracking-tight">{social.name}</h2>
                  <p className="text-xs text-white/40 mt-1">{social.handle}</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialsPage;