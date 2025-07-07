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
  Zap,
  ShoppingBag,
  Lightbulb,
  MapPin,
  Compass,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import { useTestResultStore } from "@/store/testResultStore";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { RelatedTest } from "@/types/test";
import { getRelatedTests } from "@/lib/supabase/getRelatedTests";
import { useLanguageStore } from "@/store/useLanguageStore";
import { formatBoldText } from "@/utils/formatBoldText";

// --- useTranslation 훅 임포트 추가 ---
import { useTranslation } from "react-i18next";
// ------------------------------------

// params를 Promise로 받아서 React.use()로 언래핑
export default function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // React.use()를 사용하여 params Promise 언래핑
  const { id } = use(params);
  const { result, clearResult } = useTestResultStore();
  const [relatedTests, setRelatedTests] = useState<RelatedTest[]>([]);
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);

  // --- useTranslation 훅 사용 ---
  const { t } = useTranslation("common"); // 'common' 네임스페이스 사용
  // -----------------------------

  useEffect(() => {
    if (result) {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500); // 1.5초 대기
    } else {
      // 결과가 없으면 바로 테스트 페이지로 이동
      router.push(`/test/${id}`);
    }
  }, [result, id, router]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRelatedTests(Number(id), currentLanguage);
      setRelatedTests(data);
    };

    fetchData();
  }, [id, currentLanguage]); // id 의존성 추가

  const handleShare = (platform: string) => {
    // ... sharing logic
  };

  // 결과 사용 후 정리하는 함수
  const handleRetakeTest = () => {
    clearResult();
    router.push(`/test/${id}`);
  };

  const handleGoHome = () => {
    clearResult();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            {t("resultPage.analyzingResults")} {/* 번역 키 사용 */}
          </p>
        </div>
      </div>
    );
  }

  // 로딩이 끝났는데 결과가 없는 경우 (useEffect에서 리디렉션하기 전 잠깐 표시될 수 있음)
  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">
            {t("resultPage.noResultFound")} {/* 번역 키 사용 */}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto space-y-5">
          {/* Result Header */}
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl overflow-hidden">
            {/* Animated Background Bubbles */}
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
                {t("resultPage.youAre")} {/* 번역 키 사용 */}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  "{result.title}"
                </span>
              </h1>
              <p className="text-md text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-line text-center md:text-left">
                <span className="block font-medium mb-2 text-purple-500">
                  💡 {t("resultPage.analysisTitle")} {/* 번역 키 사용 */}
                </span>
                {formatBoldText(result.description)}
              </p>
            </div>
          </div>

          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Compass className="w-6 h-6 text-blue-600" />
                {t("resultPage.traitsAnalysis")} {/* 번역 키 사용 */}
              </h2>
              <div className="space-y-6">
                {result.keywords?.map((keyword, index) => {
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
                            style={{
                              width: `${randomScore}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recommendation Section */}
          <Card className="bg-gradient-to-r from-purple-50 via-blue-50 to-pink-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-pink-900/20 border border-purple-100 dark:border-purple-700 shadow-xl">
            <CardContent className="p-8 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Heart className="w-6 h-6 text-pink-600" />
                {t("resultPage.recommendationGuide")} {/* 번역 키 사용 */}
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Matching Type */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    {t("resultPage.matchingType")} {/* 번역 키 사용 */}
                  </h3>
                  <p className="bg-white/70 dark:bg-gray-700/70 p-4 rounded-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                    {formatBoldText(result.recommendation?.matching_type)}
                  </p>
                </div>

                {/* Suggested Actions */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    {t("resultPage.suggestedActions")} {/* 번역 키 사용 */}
                  </h3>
                  <p className="bg-white/70 dark:bg-gray-700/70 p-4 rounded-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                    {formatBoldText(result.recommendation?.suggested_actions)}
                  </p>
                </div>
              </div>

              {/* Items */}
              {result.recommendation?.items &&
                result.recommendation.items.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-green-500" />
                      {t("resultPage.suitableItems")} {/* 번역 키 사용 */}
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

          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-left flex items-center justify-start gap-2">
                <Share2 className="w-6 h-6 text-blue-600" />
                {t("resultPage.shareWithFriends")} {/* 번역 키 사용 */}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  onClick={() => handleShare("kakao")}
                  className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-6 py-4 rounded-2xl font-semibold flex flex-col items-center gap-2 h-auto shadow-lg hover:shadow-xl transition-all"
                >
                  <span className="text-2xl">💬</span>
                  <span>{t("resultPage.kakaoTalk")}</span> {/* 번역 키 사용 */}
                </Button>
                <Button
                  onClick={() => handleShare("twitter")}
                  className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-4 rounded-2xl font-semibold flex flex-col items-center gap-2 h-auto shadow-lg hover:shadow-xl transition-all"
                >
                  <span className="text-2xl">🐦</span>
                  <span>{t("resultPage.twitter")}</span> {/* 번역 키 사용 */}
                </Button>
                <Button
                  onClick={() => handleShare("copy")}
                  variant="outline"
                  className="px-6 py-4 rounded-2xl font-semibold flex flex-col items-center gap-2 h-auto border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-transparent shadow-lg hover:shadow-xl transition-all"
                >
                  <Share2 className="w-6 h-6" />
                  <span>{t("resultPage.copyLink")}</span> {/* 번역 키 사용 */}
                </Button>
                <Button
                  variant="outline"
                  className="px-6 py-4 rounded-2xl font-semibold flex flex-col items-center gap-2 h-auto bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg hover:shadow-xl transition-all"
                >
                  <Download className="w-6 h-6" />
                  <span>{t("resultPage.saveImage")}</span> {/* 번역 키 사용 */}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardContent className="p-5 sm:p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                {t("resultPage.otherTests")} {/* 이런 테스트는 어때요? */}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {relatedTests.map((test) => (
                  <Link key={test.id} href={`/test/${test.id}`}>
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

          <div className="flex flex-row flex-wrap gap-4 justify-center">
            <Link href={`/test/${id}`}>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
                onClick={handleRetakeTest}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {t("resultPage.retakeTest")} {/* 번역 키 사용 */}
              </Button>
            </Link>
            <Link href="/">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 rounded-full px-8 shadow-lg hover:shadow-xl transition-all"
                onClick={handleGoHome}
              >
                <Home className="w-4 h-4 mr-2" />
                {t("resultPage.goHome")} {/* 번역 키 사용 */}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
