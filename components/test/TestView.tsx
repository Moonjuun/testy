// components/test/TestView.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTestEngine } from "@/hooks/useTestEngine";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTestResultStore } from "@/store/testResultStore";
import { MobileAdBanner } from "@/components/Banner/mobile-ad-banner";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { TestData } from "@/types/test";

interface Props {
  initialTestData: TestData;
  testId: string;
}

export default function TestView({ initialTestData, testId }: Props) {
  const router = useRouter();
  const setResult = useTestResultStore((state) => state.setResult);

  // props로 받은 초기 데이터를 바로 사용합니다.
  const {
    currentQuestion,
    selectedOption,
    progress,
    isCompleted,
    totalQuestions,
    currentQuestionData,
    handleAnswer,
    handleNext,
    handlePrevious,
    canGoNext,
    canGoPrevious,
    calculateResult,
  } = useTestEngine(initialTestData);

  useEffect(() => {
    if (isCompleted) {
      const resultData = calculateResult();
      console.log("resultData", resultData);
      setResult(resultData); // ✅ Zustand 스토어에 결과 저장

      router.push(`/test/${testId}/result`);
    }
  }, [isCompleted, testId, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <MobileAdBanner type="sticky-top" size="320x50" />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            테스트 목록으로
          </Link>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {initialTestData.title}
            </h1>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
              <span>
                질문 {currentQuestion + 1} / {totalQuestions}
              </span>
              <span>{Math.round(progress)}% 완료</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-8 leading-relaxed">
                {currentQuestionData.question}
              </h2>
              <div className="space-y-4">
                {currentQuestionData.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                      selectedOption === index
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-900 dark:text-purple-300"
                        : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-25 dark:hover:bg-purple-900/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          selectedOption === index
                            ? "border-purple-500 bg-purple-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {selectedOption === index && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {option.text}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={!canGoPrevious}
                  className="rounded-full px-6 bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  이전
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!canGoNext}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full px-6"
                >
                  {currentQuestion === totalQuestions - 1
                    ? "결과 보기"
                    : "다음"}
                  {currentQuestion !== totalQuestions - 1 && (
                    <ArrowRight className="w-4 h-4 ml-2" />
                  )}
                </Button>
              </div>
            </div>

            <MobileAdBanner type="inline" size="300x250" className="mt-8" />
          </div>
        </div>
      </div>
      <MobileAdBanner type="sticky-bottom" size="320x50" />
    </div>
  );
}
