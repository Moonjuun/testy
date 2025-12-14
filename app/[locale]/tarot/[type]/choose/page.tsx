"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Star, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { DragHint } from "@/components/taro/DragHint";
import { useTranslation } from "react-i18next";
import { MobileAdBanner } from "@/components/banner/mobile-ad-banner";
import { InlineAdBanner } from "@/components/banner/inline-ad-banner";
import { AD_SLOTS } from "@/constants/ads";

// 78장 전체 덱
const fullTarotDeck = Array.from({ length: 78 }, (_, i) => ({
  id: i,
  name: `Card ${i + 1}`,
}));

// 카드 셔플 함수
function shuffle(array: any[]) {
  const newArray = [...array];
  let currentIndex = newArray.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex],
      newArray[currentIndex],
    ];
  }
  return newArray;
}

type CardSpread = "single" | "three" | "five";

export default function TarotChoosePage() {
  const router = useRouter();
  const { t } = useTranslation("common");

  const [params, setParams] = useState<{ type: string | null }>({ type: null });
  const [radius, setRadius] = useState(450);
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const shuffledDeck = useMemo(() => shuffle(fullTarotDeck), []);

  useEffect(() => {
    setHasMounted(true);

    try {
      const pathSegments = window.location.pathname.split("/"); // /ko/tarot/{type}/choose
      const typeIndex = pathSegments.indexOf("tarot") + 1;
      if (typeIndex > 0 && typeIndex < pathSegments.length) {
        const type = pathSegments[typeIndex];
        if (type !== "choose") setParams({ type });
      }
    } catch (error) {
      console.error("Could not parse URL for params:", error);
    }

    const updateLayout = () => {
      const w = window.innerWidth;
      const mobile = w < 768;
      setIsMobile(mobile);
      if (mobile) {
        setRadius(350);
      } else {
        setRadius(Math.min(w * 0.4, 450));
      }
    };

    window.addEventListener("resize", updateLayout);
    updateLayout();
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  // 데스크탑 여부 체크
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1280);
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const handleBack = () => {
    window.history.back();
  };

  const [selectedSpread, setSelectedSpread] = useState<CardSpread>("three");
  const [drawnCards, setDrawnCards] = useState<number[]>([]);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const handleSpreadSelect = (spread: CardSpread) => {
    setSelectedSpread(spread);
    setDrawnCards([]);
    setFlippedCards(new Set());
  };

  const handleCardClick = (cardIndex: number) => {
    const cardId = shuffledDeck[cardIndex].id;
    if (drawnCards.includes(cardId)) return;

    const maxCards =
      selectedSpread === "single" ? 1 : selectedSpread === "three" ? 3 : 5;

    if (drawnCards.length >= maxCards) return;

    const newDrawnCards = [...drawnCards, cardId];
    setDrawnCards(newDrawnCards);

    setTimeout(() => {
      setFlippedCards((prev) => new Set([...prev, cardId]));
    }, 300);
  };

  const getCardCount = () => {
    switch (selectedSpread) {
      case "single":
        return 1;
      case "three":
        return 3;
      case "five":
        return 5;
    }
  };

  const canProceedToResults = () => drawnCards.length === getCardCount();

  const handleProceedToResults = () => {
    const qs = new URLSearchParams({
      cards: drawnCards.join(","),
      spread: selectedSpread,
    });
    router.push(`./results?${qs.toString()}`);
  };

  const layout = useMemo(() => {
    const totalCards = shuffledDeck.length;
    const fanAngle = Math.PI * 0.7;
    const startAngle = -fanAngle / 2;

    const points = Array.from({ length: totalCards }, (_, index) => {
      const angle = startAngle + (index / (totalCards - 1)) * fanAngle;
      const x = Math.sin(angle) * radius;
      const y = -Math.cos(angle) * radius;
      const cardRotation = angle * (180 / Math.PI);
      return { x, y, cardRotation };
    });

    const xs = points.map((p) => p.x);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);

    const leftPadding = 16;
    const leftShift = -minX + leftPadding;
    const totalWidth = Math.ceil(maxX - minX + leftPadding * 2);

    return { points, leftShift, totalWidth };
  }, [radius, shuffledDeck]);

  if (!hasMounted) return null;

  return (
    <div className="tarot min-h-screen flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
      <div className="flex-shrink-0">
        <div className="mt-4">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("tarot.typePage.back")}
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="font-sans text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            {t("tarot.typePage.chooseTitle")}
          </h1>
          <p className="font-mono text-lg text-muted-foreground text-pretty">
            {t("tarot.typePage.chooseSubtitle")}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6">
          <Button
            variant={selectedSpread === "single" ? "default" : "outline"}
            onClick={() => handleSpreadSelect("single")}
            className="font-sans"
          >
            {t("tarot.typePage.choose1Card")}
          </Button>
          <Button
            variant={selectedSpread === "three" ? "default" : "outline"}
            onClick={() => handleSpreadSelect("three")}
            className="font-sans"
          >
            {t("tarot.typePage.choose3Cards")}
          </Button>
          <Button
            variant={selectedSpread === "five" ? "default" : "outline"}
            onClick={() => handleSpreadSelect("five")}
            className="font-sans"
          >
            {t("tarot.typePage.choose5Cards")}
          </Button>
        </div>
      </div>

      <div className="flex-shrink-0 text-center mt-4">
        <div className="mb-6">
          <p className="font-mono text-muted-foreground mb-2">
            {drawnCards.length} / {getCardCount()}{" "}
            {t("tarot.typePage.selected")}
          </p>
          <div className="w-full max-w-xs mx-auto bg-muted rounded-full h-2">
            <div
              className="bg-accent h-2 rounded-full transition-all duration-500"
              style={{
                width: `${(drawnCards.length / getCardCount()) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div
        className={[
          "relative flex-grow my-4 overflow-y-hidden md:overflow-visible",
          isMobile
            ? "flex items-center justify-start overflow-x-auto scrollbar-hide snap-x snap-mandatory [-webkit-overflow-scrolling:touch]"
            : "flex items-center justify-center overflow-x-hidden",
        ].join(" ")}
      >
        {isMobile && <DragHint />}
        <div
          className="relative h-full flex items-center justify-center w-full flex-shrink-0 md:min-w-0"
          style={
            isMobile
              ? { minWidth: `${layout.totalWidth}px` }
              : { minWidth: "900px" }
          }
        >
          <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/20 to-secondary/40" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

          <div className="relative w-full max-w-6xl">
            <div className="relative w-full h-[400px] sm:h-[500px] md:h-[500px]">
              {shuffledDeck.map((card, index) => {
                const isDrawn = drawnCards.includes(card.id);
                const isFlipped = flippedCards.has(card.id);
                const isHovered = hoveredCard === index;

                const { x, y, cardRotation } = layout.points[index];

                const leftStyle = isMobile
                  ? `${x + layout.leftShift}px`
                  : `calc(50% + ${x}px)`;
                const baseTransform = isMobile
                  ? `translateY(-50%) rotate(${cardRotation}deg)`
                  : `translate(-50%, -50%) rotate(${cardRotation}deg)`;
                const hoverScale = isHovered
                  ? "translateY(-12px) scale(1.15)"
                  : isDrawn
                  ? "translateY(-8px) scale(1.2)"
                  : "scale(1)";

                return (
                  <div
                    key={card.id}
                    className={`absolute cursor-pointer transition-all duration-300 ${
                      isDrawn ? "z-30" : isHovered ? "z-20" : "z-10"
                    } ${isMobile ? "snap-start" : ""}`}
                    style={{
                      left: leftStyle,
                      top: `calc(105% + ${y}px)`,
                      transform: `${baseTransform} ${hoverScale}`,
                      transformOrigin: "center center",
                    }}
                    onClick={() => handleCardClick(index)}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div
                      className={`w-12 h-[72px] md:w-16 md:h-24 rounded-lg border-2 transition-all duration-500 ${
                        isFlipped ? "card-flip" : ""
                      } ${
                        isDrawn
                          ? "border-accent mystical-glow bg-gradient-to-b from-accent/30 to-accent/10"
                          : isHovered
                          ? "border-accent/80 bg-gradient-to-b from-accent/20 to-accent/5"
                          : "border-accent/30 bg-gradient-to-b from-card to-card/50 hover:border-accent/60"
                      }`}
                      style={{
                        boxShadow: isDrawn
                          ? "0 8px 25px rgba(0,0,0,0.3), 0 0 20px rgba(212, 175, 55, 0.4)"
                          : isHovered
                          ? "0 6px 20px rgba(0,0,0,0.25), 0 0 15px rgba(212, 175, 55, 0.2)"
                          : "0 4px 12px rgba(0,0,0,0.2)",
                      }}
                    >
                      {!isFlipped ? (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-secondary/80 to-secondary rounded-lg relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
                          <div className="text-center relative z-10">
                            <div className="w-4 h-4 md:w-6 md:h-6 border border-accent/50 rounded-full mx-auto flex items-center justify-center mb-1">
                              <Star className="w-2 h-2 md:w-3 md:h-3 text-accent" />
                            </div>
                          </div>
                          <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-accent/30 rounded-full" />
                          <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-accent/40 rounded-full" />
                          <div className="absolute top-2 left-1/2 w-0.5 h-0.5 bg-accent/35 rounded-full" />
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-accent/15 to-accent/5 rounded-lg p-1">
                          <div className="text-accent text-center">
                            <Star className="w-3 h-3 md:w-4 md:h-4 mx-auto mb-1" />
                            <div className="font-sans text-[6px] md:text-[8px] font-semibold leading-tight">
                              {t("tarot.typePage.selected")}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {canProceedToResults() && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 animate-fade-in">
                  <Button
                    size="lg"
                    className="font-sans font-semibold mystical-glow"
                    onClick={handleProceedToResults}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {t("tarot.typePage.viewInterpretation")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 광고: 카드 선택 영역 아래 (결과 버튼이 나타난 후) */}
      {canProceedToResults() && (
        <div className="flex-shrink-0 w-full">
          {/* 데스크탑: 336x280 사각형 */}
          {isDesktop && (
            <InlineAdBanner
              size="336x280"
              slot={AD_SLOTS.DESKTOP_336x280}
              className=""
            />
          )}
          {/* 모바일: 300x250 사각형 */}
          <MobileAdBanner type="inline" size="300x250" className="xl:hidden" />
        </div>
      )}

      {/* 모바일 하단 고정 배너 */}
      <MobileAdBanner
        type="sticky-bottom"
        size="320x50"
        className="xl:hidden"
      />
    </div>
  );
}
