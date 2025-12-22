"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export const Component: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div className={cn("flex flex-col items-center gap-4 p-4 rounded-lg")}>
      <h1 className="text-2xl font-bold mb-2">Component Example</h1>
      <h2 className="text-xl font-semibold">{count}</h2>
      <div className="flex gap-2">
        <button
          className="rounded bg-gray-800 px-3 py-1 text-white"
          onClick={() => setCount((prev) => prev - 1)}
        >
          -
        </button>
        <button
          className="rounded bg-gray-800 px-3 py-1 text-white"
          onClick={() => setCount((prev) => prev + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Component;
