"use client";
import { useEffect, useRef } from "react";
import "lenis/dist/lenis.css";

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    let lenis: any;

    const startLenis = async () => {
      try {
        const Lenis = (await import("lenis")).default;
        lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          gestureOrientation: "vertical",
          autoRaf: true,
        });
        lenisRef.current = lenis;
      } catch (e) {
        console.warn("Lenis failed to load", e);
      }
    };
    startLenis();
    return () => {
      if (lenisRef.current) lenisRef.current.destroy();
    };
  }, []);

  return children;
}
