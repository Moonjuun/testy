// app/[locale]/play/draw/page.tsx
"use client";

import type React from "react";

import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  RotateCcw,
  Timer,
  Target,
  Trophy,
  Crown,
  Medal,
  Award,
  TrendingUp,
  Users,
  Share2,
  Sparkles,
  Heart,
  Star,
} from "lucide-react";

interface Point {
  x: number;
  y: number;
}

interface Player {
  rank: number;
  name: string;
  score: number;
  avatar: string;
}

type GameState = "idle" | "countdown" | "drawing" | "results" | "timeout";
type ShapeType = "circle" | "triangle" | "square" | "umbrella";

interface ShapeConfig {
  name: string;
  emoji: string;
  description: string;
  gradient: string;
  shadowColor: string;
  strokeColor: string;
  difficulty: number;
}

const SHAPES: Record<ShapeType, ShapeConfig> = {
  circle: {
    name: "Circle",
    emoji: "⭕",
    description: "Draw a perfect circle",
    gradient: "from-purple-300 via-pink-300 to-rose-300",
    shadowColor: "rgba(219, 112, 147, 0.3)",
    strokeColor: "#DDA0DD",
    difficulty: 1,
  },
  triangle: {
    name: "Triangle",
    emoji: "🔺",
    description: "Draw an equilateral triangle",
    gradient: "from-emerald-300 via-teal-300 to-cyan-300",
    shadowColor: "rgba(32, 178, 170, 0.3)",
    strokeColor: "#20B2AA",
    difficulty: 2,
  },
  square: {
    name: "Square",
    emoji: "🟦",
    description: "Draw a perfect square",
    gradient: "from-sky-300 via-blue-300 to-indigo-300",
    shadowColor: "rgba(135, 206, 235, 0.3)",
    strokeColor: "#87CEEB",
    difficulty: 2,
  },
  umbrella: {
    name: "Umbrella",
    emoji: "☂️",
    description: "Draw an umbrella shape",
    gradient: "from-rose-300 via-pink-300 to-fuchsia-300",
    shadowColor: "rgba(255, 182, 193, 0.3)",
    strokeColor: "#FFB6C1",
    difficulty: 4,
  },
};

// Enhanced mock data with avatars
const generateMockRankings = (shapeType: ShapeType): Player[] => {
  const names = [
    "Luna✨",
    "Mia🌸",
    "Zoe💫",
    "Ava🦋",
    "Emma🌺",
    "Lily🌙",
    "Ruby💎",
    "Iris🌈",
    "Nova⭐",
    "Chloe🌻",
    "Maya🎀",
    "Aria🌷",
    "Sage🍃",
    "Rose🌹",
    "Jade💚",
    "Sky☁️",
    "Mila🎨",
    "Nora🌊",
    "Ella🦄",
    "Ivy🌿",
    "Hazel🌰",
    "Pearl🐚",
    "Wren🕊️",
    "Faye🧚",
    "Dara🌸",
    "Kira⚡",
    "Lila💜",
    "Naia🌊",
    "Vera🌺",
    "Zara✨",
    "Cora🌙",
    "Tara🌟",
  ];

  const avatars = [
    "🌸",
    "🦋",
    "🌺",
    "🌙",
    "💎",
    "🌈",
    "⭐",
    "🌻",
    "🎀",
    "🌷",
    "🍃",
    "🌹",
    "💚",
    "☁️",
    "🎨",
    "🌊",
    "🦄",
    "🌿",
    "🌰",
    "🐚",
    "🕊️",
    "🧚",
    "⚡",
    "💜",
    "✨",
  ];

  const baseDifficulty = SHAPES[shapeType].difficulty * 0.2;

  return Array.from({ length: 100 }, (_, i) => ({
    rank: i + 1,
    name: names[Math.floor(Math.random() * names.length)],
    score: Math.max(20, 99.99 - i * baseDifficulty - Math.random() * 4),
    avatar: avatars[Math.floor(Math.random() * avatars.length)],
  }));
};

