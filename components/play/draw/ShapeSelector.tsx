// /components/ShapeSelector.tsx

"use client";

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

  return (
    <section className="mb-6 md:mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
        {Object.entries(SHAPES).map(([key, shape]) => (
          <button
            key={key}
            onClick={() => onShapeChange(key as ShapeType)}
            disabled={isDisabled}
            className={`group relative p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 flex flex-col items-center justify-center text-center ${
              selectedShape === key
                ? `bg-gradient-to-br ${shape.gradient} text-white shadow-lg scale-105`
                : "bg-white/70 hover:bg-white/90 text-gray-700 hover:scale-102 shadow-sm hover:shadow-md"
            } ${isDisabled && "opacity-50 cursor-not-allowed"}`}
          >
            <div className="text-2xl sm:text-3xl mb-1 sm:mb-2 group-hover:scale-110 transition-transform">
              {shape.emoji}
            </div>
            <div className="font-bold text-xs sm:text-sm">{shape.name}</div>
            <div className="hidden sm:block text-xs opacity-75 mt-1">
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
    </section>
  );
}
