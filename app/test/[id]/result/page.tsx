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
  Target,
  Gift,
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
  }, [currentLanguage]);

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
            결과를 분석하고 있어요...
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
            결과를 찾을 수 없습니다. 테스트 페이지로 이동합니다...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Result Header */}
          <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-8 shadow-lg text-center transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
            {/* ✅ 수정된 부분: 이미지 강조를 위한 Wrapper Div 추가 */}

            {result.result_image_url ? (
              <Image
                src={result.result_image_url}
                alt={result.title}
                width={224} // 56 * 4
                height={224} // 56 * 4
                className="w-56 h-56 mx-auto rounded-full object-cover border-4 border-white dark:border-gray-800"
                priority
              />
            ) : (
              <div className="w-56 h-56 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800">
                <span className="text-6xl">🎉</span>
              </div>
            )}

            {/* ✅ 수정된 부분: 텍스트 크기 증가 */}
            <h2 className="text-lg md:text-xl font-semibold text-purple-600 dark:text-purple-400">
              당신의 결과 유형은
            </h2>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
              {result.title}
            </h1>
            <p className="text-md md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto text-left">
              {result.description}
            </p>
          </div>

          {/* Recommendation */}
          <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              ✨ 이런건 어때요?
            </h2>
            <div className="bg-purple-50 dark:bg-gray-800 rounded-xl p-6">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {result.recommendation}
              </p>
            </div>
          </div>

          {/* Share Buttons */}
          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center flex items-center justify-center gap-2">
                <Share2 className="w-6 h-6 text-purple-600" />
                친구들에게 자랑하기
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  onClick={() => handleShare("kakao")}
                  className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-6 py-4 rounded-2xl font-semibold flex flex-col items-center gap-2 h-auto"
                >
                  <span className="text-2xl">💬</span>
                  <span>카카오톡</span>
                </Button>
                <Button
                  onClick={() => handleShare("twitter")}
                  className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-4 rounded-2xl font-semibold flex flex-col items-center gap-2 h-auto"
                >
                  <span className="text-2xl">🐦</span>
                  <span>X (Twitter)</span>
                </Button>
                <Button
                  onClick={() => handleShare("copy")}
                  variant="outline"
                  className="px-6 py-4 rounded-2xl font-semibold flex flex-col items-center gap-2 h-auto border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-transparent"
                >
                  <Share2 className="w-6 h-6" />
                  <span>링크 복사</span>
                </Button>
                <Button
                  variant="outline"
                  className="px-6 py-4 rounded-2xl font-semibold flex flex-col items-center gap-2 h-auto bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Download className="w-6 h-6" />
                  <span>이미지 저장</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                이런 테스트는 어때요?
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedTests.map((test) => (
                  <Link key={test.id} href={`/test/${test.id}`}>
                    <div className="group p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-300 dark:hover:border-purple-600 transition-all hover:shadow-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: test.tone.color }}
                        ></div>
                        <Badge variant="outline" className="text-xs">
                          {test.category?.name}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleRetakeTest}
              variant="outline"
              size="lg"
              className="rounded-full px-8 w-full transition-transform hover:scale-105"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              다시 테스트하기
            </Button>
            <Button
              onClick={handleGoHome}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full px-8 w-full transition-transform hover:scale-105"
            >
              <Home className="w-4 h-4 mr-2" />
              다른 테스트 하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
