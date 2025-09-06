"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { categories } from "@/constants/tarot/TarotConstants";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function Tarot({ locale }: { locale: string }) {
  const router = useRouter();
  // 'tarot' 네임스페이스를 사용하도록 지정합니다.
  const { t } = useTranslation("common");

  const handleCategorySelect = (categoryId: string) => {
    // 다국어 라우팅을 위해 locale 정보를 포함하는 것이 좋습니다.
    router.push(`/${locale}/tarot/${categoryId}`);
  };

  return (
    <div className="tarot min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-sans text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              {t("tarot.typePage.title1")}
            </h1>
            <p className="font-mono text-lg text-muted-foreground text-pretty">
              {t("tarot.typePage.subtitle1")}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card
                  key={category.id}
                  className="cursor-pointer transition-all duration-300 hover:scale-105 hover:border-accent/50"
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      <IconComponent className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="font-sans font-semibold text-card-foreground mb-2">
                      {t(`tarot.categories.${category.id}.name`)}
                    </h3>
                    <p className="font-mono text-sm text-muted-foreground text-pretty">
                      {t(`tarot.categories.${category.id}.description`)}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
