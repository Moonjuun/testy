// app/[locale]/mbti/page.tsx

"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MbtiModeSelectionPage() {
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const { t } = useTranslation("common");
  const [selectedMode, setSelectedMode] = useState<"basic" | "advanced" | null>(
    null
  );

  const handleStartTest = () => {
    if (!selectedMode) return;
    const testCode = selectedMode === "basic" ? "basic_v1" : "original_v1";
    router.push(`/${locale}/mbti/test?mode=${testCode}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t("mbti.selectMode")}
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* 기본 모드 */}
            <Card
              className={cn(
                "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl",
                selectedMode === "basic"
                  ? "border-purple-500 border-2 bg-purple-50 dark:bg-purple-900/20"
                  : "border-gray-200 dark:border-gray-700"
              )}
              onClick={() => setSelectedMode("basic")}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  <CardTitle className="text-2xl">
                    {t("mbti.basicMode")}
                  </CardTitle>
                </div>
                <CardDescription className="text-base">
                  {t("mbti.basicModeDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    •{" "}
                    {locale === "ko"
                      ? "40개의 핵심 질문"
                      : locale === "en"
                      ? "40 essential questions"
                      : locale === "ja"
                      ? "40の重要な質問"
                      : "40 câu hỏi cốt lõi"}
                  </p>
                  <p>
                    •{" "}
                    {locale === "ko"
                      ? "약 10-15분 소요"
                      : locale === "en"
                      ? "About 10-15 minutes"
                      : locale === "ja"
                      ? "約10-15分"
                      : "Khoảng 10-15 phút"}
                  </p>
                  <p>
                    •{" "}
                    {locale === "ko"
                      ? "빠른 결과 확인"
                      : locale === "en"
                      ? "Quick results"
                      : locale === "ja"
                      ? "迅速な結果"
                      : "Kết quả nhanh"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 심화 모드 */}
            <Card
              className={cn(
                "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl",
                selectedMode === "advanced"
                  ? "border-purple-500 border-2 bg-purple-50 dark:bg-purple-900/20"
                  : "border-gray-200 dark:border-gray-700"
              )}
              onClick={() => setSelectedMode("advanced")}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-6 h-6 text-purple-500" />
                  <CardTitle className="text-2xl">
                    {t("mbti.advancedMode")}
                  </CardTitle>
                </div>
                <CardDescription className="text-base">
                  {t("mbti.advancedModeDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    •{" "}
                    {locale === "ko"
                      ? "100개의 상세 질문"
                      : locale === "en"
                      ? "100 detailed questions"
                      : locale === "ja"
                      ? "100の詳細な質問"
                      : "100 câu hỏi chi tiết"}
                  </p>
                  <p>
                    •{" "}
                    {locale === "ko"
                      ? "약 25-30분 소요"
                      : locale === "en"
                      ? "About 25-30 minutes"
                      : locale === "ja"
                      ? "約25-30分"
                      : "Khoảng 25-30 phút"}
                  </p>
                  <p>
                    •{" "}
                    {locale === "ko"
                      ? "깊이 있는 분석"
                      : locale === "en"
                      ? "In-depth analysis"
                      : locale === "ja"
                      ? "詳細な分析"
                      : "Phân tích sâu"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button
              onClick={handleStartTest}
              disabled={!selectedMode}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-full"
            >
              {t("mbti.startTest")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
