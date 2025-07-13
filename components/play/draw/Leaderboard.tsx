// /components/Leaderboard.tsx

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Medal, Award, Users } from "lucide-react";
import type { Player, ShapeType } from "@/types/play/draw";
import { SHAPES } from "@/constants/play/draw";
import { getScoreColor } from "@/lib/utils";

interface LeaderboardProps {
  rankings: Player[];
  selectedShape: ShapeType;
  userScore: number | null;
  userRank: number | null;
  isVisible: boolean; // 모바일에서 표시 여부
}

export function Leaderboard({
  rankings,
  selectedShape,
  userScore,
  userRank,
  isVisible,
}: LeaderboardProps) {
  const currentShape = SHAPES[selectedShape];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-4 h-4 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-gray-300" />;
    if (rank === 3) return <Award className="w-4 h-4 text-amber-500" />;
    return <span className="text-xs font-medium text-gray-400">#{rank}</span>;
  };

  return (
    <aside
      className={`lg:block ${
        isVisible ? "block animate-fade-in" : "hidden"
      } mt-8 lg:mt-0`}
    >
      <Card className="bg-gradient-to-br from-white/90 via-purple-50/50 to-pink-50/50 backdrop-blur-sm shadow-xl border-0 h-fit lg:sticky lg:top-8">
        <CardContent className="p-4 sm:p-6">
          <header className="flex items-center gap-3 mb-4">
            <div className="text-2xl">{currentShape.emoji}</div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                {currentShape.name} Board
              </h3>
            </div>
            <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0 font-bold">
              <Users className="w-3 h-3 mr-1.5" />
              {rankings.length}
            </Badge>
          </header>

          <div className="space-y-2 max-h-[25rem] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent pr-1">
            {rankings.slice(0, 50).map((player) => (
              <div
                key={player.rank}
                className={`flex items-center gap-3 p-2.5 rounded-lg transition-all ${
                  player.rank <= 3
                    ? "bg-white"
                    : "bg-white/60 hover:bg-white/90"
                }`}
              >
                <div className="flex-shrink-0 w-6 text-center">
                  {getRankIcon(player.rank)}
                </div>
                <div className="text-lg">{player.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-800 truncate text-sm">
                    {player.name}
                  </div>
                </div>
                <div
                  className={`text-sm font-bold ${getScoreColor(player.score)}`}
                >
                  {player.score.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>

          {userScore !== null && userRank !== null && (
            <div className="mt-4 pt-4 border-t border-purple-200">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200 shadow-lg">
                <div className="flex-shrink-0 w-6 text-center">
                  {getRankIcon(userRank)}
                </div>
                <div className="text-lg">🔻</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-purple-800 text-sm">You</div>
                </div>
                <div
                  className={`text-sm font-bold ${getScoreColor(userScore)}`}
                >
                  {userScore.toFixed(2)}%
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </aside>
  );
}
