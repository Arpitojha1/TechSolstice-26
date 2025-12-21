import React from 'react';
import { Mail, Phone, MapPin, Instagram, Linkedin, Twitter } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8">
          Get in Touch
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-white mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
                  <a href="mailto:contact@techsolstice.in" className="text-neutral-300 hover:text-white transition-colors">
                    contact@techsolstice.in
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-white mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Phone</h3>
                  <p className="text-neutral-300">+91 XXXXX XXXXX</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-white mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Location</h3>
                  <p className="text-neutral-300">College Campus</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6">Follow Us</h3>
              <div className="space-y-4">
                <a href="#" className="flex items-center gap-3 text-neutral-300 hover:text-white transition-colors group">
                  <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <span>Instagram</span>
                </a>
                <a href="#" className="flex items-center gap-3 text-neutral-300 hover:text-white transition-colors group">
                  <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <span>LinkedIn</span>
                </a>
                <a href="#" className="flex items-center gap-3 text-neutral-300 hover:text-white transition-colors group">
                  <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                    <Twitter className="w-5 h-5" />
                  </div>
                  <span>Twitter</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
