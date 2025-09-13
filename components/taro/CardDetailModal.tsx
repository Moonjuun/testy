// components/taro/CardDetailModal.tsx

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import PositionBadge from "@/components/taro/PositionBadge";
import TarotBackFace from "@/components/taro/TarotBackFace";
import TarotFrontFace from "@/components/taro/TarotFrontFace";
import { TarotCard } from "@/types/tarot/tarot";
import { formatBoldText } from "@/utils/formatBoldText";
import { useTranslation } from "react-i18next";
import { Lightbulb, Copy } from "lucide-react";

interface CardDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeCard: TarotCard | null;
  activeLabel?: string;
  activeCardIndex: number;
  onNext: () => void;
}

export default function CardDetailModal({
  open,
  onOpenChange,
  activeCard,
  activeLabel,
  activeCardIndex,
  onNext,
}: CardDetailModalProps) {
  const { t } = useTranslation("common");
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (open) {
      timeoutId = setTimeout(() => setIsFlipped(true), 100);
    } else {
      setIsFlipped(false);
    }
    return () => clearTimeout(timeoutId);
  }, [open]);

  // ★ 훅은 항상 동일한 순서로 호출되도록 early return 이전에 위치
  const keywords = activeCard?.keyword ?? [];
  const displayedKeywords = useMemo(() => {
    if (!keywords || keywords.length === 0) return [];
    const k = [...keywords];
    for (let i = k.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [k[i], k[j]] = [k[j], k[i]];
    }
    return k.slice(0, 4);
  }, [activeCard?.cardKey, keywords]);

  // 이제 early return
  if (!activeCard) return null;

  const hasKeywords = displayedKeywords.length > 0;
  const hasAdvice =
    typeof activeCard.advice === "string" &&
    activeCard.advice.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="tarot flex h-full max-h-[95vh] w-[95vw] max-w-4xl flex-col rounded-2xl border-accent/30 md:h-auto md:min-h-[90vh]">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="font-sans text-2xl md:text-3xl">
            {activeCard.name}
            <span className="text-base font-normal text-muted-foreground">
              ({activeCard.cardKey})
            </span>
          </DialogTitle>
          <DialogDescription className="font-mono">
            {activeLabel}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto md:overflow-visible pr-2 desktop-scrollbar-hide">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[320px_1fr] md:items-start">
            {/* 왼쪽: 카드 */}
            <div
              className="relative mx-auto w-full max-w-[260px] aspect-[2/3] md:mx-0 md:sticky md:top-0 md:max-w-none md:self-start"
              style={{ perspective: "1600px" }}
            >
              <div
                className={`relative h-full w-full rounded-xl [transform-style:preserve-3d] transition-transform duration-700 ${
                  isFlipped ? "is-flipped" : ""
                }`}
              >
                <div
                  className="absolute inset-0 [backface-visibility:hidden]"
                  style={{ transform: "rotateY(0deg)" }}
                >
                  <TarotBackFace index={activeCard.id} />
                </div>
                <div
                  className="absolute inset-0 [backface-visibility:hidden] h-full"
                  style={{ transform: "rotateY(180deg)" }}
                >
                  <TarotFrontFace
                    imageUrl={activeCard.imageUrl || ""}
                    name={activeCard.name}
                  />
                </div>
              </div>
            </div>

            {/* 오른쪽: 콘텐츠 */}
            <div className="flex flex-col gap-4 md:pr-2 desktop-scrollbar-hide md:overflow-y-auto md:max-h-[70vh]">
              <div className="group inline-block">
                <PositionBadge>{activeLabel}</PositionBadge>
              </div>

              {/* 키워드: 최상단 + 4개 랜덤 */}
              {hasKeywords && (
                <section className="mt-1">
                  <h3 className="text-xl font-bold font-sans mb-2">
                    {t("tarot.typePage.keywordsTitle") || "Keywords"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {displayedKeywords.map((kw, idx) => {
                      const colors = [
                        "bg-blue-100 text-blue-800 border-blue-200",
                        "bg-green-100 text-green-800 border-green-200",
                        "bg-yellow-100 text-yellow-800 border-yellow-200",
                        "bg-purple-100 text-purple-800 border-purple-200",
                        "bg-pink-100 text-pink-800 border-pink-200",
                        "bg-red-100 text-red-800 border-red-200",
                        "bg-indigo-100 text-indigo-800 border-indigo-200",
                      ];
                      const colorClass = colors[idx % colors.length]; // 인덱스로 색상 선택
                      return (
                        <span
                          key={`${kw}-${idx}`}
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${colorClass}`}
                          title={kw}
                        >
                          {kw}
                        </span>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* 의미 */}
              <section>
                <h3 className="text-xl font-bold font-sans mb-2">
                  {t("tarot.typePage.meaningTitle")}
                </h3>
                <p className="font-mono leading-relaxed text-muted-foreground">
                  {formatBoldText(activeCard.meaning)}
                </p>
              </section>

              {/* 해설 */}
              <section>
                <h3 className="text-xl font-bold font-sans mb-2">
                  {t("tarot.typePage.descriptionTitle")}
                </h3>
                <p className="font-mono leading-relaxed text-muted-foreground">
                  {formatBoldText(activeCard.description)}
                </p>
              </section>

              <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                {activeCard.name} {t("tarot.typePage.cardIs")}{" "}
                {String(activeLabel).toLowerCase()}
                {t("tarot.typePage.positionExplanation")}
              </p>

              {/* 조언: 항상 맨 하단 */}
              {hasAdvice && (
                <section className="mt-auto">
                  <h3 className="text-xl font-bold font-sans mb-2">
                    {t("tarot.typePage.adviceTitle") || "Advice"}
                  </h3>
                  <div className="relative rounded-xl border bg-card/50 p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-lg p-2 border bg-background">
                        <Lightbulb className="h-4 w-4" aria-hidden />
                      </div>
                      <p className="font-mono leading-relaxed text-muted-foreground">
                        {formatBoldText(activeCard.advice)}
                      </p>
                    </div>
                  </div>
                </section>
              )}

              <div className="mt-6 mr-4 flex flex-shrink-0 justify-end gap-3">
                <DialogClose asChild>
                  <Button
                    className="px-5 py-2 text-base font-bold"
                    variant="default"
                  >
                    {t("common.close")}
                  </Button>
                </DialogClose>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
