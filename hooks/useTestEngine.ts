//hooks/useTestEngine.ts
"use client";

import { useState, useCallback } from "react";
import type { TestData, TestResultItem } from "@/types/test";

export function useTestEngine(testData: TestData) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const progress = ((currentQuestion + 1) / testData.questions.length) * 100;

  const handleAnswer = useCallback((optionIndex: number) => {
    setSelectedOption(optionIndex);
  }, []);

  const handleNext = useCallback(() => {
    if (selectedOption !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] =
        testData.questions[currentQuestion].options[selectedOption].score;
      setAnswers(newAnswers);

      if (currentQuestion < testData.questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedOption(null);
      } else {
        setIsCompleted(true);
      }
    }
  }, [selectedOption, answers, currentQuestion, testData.questions]);

  const handlePrevious = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setSelectedOption(
        answers[currentQuestion - 1] !== undefined
          ? testData.questions[currentQuestion - 1].options.findIndex(
              (opt) => opt.score === answers[currentQuestion - 1]
            )
          : null
      );
    }
  }, [currentQuestion, answers, testData.questions]);

  const calculateResult = useCallback((): TestResultItem => {
    const totalScore = answers.reduce((sum, score) => sum + score, 0);

    // 점수 범위에 맞는 결과 찾기
    const result = testData.results.find(
      (result) =>
        totalScore >= result.score_range[0] &&
        totalScore <= result.score_range[1]
    );

    return result || testData.results[0]; // 기본값으로 첫 번째 결과 반환
  }, [answers, testData.results]);

  const reset = useCallback(() => {
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedOption(null);
    setIsCompleted(false);
  }, []);

  return {
    currentQuestion,
    selectedOption,
    progress,
    isCompleted,
    totalQuestions: testData.questions.length,
    currentQuestionData: testData.questions[currentQuestion],
    handleAnswer,
    handleNext,
    handlePrevious,
    calculateResult,
    reset,
    canGoNext: selectedOption !== null,
    canGoPrevious: currentQuestion > 0,
  };
}
