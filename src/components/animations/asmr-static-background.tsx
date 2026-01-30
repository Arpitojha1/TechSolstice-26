"use client";
import React, { useEffect, useRef } from "react";

/**
 * ASMRStaticBackground
 * - Adaptive particle count for mobile/desktop
 * - Respects prefers-reduced-motion
 * - Light-weight defaults to avoid mobile lag
 * - Fixed position at lowest z-index to show behind all content
 */
const ASMRStaticBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Respect reduced motion
    const prefersReduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use srgb colorSpace for consistent colors across devices (especially iOS)
    const ctx = canvas.getContext("2d", { colorSpace: 'srgb' });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationFrameId = 0;

    // Adaptive particle density
    const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
    const DPR = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    // ========== PARTICLE BEHAVIOR SETTINGS ==========
    // PARTICLE_COUNT: Number of particles on screen. Higher = denser effect, but impacts performance
    // NUKE MODE: Mobile has 280 particles for intense red coverage
    const PARTICLE_COUNT = isMobile ? 165 : Math.round(700 / (2 / DPR));
    // MAGNETIC_RADIUS: How close cursor must be to attract particles (in pixels). Larger = wider influence area
    const MAGNETIC_RADIUS = isMobile ? 200 : 300;
    // VORTEX_STRENGTH: How much particles swirl around cursor. Higher = more spinning/orbital motion
    const VORTEX_STRENGTH = 0.07;
    // PULL_STRENGTH: How strongly particles are pulled toward cursor. Higher = faster attraction
    const PULL_STRENGTH = 0.12;

    const mouse = { x: -1000, y: -1000 };

    // Simulation state for initial animation
    let isSimulating = true;
    const simulationStart = Date.now();
    const SIMULATION_DURATION = 2500; // 2.5s swipe

    class Particle {
      x = 0;
      y = 0;
      vx = 0;
      vy = 0;
      size = 0;
      alpha = 0;
      color = "";
      rotation = 0;
      rotationSpeed = 0;
      frictionGlow = 0;

      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // ========== PARTICLE SIZE ==========
        // NUKE MODE: Bigger particles (0.8 to 3.0 px) for more visible red
        this.size = isMobile ? (Math.random() * 2.5 + 0.8) : (Math.random() * 2.2 + 0.6);

        // ========== PARTICLE VELOCITY ==========
        // vx/vy: Initial drift speed. Change 0.2 for faster/slower ambient movement
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;

        // ========== PARTICLE COLOR PALETTE ==========
        // NUKE MODE: Bright vivid red - 25% less bright
        // Mix of pure red and slightly darker red for variety
        const isBright = Math.random() > 0.5;
        // Reduced another ~5% from current values (93 -> 88, 81 -> 77, 7 -> 6)
        this.color = isBright ? "88,0,0" : "77,6,6";

        // ========== PARTICLE OPACITY ==========
        // NUKE MODE: Full opacity for maximum brightness
        this.alpha = 1.0;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
      }

      update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        if (dist < MAGNETIC_RADIUS) {
          const force = (MAGNETIC_RADIUS - dist) / MAGNETIC_RADIUS;
          this.vx += (dx / dist) * force * PULL_STRENGTH;
          this.vy += (dy / dist) * force * PULL_STRENGTH;
          this.vx += (dy / dist) * force * VORTEX_STRENGTH * 10;
          this.vy -= (dx / dist) * force * VORTEX_STRENGTH * 10;
          this.frictionGlow = force * 0.7;
        } else {
          this.frictionGlow *= 0.92;
        }

        this.x += this.vx;
        this.y += this.vy;

        this.vx *= 0.95;
        this.vy *= 0.95;

        this.vx += (Math.random() - 0.5) * 0.03;
        this.vy += (Math.random() - 0.5) * 0.03;

        this.rotation += this.rotationSpeed + (Math.abs(this.vx) + Math.abs(this.vy)) * 0.05;

        if (this.x < -20) this.x = width + 20;
        if (this.x > width + 20) this.x = -20;
        if (this.y < -20) this.y = height + 20;
        if (this.y > height + 20) this.y = -20;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        const finalAlpha = Math.min(this.alpha + this.frictionGlow, 0.98);
        ctx.fillStyle = `rgba(${this.color}, ${finalAlpha})`;

        // ========== GLOW EFFECT ON CURSOR INTERACTION ==========
        // NUKE MODE: Always emit a subtle glow, stronger when near cursor
        // Base glow for all particles (25% less bright)
        ctx.shadowBlur = isMobile ? 12 : 8;
        ctx.shadowColor = `rgba(88,0,0, 0.6)`;

        // Extra glow when near cursor
        if (this.frictionGlow > 0.2) {
          ctx.shadowBlur = 25 * this.frictionGlow;
          ctx.shadowColor = `rgba(77,6,6, ${Math.min(this.frictionGlow * 1.5, 1.0)})`;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.moveTo(0, -this.size * 2.5);
        ctx.lineTo(this.size, 0);
        ctx.lineTo(0, this.size * 2.5);
        ctx.lineTo(-this.size, 0);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }
    }

    let particles: Particle[] = [];

    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
      // scale for DPR
      if (DPR && DPR !== 1) {
        canvas.width = Math.round(width * DPR);
        canvas.height = Math.round(height * DPR);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(DPR, DPR);
      }
      // CRITICAL: Fill with solid black immediately to prevent flash
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
    };

    const render = () => {
      // Handle initial simulation
      if (isSimulating) {
        const elapsed = Date.now() - simulationStart;
        if (elapsed < SIMULATION_DURATION) {
          const progress = elapsed / SIMULATION_DURATION;
          // Smooth sine wave motion across the screen
          const x = width * (0.2 + 0.6 * Math.sin(progress * Math.PI)); // Sweep 20% -> 80% -> 20%
          const y = height * (0.5 + 0.2 * Math.cos(progress * Math.PI * 2)); // Circle motion

          mouse.x = x;
          mouse.y = y;
        } else {
          isSimulating = false;
          mouse.x = -1000;
          mouse.y = -1000;
        }
      }

      // ========== BACKGROUND FILL / TRAIL EFFECT ==========
      // This rectangle is drawn each frame with low opacity, creating the "trail" effect
      // The color tints the entire canvas and controls how fast trails fade
      // 
      // FORMAT: "rgba(R, G, B, A)" where:
      //   - R,G,B (0-255): Base color tint for the background
      //   - A (0.0-1.0): Fade speed. Lower = longer trails, Higher = shorter trails
      //
      // Current "rgba(25,6,12,0.04)": Very dark red/maroon tint with slow fade (long trails)
      //   - 25,6,12 = Dark reddish-brown for cyberpunk atmosphere
      //   - 0.04 = Very slow fade creating long ghostly trails
      //
      // COLOR EXAMPLES:
      //   - Pure black trails: "rgba(0,0,0,0.04)" - neutral, no color tint
      //   - Blue/cyan mood: "rgba(6,12,25,0.04)" - cool cyberpunk
      //   - Purple mood: "rgba(15,6,25,0.04)" - violet atmosphere
      //   - Green mood: "rgba(6,20,12,0.04)" - matrix-style
      //
      // TRAIL LENGTH:
      //   - 0.02 = Very long trails (ghostly)
      //   - 0.04 = Long trails (current - smooth)
      //   - 0.08 = Medium trails
      //   - 0.15 = Short trails (snappy)
      // NUKE MODE: Very dark red tint (10,0,0) for subtle ambient red glow on black
      // Mobile uses slower fade (0.02) for longer, more visible red trails
      ctx.fillStyle = isMobile ? "rgba(8,0,0,0.02)" : "rgba(5,0,0,0.025)";
      ctx.fillRect(0, 0, width, height);

      // Draw particles (limit per frame for performance on mobile)
      const step = isMobile ? 1 : 1;
      for (let i = 0; i < particles.length; i += step) {
        const p = particles[i];
        p.update();
        p.draw();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const handleMouseMove = (e: MouseEvent) => {
      isSimulating = false; // Cancel simulation on user interaction
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        isSimulating = false; // Cancel simulation on user interaction
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    const handleResize = () => {
      // Immediately reinitialize and redraw to prevent flash
      init();
      // Draw one frame immediately to ensure canvas is never empty
      // ========== RESIZE BACKGROUND COLOR ==========
      // NUKE MODE: Match the dark red tint from render()
      ctx.fillStyle = isMobile ? "rgba(8,0,0,0.02)" : "rgba(5,0,0,0.025)";
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.update();
        p.draw();
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // Also cancel on touch start to be responsive immediately
    window.addEventListener("touchstart", () => { isSimulating = false; }, { passive: true });

    init();
    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove as EventListener);
      window.removeEventListener("touchstart", () => { isSimulating = false; });
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        // ========== CONTAINER BACKGROUND COLOR ==========
        // Base color behind the entire effect. Should be dark to make particles visible
        // Change to any dark hex color: '#000000' (black), '#0a0a0a' (near-black), '#0d0d1a' (dark blue)
        backgroundColor: '#000000',
        WebkitTapHighlightColor: 'transparent',
        WebkitTouchCallout: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none'
      }}
    >
      {/* ========== INNER WRAPPER BACKGROUND ========== */}
      {/* This div's backgroundColor should match container for seamless look */}
      <div className="absolute inset-0" style={{ backgroundColor: '#000000' }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full block absolute inset-0"
          style={{
            transform: "translateZ(0)",
            // ========== CANVAS BLUR EFFECT ==========
            // NUKE MODE: Less blur on mobile (6px) for sharper red particles
            // Desktop keeps 8px for smooth glow
            filter: "blur(7px)",
            // ========== CANVAS BACKGROUND COLOR ==========
            // Should match container background for seamless effect
            backgroundColor: '#000000',
            willChange: 'transform',
            WebkitTapHighlightColor: 'transparent',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            touchAction: 'none',
            // Force hardware acceleration and consistent color rendering on iOS
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            imageRendering: 'auto'
          }}
        />

        {/* ========== OVERLAY LAYER ========== */}
        {/* NUKE MODE: Red radial glow from center for ambient red atmosphere */}
        {/* Mobile gets stronger red glow, desktop is subtler */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(80,0,0,0.15) 0%, rgba(20,0,0,0.08) 50%, rgba(0,0,0,0) 100%)',
            mixBlendMode: 'screen'
          }}
        />
        {/* Secondary vignette for depth */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)'
          }}
        />
      </div>
    </div>
  );
};

export default ASMRStaticBackground;