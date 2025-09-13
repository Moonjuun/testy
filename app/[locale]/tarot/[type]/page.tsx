// app/[locale]/tarot/[type]/choose/page.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { categories, subcategories } from "@/constants/tarot/TarotConstants";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function TarotTypePage() {
  const router = useRouter();
  const params = useParams<{ locale: string; type: string }>();
  const type = params?.type as string | undefined;
  const { t } = useTranslation("common");

  const [situationText, setSituationText] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );

  const currentCategory = categories.find((c) => c.id === type);

  const handleBack = () => router.push(`/${params?.locale}/tarot/`);

  const handleProceedToCards = () => {
    if (!type || !selectedSubcategory) return;
    const locale = (params?.locale as string) || "en";
    router.push(`/${locale}/tarot/${type}/choose`);
  };

  if (!type || !currentCategory) {
    return (
      <div className="max-w-2xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("tarot.typePage.back", { defaultValue: "돌아가기" })}
        </Button>
        <p className="text-sm text-muted-foreground mt-4">
          {t("tarot.typePage.invalidType", {
            defaultValue:
              "유효하지 않은 타입입니다. 올바른 링크로 다시 시도해주세요.",
          })}
        </p>
      </div>
    );
  }

  const IconComponent = currentCategory.icon;
  const subs = subcategories[type as keyof typeof subcategories] ?? [];

  // 번역 헬퍼
  const catName = t(`tarot.categories.${currentCategory.id}.name`, {
    defaultValue: currentCategory.id,
  });
  const subName = (subId: string) =>
    t(`tarot.subcategories.${currentCategory.id}.${subId}.name`, {
      defaultValue: subId,
    });
  const subDesc = (subId: string) =>
    t(`tarot.subcategories.${currentCategory.id}.${subId}.description`, {
      defaultValue: "",
    });

  return (
    <div className="tarot min-h-screen">
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <Button variant="ghost" onClick={handleBack} className="text-sm px-0">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("tarot.typePage.back")}
          </Button>
        </div>

        {/* 👇 1. 제목과 부제목을 중앙 정렬합니다. */}
        <div className="text-center mb-8">
          <h1 className="font-sans text-3xl md:text-4xl font-bold text-foreground text-pretty mb-2">
            {t("tarot.typePage.title2")}
          </h1>
          <p className="font-mono text-lg text-muted-foreground text-pretty">
            {t("tarot.typePage.subtitle2")}
          </p>
        </div>

        {/* 👇 2. 카테고리 칩을 중앙 정렬합니다. */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-accent/30">
            <IconComponent className="w-4 h-4 text-accent" />
            <span className="font-mono text-sm text-card-foreground">
              {t("tarot.typePage.currentCategoryChip", {
                name: catName,
                defaultValue: catName,
              })}
            </span>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {subs.map((sub) => (
            <Card
              key={sub.id}
              className={`cursor-pointer transition-all duration-300 ${
                selectedSubcategory === sub.id
                  ? "ring-2 ring-accent border-accent scale-[1.02] mystical-glow"
                  : "hover:border-accent/50 hover:scale-[1.01]"
              }`}
              onClick={() => setSelectedSubcategory(sub.id)}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between">
                  <div className="text-left flex-1 mr-4">
                    <h3 className="font-sans font-semibold text-lg text-card-foreground mb-1 leading-snug">
                      {subName(sub.id)}
                    </h3>
                    <p className="font-mono text-sm text-muted-foreground leading-relaxed">
                      {subDesc(sub.id)}
                    </p>
                  </div>
                  <ArrowRight
                    className={`w-5 h-5 text-accent flex-shrink-0 transition-transform duration-300 ${
                      selectedSubcategory === sub.id
                        ? "translate-x-1"
                        : "opacity-50"
                    }`}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* <div className="mb-8">
          <Card className="bg-card">
            <CardContent className="p-6">
              <h3 className="font-sans font-semibold text-card-foreground mb-4">
                {t("tarot.typePage.situationTitle")}
              </h3>
              <Textarea
                placeholder={t("tarot.typePage.situationPlaceholder", {
                  defaultValue: "한두 문장으로 지금 상황을 적어주세요.",
                })}
                value={situationText}
                onChange={(e) => setSituationText(e.target.value)}
                className="min-h-[100px] bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </CardContent>
          </Card>
        </div> */}

        <div className="text-center">
          <Button
            size="lg"
            onClick={handleProceedToCards}
            disabled={!selectedSubcategory}
            className={`w-full font-sans font-semibold transition-all duration-300 mb-8 ${
              selectedSubcategory
                ? "mystical-glow"
                : "bg-muted-foreground/30 text-muted"
            }`}
          >
            {t("tarot.typePage.start", { defaultValue: "카드 뽑기 시작하기" })}
          </Button>
        </div>
      </div>
    </div>
  );
}
