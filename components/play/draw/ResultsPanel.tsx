// /components/ResultsPanel.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Share2, Trophy, Zap } from "lucide-react";
import type { ShapeType } from "@/types/play/draw";
import { SHAPES } from "@/constants/play/draw";

import { getScoreColor, getScoreMessage } from "@/lib/utils";
interface ResultsPanelProps {
  userScore: number;
  userRank: number | null;
  completionTime: number;
  selectedShape: ShapeType;
  showComparison: boolean;
  onResetGame: () => void;
  onShare: (platform: "kakao" | "twitter" | "copy") => void;
}

export function ResultsPanel({
  userScore,
  userRank,
  completionTime,
  selectedShape,
  showComparison,
  onResetGame,
  onShare,
}: ResultsPanelProps) {
  const currentShape = SHAPES[selectedShape];

  return (
    <Card className="bg-gradient-to-br from-white/90 via-purple-50/50 to-pink-50/50 backdrop-blur-sm shadow-xl border-0 animate-fade-in">
      <CardContent className="p-6 sm:p-8">
        <div className="text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            Your Result
          </h3>
          <p
            className={`text-5xl sm:text-6xl font-bold mb-3 ${getScoreColor(
              userScore
            )}`}
          >
            {userScore.toFixed(2)}%
          </p>
          <p className="text-gray-600 text-base sm:text-lg mb-4 font-medium">
            {getScoreMessage(userScore)}
          </p>

          <div className="flex justify-center items-center gap-4 mb-6">
            {userRank && (
              <Badge
                variant="outline"
                className="text-base bg-white/50 border-purple-200 text-purple-700 font-bold px-4 py-2"
              >
                <Trophy className="w-4 h-4 mr-2 text-yellow-500" /> Rank #
                {userRank}
              </Badge>
            )}
            <Badge
              variant="outline"
              className="text-base bg-white/50 border-pink-200 text-pink-700 font-bold px-4 py-2"
            >
              <Zap className="w-4 h-4 mr-2 text-orange-400" />{" "}
              {completionTime.toFixed(2)}s
            </Badge>
          </div>

          {showComparison && (
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 mb-6 shadow-sm text-xs sm:text-sm">
              <div className="flex items-center justify-center gap-4 text-gray-700">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: currentShape.strokeColor }}
                  ></div>
                  <span>Your line</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-emerald-400 border-dashed rounded-full"></div>
                  <span>Perfect line</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-bold text-gray-700">
                Share Your Score!
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={() => onShare("kakao")}
                className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-lg px-2 py-3 shadow-md h-auto font-bold flex flex-col items-center gap-1.5"
              >
                <span className="text-xl">💬</span>
                <span className="text-xs">Kakao</span>
              </Button>
              <Button
                onClick={() => onShare("twitter")}
                className="bg-sky-400 hover:bg-sky-500 text-white rounded-lg px-2 py-3 shadow-md h-auto font-bold flex flex-col items-center gap-1.5"
              >
                <span className="text-xl">🐦</span>
                <span className="text-xs">Twitter</span>
              </Button>
              <Button
                onClick={() => onShare("copy")}
                className="bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg px-2 py-3 shadow-md h-auto font-bold flex flex-col items-center gap-1.5"
              >
                <span className="text-xl">📋</span>
                <span className="text-xs">Copy Link</span>
              </Button>
            </div>
            <Button
              onClick={onResetGame}
              variant="outline"
              className="w-full rounded-lg py-3 border-gray-300 text-gray-700 hover:bg-gray-100 bg-white/80 shadow-sm font-bold"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
