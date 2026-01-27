"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TrailerProps {
  videoId?: string; // YouTube ID (default: comtgOhuXIg)
}

const Trailer: React.FC<TrailerProps> = ({ videoId = "comtgOhuXIg" }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  useEffect(() => {
    // Only run GSAP if sectionRef is valid
    if (sectionRef.current) {
      const ctx = gsap.context(() => {
        const mm = gsap.matchMedia();

        // SHARED: Heading Animation
        gsap.from(headingRef.current, {
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          y: 30,
          duration: 1,
          ease: "power3.out",
        });

        // DESKTOP: Side-by-Side Animation
        mm.add("(min-width: 1024px)", () => {
          gsap.from(videoContainerRef.current, {
            scrollTrigger: {
              trigger: videoContainerRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
            opacity: 0,
            x: -80, // User requested stronger animation
            duration: 1,
            ease: "power3.out",
          });

          gsap.from(descRef.current, {
            scrollTrigger: {
              trigger: descRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
            opacity: 0,
            x: 80, // User requested stronger animation
            duration: 1,
            ease: "power3.out",
            delay: 0.2,
          });
        });

        // MOBILE: Vertical Stack Animation (Slide Up)
        mm.add("(max-width: 1023px)", () => {
          gsap.from([videoContainerRef.current, descRef.current], {
            scrollTrigger: {
              trigger: videoContainerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
          });
        });

      }, sectionRef);

      return () => ctx.revert();
    }
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-neutral-950 py-16 sm:py-24 px-4 sm:px-6 relative z-10 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-red-600/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <h2
          ref={headingRef}
          className="michroma-regular text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-12 sm:mb-16 tracking-tight text-center uppercase"
        >
          TechSolstice <span className="text-red-600">'26</span> TRAILER
        </h2>

        <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">

          {/* VIDEO CONTAINER */}
          <div
            ref={videoContainerRef}
            className="w-full lg:w-3/5 flex justify-center relative group"
          >
            <div className="w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black relative">
              {isPlaying ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&controls=1`}
                  title="TechSolstice Trailer"
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                /* THUMBNAIL OVERLAY */
                <div
                  className="absolute inset-0 cursor-pointer"
                  onClick={handlePlay}
                >
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                    alt="Trailer Thumbnail"
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 scale-105 group-hover:scale-100 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* PLAY BUTTON */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.5)] group-hover:scale-110 group-hover:bg-red-600 transition-all duration-300">
                      <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-white ml-1" />
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
                    <p className="text-white font-bold text-sm sm:text-base uppercase tracking-widest michroma-regular">Watch Teaser</p>
                  </div>
                </div>
              )}
            </div>

            {/* Corner Accents */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-red-500/50 rounded-tl-lg pointer-events-none" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-red-500/50 rounded-br-lg pointer-events-none" />
          </div>

          {/* DESCRIPTION CONTAINER */}
          <div
            ref={descRef}
            className="w-full lg:w-2/5 flex flex-col justify-center"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-xl h-full flex flex-col justify-center relative overflow-hidden group/card hover:border-red-500/30 transition-colors duration-500">
              <div className="absolute top-0 right-0 p-32 bg-red-600/5 blur-[60px] rounded-full pointer-events-none" />

              <h3 className="text-2xl font-bold text-white mb-4 michroma-regular uppercase">
                The Legacy Continues
              </h3>

              <div className="space-y-4 text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
                <p>
                  <span className="text-red-500 font-bold">TechSolstice</span>, the flagship annual technical and cultural fest of{" "}
                  <span className="font-semibold text-white">MIT Bengaluru</span>, returns with an electrifying fusion of innovation and artistry.
                </p>
                <p>
                  A grand celebration of creativity, talent, and technology that transforms the campus into a vibrant arena of competition. From cutting-edge hackathons to mesmerizing cultural performances, it is the ultimate platform to <span className="text-white italic">Collaborate, Compete, and Create.</span>
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-red-600/50 to-transparent" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-red-500 font-mono">
                  Edition 2026
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Trailer;
