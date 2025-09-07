import React from "react";
import { Star, Sparkles } from "lucide-react";

/* 공통: 포지션 뱃지 (카드 아래/모달 설명에 동일 스타일 적용) */
export default function PositionBadge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative inline-flex items-center gap-2 px-3 py-1 rounded-full border shadow-sm
      border-accent/25
      bg-[linear-gradient(135deg,hsla(var(--secondary),.75),hsla(var(--secondary),.55))]
      backdrop-blur-md
      text-secondary-foreground
    "
    >
      <Star className="w-3 h-3 text-accent" />
      <span className="font-mono text-[11px] md:text-xs tracking-wide">
        {children}
      </span>

      {/* 은은한 링/글로우 */}
      <span
        className="pointer-events-none absolute -inset-[2px] rounded-full ring-1 ring-accent/25 opacity-0
        group-hover:opacity-100 transition-opacity"
      />
    </div>
  );
}
