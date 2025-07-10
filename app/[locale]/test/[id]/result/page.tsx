"use client";

import { Button } from "@/components/ui/button";
import {
  Share2,
  Download,
  RotateCcw,
  Home,
  Users,
  TrendingUp,
  Heart,
  Compass,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEffect, useState, use, useRef } from "react";
import { useTestResultStore } from "@/store/testResultStore";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { RelatedTest } from "@/types/test";
import { getRelatedTests } from "@/lib/supabase/getRelatedTests";
import { useLanguageStore } from "@/store/useLanguageStore";
import { formatBoldText } from "@/utils/formatBoldText";
import { useAlert } from "@/components/modal/alert-context";
import { useTranslation } from "react-i18next";
import ResultDownloadCard from "@/components/result/ResultDownloadCard";
import html2canvas from "html2canvas";
import { Language } from "@/store/useLanguageStore";

// 1. params 타입에 locale을 추가합니다.
export default function ResultPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // 2. params에서 id와 locale을 모두 추출합니다.
  const { id, locale } = use(params);
  const { result, clearResult } = useTestResultStore();
  const [relatedTests, setRelatedTests] = useState<RelatedTest[]>([]);
  const language = useLanguageStore((state) => state.currentLanguage);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const customAlert = useAlert();
  const { t, i18n } = useTranslation("common");
  const captureRef = useRef<HTMLDivElement>(null);

  // 페이지 진입 시 URL의 locale과 전역 상태를 동기화합니다.
  useEffect(() => {
    if (locale) {
      setLanguage(locale as Language);
      i18n.changeLanguage(locale);
    }
  }, [locale, setLanguage, i18n]);

  // 테스트 결과가 없으면 테스트 페이지로 리디렉션합니다.
  useEffect(() => {
    if (result) {
      setTimeout(() => setIsLoading(false), 1500); // 결과 표시 전 잠시 로딩
    }
  }, [result, id, router, locale]);

  // 관련 테스트 데이터를 가져옵니다.
  useEffect(() => {
    const fetchData = async () => {
      // 전역 상태의 언어(language)가 설정된 후에 데이터를 가져옵니다.
      if (language) {
        const data = await getRelatedTests(Number(id), language);
        setRelatedTests(data);
      }
    };
    fetchData();
  }, [id, language]);

  // 공유 기능을 처리하는 함수입니다.
  const handleShare = async (platform: string) => {
    // 4. 공유 URL에도 locale을 포함합니다.
    const shareUrl = `https://testy.im/${locale}/test/${id}?utm_source=${platform}`;
    const shareText = `🤩 나의 성향은 "${result?.title}"! 지금 테스트 해보세요 👉`;

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
      if (!captureRef.current) return;
      const canvas = await html2canvas(captureRef.current, {
        scale: 2,
        backgroundColor: "#fff",
        useCORS: true,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `result-${id}.png`;
      link.click();
    }
  };

  // '다시 풀기' 버튼 핸들러입니다.
  const handleRetakeTest = () => {
    clearResult();
    // 5. '다시 풀기' 시에도 locale을 포함하여 이동합니다.
    router.push(`/${locale}/test/${id}`);
  };

  // '홈으로 가기' 버튼 핸들러입니다.
  const handleGoHome = () => {
    clearResult();
    // 6. '홈으로 가기' 시에도 locale을 포함하여 이동합니다.
    router.push(`/${locale}`);
  };

  // 로딩 중 UI
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            {t("resultPage.analyzingResults")}
          </p>
        </div>
      </div>
    );
  }

  // 로딩이 끝났지만 결과가 없는 경우 (useEffect에서 리디렉션 되기 전)
  if (!result) {
    return null;
  }

  // 결과 페이지 UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto space-y-5">
          {/* 결과 헤더 */}
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-24 h-24 bg-blue-400 rounded-full -translate-x-10 -translate-y-10 animate-ping" />
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-pink-400 rounded-full translate-x-8 translate-y-8 animate-bounce" />
            </div>
            <div className="relative text-center space-y-6">
              {result.result_image_url ? (
                <Image
                  src={result.result_image_url}
                  alt={result.title}
                  width={224}
                  height={224}
                  className="w-56 h-56 mx-auto rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                  priority
                />
              ) : (
                <div className="w-56 h-56 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800">
                  <span className="text-6xl">🎉</span>
                </div>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t("resultPage.youAre")}{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  "{result.title}"
                </span>
              </h1>
              <p className="text-md text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-line text-left">
                <span className="block font-medium mb-2 text-purple-500">
                  💡 {t("resultPage.analysisTitle")}
                </span>
                {formatBoldText(result.description)}
              </p>
            </div>
          </div>

          {/* 특성 분석 */}
          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Compass className="w-6 h-6 text-blue-600" />
                {t("resultPage.traitsAnalysis")}
              </h2>
              <div className="space-y-6">
                {result.keywords?.map((keyword) => {
                  const randomScore = Math.floor(Math.random() * 17) + 80;
                  return (
                    <div key={keyword} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900 dark:text-white text-lg">
                          {keyword}
                        </span>
                        <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {randomScore}%
                        </span>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-1000 shadow-sm"
                            style={{ width: `${randomScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 추천 가이드 */}
          <Card className="bg-gradient-to-r from-purple-50 via-blue-50 to-pink-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-pink-900/20 border border-purple-100 dark:border-purple-700 shadow-xl">
            <CardContent className="p-8 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Heart className="w-6 h-6 text-pink-600" />
                {t("resultPage.recommendationGuide")}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    {t("resultPage.matchingType")}
                  </h3>
                  <p className="bg-white/70 dark:bg-gray-700/70 p-4 rounded-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                    {formatBoldText(result.recommendation?.matching_type)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    {t("resultPage.suggestedActions")}
                  </h3>
                  <p className="bg-white/70 dark:bg-gray-700/70 p-4 rounded-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                    {formatBoldText(result.recommendation?.suggested_actions)}
                  </p>
                </div>
              </div>
              {result.recommendation?.items &&
                result.recommendation.items.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-green-500" />
                      {t("resultPage.suitableItems")}
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {result.recommendation.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-white/70 dark:bg-gray-700/70 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
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
                )}
            </CardContent>
          </Card>

          {/* 공유하기 */}
          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-left flex items-center justify-start gap-2">
                <Share2 className="w-6 h-6 text-blue-600" />
                {t("resultPage.shareWithFriends")}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  onClick={() => handleShare("facebook")}
                  className="bg-gradient-to-tr from-blue-600 via-blue-500 to-blue-400 hover:opacity-90 text-white rounded-2xl font-semibold flex flex-col items-center justify-center gap-2 h-24 shadow-lg hover:shadow-xl transition-all"
                >
                  <FaFacebook style={{ width: "32px", height: "32px" }} />
                  <span className="text-sm">{t("resultPage.facebook")}</span>
                </Button>
                <Button
                  onClick={() => handleShare("twitter")}
                  className="bg-blue-400 hover:bg-blue-500 text-white rounded-2xl font-semibold flex flex-col items-center justify-center gap-2 h-24 shadow-lg hover:shadow-xl transition-all"
                >
                  <span className="text-2xl">🐦</span>
                  <span className="text-sm">{t("resultPage.twitter")}</span>
                </Button>
                <Button
                  onClick={() => handleShare("copy")}
                  className="bg-gradient-to-tr from-yellow-400 via-amber-400 to-orange-400 hover:opacity-90 text-white rounded-2xl font-semibold flex flex-col items-center justify-center gap-2 h-24 shadow-lg hover:shadow-xl transition-all"
                >
                  <Share2 className="w-8 h-8" />
                  <span className="text-sm">{t("resultPage.copyLink")}</span>
                </Button>
                <Button
                  onClick={() => handleShare("image")}
                  className="bg-gradient-to-tr from-emerald-400 via-green-500 to-lime-400 hover:opacity-90 text-white rounded-2xl font-semibold flex flex-col items-center justify-center gap-2 h-24 shadow-lg hover:shadow-xl transition-all"
                >
                  <Download className="w-8 h-8" />
                  <span className="text-sm">{t("resultPage.saveImage")}</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 관련 테스트 */}
          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardContent className="p-5 sm:p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                {t("resultPage.otherTests")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {relatedTests.map((test) => (
                  // 7. '관련 테스트' 링크에도 locale을 포함합니다.
                  <Link key={test.id} href={`/${locale}/test/${test.id}`}>
                    <div className="group p-4 w-full border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all hover:shadow-lg hover:-translate-y-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: test.tone.color }}
                        ></div>
                        <Badge variant="outline" className="text-xs">
                          {test.category?.name}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 break-words">
                        {test.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {test.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 하단 버튼 */}
          <div className="flex flex-row flex-wrap gap-4 justify-center">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
              onClick={handleRetakeTest}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t("resultPage.retakeTest")}
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 rounded-full px-8 shadow-lg hover:shadow-xl transition-all"
              onClick={handleGoHome}
            >
              <Home className="w-4 h-4 mr-2" />
              {t("resultPage.goHome")}
            </Button>
          </div>
        </div>
      </div>

      {/* 이미지 다운로드용 컴포넌트 */}
      <div className="absolute -left-[9999px] top-0">
        <ResultDownloadCard
          ref={captureRef}
          title={result?.title || ""}
          keywords={result?.keywords || []}
          description={result?.description || ""}
          resultImageUrl={result?.result_image_url || ""}
        />
      </div>
    </div>
  );
}
