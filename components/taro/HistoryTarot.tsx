import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { categories, subcategories } from "@/constants/tarot/TarotConstants";
import { Star, ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Syringe as Ring, Sparkles, BookOpen, Share2 } from "lucide-react";
export default function HistoryTarot() {
  const router = useRouter();
  const handleBack = () => router.back();

  return (
    <>
      {/* <div className="mb-8">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          돌아가기
        </Button>
      </div>

      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/30 mb-6">
          <BookOpen className="w-4 h-4 text-accent" />
          <span className="font-mono text-sm text-accent">나의 여정</span>
        </div>
        <h1 className="font-sans text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
          나의 리딩 기록
        </h1>
        <p className="font-mono text-lg text-muted-foreground text-pretty">
          지금까지의 타로 여정을 되돌아보세요.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {readingHistory.map((reading) => (
          <Card
            key={reading.id}
            className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-accent/50 ${
              favoriteReadings.has(reading.id)
                ? "ring-1 ring-accent/30 border-accent/50"
                : ""
            }`}
            onClick={() => viewReadingDetails(reading)}
          >
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-shrink-0">
                  <div className="flex gap-2">
                    {reading.cards.slice(0, 3).map((cardIndex, index) => {
                      const card =
                        fullTarotDeck[cardIndex % fullTarotDeck.length];
                      return (
                        <div key={index} className="w-12 h-18 relative">
                          <img
                            src={"/placeholder.svg"}
                            alt={card.koreanName}
                            className="w-full h-full object-cover rounded border border-accent/30"
                          />
                        </div>
                      );
                    })}
                    {reading.cards.length > 3 && (
                      <div className="w-12 h-18 bg-muted rounded border border-accent/30 flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">
                          +{reading.cards.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-sans font-semibold text-card-foreground">
                          {reading.insight}
                        </span>
                        {favoriteReadings.has(reading.id) && (
                          <Star className="w-4 h-4 text-accent fill-accent" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <span className="font-mono">{reading.date}</span>
                        <span>•</span>
                        <span className="font-mono">{reading.category}</span>
                        <span>•</span>
                        <span className="font-mono">
                          {reading.spread === "single"
                            ? "1장"
                            : reading.spread === "three"
                            ? "3장"
                            : "5장"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(reading.id);
                        }}
                        className="p-2"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            favoriteReadings.has(reading.id)
                              ? "text-accent fill-accent"
                              : "text-muted-foreground"
                          }`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="p-2"
                      >
                        <Share2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>

                  <p className="font-mono text-sm text-muted-foreground mb-3 leading-relaxed">
                    {reading.summary}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {reading.emotions.map((emotion) => (
                      <span
                        key={emotion}
                        className={`px-2 py-1 rounded-full text-xs font-mono border ${
                          emotionColors[emotion as EmotionType]
                        }`}
                      >
                        {emotion}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {readingHistory.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="font-sans text-xl font-semibold text-muted-foreground mb-2">
            아직 리딩 기록이 없습니다
          </h3>
          <p className="font-mono text-muted-foreground mb-6">
            첫 번째 타로 리딩을 시작해보세요.
          </p>
          <Button
            onClick={startNewReading}
            className="font-sans font-semibold mystical-glow"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            새로운 리딩 시작하기
          </Button>
        </div>
      )}

      <div className="text-center">
        <Button
          onClick={startNewReading}
          size="lg"
          className="font-sans font-semibold mystical-glow"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          새로운 리딩 시작하기
        </Button>
      </div> */}
    </>
  );
}
