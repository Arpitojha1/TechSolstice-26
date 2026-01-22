'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Instagram, Linkedin, Globe, Ticket, ExternalLink } from 'lucide-react'

const SocialsPage = () => {
  const socials = [
    {
      name: 'Instagram',
      handle: '@techsolstice.mitblr',
      url: 'https://www.instagram.com/techsolstice.mitblr/#',
      icon: <Instagram className="w-5 h-5" />,
      highlight: 'group-hover:text-pink-500'
    },
    {
      name: 'LinkedIn',
      handle: 'TechSolstice MIT-B',
      url: 'https://www.linkedin.com/company/techsolstice/',
      icon: <Linkedin className="w-5 h-5" />,
      highlight: 'group-hover:text-blue-500'
    },
    {
      name: 'Website',
      handle: 'techsolstice.mitblr.in',
      url: '/',
      icon: <Globe className="w-5 h-5" />,
      highlight: 'group-hover:text-emerald-500'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-transparent px-4 py-24 relative overflow-hidden font-sans">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md z-10"
      >
        <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden space-y-10">

          <div className="space-y-3 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white michroma-regular tracking-tight leading-tight uppercase">
              Connect
            </h1>
            <p className="text-neutral-500 text-[10px] font-black tracking-[0.3em] uppercase">The Solstice Network</p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {/* Featured Pass Link */}
            <motion.div variants={itemVariants}>
              <a
                href="/passes"
                className="group relative flex items-center justify-between p-5 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-md transition-all duration-500 hover:bg-red-500/20 hover:border-red-500/40 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-red-500/20 text-red-400 group-hover:scale-110 transition-transform duration-500">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-[10px] font-black tracking-[0.2em] text-red-400 uppercase">Priority Access</h2>
                    <p className="text-lg font-bold text-white leading-tight mt-0.5">Get Fest Pass</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-red-500/50 group-hover:text-red-400" />
              </a>
            </motion.div>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-1 bg-white/[0.05]"></div>
              <span className="text-[8px] text-neutral-600 uppercase tracking-[0.4em] font-black">Social Channels</span>
              <div className="h-px flex-1 bg-white/[0.05]"></div>
            </div>

            {/* Social Links */}
            {socials.map((social) => (
              <motion.div key={social.name} variants={itemVariants}>
                <a
                  href={social.url}
                  target={social.url.startsWith('http') ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] transition-all duration-500 hover:bg-white/[0.08] hover:border-white/[0.15] active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-black/40 text-neutral-500 transition-all duration-500 group-hover:scale-110 ${social.highlight}`}>
                      {social.icon}
                    </div>
                    <div>
                      <p className="text-white font-bold">{social.name}</p>
                      <p className="text-[10px] text-neutral-500 font-medium tracking-wide">{social.handle}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-neutral-700 group-hover:text-white transition-colors" />
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-[10px] text-neutral-600 uppercase tracking-[0.5em] font-black opacity-40 italic">TechSolstice'26</p>
        </div>
      </motion.div>
    </div>
  );
};

export default SocialsPage;