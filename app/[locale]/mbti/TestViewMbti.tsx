// components/test/TestViewMbti.tsx

"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useMbtiTestResultStore } from "@/store/testMbtiResultStore";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MobileAdBanner } from "@/components/banner/mobile-ad-banner";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
// import { incrementTestViewCount } from "@/lib/supabase/incrementViewCount";

// 데이터 타입 정의 (DB에서 받아오는 데이터 타입과 일치)
interface MbtiQuestion {
  id: number;
  text: string;
  dimension: "EI" | "SN" | "TF" | "JP";
  direction: "I" | "N" | "F" | "P";
}

interface MbtiTestData {
  title: string;
  description: string;
  thumbnail_url?: string;
  questions: MbtiQuestion[];
}

// ✅ Props 타입 수정: testId를 제거하고 testCode로 통일합니다.
interface Props {
  initialTestData: MbtiTestData;
  testCode: string;
  locale: string;
}

// 답변 선택지와 점수 (다국어 키 사용)
const ANSWER_OPTIONS = [
  { textKey: "mbtiAnswers.stronglyAgree", score: 2 },
  { textKey: "mbtiAnswers.agree", score: 1 },
  { textKey: "mbtiAnswers.neutral", score: 0 },
  { textKey: "mbtiAnswers.disagree", score: -1 },
  { textKey: "mbtiAnswers.stronglyDisagree", score: -2 },
];

