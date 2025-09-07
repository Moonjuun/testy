import React from "react";
import { Star, Sparkles } from "lucide-react";

/* 선택 페이지 ‘뒷면’ 디자인 재현 */
export default function TarotBackFace({ index }: { index: number }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-secondary/80 to-secondary rounded-xl relative overflow-hidden border-2 border-accent/30">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
      <div className="text-center relative z-10">
        <div className="w-8 h-8 border border-accent/50 rounded-full mx-auto flex items-center justify-center mb-1">
          <Star className="w-4 h-4 text-accent" />
        </div>
        <div className="text-[10px] font-mono text-accent/70">{index + 1}</div>
      </div>
      <div className="absolute top-1 right-1 w-1 h-1 bg-accent/30 rounded-full" />
      <div className="absolute bottom-1 left-1 w-1 h-1 bg-accent/40 rounded-full" />
      <div className="absolute top-2 left-1/2 w-1 h-1 bg-accent/35 rounded-full" />
    </div>
  );
}
