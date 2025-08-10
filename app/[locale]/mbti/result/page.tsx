// app/[locale]/mbti/result/page.tsx

"use client";

import { useEffect, useState, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMbtiTestResultStore } from "@/store/testMbtiResultStore";
import { getMbtiResult } from "@/lib/supabase/mbti/getMbtiResult";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatBoldText } from "@/utils/formatBoldText";
import { useAlert } from "@/components/modal/alert-context";
import {
  Target,
  Heart,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  HeartHandshake,
  Swords,
  Compass,
  ShoppingBag,
  Share2,
  Home,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import html2canvas from "html2canvas";

// The data type for the final result page
interface MbtiResultData {
  type: string;
  title: string;
  description: string;
  profile: {
    axis: string;
    label1: string;
    label2: string;
    value1: number;
    value2: number;
    color: string;
  }[];
  keywords: string[];
  compatibility: {
    best: { type: string; comment: string };
    worst: { type: string; comment: string };
  };
  strengths: string[];
  weaknesses: string[];
  career_paths: string[];
  dating_style: string;
  recommended_items: string[]; // ✅ Add recommended_items
}

export default function MbtiResultPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const router = useRouter();
  const { result: storeResult, clearResult } = useMbtiTestResultStore();
  const [mbtiResult, setMbtiResult] = useState<MbtiResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { locale } = use(params);
  const { t } = useTranslation("common");
  const customAlert = useAlert();
  const captureRef = useRef<HTMLDivElement>(null);

  // 공유 기능을 처리하는 함수입니다.
  const handleShare = async (platform: string) => {
    // 4. 공유 URL에도 locale을 포함합니다.
    const shareUrl = `https://testy.im/${locale}/mbti`;
    const shareText = `MBTI ${t("home.heroTitlePart2")}`;

    if (platform === "twitter") {
      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(shareUrl)}`;
      window.open(tweetUrl, "_blank", "noopener,noreferrer");
    }
    if (platform === "facebook") {
      const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`;
      window.open(fbShareUrl, "_blank", "noopener,noreferrer");
    }
    if (platform === "copy") {
      await navigator.clipboard.writeText(shareUrl);
      await customAlert({
        title: t("alert.copySuccessTitle"),
        message: t("alert.copySuccessMessage"),
        confirmText: t("alert.confirm"),
      });
    }
    if (platform === "image") {
      await customAlert({
        title: t("profile.notification"),
        message: t("error.waitPlease"),
        confirmText: t("alert.confirm"),
      });
    }
  };

  useEffect(() => {
    const fetchAndProcessResult = async () => {
      if (!storeResult) {
        router.replace(`/${locale}/mbti`);
        return;
      }

      const { mbtiType, scores, testCode } = storeResult;

      const typeInfo = await getMbtiResult(testCode, mbtiType, locale);

      // Add a 3-second delay before showing the result or error
      setTimeout(() => {
        if (!typeInfo) {
          console.error("Error loading MBTI type information");
          setIsLoading(false);
          return;
        }

        const finalResult: MbtiResultData = {
          type: mbtiType,
          ...typeInfo,
          profile: [
            {
              axis: "E-I",
              label1: "E",
              label2: "I",
              value1: scores.score_e,
              value2: scores.score_i,
              color: "bg-gradient-to-r from-blue-500 to-purple-500",
            },
            {
              axis: "S-N",
              label1: "S",
              label2: "N",
              value1: scores.score_s,
              value2: scores.score_n,
              color: "bg-gradient-to-r from-emerald-500 to-green-500",
            },
            {
              axis: "T-F",
              label1: "T",
              label2: "F",
              value1: scores.score_t,
              value2: scores.score_f,
              color: "bg-gradient-to-r from-yellow-500 to-orange-500",
            },
            {
              axis: "J-P",
              label1: "J",
              label2: "P",
              value1: scores.score_j,
              value2: scores.score_p,
              color: "bg-gradient-to-r from-pink-500 to-red-500",
            },
          ],
        };

        setMbtiResult(finalResult);
        setIsLoading(false);
      }, 3000); // 3-second delay
    };

    fetchAndProcessResult();
  }, [storeResult, router, locale]);

  const handleRetry = () => {
    clearResult();
    router.push(`/${locale}/mbti`);
  };

  const handleGoHome = () => {
    clearResult();
    router.push(`/${locale}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
        <p className="mt-4 text-lg font-semibold text-gray-700">
          {t("resultPage.analyzingResults")}
        </p>
      </div>
    );
  }

  if (!mbtiResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <p className="mt-4 text-lg font-semibold text-gray-700">
          {t("resultPage.noResultFound")}
        </p>
        <Button onClick={handleRetry} className="mt-4">
          {t("resultPage.retakeTest")}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Result Header */}
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl overflow-hidden">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse" />
            <div className="relative text-center space-y-6">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800">
                <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {mbtiResult.type}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  "{mbtiResult.title}"
                </span>
              </h1>
              <p className="text-left text-gray-700 dark:text-gray-200 leading-relaxed max-w-2xl mx-auto">
                {formatBoldText(mbtiResult.description)}
              </p>
            </div>
          </div>

          {/* MBTI Profile */}
          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Compass className="w-6 h-6 text-blue-600" />
                MBTI {t("mbti.score")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {mbtiResult.profile.map((item) => (
                <div key={item.axis} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white text-lg">
                      {item.label1} <span className="text-gray-400">vs</span>{" "}
                      {item.label2}
                    </span>
                    <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {item.value1}% / {item.value2}%
                    </span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                      <div
                        className={cn(
                          "h-4 rounded-full transition-all duration-1000 shadow-sm",
                          item.color
                        )}
                        style={{ width: `${item.value1}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Compatibility */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white/50 dark:bg-gray-800/50 shadow-xl">
              <CardContent className="p-6 text-center">
                <HeartHandshake className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {t("mbti.bestChem")}
                </h3>
                <p className="text-3xl font-bold text-pink-600 mb-2">
                  {mbtiResult.compatibility.best.type}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {mbtiResult.compatibility.best.comment}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/50 dark:bg-gray-800/50 shadow-xl">
              <CardContent className="p-6 text-center">
                <Swords className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {t("mbti.worstChem")}
                </h3>
                <p className="text-3xl font-bold text-orange-600 mb-2">
                  {mbtiResult.compatibility.worst.type}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {mbtiResult.compatibility.worst.comment}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Personality Keywords */}
          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                {t("mbti.keywords")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 justify-center">
                {mbtiResult.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-200 rounded-full font-medium"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 연애 스타일 */}
          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Heart className="w-6 h-6 text-pink-600" />
                {t("mbti.dateStyle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex flex-col items-start text-left p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <p className="text-gray-700 dark:text-gray-300">
                  {formatBoldText(mbtiResult.dating_style)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ✅ Guide Card (Strengths, Weaknesses, Careers, Items) */}
          <Card className="bg-gradient-to-r from-purple-50 via-blue-50 to-pink-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-pink-900/20 border border-purple-100 dark:border-purple-700 shadow-xl">
            <CardContent className="p-8 space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Target className="w-6 h-6 text-purple-600" />
                {t("mbti.guide")}
              </h2>

              {/* Strengths and Weaknesses */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    {t("mbti.strengths")}
                  </h3>
                  <div className="space-y-2">
                    {mbtiResult.strengths.map((strength, index) => (
                      <div
                        key={index}
                        className="bg-white/70 dark:bg-gray-700/70 p-3 rounded-lg text-gray-700 dark:text-gray-300 text-sm"
                      >
                        {formatBoldText(strength)}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    {t("mbti.weaknesses")}
                  </h3>
                  <div className="space-y-2">
                    {mbtiResult.weaknesses.map((weakness, index) => (
                      <div
                        key={index}
                        className="bg-white/70 dark:bg-gray-700/70 p-3 rounded-lg text-gray-700 dark:text-gray-300 text-sm"
                      >
                        {formatBoldText(weakness)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ✅ Recommended Items */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-blue-500" />
                  {t("mbti.items")}
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {mbtiResult.recommended_items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-white/70 dark:bg-gray-700/70 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Careers */}

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />

                  {t("mbti.careers")}
                </h3>

                <div className="flex flex-wrap gap-2">
                  {mbtiResult.career_paths.map((career, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/70 dark:bg-gray-700/70 text-gray-800 dark:text-gray-200 rounded-full text-sm md:text-base font-medium"
                    >
                      {career}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Share */}
          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Share2 className="w-6 h-6 text-blue-600" />
                {t("resultPage.shareWithFriends")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  onClick={() => handleShare("facebook")}
                  className="bg-gradient-to-tr from-blue-600 via-blue-500 to-blue-400 hover:opacity-90 text-white rounded-2xl font-semibold flex flex-col items-center justify-center gap-2 h-20 shadow-lg hover:shadow-xl transition-all"
                >
                  <span className="text-2xl">📘</span>
                  <span className="text-sm">{t("resultPage.facebook")}</span>
                </Button>
                <Button
                  onClick={() => handleShare("twitter")}
                  className="bg-blue-400 hover:bg-blue-500 text-white rounded-2xl font-semibold flex flex-col items-center justify-center gap-2 h-20 shadow-lg hover:shadow-xl transition-all"
                >
                  <span className="text-2xl">🐦</span>
                  <span className="text-sm">{t("resultPage.twitter")}</span>
                </Button>
                <Button
                  onClick={() => handleShare("copy")}
                  className="bg-gradient-to-tr from-yellow-400 via-amber-400 to-orange-400 hover:opacity-90 text-white rounded-2xl font-semibold flex flex-col items-center justify-center gap-2 h-20 shadow-lg hover:shadow-xl transition-all"
                >
                  <Share2 className="w-6 h-6" />
                  <span className="text-sm">{t("resultPage.copyLink")}</span>
                </Button>
                <Button
                  onClick={() => handleShare("image")}
                  className="bg-gradient-to-tr from-emerald-400 via-green-500 to-lime-400 hover:opacity-90 text-white rounded-2xl font-semibold flex flex-col items-center justify-center gap-2 h-20 shadow-lg hover:shadow-xl transition-all"
                >
                  <span className="text-2xl">💾</span>
                  <span className="text-sm">{t("resultPage.saveImage")}</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Buttons */}
          <div className="flex flex-row flex-wrap gap-4 justify-center pt-8">
            <Button
              onClick={handleRetry}
              variant="outline"
              size="lg"
              className="rounded-full px-8 bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t("resultPage.retakeTest")}
            </Button>
            <Button
              onClick={handleGoHome}
              size="lg"
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:opacity-90 rounded-full px-8 shadow-lg hover:shadow-xl transition-all"
            >
              <Home className="w-4 h-4 mr-2" />
              {t("resultPage.goHome")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
