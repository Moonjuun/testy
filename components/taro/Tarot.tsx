"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { categories } from "@/constants/tarot/TarotConstants";
import { useRouter } from "next/navigation";

export default function Tarot({ locale }: { locale: string }) {
  const router = useRouter();

  const handleCategorySelect = (categoryId: string) => {
    router.push(`/tarot/${categoryId}`);
  };
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-accent rounded-full constellation-twinkle" />
        <div
          className="absolute top-32 right-20 w-1 h-1 bg-accent rounded-full constellation-twinkle"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-accent rounded-full constellation-twinkle"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 right-10 w-1 h-1 bg-accent rounded-full constellation-twinkle"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-sans text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              무엇을 정리해볼까요?
            </h1>
            <p className="font-mono text-lg text-muted-foreground text-pretty">
              당신의 상황에 맞는 카테고리를 선택하세요.
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
                      {category.name}
                    </h3>
                    <p className="font-mono text-sm text-muted-foreground text-pretty">
                      {category.description}
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
