"use client";

/**
 * Responsive wrapper around FlickeringGrid which measures the available width
 * and scales the fontSize down if the rendered text would overflow the container.
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

export function FlickeringGridResponsive({
  text,
  baseFontSize,
  ...props
}: {
  text: string;
  baseFontSize: number;
  [key: string]: any;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [fontSize, setFontSize] = useState<number>(baseFontSize);

  useEffect(() => {
    if (!containerRef.current) return;

    let raf = 0;

    const measure = () => {
      const container = containerRef.current!;
      const containerWidth = container.clientWidth;

      // Create an offscreen canvas to measure text width accurately
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Use same font stack as FlickeringGrid
      const fontWeight = "600";
      ctx.font = `${fontWeight} ${baseFontSize}px "Doto", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      const metrics = ctx.measureText(text);
      const textWidth = metrics.width || 0;

      if (textWidth > containerWidth) {
        // Scale down proportionally with a small margin
        const scale = (containerWidth * 0.9) / textWidth;
        const newSize = Math.max(12, Math.floor(baseFontSize * scale));
        setFontSize(newSize);
      } else {
        setFontSize(baseFontSize);
      }
    };

    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    // Initial measure
    measure();

    window.addEventListener("resize", onResize);

    const ro = new ResizeObserver(onResize);
    ro.observe(containerRef.current as Element);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [text, baseFontSize]);

  return (
    <div ref={containerRef} className="h-full w-full">
      <FlickeringGrid text={text} fontSize={fontSize} {...props} />
    </div>
  );
}


// FlickeringGrid implementation
// Lightweight, imperative canvas rendering with sampling and DPR handling

// Helper function to convert hex to rgba
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : null;
};

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  maxOpacity?: number;
  text?: string;
  fontSize?: number;
  fontWeight?: number | string;
}

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 3,
  gridGap = 3,
  flickerChance = 0.2,
  // Tuned cyberpunk red (darker, less saturated)
  color = "#D33A4A",
  width,
  height,
  className,
  maxOpacity = 0.15,
  text = "",
  fontSize = 140,
  fontWeight = 600,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Detect if device is mobile/tablet to disable animation for performance
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const shouldAnimate = isDesktop;

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      dpr: number,
    ) => {
      ctx.clearRect(0, 0, width, height);
      // Fill a solid black background so the flicker is visible and opaque
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      // Create a separate canvas for the text mask and draw text once
      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = width;
      maskCanvas.height = height;
      const maskCtx = maskCanvas.getContext("2d");
      if (!maskCtx) return;

      if (text) {
        maskCtx.save();
        maskCtx.scale(dpr, dpr);
        maskCtx.fillStyle = "white";
        maskCtx.font = `${fontWeight} ${fontSize}px "Doto", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        maskCtx.textAlign = "center";
        maskCtx.textBaseline = "middle";
        maskCtx.fillText(text, width / (2 * dpr), height / (2 * dpr));
        maskCtx.restore();
      }

      // Read mask pixels once (cheaper than getImageData per-square)
      let maskData: Uint8ClampedArray | null = null;
      try {
        maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height).data;
      } catch (e) {
        // getImageData can throw on some cross-origin/tainted canvases; fallback to no masking
        maskData = null;
      }

      // Convert color to RGB
      const rgb = hexToRgb(color) || { r: 107, g: 114, b: 128 };

      // Draw flickering squares — sample a single pixel at the center of each square from maskData
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * (squareSize + gridGap) * dpr;
          const y = j * (squareSize + gridGap) * dpr;
          const squareWidth = Math.max(1, Math.floor(squareSize * dpr));
          const squareHeight = Math.max(1, Math.floor(squareSize * dpr));

          let hasText = false;
          if (maskData) {
            const sampleX = Math.min(maskCanvas.width - 1, Math.floor(x + squareWidth / 2));
            const sampleY = Math.min(maskCanvas.height - 1, Math.floor(y + squareHeight / 2));
            const idx = (sampleY * maskCanvas.width + sampleX) * 4;
            hasText = maskData[idx] > 0;
          }

          const opacity = squares[i * rows + j];
          const finalOpacity = hasText ? Math.min(1, opacity * 3 + 0.4) : opacity;

          ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${finalOpacity})`;
          ctx.fillRect(x, y, squareWidth, squareHeight);
        }
      }
    },
    [color, squareSize, gridGap, text, fontSize, fontWeight],
  );

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, width: number, height: number) => {
      // Cap DPR to reduce pixel fill cost on very high-density screens
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const cols = Math.ceil(width / (squareSize + gridGap));
      const rows = Math.ceil(height / (squareSize + gridGap));

      const squares = new Float32Array(cols * rows);
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity;
      }

      return { cols, rows, squares, dpr };
    },
    [squareSize, gridGap, maxOpacity],
  );

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) {
          squares[i] = Math.random() * maxOpacity;
        }
      }
    },
    [flickerChance, maxOpacity],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let gridParams: ReturnType<typeof setupCanvas>;

    const scrollRef = { timer: 0 as any };
    let isScrolling = false;

    const onScroll = () => {
      isScrolling = true;
      clearTimeout(scrollRef.timer);
      scrollRef.timer = setTimeout(() => {
        isScrolling = false;
      }, 120);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    const updateCanvasSize = () => {
      const newWidth = width || container.clientWidth;
      const newHeight = height || container.clientHeight;
      setCanvasSize({ width: newWidth, height: newHeight });
      gridParams = setupCanvas(canvas, newWidth, newHeight);

      // CRITICAL: Draw initial frame immediately after setup so canvas is visible on mount
      // This eliminates the pop-in delay when scrolling to footer
      drawGrid(
        ctx,
        canvas.width,
        canvas.height,
        gridParams.cols,
        gridParams.rows,
        gridParams.squares,
        gridParams.dpr,
      );
    };

    updateCanvasSize();

    // Throttle animation to a target FPS to reduce CPU/painter cost during scroll
    const TARGET_FPS = 18;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;
    let lastDraw = performance.now();
    const animate = (time: number) => {
      if (!shouldAnimate) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      // Skip drawing while user is actively scrolling
      if (isScrolling) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      if (time - lastDraw < FRAME_INTERVAL) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = (time - lastDraw) / 1000;
      lastDraw = time;

      updateSquares(gridParams.squares, deltaTime);
      drawGrid(
        ctx,
        canvas.width,
        canvas.height,
        gridParams.cols,
        gridParams.rows,
        gridParams.squares,
        gridParams.dpr,
      );
      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });

    resizeObserver.observe(container);

    // Start animation immediately on mount (removed IntersectionObserver blocking)
    if (shouldAnimate) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      clearTimeout(scrollRef.timer);
    };
  }, [setupCanvas, updateSquares, drawGrid, width, height, shouldAnimate]);

  return (
    <div
      ref={containerRef}
      className={cn(`h-full w-full ${className || ""}`)}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
        }}
      />
    </div>
  );
};

export default FlickeringGrid;
