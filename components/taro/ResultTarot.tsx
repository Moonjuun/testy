"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import { Star, ArrowLeft, Sparkles } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { fullTarotDeck } from "@/constants/tarot/TarotConstants";
import { Card, CardContent } from "@/components/ui/card";

type CardSpread = "single" | "three" | "five";

const spreadPositions = {
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
  const params = useParams<{ locale: string; type: string }>();

  const startNewReading = () => {
    router.push(`/tarot/`);
  };

  return (
    <>
      <div className="space-y-6 mb-12">
        {drawnCards.map((cardIndex, position) => {
          const card = fullTarotDeck[cardIndex];
          const positionName = spreadPositions[selectedSpread][position];
          return (
            <Card key={position} className="overflow-hidden mystical-glow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-36 md:w-32 md:h-48 mx-auto md:mx-0">
                      <div className="w-full h-full bg-gradient-to-b from-accent/20 to-accent/5 rounded-lg border-2 border-accent/30 flex items-center justify-center">
                        <div className="text-center text-accent">
                          <Star className="w-8 h-8 mx-auto mb-2" />
                          <div className="font-sans text-sm font-semibold">
                            {card.koreanName}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="mb-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-full mb-3">
                        <Star className="w-3 h-3 text-accent" />
                        <span className="font-mono text-xs text-secondary-foreground">
                          {positionName}
                        </span>
                      </div>
                      <h3 className="font-sans text-xl font-bold text-card-foreground mb-1">
                        {card.koreanName} ({card.name})
                      </h3>
                      <p className="font-mono text-sm text-accent font-semibold">
                        {card.meaning}
                      </p>
                    </div>
                    <p className="font-mono text-muted-foreground leading-relaxed">
                      {card.description}
                    </p>
                    <p className="font-mono text-sm text-muted-foreground mt-3 leading-relaxed">
                      이 카드는 {positionName.toLowerCase()}에서 중요한 메시지를
                      전달합니다. 현재 상황을 긍정적으로 받아들이고 내면의
                      지혜를 믿어보세요.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* <div className="text-center mb-8">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={saveCurrentReading}
                  className="font-sans font-semibold bg-transparent"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  리딩 기록에 저장하기
                </Button>
              </div> */}

      <div className="text-center">
        <Button
          onClick={startNewReading}
          size="lg"
          className="font-sans font-semibold mystical-glow"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          새로운 리딩 시작하기
        </Button>
      </div>
    </>
  );
}
