// /components/ShapeSelector.tsx

"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SHAPES } from "@/constants/play/draw";
import type { ShapeType, GameState } from "@/types/play/draw";

interface ShapeSelectorProps {
  selectedShape: ShapeType;
  onShapeChange: (shape: ShapeType) => void;
  gameState: GameState;
}

export function ShapeSelector({
  selectedShape,
  onShapeChange,
  gameState,
}: ShapeSelectorProps) {
  const isDisabled = gameState === "drawing" || gameState === "countdown";
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="relative mb-6 md:mb-8">
      <button
        onClick={() => handleScroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-white/70 dark:bg-gray-800/70 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-800 transition"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex space-x-2 sm:space-x-3 p-2">
          {Object.entries(SHAPES).map(([key, shape]) => (
            <button
              key={key}
              onClick={() => onShapeChange(key as ShapeType)}
              disabled={isDisabled}
              className={`group relative p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 flex flex-col items-center justify-center text-center w-28 sm:w-36 flex-shrink-0 ${
                selectedShape === key
                  ? `bg-gradient-to-br ${shape.gradient} text-white shadow-lg scale-105`
                  : "bg-white/70 dark:bg-gray-800/60 hover:bg-white/90 dark:hover:bg-gray-800/90 text-gray-700 dark:text-gray-200 hover:scale-102 shadow-sm hover:shadow-md"
              } ${isDisabled && "opacity-50 cursor-not-allowed"}`}
            >
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2 group-hover:scale-110 transition-transform">
                {shape.emoji}
              </div>
              <div className="font-bold text-xs sm:text-sm text-gray-800 dark:text-gray-100">
                {shape.name}
              </div>{" "}
              <div className="hidden sm:block text-xs opacity-75 mt-1 truncate">
                {shape.description}
              </div>
              {selectedShape === key && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-2.5 h-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={() => handleScroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-white/70 dark:bg-gray-800/70 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-800 transition"
      >
        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>
    </section>
  );
}