export default function TestViewMbti({
  initialTestData,
  testCode,
  locale,
}: Props) {
  const router = useRouter();
  const setResult = useMbtiTestResultStore((state) => state.setResult);
  const [showContent, setShowContent] = useState(false);
  const { t } = useTranslation("common");

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(() =>
    Array(initialTestData.questions.length).fill(-1)
  );

  const totalQuestions = initialTestData.questions.length;
  const currentQuestionData = initialTestData.questions[currentQuestion];
  const selectedOption = answers[currentQuestion];

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // useEffect(() => {
  //   if (testCode) {
  //     // ✅ incrementTestViewCount가 testId(number) 대신 testCode(string)를 받을 수 있도록 수정 필요
  //     incrementTestViewCount(testCode);
  //   }
  // }, [testCode]);

  // MBTI 결과 계산 및 점수 변환 로직 (상세 점수 포함)
  const calculateAndProcessResult = useCallback(() => {
    const rawScores = { I: 0, N: 0, F: 0, P: 0 };

    initialTestData.questions.forEach((question, index) => {
      const answerIndex = answers[index];
      if (answerIndex !== -1) {
        const score = ANSWER_OPTIONS[answerIndex].score;
        if (rawScores.hasOwnProperty(question.direction)) {
          rawScores[question.direction as keyof typeof rawScores] += score;
        }
      }
    });

    // 각 dimension별 질문 개수 계산 (동적)
    const dimensionCounts = {
      EI: initialTestData.questions.filter((q) => q.dimension === "EI").length,
      SN: initialTestData.questions.filter((q) => q.dimension === "SN").length,
      TF: initialTestData.questions.filter((q) => q.dimension === "TF").length,
      JP: initialTestData.questions.filter((q) => q.dimension === "JP").length,
    };

    // 각 dimension의 최대 점수 계산 (질문 개수 * 2점)
    const maxScorePerDimension = Math.max(
      dimensionCounts.EI * 2,
      dimensionCounts.SN * 2,
      dimensionCounts.TF * 2,
      dimensionCounts.JP * 2
    );

    // Helper function to amplify the difference from the 50% midpoint
    const amplifyScore = (rawScore: number) => {
      // 1. Calculate the initial percentage (0-100)
      const initialPercent =
        ((rawScore + maxScorePerDimension) / (maxScorePerDimension * 2)) * 100;

      // 2. Calculate deviation from the midpoint (50)
      const deviation = initialPercent - 50;

      // 3. Amplify the deviation. Adjust this factor to control the "stretch".
      // 1.0 is no change. 2.0 is a very strong change. 1.7 is a good starting point.
      const gainFactor = 1.7;
      const amplifiedDeviation = deviation * gainFactor;

      // 4. Calculate the new percentage and clamp it between 0 and 100
      const finalPercent = 50 + amplifiedDeviation;
      return Math.max(0, Math.min(100, Math.round(finalPercent)));
    };

    const finalScores = {
      score_e: 0,
      score_i: 0,
      score_s: 0,
      score_n: 0,
      score_t: 0,
      score_f: 0,
      score_j: 0,
      score_p: 0,
    };

    // Calculate amplified scores for each dimension
    finalScores.score_i = amplifyScore(rawScores.I);
    finalScores.score_e = 100 - finalScores.score_i;

    finalScores.score_n = amplifyScore(rawScores.N);
    finalScores.score_s = 100 - finalScores.score_n;

    finalScores.score_f = amplifyScore(rawScores.F);
    finalScores.score_t = 100 - finalScores.score_f;

    finalScores.score_p = amplifyScore(rawScores.P);
    finalScores.score_j = 100 - finalScores.score_p;

    // Determine final MBTI type
    const mbtiType = [
      finalScores.score_e > finalScores.score_i ? "E" : "I",
      finalScores.score_s > finalScores.score_n ? "S" : "N",
      finalScores.score_t > finalScores.score_f ? "T" : "F",
      finalScores.score_j > finalScores.score_p ? "P" : "J",
    ].join("");

    return { mbtiType, scores: finalScores };
  }, [answers, initialTestData.questions]);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }, 300);
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const { mbtiType, scores } = calculateAndProcessResult();

      setResult({
        mbtiType,
        scores,
        testCode,
        title: initialTestData.title,
      });

      router.push(`/${locale}/mbti/result`);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const canGoNext = useMemo(
    () => answers[currentQuestion] !== -1,
    [answers, currentQuestion]
  );
  const canGoPrevious = useMemo(() => currentQuestion > 0, [currentQuestion]);
  const isCompleted = useMemo(() => !answers.includes(-1), [answers]);

  const answeredCount = useMemo(
    () => answers.filter((a) => a !== -1).length,
    [answers]
  );
  const displayProgress = (answeredCount / totalQuestions) * 100;

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
          {t("testView.loading")}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mb-4">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("testView.backToList")}
          </Link>

          <div className="relative mb-4 rounded-2xl overflow-hidden shadow-xl">
            <img
              src={initialTestData.thumbnail_url}
              alt="Test thumbnail"
              className="w-full h-64 object-cover brightness-75"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/60 to-transparent">
              <h1 className="text-2xl font-bold text-white">
                {initialTestData.title}
              </h1>
              {initialTestData.description && (
                <p className="text-sm text-white/80 mt-1">
                  {initialTestData.description
                    .split("\n")
                    .map((line, index) => (
                      <span key={index}>
                        {line}
                        <br />
                      </span>
                    ))}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
              <span>
                {t("testView.questionProgress", {
                  current: currentQuestion + 1,
                  total: totalQuestions,
                })}
              </span>
              <span>
                {t("testView.progressCompleted", {
                  percent: Math.round(displayProgress),
                })}
              </span>
            </div>
            <Progress value={displayProgress} className="h-2" />
          </div>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <h2 className="text-lg sm:text-xl font-bold text-center text-gray-900 dark:text-white mb-6">
              {currentQuestionData.text}
            </h2>
            <div className="space-y-4">
              {ANSWER_OPTIONS.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full p-4 text-center rounded-xl border-2 transition-all duration-200 ${
                    selectedOption === index
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-900 dark:text-purple-300 font-bold"
                      : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-25 dark:hover:bg-purple-900/10"
                  }`}
                >
                  <span className="font-medium text-gray-900 dark:text-white">
                    {t(option.textKey)}
                  </span>
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
                <ArrowLeft className="w-4 h-4 mr-2" /> {t("testView.previous")}
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canGoNext}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full px-6"
              >
                {currentQuestion === totalQuestions - 1
                  ? t("testView.viewResults")
                  : t("testView.next")}
                {currentQuestion !== totalQuestions - 1 && (
                  <ArrowRight className="w-4 h-4 ml-2" />
                )}
              </Button>
            </div>
            {isCompleted && (
              <div className="text-center mt-6">
                <p className="text-green-600 dark:text-green-400 font-semibold">
                  {t("testView.allAnswered")}
                </p>
              </div>
            )}
          </div>
          <MobileAdBanner type="inline" size="300x250" className="mt-8" />
        </div>
      </div>
    </div>
  );
}
