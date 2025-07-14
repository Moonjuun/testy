import { useState, useEffect, useCallback, useRef } from "react";
import type { GameState, ShapeType, Player, Point } from "@/types/play/draw";
import { calculateScore } from "@/lib/utils";
import { names, avatars, SHAPES } from "@/constants/play/draw";

// Mock 데이터 생성 함수 (이제 이 훅 내부에서만 사용됩니다)
const generateMockRankings = (shapeType: ShapeType): Player[] => {
  const baseDifficulty = SHAPES[shapeType].difficulty * 0.2;
  return Array.from({ length: 100 }, (_, i) => ({
    rank: i + 1,
    name: names[Math.floor(Math.random() * names.length)],
    score: Math.max(20, 99.99 - i * baseDifficulty - Math.random() * 4),
    avatar: avatars[Math.floor(Math.random() * avatars.length)],
  }));
};

/**
 * 그림 그리기 게임의 모든 상태와 로직을 관리하는 커스텀 훅
 * @param initialShape 초기 도형 설정
 */
export const useGameLogic = (initialShape: ShapeType = "circle") => {
  // =======================================================
  // ===== 상태 관리 (State & Ref) =========================
  // =======================================================
  const [gameState, setGameState] = useState<GameState>("idle");
  const [selectedShape, setSelectedShape] = useState<ShapeType>(initialShape);
  const [userPath, setUserPath] = useState<Point[]>([]);
  const [userScore, setUserScore] = useState<number | null>(null);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [rankings, setRankings] = useState<Record<ShapeType, Player[]>>({
    circle: [],
    triangle: [],
    square: [],
    umbrella: [],
    star: [],
    diamond: [],
  });
  const [showMobileRankings, setShowMobileRankings] = useState(false);
  const [particles, setParticles] = useState<
    Array<{ x: number; y: number; emoji: string }>
  >([]);

  // 시간 측정 관련 상태 및 ref
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completionTime, setCompletionTime] = useState<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // 핵심 로직 (useCallback, useEffect)

  // 랭킹 데이터 초기화
  useEffect(() => {
    const allRankings: Record<ShapeType, Player[]> = {
      circle: generateMockRankings("circle"),
      triangle: generateMockRankings("triangle"),
      square: generateMockRankings("square"),
      umbrella: generateMockRankings("umbrella"),
      // --- 새로운 도형 랭킹 생성 추가 ---
      star: generateMockRankings("star"),
      diamond: generateMockRankings("diamond"),
    };
    setRankings(allRankings);
  }, []);

  // 파티클 생성
  const createParticles = useCallback(() => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      emoji: ["✨", "🌟", "💫", "⭐"][Math.floor(Math.random() * 4)],
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 3000);
  }, []);

  // 랭크 계산
  const calculateUserRank = useCallback(
    (score: number, shape: ShapeType): number => {
      const shapeRankings = rankings[shape];
      if (!shapeRankings) return 1;
      const betterScores = shapeRankings.filter(
        (player) => player.score > score
      ).length;
      return betterScores + 1;
    },
    [rankings]
  );

  // 게임 시작
  const startGame = useCallback(() => {
    setGameState("countdown");
  }, []);

  // 그리기 종료 및 채점
  const stopDrawing = useCallback(() => {
    if (gameState !== "drawing" || userPath.length < 1) return;

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    const timeTaken = Date.now() - startTimeRef.current;
    setCompletionTime(timeTaken / 1000);

    const finalScore = calculateScore(userPath, selectedShape, timeTaken);
    setUserScore(finalScore);
    setUserRank(calculateUserRank(finalScore, selectedShape));

    if (finalScore >= 85) {
      createParticles();
    }

    setGameState("results");
    setTimeout(() => setShowComparison(true), 1000);
  }, [gameState, userPath, selectedShape, calculateUserRank, createParticles]);

  // 게임 리셋
  const resetGame = useCallback((startImmediately = false) => {
    setUserPath([]);
    setUserScore(null);
    setUserRank(null);
    setShowComparison(false);
    setCountdownNumber(3);
    setShowMobileRankings(false);
    setParticles([]);
    setElapsedTime(0);
    setCompletionTime(null);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (startImmediately) {
      setGameState("countdown");
    } else {
      setGameState("idle");
    }
  }, []);

  // 도형 변경 핸들러
  const handleShapeChange = useCallback(
    (shape: ShapeType) => {
      if (gameState === "idle" || gameState === "results") {
        setSelectedShape(shape);
        if (gameState === "results") {
          resetGame();
        }
      }
    },
    [gameState, resetGame]
  );

  // 카운트다운 및 경과 시간 타이머
  useEffect(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    if (gameState === "countdown") {
      const countdownInterval = setInterval(() => {
        setCountdownNumber((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setGameState("drawing");
            return 3;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdownInterval);
    } else if (gameState === "drawing") {
      startTimeRef.current = Date.now();
      setElapsedTime(0);
      timerIntervalRef.current = setInterval(() => {
        setElapsedTime((Date.now() - startTimeRef.current) / 1000);
      }, 100);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [gameState]);

  // =======================================================
  // ===== UI 컴포넌트에 전달할 값들 ==========================
  // =======================================================
  return {
    // 상태 (State)
    gameState,
    selectedShape,
    userPath,
    userScore,
    userRank,
    showComparison,
    countdownNumber,
    rankings,
    showMobileRankings,
    particles,
    elapsedTime,
    completionTime,

    // 상태 변경 함수 (Setters & Handlers)
    setGameState,
    setSelectedShape,
    setUserPath,
    setShowMobileRankings,

    // 게임 로직 함수
    startGame,
    stopDrawing,
    resetGame,
    handleShapeChange,
    createParticles, // 파티클은 UI와 직접 관련있으므로 넘겨줄 수 있음
  };
};
