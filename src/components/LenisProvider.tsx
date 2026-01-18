"use client";
import { useEffect, useRef } from "react";

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    let lenis: any;
    let rafId: number;

    const startLenis = async () => {
      try {
        const Lenis = (await import("@studio-freight/lenis")).default;
        lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          gestureOrientation: "vertical",
        });
        lenisRef.current = lenis;
        function raf(time: number) {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);
        rafIdRef.current = rafId;
      } catch (e) {
        console.warn("Lenis failed to load", e);
      }
    };
    startLenis();
    return () => {
      isMounted = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (lenisRef.current) lenisRef.current.destroy();
    };
  }, []);

  return children;
}
