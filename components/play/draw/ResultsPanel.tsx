// /components/play/draw/ResultsPanel.tsx

"use client";
import React, { use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Share2, Trophy, Timer } from "lucide-react";
import type { ShapeType } from "@/types/play/draw";
import { SHAPES } from "@/constants/play/draw";
import { useTranslation } from "react-i18next";
import { useAlert } from "@/components/modal/alert-context";
import { FaFacebook } from "react-icons/fa";

// api
import { getScoreColor, getScoreMessage } from "@/lib/utils";
import { useLanguageStore } from "@/store/useLanguageStore";
interface ResultsPanelProps {
  userScore: number;
  userRank: number | null;
  completionTime: number;
  selectedShape: ShapeType;
  showComparison: boolean;
  onResetGame: (startImmediately: boolean) => void;
}

export function ResultsPanel({
  userScore,
  userRank,
  completionTime,
  selectedShape,
  showComparison,
  onResetGame,
}: ResultsPanelProps) {
  const { t } = useTranslation("common");
  const customAlert = useAlert();
  const language = useLanguageStore((state) => state.currentLanguage);

  const handleShare = async (platform: string) => {
    // 4. 공유 URL에도 locale을 포함합니다.
    const shareUrl = `https://testy.im/${language}/play/draw`;
    const shareText = `🤩 ${t("draw.title1")}`;

    if (platform === "twitter") {
      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(shareUrl)}`;
      window.open(tweetUrl, "_blank", "noopener,noreferrer");
    }
    if (platform === "facebook") {
      const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`;
      window.open(fbShareUrl, "_blank", "noopener,noreferrer");
    }
    if (platform === "copy") {
      await navigator.clipboard.writeText(shareUrl);
      await customAlert({
        title: t("alert.copySuccessTitle"),
        message: t("alert.copySuccessMessage"),
        confirmText: t("alert.confirm"),
      });
    }
  };

  return (
    <Card className="bg-gradient-to-br from-white/90 via-purple-50/50 to-pink-50/50 dark:from-gray-800/90 dark:via-purple-900/40 dark:to-pink-900/40 backdrop-blur-sm shadow-xl border-0 animate-fade-in">
      <CardContent className="p-6 sm:p-8">
        <div className="text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {t("draw.result.score")}
          </h3>
          <p
            className={`text-5xl sm:text-6xl font-bold mb-3 ${getScoreColor(
              userScore
            )}`}
          >
            {userScore.toFixed(2)}%
          </p>

          <div className="flex justify-center items-center gap-4 mb-6">
            {userRank && (
              <Badge
                variant="outline"
                className="text-base bg-white/50 dark:bg-gray-700/50 border-purple-200 dark:border-purple-600/50 text-purple-700 dark:text-purple-300 font-bold px-4 py-2"
              >
                <Trophy className="w-4 h-4 mr-2 text-yellow-500" /> Rank #
                {userRank}
              </Badge>
            )}
            <Badge
              variant="outline"
              className="text-base bg-white/50 dark:bg-gray-700/50 border-pink-200 dark:border-pink-500/50 text-pink-700 dark:text-pink-300 font-bold px-4 py-2"
            >
              <Timer className="w-4 h-4 mr-2 text-orange-400" />{" "}
              {completionTime.toFixed(2)}s
            </Badge>
          </div>

          <div className="p-3 mb-6 ">
            <Button
              onClick={() => onResetGame(true)}
              variant="outline"
              className="w-full rounded-lg py-3 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 bg-white/80 dark:bg-gray-800/80 shadow-sm font-bold"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t("draw.result.retry")}
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                {t("draw.result.share")}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={() => handleShare("facebook")}
                className="bg-gradient-to-tr from-blue-600 via-blue-500 to-blue-400 hover:opacity-90 text-white rounded-2xl font-semibold flex flex-col items-center justify-center gap-2 h-24 shadow-lg hover:shadow-xl transition-all"
              >
                <FaFacebook style={{ width: "32px", height: "32px" }} />
                <span className="text-sm">{t("resultPage.facebook")}</span>
              </Button>
              <Button
                onClick={() => handleShare("twitter")}
                className="bg-blue-400 hover:bg-blue-500 text-white rounded-2xl font-semibold flex flex-col items-center justify-center gap-2 h-24 shadow-lg hover:shadow-xl transition-all"
              >
                <span className="text-2xl">🐦</span>
                <span className="text-sm">{t("resultPage.twitter")}</span>
              </Button>
              <Button
                onClick={() => handleShare("copy")}
                className="bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg px-2 py-3 shadow-md h-auto font-bold flex flex-col items-center gap-1.5"
              >
                <span className="text-xl">📋</span>
                <span className="text-xs">{t("resultPage.copyLink")}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
