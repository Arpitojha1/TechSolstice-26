
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

type FlipCardProps = {
  front: React.ReactNode;
  back: React.ReactNode;
};

export function FlipCard({ front, back }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-64 h-96 perspective-[1000px]">
        <div
          className={`relative h-full w-full transition-transform duration-700 ease-in-out transform-3d ${
            isFlipped ? "transform-[rotateY(180deg)]" : ""
          }`}
        >
          <div
            className="absolute inset-0 backface-hidden"
          >
            {front}
            <Button onClick={() => setIsFlipped(true)} size="lg" className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold">Registration</Button>
          </div>

          <div
            className="absolute inset-0 backface-hidden transform-[rotateY(180deg)]"
          >
            {back}
            <button onClick={() => setIsFlipped(false)}>Flip to Front</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default FlipCard;