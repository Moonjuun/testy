// components/taro/CardDetailModal.tsx

"use client";

import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (open) {
      timeoutId = setTimeout(() => {
        setIsFlipped(true);
      }, 100);
    } else {
      setIsFlipped(false);
    }
    return () => clearTimeout(timeoutId);
  }, [open]);

  if (!activeCard) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="tarot flex h-full max-h-[90vh] w-[95vw] max-w-4xl flex-col rounded-2xl border-accent/30 md:h-auto md:min-h-[85vh]">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="font-sans text-2xl md:text-3xl">
            {activeCard.name}
            <span className="text-base font-normal text-muted-foreground">
              ({activeCard.cardKey})
            </span>
          </DialogTitle>
          <DialogDescription className="font-mono">
            {activeLabel}
            {/* {t("tarot.typePage.message")} */}
          </DialogDescription>
        </DialogHeader>

        {/* 모바일: 이 래퍼가 스크롤 역할 / 데스크탑: overflow 해제 */}
        <div className="flex-grow overflow-y-auto md:overflow-visible pr-2 desktop-scrollbar-hide">
          {/* 데스크탑 2열 레이아웃, 모바일 1열 */}
          <div className=" grid grid-cols-1 gap-6 md:grid-cols-[320px_1fr] md:items-start">
            {/* 왼쪽: 카드 (데스크탑에서만 sticky) */}
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

            {/* 오른쪽: 설명 (데스크탑에서만 내부 스크롤) */}
            <div className="flex flex-col gap-4 md:pr-2 desktop-scrollbar-hide md:overflow-y-auto md:max-h-[70vh]">
              <div className="group inline-block">
                <PositionBadge>{activeLabel}</PositionBadge>
              </div>

              {/* 1. 의미 */}
              <div>
                <h3 className="text-xl font-bold font-sans mb-2">
                  {t("tarot.typePage.meaningTitle")}
                </h3>
                <p className="font-mono leading-relaxed text-muted-foreground">
                  {formatBoldText(activeCard.meaning)}
                </p>
              </div>

              {/* 2. 해설 */}
              <div>
                <h3 className="text-xl font-bold font-sans mb-2">
                  {t("tarot.typePage.descriptionTitle")}
                </h3>
                <p className="font-mono leading-relaxed text-muted-foreground">
                  {formatBoldText(activeCard.description)}
                </p>
              </div>

              <p className="font-mono text-sm leading-relaxed text-muted-foreground">
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
