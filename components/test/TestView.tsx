// components/test/TestView.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTestEngine } from "@/hooks/useTestEngine";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTestResultStore } from "@/store/testResultStore";

import { MobileAdBanner } from "@/components/Banner/mobile-ad-banner";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { TestData } from "@/types/test";
import { useLanguageStore } from "@/store/useLanguageStore";

interface Props {
  initialTestData: TestData;
  testId: string;
  language: string;
}

export default function TestView({ initialTestData, testId, language }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setResult = useTestResultStore((state) => state.setResult);
  const currentLangCode = useLanguageStore((state) => state.currentLanguage);

  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (currentLangCode !== language) {
      const newSearchParams = new URLSearchParams(searchParams || undefined);
      newSearchParams.set("lang", currentLangCode);
      router.replace(`/test/${testId}?${newSearchParams.toString()}`);
    }
  }, [currentLangCode, language, router, testId, searchParams]);

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
      setResult(resultData);

      const resultSearchParams = new URLSearchParams(searchParams || undefined);
      resultSearchParams.set("lang", currentLangCode);
      router.push(`/test/${testId}/result?${resultSearchParams.toString()}`);
    }
  }, [isCompleted, testId, router, currentLangCode, searchParams]);

  if (!showContent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse flex items-center justify-center shadow-xl">
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707M6 17H5a2 2 0 00-2 2v1a2 2 0 002 2h14a2 2 0 002-2v-1a2 2 0 00-2-2h-1m-6-4a4 4 0 110-8 4 4 0 010 8zm0 0v1.5a2.5 2.5 0 005 0V14a2 2 0 11-4 0v-.5"
            ></path>
          </svg>
        </div>
        <p className="mt-8 text-xl font-semibold text-gray-700 dark:text-gray-300">
          테스트를 불러오는 중...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <MobileAdBanner type="sticky-top" size="320x50" />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mb-4">
          <Link
            href={`/?lang=${currentLangCode}`}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            테스트 목록으로
          </Link>

          {/* 썸네일 이미지 추가 */}
          {initialTestData.thumbnail_url && (
            <div className="relative mb-4 rounded-2xl overflow-hidden shadow-xl">
              <img
                src={initialTestData.thumbnail_url}
                alt="Test thumbnail"
                className="w-full h-64 object-cover brightness-75"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h1 className="text-2xl font-bold">{initialTestData.title}</h1>
                {initialTestData.description && (
                  <p className="text-sm text-white/80 mt-1">
                    {initialTestData.description}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {currentQuestionData.question}
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
              {/* <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-8 leading-relaxed">
                {currentQuestionData.question}
              </h2> */}
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
