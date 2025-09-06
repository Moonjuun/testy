"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { categories, subcategories } from "@/constants/tarot/TarotConstants";
import { Star, ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function TarotTypePage() {
  const router = useRouter();
  const params = useParams<{ locale: string; type: string }>();
  const type = params?.type;

  const [situationText, setSituationText] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );

  const currentCategory = categories.find((c) => c.id === type);

  const handleBack = () => router.back();

  const handleProceedToCards = () => {
    if (!type || !selectedSubcategory) return;
    const locale = params?.locale || "ko";
    router.push(`/${locale}/tarot/${type}/choose`);
  };

  if (!type || !currentCategory) {
    return (
      <div className="max-w-2xl mx-auto w-full">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          돌아가기
        </Button>
        <p className="text-sm text-muted-foreground mt-4">
          유효하지 않은 타입입니다. 올바른 링크로 다시 시도해주세요.
        </p>
      </div>
    );
  }

  const IconComponent = currentCategory.icon;
  const subs = subcategories[type as keyof typeof subcategories] ?? [];

  return (
    <div className="tarot">
      {/* 전체 콘텐츠를 감싸는 컨테이너 추가 */}
      <div className="w-full max-w-2xl mx-auto">
        <div className="mt-4">
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            돌아가기
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="font-sans text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            구체적으로 어디가 궁금한가요?
          </h1>
          <p className="font-mono text-lg text-muted-foreground text-pretty">
            선택한 주제를 좁혀보면, 카드 해석이 더 선명해집니다.
          </p>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-accent/30">
            <IconComponent className="w-4 h-4 text-accent" />
            <span className="font-mono text-sm text-card-foreground">
              {currentCategory.name}
            </span>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          {subs.map((sub) => (
            <Card
              key={sub.id}
              className={`cursor-pointer transition-all duration-300 ${
                selectedSubcategory === sub.id
                  ? "ring-2 ring-accent mystical-glow border-accent"
                  : "hover:border-accent/50"
              }`}
              onClick={() => setSelectedSubcategory(sub.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h3 className="font-sans font-semibold text-card-foreground mb-1">
                      {sub.name}
                    </h3>
                    <p className="font-mono text-sm text-muted-foreground">
                      {sub.description}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-accent opacity-50" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-sans font-semibold text-card-foreground mb-4">
                현재 상황을 간단히 적어주세요 (선택사항)
              </h3>
              <Textarea
                placeholder="한두 문장으로 지금 상황을 적어주세요."
                value={situationText}
                onChange={(e) => setSituationText(e.target.value)}
                className="min-h-[100px] bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </CardContent>
          </Card>
        </div>

        <div className="text-center mb-8">
          <Button
            size="lg"
            onClick={handleProceedToCards}
            disabled={!selectedSubcategory}
            className="font-sans font-semibold mystical-glow"
          >
            카드 뽑기 시작하기
          </Button>
        </div>
      </div>
    </div>
  );
}
