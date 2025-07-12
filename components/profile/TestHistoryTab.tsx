"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { getTestHistory } from "@/lib/supabase/getTestHistory";
import { useTranslation } from "react-i18next";

interface TestHistoryTabProps {
  userId: string;
  onPreview: (id: number) => void;
}

export function TestHistoryTab({ userId, onPreview }: TestHistoryTabProps) {
  const [testHistory, setTestHistory] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (userId) {
      getTestHistory(userId, 0).then((data) => {
        setTestHistory(data);
        setHasMore(data.length === 10);
      });
    }
  }, [userId]);

  const handleLoadMore = async () => {
    if (loadingMore || !userId) return;
    setLoadingMore(true);
    const more = await getTestHistory(userId, testHistory.length);
    setTestHistory((prev) => [...prev, ...more]);
    setHasMore(more.length === 10);
    setLoadingMore(false);
  };

  if (!testHistory || testHistory.length === 0) {
    return <p className="text-sm text-gray-500">{t("profile.noHistory")}</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">
        {t("profile.recentResults")}
      </h3>
      <div className="grid gap-3">
        {testHistory.map((test) => (
          <div
            key={test.id}
            className="p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md hover:translate-y-[-2px] transition-all duration-200 ease-in-out"
          >
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
                {test.title}
              </h4>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {test.date}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <div>
                <p className="text-sm sm:text-base text-purple-600 dark:text-purple-400 font-medium">
                  {t("resultPage.result")}: {test.result}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {t("testCard.category", { defaultValue: "카테고리" })}:{" "}
                  {test.category}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors py-1 px-2"
                onClick={() => onPreview(test.id)}
              >
                {t("resultPage.retakeTest")}
              </Button>
            </div>
          </div>
        ))}
      </div>
      {hasMore && (
        <Button
          onClick={handleLoadMore}
          variant="outline"
          className="w-full mt-3 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
          disabled={loadingMore}
        >
          {loadingMore ? t("testView.loading") : t("alert.more")}
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
