"use client";

import React from "react";
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
import { fullTarotDeck } from "@/constants/tarot/TarotConstants";

// TarotCard 타입을 정의하여 props를 명확하게 합니다.
type TarotCard = (typeof fullTarotDeck)[0];

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
  // activeCard가 없으면 모달을 렌더링하지 않습니다.
  if (!activeCard) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="tarot flex h-full max-h-[90vh] w-[95vw] max-w-4xl flex-col rounded-2xl border-accent/30 md:h-auto md:max-h-[82vh]">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="font-sans text-2xl md:text-3xl">
              {activeCard.koreanName}{" "}
              <span className="text-base font-normal text-muted-foreground">
                ({activeCard.name})
              </span>
            </DialogTitle>
            <DialogDescription className="font-mono">
              {activeLabel}의 메시지
            </DialogDescription>
          </DialogHeader>

          {/* ✅ 데스크탑에서 스크롤바 숨기는 클래스 추가 */}
          <div className="flex-grow overflow-y-auto pr-2 desktop-scrollbar-hide">
            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start">
              {/* 3D 플립 컨테이너 */}
              <div
                className="relative mx-auto w-full max-w-[260px] aspect-[2/3] md:sticky md:top-0 md:max-w-none"
                style={{ perspective: "1600px" }}
              >
                <div className="relative h-full w-full rounded-xl [transform-style:preserve-3d] animate-[flipIn_700ms_ease-out_forwards]">
                  {/* 앞면 */}
                  <div
                    className="absolute inset-0 [backface-visibility:hidden]"
                    style={{ transform: "rotateY(0deg)" }}
                  >
                    <TarotFrontFace
                      title={activeCard.koreanName ?? ""}
                      subtitle={activeCard.name}
                      meaning={activeCard.meaning}
                    />
                  </div>
                  {/* 뒷면 */}
                  <div
                    className="absolute inset-0 [backface-visibility:hidden]"
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    <TarotBackFace index={activeCardIndex} />
                  </div>
                </div>
              </div>

              {/* 설명 */}
              <div className="flex flex-col gap-4">
                <div className="group inline-block">
                  <PositionBadge>{activeLabel}</PositionBadge>
                </div>
                <p className="font-mono leading-relaxed text-muted-foreground">
                  {activeCard.description}
                </p>
                <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                  이 카드는 {String(activeLabel).toLowerCase()}에서 중요한
                  메시지를 전달합니다. 현재 상황을 긍정적으로 받아들이고 내면의
                  지혜를 믿어보세요.
                </p>
                <div className="mt-4 flex flex-shrink-0 gap-3">
                  <DialogClose asChild>
                    <Button variant="outline">닫기</Button>
                  </DialogClose>
                  <Button
                    onClick={onNext}
                    className="font-sans font-semibold mystical-glow"
                  >
                    다음 카드
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @keyframes flipIn {
          from {
            transform: rotateY(-180deg);
          }
          to {
            transform: rotateY(0deg);
          }
        }

        /* ✅ 데스크탑 화면(768px 이상)에서 스크롤바를 숨기는 CSS 추가 */
        @media (min-width: 768px) {
          .desktop-scrollbar-hide {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
          }
          .desktop-scrollbar-hide::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }
        }
      `}</style>
    </>
  );
}
