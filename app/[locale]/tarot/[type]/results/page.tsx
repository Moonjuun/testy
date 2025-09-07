// app/[locale]/tarot/[type]/results/page.tsx

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { fullTarotDeck } from "@/constants/tarot/TarotConstants";
import TarotCard3D from "@/components/taro/TarotCard3D";
import CardDetailModal from "@/components/taro/CardDetailModal"; // 모달 컴포넌트 import

type CardSpread = "single" | "three" | "five";

const spreadPositions: Record<CardSpread, string[]> = {
  single: ["현재 상황"],
  three: ["과거/원인", "현재 상황", "미래/결과"],
  five: ["과거", "현재", "미래", "조언", "결과"],
};

export default function ResultTarotPage({
  drawnCards,
  selectedSpread,
}: {
  drawnCards: number[];
  selectedSpread: CardSpread;
}) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const positions = spreadPositions[selectedSpread];

  const handleOpenCard = (i: number) => {
    setActiveIdx(i);
    setOpenModal(true);
  };

  const handleNextCard = () => {
    if (activeIdx === null) return;
    const next = (activeIdx + 1) % drawnCards.length;
    setActiveIdx(next);
  };

  const activeCard =
    activeIdx !== null ? fullTarotDeck[drawnCards[activeIdx]] : null;
  const activeLabel = activeIdx !== null ? positions[activeIdx] : undefined;
  const activeCardIndex = activeIdx !== null ? drawnCards[activeIdx] : 0;

  // 반응형 격자
  const gridCols =
    selectedSpread === "single"
      ? "grid-cols-1"
      : selectedSpread === "three"
      ? "grid-cols-1 sm:grid-cols-3"
      : "grid-cols-2 md:grid-cols-3 lg:grid-cols-5";

  return (
    <div className="tarot flex min-h-screen w-full flex-col items-center justify-between p-4 relative sm:p-6 lg:p-8 overflow-x-clip">
      <div className="w-full flex-grow flex flex-col items-center">
        <div className="text-center my-6">
          <h1 className="font-sans text-3xl font-bold text-foreground md:text-4xl mb-2">
            선택한 카드
          </h1>
          <p className="font-mono text-muted-foreground">
            카드를 눌러 해석을 확인하세요.
          </p>
        </div>

        {/* 카드 격자 */}
        <div
          className={`grid gap-10 place-items-center py-6 md:gap-12 ${gridCols}`}
        >
          {drawnCards.map((cardIndex, i) => (
            <TarotCard3D
              key={`${cardIndex}-${i}`}
              index={cardIndex}
              label={positions[i]}
              onOpen={() => handleOpenCard(i)}
            />
          ))}
        </div>
      </div>

      {/* 분리된 모달 컴포넌트 렌더링 */}
      <CardDetailModal
        open={openModal}
        onOpenChange={setOpenModal}
        activeCard={activeCard}
        activeLabel={activeLabel}
        activeCardIndex={activeCardIndex}
        onNext={handleNextCard}
      />

      {/* 하단 CTA */}
      <div className="text-center my-10">
        <Button
          onClick={() => router.push(`/tarot/`)}
          size="lg"
          className="font-sans font-semibold mystical-glow"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          새로운 리딩 시작하기
        </Button>
      </div>
    </div>
  );
}
