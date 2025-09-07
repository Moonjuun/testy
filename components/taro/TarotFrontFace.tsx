import React from "react";
import { Star, Sparkles } from "lucide-react";

/* 모달 앞면(카드 정보) */
export default function TarotFrontFace({
  title,
  subtitle,
  meaning,
  description,
}: {
  title: string;
  subtitle?: string;
  meaning?: string;
  description?: string;
}) {
  return (
    <div className="w-full h-full rounded-xl border-2 border-accent/40 bg-gradient-to-b from-accent/15 to-accent/5 p-4 md:p-6 text-accent">
      <div className="text-center">
        <Star className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-3" />
        <div className="font-sans text-lg md:text-2xl font-bold leading-tight">
          {title}
        </div>
        {subtitle && (
          <div className="font-mono text-xs md:text-sm text-accent/80 mt-1">
            {subtitle}
          </div>
        )}
        {meaning && (
          <div className="font-mono text-sm md:text-base text-accent mt-3">
            {meaning}
          </div>
        )}
      </div>
      {description && (
        <p className="font-mono text-sm md:text-base text-card-foreground/80 mt-5 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
