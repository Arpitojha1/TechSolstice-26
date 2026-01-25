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

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationFrameId = 0;

    // Adaptive particle density
    const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
    const DPR = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    const PARTICLE_COUNT = isMobile ? 160 : Math.round(600 / (2 / DPR));
    const MAGNETIC_RADIUS = isMobile ? 180 : 280;
    const VORTEX_STRENGTH = 0.07;
    const PULL_STRENGTH = 0.12;

    const mouse = { x: -1000, y: -1000 };

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
        this.size = Math.random() * (isMobile ? 1.2 : 1.6) + 0.4;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        const isGlass = Math.random() > 0.7;
        // Cyberpunk palette: glassy pink highlights vs deeper neon red shards
        this.color = isGlass ? "255,160,180" : "255,20,80";
        this.alpha = Math.random() * 0.35 + 0.08;
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

        if (this.frictionGlow > 0.2) {
          ctx.shadowBlur = 18 * this.frictionGlow;
          ctx.shadowColor = `rgba(255,60,140, ${Math.min(this.frictionGlow * 1.2, 0.95)})`;
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
      // subtle red wash for cyberpunk atmosphere (shortens trails)
      ctx.fillStyle = isMobile ? "rgba(25,6,12,0.06)" : "rgba(25,6,12,0.04)";
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
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    const handleResize = () => {
      // Immediately reinitialize and redraw to prevent flash
      init();
      // Draw one frame immediately to ensure canvas is never empty
      ctx.fillStyle = isMobile ? "rgba(25,6,12,0.06)" : "rgba(25,6,12,0.04)";
      ctx.fillRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.update();
        p.draw();
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    init();
    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove as EventListener);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        backgroundColor: '#000000',
        WebkitTapHighlightColor: 'transparent',
        WebkitTouchCallout: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none'
      }}
    >
      <div className="absolute inset-0" style={{ backgroundColor: '#000000' }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full block absolute inset-0"
          style={{ 
            transform: "translateZ(0)", 
            filter: "blur(9px)",
            backgroundColor: '#000000',
            willChange: 'transform',
            WebkitTapHighlightColor: 'transparent',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            touchAction: 'none'
          }}
        />

        {/* Black-tinted overlay with subtle backdrop blur to darken and soften the background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-black/0 md:bg-black/5 backdrop-blur-none pointer-events-none"
          style={{ mixBlendMode: 'multiply' }}
        />
      </div>
    </div>
  );
};

export default ASMRStaticBackground;