export default function DrawPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedShape, setSelectedShape] = useState<ShapeType>("circle");
  const [gameState, setGameState] = useState<GameState>("idle");
  const [isDrawing, setIsDrawing] = useState(false);
  const [userPath, setUserPath] = useState<Point[]>([]);
  const [userScore, setUserScore] = useState<number | null>(null);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [rankings, setRankings] = useState<Record<ShapeType, Player[]>>({
    circle: [],
    triangle: [],
    square: [],
    umbrella: [],
  });
  const [showMobileRankings, setShowMobileRankings] = useState(false);
  const [particles, setParticles] = useState<
    Array<{ x: number; y: number; emoji: string }>
  >([]);

  const canvasSize = 320;
  const centerX = canvasSize / 2;
  const centerY = canvasSize / 2;

  // Initialize rankings
  useEffect(() => {
    const allRankings: Record<ShapeType, Player[]> = {
      circle: generateMockRankings("circle"),
      triangle: generateMockRankings("triangle"),
      square: generateMockRankings("square"),
      umbrella: generateMockRankings("umbrella"),
    };
    setRankings(allRankings);
  }, []);

  // Particle animation for celebrations
  const createParticles = useCallback(() => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      emoji: ["✨", "🌟", "💫", "⭐"][Math.floor(Math.random() * 4)],
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 3000);
  }, []);

  const drawGuideShape = useCallback(
    (ctx: CanvasRenderingContext2D, shape: ShapeType) => {
      ctx.strokeStyle = "rgba(147, 197, 253, 0.5)"; // Soft blue
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();

      switch (shape) {
        case "circle":
          ctx.arc(centerX, centerY, 85, 0, 2 * Math.PI);
          break;
        case "triangle":
          const triangleSize = 95;
          const height = (triangleSize * Math.sqrt(3)) / 2;
          ctx.moveTo(centerX, centerY - height / 2);
          ctx.lineTo(centerX - triangleSize / 2, centerY + height / 2);
          ctx.lineTo(centerX + triangleSize / 2, centerY + height / 2);
          ctx.closePath();
          break;
        case "square":
          const squareSize = 110;
          ctx.rect(
            centerX - squareSize / 2,
            centerY - squareSize / 2,
            squareSize,
            squareSize
          );
          break;
        case "umbrella":
          // Umbrella dome
          ctx.arc(centerX, centerY - 15, 75, Math.PI, 0);
          // Handle
          ctx.moveTo(centerX, centerY - 15);
          ctx.lineTo(centerX, centerY + 75);
          // Handle curve
          ctx.arc(centerX + 12, centerY + 75, 12, Math.PI, Math.PI / 2, true);
          break;
      }

      ctx.stroke();
      ctx.setLineDash([]);
    },
    [centerX, centerY]
  );

  const drawUserPath = useCallback(
    (ctx: CanvasRenderingContext2D, path: Point[]) => {
      if (path.length < 2) return;

      const shapeConfig = SHAPES[selectedShape];
      ctx.strokeStyle = shapeConfig.strokeColor;
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = shapeConfig.shadowColor;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);

      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    },
    [selectedShape]
  );

  const drawPerfectShape = useCallback(
    (ctx: CanvasRenderingContext2D, shape: ShapeType) => {
      ctx.strokeStyle = "#86EFAC"; // Soft green
      ctx.lineWidth = 3;
      ctx.setLineDash([4, 4]);
      ctx.shadowColor = "rgba(134, 239, 172, 0.4)";
      ctx.shadowBlur = 8;
      ctx.beginPath();

      switch (shape) {
        case "circle":
          ctx.arc(centerX, centerY, 85, 0, 2 * Math.PI);
          break;
        case "triangle":
          const triangleSize = 95;
          const height = (triangleSize * Math.sqrt(3)) / 2;
          ctx.moveTo(centerX, centerY - height / 2);
          ctx.lineTo(centerX - triangleSize / 2, centerY + height / 2);
          ctx.lineTo(centerX + triangleSize / 2, centerY + height / 2);
          ctx.closePath();
          break;
        case "square":
          const squareSize = 110;
          ctx.rect(
            centerX - squareSize / 2,
            centerY - squareSize / 2,
            squareSize,
            squareSize
          );
          break;
        case "umbrella":
          ctx.arc(centerX, centerY - 15, 75, Math.PI, 0);
          ctx.moveTo(centerX, centerY - 15);
          ctx.lineTo(centerX, centerY + 75);
          ctx.arc(centerX + 12, centerY + 75, 12, Math.PI, Math.PI / 2, true);
          break;
      }

      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;
    },
    [centerX, centerY]
  );

  const calculateScore = useCallback(
    (path: Point[], shape: ShapeType): number => {
      if (path.length < 10) return 0;

      let totalDeviation = 0;
      let validPoints = 0;

      switch (shape) {
        case "circle":
          const targetRadius = 85;
          for (const point of path) {
            const distanceFromCenter = Math.sqrt(
              Math.pow(point.x - centerX, 2) + Math.pow(point.y - centerY, 2)
            );
            const deviation = Math.abs(distanceFromCenter - targetRadius);
            totalDeviation += deviation;
            validPoints++;
          }
          break;

        case "triangle":
          const triangleVertices = [
            { x: centerX, y: centerY - 45 },
            { x: centerX - 82, y: centerY + 45 },
            { x: centerX + 82, y: centerY + 45 },
          ];

          for (const point of path) {
            let minDistance = Number.POSITIVE_INFINITY;
            for (let i = 0; i < 3; i++) {
              const v1 = triangleVertices[i];
              const v2 = triangleVertices[(i + 1) % 3];
              const distance = distanceToLineSegment(point, v1, v2);
              minDistance = Math.min(minDistance, distance);
            }
            totalDeviation += minDistance;
            validPoints++;
          }
          break;

        case "square":
          const squareEdges = [
            [
              { x: centerX - 55, y: centerY - 55 },
              { x: centerX + 55, y: centerY - 55 },
            ],
            [
              { x: centerX + 55, y: centerY - 55 },
              { x: centerX + 55, y: centerY + 55 },
            ],
            [
              { x: centerX + 55, y: centerY + 55 },
              { x: centerX - 55, y: centerY + 55 },
            ],
            [
              { x: centerX - 55, y: centerY + 55 },
              { x: centerX - 55, y: centerY - 55 },
            ],
          ];

          for (const point of path) {
            let minDistance = Number.POSITIVE_INFINITY;
            for (const [v1, v2] of squareEdges) {
              const distance = distanceToLineSegment(point, v1, v2);
              minDistance = Math.min(minDistance, distance);
            }
            totalDeviation += minDistance;
            validPoints++;
          }
          break;

        case "umbrella":
          for (const point of path) {
            const arcDistance = Math.abs(
              Math.sqrt(
                Math.pow(point.x - centerX, 2) +
                  Math.pow(point.y - (centerY - 15), 2)
              ) - 75
            );
            const handleDistance = Math.abs(point.x - centerX);
            const minDistance = Math.min(arcDistance, handleDistance);
            totalDeviation += minDistance;
            validPoints++;
          }
          break;
      }

      if (validPoints === 0) return 0;

      const averageDeviation = totalDeviation / validPoints;
      const maxDeviation = SHAPES[shape].difficulty * 30;
      const rawScore = Math.max(
        0,
        100 - (averageDeviation / maxDeviation) * 100
      );

      // Closure bonus
      const startPoint = path[0];
      const endPoint = path[path.length - 1];
      const closureDistance = Math.sqrt(
        Math.pow(endPoint.x - startPoint.x, 2) +
          Math.pow(endPoint.y - startPoint.y, 2)
      );
      const closureBonus = closureDistance < 35 ? 8 : 0;

      return Math.min(100, rawScore + closureBonus);
    },
    [centerX, centerY]
  );

  const distanceToLineSegment = (
    point: Point,
    lineStart: Point,
    lineEnd: Point
  ): number => {
    const A = point.x - lineStart.x;
    const B = point.y - lineStart.y;
    const C = lineEnd.x - lineStart.x;
    const D = lineEnd.y - lineStart.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;

    if (param < 0) {
      xx = lineStart.x;
      yy = lineStart.y;
    } else if (param > 1) {
      xx = lineEnd.x;
      yy = lineEnd.y;
    } else {
      xx = lineStart.x + param * C;
      yy = lineStart.y + param * D;
    }

    const dx = point.x - xx;
    const dy = point.y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const calculateUserRank = useCallback(
    (score: number, shape: ShapeType): number => {
      const shapeRankings = rankings[shape];
      const betterScores = shapeRankings.filter(
        (player) => player.score > score
      ).length;
      return betterScores + 1;
    },
    [rankings]
  );

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear with subtle gradient background
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      canvasSize / 2
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.9)");
    gradient.addColorStop(1, "rgba(248, 250, 252, 0.9)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    if (gameState === "drawing" || gameState === "countdown") {
      drawGuideShape(ctx, selectedShape);
    }

    if (userPath.length > 0) {
      drawUserPath(ctx, userPath);
    }

    if (showComparison) {
      drawPerfectShape(ctx, selectedShape);
    }
  }, [
    gameState,
    userPath,
    showComparison,
    selectedShape,
    drawGuideShape,
    drawUserPath,
    drawPerfectShape,
    centerX,
  ]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Timer effects
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (gameState === "countdown") {
      interval = setInterval(() => {
        setCountdownNumber((prev) => {
          if (prev <= 1) {
            setGameState("drawing");
            setTimeLeft(5);
            return 3;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (gameState === "drawing") {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState("timeout");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameState]);

  const getEventPos = (e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvasSize / rect.width;
    const scaleY = canvasSize / rect.height;

    if ("touches" in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (gameState !== "drawing") return;
    e.preventDefault();
    setIsDrawing(true);
    const pos = getEventPos(e);
    setUserPath([pos]);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || gameState !== "drawing") return;
    e.preventDefault();
    const pos = getEventPos(e);
    setUserPath((prev) => [...prev, pos]);
  };

  const stopDrawing = () => {
    if (!isDrawing || gameState !== "drawing") return;
    setIsDrawing(false);
    setGameState("results");

    const finalScore = calculateScore(userPath, selectedShape);
    setUserScore(finalScore);
    setUserRank(calculateUserRank(finalScore, selectedShape));

    if (finalScore >= 85) {
      createParticles();
    }

    setTimeout(() => {
      setShowComparison(true);
    }, 1000);
  };

  const resetGame = () => {
    setGameState("idle");
    setIsDrawing(false);
    setUserPath([]);
    setUserScore(null);
    setUserRank(null);
    setShowComparison(false);
    setTimeLeft(5);
    setCountdownNumber(3);
    setShowMobileRankings(false);
    setParticles([]);
  };

  const startGame = () => {
    setGameState("countdown");
    setCountdownNumber(3);
  };

  const handleShapeChange = (shape: ShapeType) => {
    if (gameState === "idle" || gameState === "results") {
      setSelectedShape(shape);
      if (gameState === "results") {
        resetGame();
      }
    }
  };

  const shareScore = (platform: string) => {
    if (userScore === null) return;

    const shapeName = SHAPES[selectedShape].name;
    const emoji = SHAPES[selectedShape].emoji;
    const text = `${emoji} I scored ${userScore.toFixed(
      2
    )}% drawing a perfect ${shapeName}! Can you beat my precision? ✨`;
    const url = window.location.href;

    switch (platform) {
      case "kakao":
        console.log("Share to KakaoTalk:", text);
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}&url=${encodeURIComponent(url)}`
        );
        break;
      case "instagram":
        navigator.clipboard.writeText(`${text} ${url}`);
        alert(
          "링크가 복사되었습니다! 인스타그램 스토리에 붙여넣어 주세요 📋✨"
        );
        break;
      default:
        navigator.clipboard.writeText(`${text} ${url}`);
        alert("링크가 복사되었습니다! 📋");
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-4 h-4 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-gray-300" />;
    if (rank === 3) return <Award className="w-4 h-4 text-amber-500" />;
    return <span className="text-xs font-medium text-gray-400">#{rank}</span>;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 95) return "text-emerald-500";
    if (score >= 90) return "text-sky-500";
    if (score >= 80) return "text-purple-500";
    if (score >= 70) return "text-pink-500";
    return "text-gray-500";
  };

  const getScoreMessage = (score: number): string => {
    if (score >= 95) return "🎯 Absolutely Perfect! You're a master!";
    if (score >= 90) return "⭐ Outstanding! Nearly flawless!";
    if (score >= 85) return "🔥 Excellent! Amazing precision!";
    if (score >= 80) return "✨ Great job! Very impressive!";
    if (score >= 70) return "👏 Good work! Keep it up!";
    if (score >= 60) return "👍 Not bad! Practice makes perfect!";
    return "💪 Keep practicing! You've got this!";
  };

  const currentRankings = rankings[selectedShape] || [];
  const currentShape = SHAPES[selectedShape];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-sky-50 relative overflow-hidden">
      {/* Floating particles for celebration */}
      {particles.map((particle, i) => (
        <div
          key={i}
          className={`absolute text-2xl animate-particle pointer-events-none z-10 animate-particle-${i}`} /* 적절한 클래스로 대체 */
          style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
        >
          {particle.emoji}
        </div>
      ))}

      <div className="container mx-auto px-4 py-6 relative z-20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-700">
              Perfect Shape Challenge
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-sky-500 bg-clip-text text-transparent mb-2">
            Draw Perfect Shapes
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Test your precision and compete with friends! ✨
          </p>
        </div>

        {/* Shape Selector */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(SHAPES).map(([key, shape]) => (
              <button
                key={key}
                onClick={() => handleShapeChange(key as ShapeType)}
                disabled={gameState === "drawing" || gameState === "countdown"}
                className={`group relative p-4 rounded-2xl transition-all duration-300 ${
                  selectedShape === key
                    ? `bg-gradient-to-br ${shape.gradient} text-white shadow-lg scale-105`
                    : "bg-white/70 hover:bg-white/90 text-gray-700 hover:scale-102 shadow-sm hover:shadow-md"
                } ${
                  gameState === "drawing" || gameState === "countdown"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                    {shape.emoji}
                  </div>
                  <div className="font-bold text-sm mb-1">{shape.name}</div>
                  <div className="text-xs opacity-75">{shape.description}</div>
                  {selectedShape === key && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                    </div>
                  )}
                  <div className="flex justify-center mt-2">
                    {Array.from({ length: shape.difficulty }, (_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Main Game Area */}
          <div className="lg:col-span-2">
            {/* Timer Display */}
            {(gameState === "drawing" || gameState === "countdown") && (
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-purple-100">
                  <Timer className="w-6 h-6 text-purple-500" />
                  <span className="font-bold text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {gameState === "countdown" ? countdownNumber : timeLeft}
                  </span>
                </div>
              </div>
            )}

            {/* Canvas Container */}
            <Card className="bg-gradient-to-br from-white/80 via-purple-50/30 to-pink-50/30 backdrop-blur-sm shadow-2xl border-0 overflow-hidden mb-6">
              <CardContent className="p-8">
                <div className="relative">
                  <div className="bg-gradient-to-br from-white/90 via-sky-50/40 to-purple-50/40 rounded-3xl p-6 shadow-inner backdrop-blur-sm">
                    <canvas
                      ref={canvasRef}
                      width={canvasSize}
                      height={canvasSize}
                      className="w-full h-auto max-w-[320px] mx-auto block rounded-2xl shadow-xl cursor-crosshair touch-none border-2 border-white/50"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      style={{ touchAction: "none" }}
                    />
                  </div>

                  {/* Game State Overlays */}
                  {gameState === "idle" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-3xl">
                      <div className="text-center p-6">
                        <div className="text-7xl mb-4 animate-pulse">
                          {currentShape.emoji}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">
                          Ready to Draw?
                        </h3>
                        <p className="text-gray-600 text-sm mb-6 leading-relaxed max-w-xs">
                          {currentShape.description} in 5 seconds!
                          <br />
                          <span className="text-purple-600 font-medium">
                            Follow the dotted guide closely ✨
                          </span>
                        </p>
                        <Button
                          onClick={startGame}
                          size="lg"
                          className={`bg-gradient-to-r ${currentShape.gradient} hover:opacity-90 text-white rounded-full px-8 py-4 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 font-bold`}
                        >
                          <Play className="w-5 h-5 mr-2" />
                          <span className="sr-only">게임 시작</span>
                          Start Drawing
                        </Button>
                      </div>
                    </div>
                  )}

                  {gameState === "countdown" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-3xl">
                      <div className="text-center">
                        <div className="text-9xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-sky-600 bg-clip-text text-transparent animate-pulse mb-4">
                          {countdownNumber}
                        </div>
                        <p className="text-gray-600 text-xl font-medium">
                          Get ready to draw...
                        </p>
                        <div className="mt-4 flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {gameState === "timeout" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-3xl">
                      <div className="text-center p-6">
                        <div className="text-7xl mb-4 animate-bounce">⏱️</div>
                        <h3 className="text-2xl font-bold text-pink-600 mb-3">
                          Time's Up!
                        </h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          Oops! You didn't finish your{" "}
                          {currentShape.name.toLowerCase()} in time.
                          <br />
                          <span className="text-sm text-purple-600">
                            ⚡ Try to be faster next time!
                          </span>
                        </p>
                        <Button
                          onClick={resetGame}
                          className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-all"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Try Again
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Results Panel */}
            {gameState === "results" && userScore !== null && (
              <Card className="bg-gradient-to-br from-white/90 via-purple-50/50 to-pink-50/50 backdrop-blur-sm shadow-2xl border-0">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-6">
                      <Target className="w-8 h-8 text-emerald-500 mr-3" />
                      <h3 className="text-2xl font-bold text-gray-800">
                        Your {currentShape.name} Score
                      </h3>
                    </div>

                    <div
                      className={`text-6xl font-bold mb-4 ${getScoreColor(
                        userScore
                      )}`}
                    >
                      {userScore.toFixed(2)}%
                    </div>

                    <p className="text-gray-600 text-lg mb-6 leading-relaxed font-medium">
                      {getScoreMessage(userScore)}
                    </p>

                    {userRank && (
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-3 mb-6 shadow-lg">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                        <span className="text-lg font-bold text-purple-700">
                          Rank #{userRank} • {currentRankings.length} players
                        </span>
                      </div>
                    )}

                    {showComparison && (
                      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg">
                        <div className="text-sm text-gray-600 mb-3 font-medium">
                          Shape Comparison
                        </div>
                        <div className="flex items-center justify-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-5 h-5 rounded-full shadow-sm"
                              style={{
                                backgroundColor: currentShape.strokeColor,
                              }}
                            ></div>
                            <span className="text-gray-700 font-medium">
                              Your {currentShape.name.toLowerCase()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-emerald-400 border-dashed rounded-full"></div>
                            <span className="text-gray-700 font-medium">
                              Perfect {currentShape.name.toLowerCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Performance Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="bg-sky-100/80 backdrop-blur-sm rounded-2xl p-4 border border-sky-200/50 shadow-sm">
                        <div className="text-2xl font-bold text-sky-600">
                          {userPath.length}
                        </div>
                        <div className="text-xs text-gray-600 font-medium">
                          Drawing Points
                        </div>
                      </div>
                      <div className="bg-purple-100/80 backdrop-blur-sm rounded-2xl p-4 border border-purple-200/50 shadow-sm">
                        <div className="text-2xl font-bold text-purple-600">
                          {userScore >= 90
                            ? "🏆"
                            : userScore >= 80
                            ? "🥈"
                            : userScore >= 70
                            ? "🥉"
                            : "⭐"}
                        </div>
                        <div className="text-xs text-gray-600 font-medium">
                          Achievement
                        </div>
                      </div>
                      <div className="bg-emerald-100/80 backdrop-blur-sm rounded-2xl p-4 border border-emerald-200/50 shadow-sm">
                        <div className="text-2xl font-bold text-emerald-600">
                          {5 - timeLeft}s
                        </div>
                        <div className="text-xs text-gray-600 font-medium">
                          Completion Time
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Share Buttons */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Share2 className="w-5 h-5 text-purple-600" />
                        <span className="text-lg font-bold text-gray-800">
                          Share Your Achievement!
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <Button
                          onClick={() => shareScore("kakao")}
                          className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-2xl px-4 py-4 shadow-lg hover:shadow-xl transition-all flex flex-col items-center gap-2 h-auto font-bold"
                        >
                          <span className="text-2xl">💬</span>
                          <span className="text-sm">KakaoTalk</span>
                        </Button>
                        <Button
                          onClick={() => shareScore("twitter")}
                          className="bg-sky-400 hover:bg-sky-500 text-white rounded-2xl px-4 py-4 shadow-lg hover:shadow-xl transition-all flex flex-col items-center gap-2 h-auto font-bold"
                        >
                          <span className="text-2xl">🐦</span>
                          <span className="text-sm">Twitter</span>
                        </Button>
                        <Button
                          onClick={() => shareScore("instagram")}
                          className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl px-4 py-4 shadow-lg hover:shadow-xl transition-all flex flex-col items-center gap-2 h-auto font-bold"
                        >
                          <span className="text-2xl">📷</span>
                          <span className="text-sm">Instagram</span>
                        </Button>
                      </div>

                      <Button
                        onClick={resetGame}
                        variant="outline"
                        className="w-full rounded-2xl px-8 py-4 border-2 border-gray-300 text-gray-700 hover:bg-white/80 bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all font-bold"
                      >
                        <RotateCcw className="w-5 h-5 mr-2" />
                        Try Again
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Mobile Rankings Toggle */}
            <div className="lg:hidden mt-8">
              <Button
                onClick={() => setShowMobileRankings(!showMobileRankings)}
                variant="outline"
                className="w-full rounded-2xl px-6 py-4 border-2 border-purple-200 text-purple-600 hover:bg-purple-50 bg-white/70 backdrop-blur-sm shadow-lg transition-all font-bold"
              >
                <Trophy className="w-5 h-5 mr-2" />
                {showMobileRankings
                  ? "Hide Rankings"
                  : `View ${currentShape.name} Rankings`}
              </Button>
            </div>
          </div>
        </div>
        {/* Enhanced Rankings Panel */}
        <div
          className={`lg:block ${
            showMobileRankings ? "block" : "hidden"
          } mt-8 lg:mt-0`}
        >
          <Card className="bg-gradient-to-br from-white/90 via-purple-50/50 to-pink-50/50 backdrop-blur-sm shadow-2xl border-0 h-fit lg:sticky lg:top-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-2xl">{currentShape.emoji}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">
                    {currentShape.name} Leaderboard
                  </h3>
                  <p className="text-sm text-gray-600">
                    {currentShape.description}
                  </p>
                </div>
                <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0 font-bold">
                  <Users className="w-3 h-3 mr-1" />
                  {currentRankings.length}
                </Badge>
              </div>

              {/* Top 3 Podium */}
              <div className="mb-6">
                <div className="flex items-end justify-center gap-2 mb-4">
                  {currentRankings.slice(0, 3).map((player, index) => (
                    <div
                      key={player.rank}
                      className={`text-center ${
                        index === 0
                          ? "order-2"
                          : index === 1
                          ? "order-1"
                          : "order-3"
                      }`}
                    >
                      <div className="text-2xl mb-1">{player.avatar}</div>
                      <div
                        className={`rounded-t-lg px-3 py-2 ${
                          index === 0
                            ? "bg-gradient-to-t from-yellow-200 to-yellow-100 h-16"
                            : index === 1
                            ? "bg-gradient-to-t from-gray-200 to-gray-100 h-12"
                            : "bg-gradient-to-t from-amber-200 to-amber-100 h-8"
                        }`}
                      >
                        <div className="text-xs font-bold text-gray-700">
                          {player.name.split("")[0]}
                        </div>
                        <div className="text-xs text-gray-600">
                          {player.score.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rankings List */}
              <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent">
                {currentRankings.slice(0, 50).map((player) => (
                  <div
                    key={player.rank}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      player.rank <= 3
                        ? "bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 shadow-sm"
                        : "bg-white/70 hover:bg-white/90 shadow-sm hover:shadow-md"
                    }`}
                  >
                    <div className="flex-shrink-0 w-8 flex justify-center">
                      {getRankIcon(player.rank)}
                    </div>
                    <div className="text-lg">{player.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-800 truncate text-sm">
                        {player.name}
                      </div>
                    </div>
                    <div
                      className={`text-sm font-bold ${getScoreColor(
                        player.score
                      )}`}
                    >
                      {player.score.toFixed(2)}%
                    </div>
                  </div>
                ))}
              </div>

              {/* User's Rank */}
              {userScore !== null && userRank !== null && (
                <div className="mt-6 pt-4 border-t border-purple-200">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200 shadow-lg">
                    <div className="flex-shrink-0 w-8 flex justify-center">
                      {getRankIcon(userRank)}
                    </div>
                    <div className="text-lg">🔻</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-purple-800 text-sm">
                        You
                      </div>
                    </div>
                    <div
                      className={`text-sm font-bold ${getScoreColor(
                        userScore
                      )}`}
                    >
                      {userScore.toFixed(2)}%
                    </div>
                  </div>
                  <div className="text-center mt-3">
                    <span className="text-sm text-gray-600 font-medium">
                      🏆 Rank #{userRank} in {currentShape.name} •{" "}
                      {currentRankings.length} total players
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 text-4xl opacity-20 animate-pulse">
        <Heart className="w-8 h-8 text-pink-300" />
      </div>
      <div className="absolute top-40 right-20 text-4xl opacity-20 animate-bounce">
        <Star className="w-6 h-6 text-purple-300" />
      </div>
      <div className="absolute bottom-40 left-20 text-4xl opacity-20 animate-pulse">
        <Sparkles className="w-7 h-7 text-sky-300" />
      </div>
    </div>
  );
}
