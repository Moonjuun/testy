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
import { Lightbulb, Copy, Tags, BookOpen, FileText } from "lucide-react"; // ✅ 아이콘 추가

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
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (open && activeCard?.imageUrl) {
      // 모달이 열릴 때 이미지 로드 상태 초기화 및 이미지 preload
      setImageLoaded(false);
      setIsFlipped(false);

      // 이미지 preload
      const img = new window.Image();
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageLoaded(true); // 에러가 나도 플립은 진행
      img.src = activeCard.imageUrl;
    } else {
      setIsFlipped(false);
      setImageLoaded(false);
    }
  }, [open, activeCard?.imageUrl]);

  // 이미지가 로드되면 카드 뒤집기
  useEffect(() => {
    if (open && imageLoaded) {
      // 이미지가 로드된 후 약간의 딜레이를 두고 플립 시작
      const timeoutId = setTimeout(() => setIsFlipped(true), 50);
      return () => clearTimeout(timeoutId);
    }
  }, [open, imageLoaded]);

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
                    onImageLoad={() => setImageLoaded(true)}
                  />
                </div>
              </div>
            </div>

            {/* 오른쪽: 콘텐츠 */}
            <div className="flex flex-col gap-6 md:pr-2 desktop-scrollbar-hide md:overflow-y-auto md:max-h-[70vh]">
              <div className="group inline-block">
                <PositionBadge>{activeLabel}</PositionBadge>
              </div>

              {/* 키워드 */}
              {hasKeywords && (
                <section>
                  <h3 className="flex items-center gap-2 text-xl font-bold font-sans mb-3 text-purple-800 dark:text-purple-300">
                    <Tags className="w-5 h-5" />
                    <span>
                      {t("tarot.typePage.keywordsTitle") || "Keywords"}
                    </span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {displayedKeywords.map((kw, idx) => {
                      const colors = [
                        "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-800",
                        "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-200 dark:border-green-800",
                        "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-200 dark:border-yellow-800",
                        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/50 dark:text-purple-200 dark:border-purple-800",
                        "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/50 dark:text-pink-200 dark:border-pink-800",
                      ];
                      const colorClass = colors[idx % colors.length];
                      return (
                        <span
                          key={`${kw}-${idx}`}
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors border ${colorClass}`}
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
                <h3 className="flex items-center gap-2 text-xl font-bold font-sans mb-3 text-blue-800 dark:text-blue-300">
                  <BookOpen className="w-5 h-5" />
                  <span>{t("tarot.typePage.meaningTitle")}</span>
                </h3>
                <p className="font-mono leading-relaxed text-muted-foreground">
                  {formatBoldText(activeCard.meaning)}
                </p>
              </section>

              {/* 해설 */}
              <section>
                <h3 className="flex items-center gap-2 text-xl font-bold font-sans mb-3 text-green-800 dark:text-green-300">
                  <FileText className="w-5 h-5" />
                  <span>{t("tarot.typePage.descriptionTitle")}</span>
                </h3>
                <p className="font-mono leading-relaxed text-muted-foreground">
                  {formatBoldText(activeCard.description)}
                </p>
              </section>

              {/* 조언 */}
              {hasAdvice && (
                <section className="mt-auto">
                  <h3 className="flex items-center gap-2 text-xl font-bold font-sans mb-3 text-amber-800 dark:text-amber-300">
                    <Lightbulb className="w-5 h-5" />
                    <span>{t("tarot.typePage.adviceTitle") || "Advice"}</span>
                  </h3>
                  <div className="relative rounded-xl border border-amber-200/50 dark:border-amber-900/50 bg-gradient-to-tr from-amber-50/50 to-background dark:from-amber-950/20 dark:to-background p-4 shadow-sm">
                    <p className="font-mono leading-relaxed text-muted-foreground">
                      {formatBoldText(activeCard.advice)}
                    </p>
                  </div>
                </section>
              )}

              <p className="font-mono text-sm leading-relaxed text-muted-foreground border-l-2 border-slate-300 dark:border-slate-700 pl-3">
                {activeCard.name} {t("tarot.typePage.cardIs")}{" "}
                {String(activeLabel).toLowerCase()}
                {t("tarot.typePage.positionExplanation")}
              </p>

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
