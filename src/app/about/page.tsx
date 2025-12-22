import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8">
          About TechSolstice'26
        </h1>
        <div className="space-y-6 text-neutral-300">
          <p className="text-lg sm:text-xl leading-relaxed">
            Welcome to TechSolstice — the premier technical festival that brings together innovators, 
            creators, and tech enthusiasts from across the region.
          </p>
          <p className="text-base sm:text-lg leading-relaxed">
            Our mission is to foster innovation, collaboration, and creativity through cutting-edge 
            competitions, workshops, and networking opportunities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h3 className="text-2xl font-semibold text-white mb-2">30+</h3>
              <p className="text-neutral-400">Events</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h3 className="text-2xl font-semibold text-white mb-2">₹5L+</h3>
              <p className="text-neutral-400">Prize Pool</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h3 className="text-2xl font-semibold text-white mb-2">3000+</h3>
              <p className="text-neutral-400">Participants</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
