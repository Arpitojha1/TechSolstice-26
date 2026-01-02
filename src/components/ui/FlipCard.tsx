"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}

export default function FlipCard({ front, back, className }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={cn("group perspective-[1000px] w-full h-full", className)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={cn(
          "relative h-full w-full transition-all duration-700 transform-style-3d cursor-pointer shadow-2xl rounded-2xl",
          isFlipped ? "rotate-y-180" : ""
        )}
      >
        {/* Front Face */}
        <div className="absolute inset-0 backface-hidden">
          {front}
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          {back}
        </div>
      </div>
    </div>
  );
}