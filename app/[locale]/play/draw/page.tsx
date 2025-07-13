"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Play,
  RotateCcw,
  Timer,
  Trophy,
  Sparkles,
  Heart,
  Star,
} from "lucide-react";

// 우리가 분리한 훅과 유틸리티, 상수를 가져옵니다.

import { shareScore } from "@/lib/utils";
import { SHAPES } from "@/constants/play/draw";
import { useGameLogic } from "@/hooks/useGameLogic";
import { GameCanvas } from "@/components/play/draw/GameCanvas";
import { Leaderboard } from "@/components/play/draw/Leaderboard";
import { ShapeSelector } from "@/components/play/draw/ShapeSelector";
import { ResultsPanel } from "@/components/play/draw/ResultsPanel";

export default function DrawPage() {
  // 게임의 모든 상태와 로직은 이 훅이 관리합니다.
  const game = useGameLogic("triangle");
  const currentShape = SHAPES[game.selectedShape];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-sky-50 relative overflow-hidden">
      {/* 파티클 효과 */}
      {game.particles.map((particle, i) => (
        <div
          key={i}
          className={`absolute text-2xl animate-particle pointer-events-none z-10`}
          style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
        >
          {particle.emoji}
        </div>
      ))}

      <div className="container mx-auto px-4 py-6 sm:py-8 relative z-20">
        {/* 헤더 */}
        <header className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-xs sm:text-sm font-medium text-purple-700">
              Perfect Shape Challenge
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-sky-500 bg-clip-text text-transparent mb-2">
            Draw Perfect Shapes
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
            Test your precision and see how you rank against others! ✨
          </p>
        </header>

        <main className="max-w-7xl mx-auto">
          {/* 1. 도형 선택기 컴포넌트 */}
          <ShapeSelector
            selectedShape={game.selectedShape}
            onShapeChange={game.handleShapeChange}
            gameState={game.gameState}
          />

          {/* 게임 영역 */}
          <div className="">
            <div className="">
              {/* 타이머 */}
              {(game.gameState === "drawing" ||
                game.gameState === "countdown") && (
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 sm:px-6 sm:py-3 shadow-lg border border-purple-100">
                    <Timer
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${
                        game.gameState === "drawing"
                          ? "text-pink-500 animate-pulse"
                          : "text-purple-500"
                      }`}
                    />
                    <span className="font-bold text-2xl sm:text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent w-20 text-center">
                      {game.gameState === "countdown"
                        ? game.countdownNumber
                        : `${game.elapsedTime.toFixed(1)}s`}
                    </span>
                  </div>
                </div>
              )}

              {/* 2. 캔버스 및 오버레이 컴포넌트 */}
              <Card className="bg-gradient-to-br from-white/80 via-purple-50/30 to-pink-50/30 backdrop-blur-sm shadow-xl border-0 overflow-hidden mb-6">
                <CardContent className="p-4 sm:p-6">
                  <div className="relative aspect-square max-w-sm mx-auto">
                    <GameCanvas
                      gameState={game.gameState}
                      selectedShape={game.selectedShape}
                      userPath={game.userPath}
                      showComparison={game.showComparison}
                      setUserPath={game.setUserPath}
                      onStopDrawing={game.stopDrawing}
                    />

                    {/* 게임 상태에 따른 오버레이 UI */}
                    {game.gameState === "idle" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl">
                        <div className="w-full text-center p-4">
                          <div className="text-6xl sm:text-7xl mb-4 animate-pulse">
                            {currentShape.emoji}
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                            {currentShape.description}
                          </h3>
                          <p className="text-gray-600 text-sm mb-6">
                            Draw as fast and accurately as you can!
                          </p>
                          <Button
                            onClick={game.startGame}
                            size="lg"
                            className={`bg-gradient-to-r ${currentShape.gradient} hover:opacity-90 text-white rounded-full px-8 py-3 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 font-bold`}
                          >
                            <Play className="w-5 h-5 mr-2" />
                            Start Drawing
                          </Button>
                        </div>
                      </div>
                    )}
                    {game.gameState === "countdown" && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl">
                        <div className="text-8xl sm:text-9xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-sky-600 bg-clip-text text-transparent animate-pulse">
                          {game.countdownNumber}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 3. 결과 패널 컴포넌트 */}
              {game.gameState === "results" &&
                game.userScore !== null &&
                game.completionTime !== null && (
                  <ResultsPanel
                    userScore={game.userScore}
                    userRank={game.userRank}
                    completionTime={game.completionTime}
                    selectedShape={game.selectedShape}
                    showComparison={game.showComparison}
                    onResetGame={game.resetGame}
                    onShare={(platform) =>
                      shareScore(platform, game.userScore, currentShape)
                    }
                  />
                )}
            </div>

            {/* 모바일 랭킹 토글 */}
            <div className="lg:hidden mt-6 text-center">
              <Button
                onClick={() =>
                  game.setShowMobileRankings(!game.showMobileRankings)
                }
                variant="outline"
                className="rounded-full px-6 py-3 border-2 border-purple-200 text-purple-600 hover:bg-purple-50 bg-white/70 backdrop-blur-sm shadow-md transition-all font-bold"
              >
                <Trophy className="w-5 h-5 mr-2" />
                {game.showMobileRankings
                  ? "Hide Rankings"
                  : `View ${currentShape.name} Rankings`}
              </Button>
            </div>
          </div>

          {/* 4. 리더보드 컴포넌트 */}
          <Leaderboard
            rankings={game.rankings[game.selectedShape] || []}
            selectedShape={game.selectedShape}
            userRank={game.userRank}
            userScore={game.userScore}
            isVisible={game.showMobileRankings}
          />
        </main>
      </div>

      {/* 장식용 아이콘 */}
      <div className="absolute top-20 left-10 text-4xl opacity-10 animate-pulse">
        <Heart className="w-8 h-8 text-pink-300" />
      </div>
      <div className="absolute top-1/2 right-10 text-4xl opacity-10 animate-bounce">
        <Star className="w-6 h-6 text-purple-300" />
      </div>
      <div className="absolute bottom-20 left-1/4 text-4xl opacity-10 animate-pulse">
        <Sparkles className="w-7 h-7 text-sky-300" />
      </div>
    </div>
  );
}
