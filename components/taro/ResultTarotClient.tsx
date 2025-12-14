"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import TarotCard3D from "@/components/taro/TarotCard3D";
import CardDetailModal from "@/components/taro/CardDetailModal";
import { TarotCard } from "@/types/tarot/tarot";
import { useTranslation } from "react-i18next";
import { MobileAdBanner } from "@/components/banner/mobile-ad-banner";
import { InlineAdBanner } from "@/components/banner/inline-ad-banner";
import { AD_SLOTS } from "@/constants/ads";

type CardSpread = "single" | "three" | "five";

export default function ResultTarotClient({
  fetchedCards,
  spreadType,
  locale, // 있어도 되고 없어도 됩니다 (i18next가 이미 언어를 관리한다면 미사용)
}: {
  fetchedCards: TarotCard[];
  spreadType: CardSpread; // ✅ 변경: positions 대신 스프레드 키
  locale: "en" | "ko" | "ja" | "vi";
}) {
  const { t } = useTranslation("common");

  // ✅ positions를 번역에서 가져오기 (배열 반환)
  const positions = useMemo(() => {
    const arr = t(`tarot.spreads.${spreadType}.positions`, {
      returnObjects: true,
    }) as string[] | undefined;

    // 안전장치: 기대 길이와 다르면 심플한 fallback
    const expected =
      spreadType === "single" ? 1 : spreadType === "three" ? 3 : 5;

    if (!arr || arr.length !== expected) {
      return Array.from({ length: expected }, (_, i) => `Pos ${i + 1}`);
    }
    return arr;
  }, [t, spreadType]);

  const [openModal, setOpenModal] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  const activeCard = activeIdx !== null ? fetchedCards[activeIdx] : null;
  const activeLabel = activeIdx !== null ? positions[activeIdx] : undefined;
  const activeCardId = activeCard ? activeCard.id : 0;

  // 데스크탑 여부 체크
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1280);
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const handleOpenCard = (i: number) => {
    setActiveIdx(i);
    setOpenModal(true);
  };

  const handleNextCard = () => {
    if (activeIdx === null) return;
    const next = (activeIdx + 1) % fetchedCards.length;
    setActiveIdx(next);
  };

  if (!fetchedCards || fetchedCards.length === 0) {
    return (
      <div className="tarot min-h-screen flex items-center justify-center">
        <p className="font-mono text-xl text-foreground">
          {t("tarot.typePage.loading")}
        </p>
      </div>
    );
  }

  const gridClass =
    positions.length === 1
      ? "grid-cols-1"
      : positions.length === 3
      ? "grid-cols-1 sm:grid-cols-3"
      : "grid-cols-2 md:grid-cols-3 lg:grid-cols-5";

  const mobileGaps = positions.length >= 3 ? "gap-y-16 gap-x-8" : "gap-10";

  return (
    <div className="tarot flex min-h-screen w-full flex-col items-center justify-between p-4 relative sm:p-6 lg:p-8 overflow-x-clip">
      <div className="w-full flex-grow flex flex-col items-center">
        <div className="text-center my-6">
          <h1 className="font-sans text-3xl font-bold text-foreground md:text-4xl mb-2">
            {t("tarot.typePage.resultTitle")}
          </h1>
          <p className="font-mono text-muted-foreground">
            {t("tarot.typePage.resultDescription")}
          </p>
        </div>

        <div
          className={`grid place-items-center py-6 md:gap-12 ${mobileGaps} ${gridClass}`}
        >
          {fetchedCards.map((card, i) => (
            <TarotCard3D
              key={card.id}
              index={i}
              label={positions[i] ?? `Pos ${i + 1}`} // ✅ 방어적 접근
              onOpen={() => handleOpenCard(i)}
            />
          ))}
        </div>

        <div className="text-center my-10 mt-20">
          <Button
            size="lg"
            className="font-sans font-semibold mystical-glow"
            asChild
          >
            <Link href={`/tarot/`}>
              <Sparkles className="mr-2 h-4 w-4" />
              {t("tarot.typePage.startNewReading")}
            </Link>
          </Button>
        </div>

        {/* 광고: 새 읽기 버튼 아래 */}
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

      {/* 모바일 하단 고정 배너 */}
      <MobileAdBanner
        type="sticky-bottom"
        size="320x50"
        className="xl:hidden"
      />

      <CardDetailModal
        open={openModal}
        onOpenChange={setOpenModal}
        activeCard={activeCard}
        activeLabel={activeLabel}
        activeCardIndex={activeCardId}
        onNext={handleNextCard}
      />
    </div>
  );
}
