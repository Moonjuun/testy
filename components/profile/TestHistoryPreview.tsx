"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { formatBoldText } from "@/utils/formatBoldText";
import { useTranslation } from "react-i18next";

interface TestHistoryPreviewProps {
  test: any;
  onBack: () => void;
}

export function TestHistoryPreview({ test, onBack }: TestHistoryPreviewProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow">
        <div className="flex items-center gap-2 mb-4">
          <Button
            onClick={onBack}
            variant="secondary"
            size="sm"
            className="px-2 text-sm text-gray-800 dark:text-gray-200"
          >
            <ChevronLeft className="w-4 h-4" /> {t("testView.backToList")}
          </Button>
          <h3 className="text-xl font-bold text-purple-700 dark:text-purple-400">
            {formatBoldText(test.title)}
          </h3>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
          <p>
            {t("testCard.category", { defaultValue: "카테고리" })}:{" "}
            {test.category}
          </p>
          <p>
            {t("resultPage.date", { defaultValue: "날짜" })}: {test.date}
          </p>
        </div>

        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          {test.result.result_image_url && (
            <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
              <Image
                src={test.result.result_image_url}
                alt="Result Image"
                layout="fill"
                objectFit="cover"
              />
            </div>
          )}

          {test.result.keywords && test.result.keywords.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {test.result.keywords.map((keyword: string, index: number) => (
                <span
                  key={index}
                  className="
                    bg-purple-200 text-purple-800
                    dark:bg-purple-800 dark:text-purple-200
                    px-3 py-1
                    rounded-full text-xs font-semibold
                    shadow-sm
                  "
                >
                  #{keyword}
                </span>
              ))}
            </div>
          )}

          <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {formatBoldText(test.description)}
          </p>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-md font-semibold text-purple-700 dark:text-purple-300 mb-2">
              {t("resultPage.suitableItems")}
            </h4>
            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 !pl-2">
              {test.result.recommendation.items.map(
                (item: string, index: number) => (
                  <li key={index}>{item}</li>
                )
              )}
            </ul>

            <h4 className="text-md font-semibold text-purple-700 dark:text-purple-300 mt-3 mb-2">
              {t("resultPage.matchingType")}
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed !pl-2">
              {formatBoldText(test.result.recommendation.matching_type)}
            </p>

            <h4 className="text-md font-semibold text-purple-700 dark:text-purple-300 mt-3 mb-2">
              {t("resultPage.suggestedActions")}
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed !pl-2 ">
              {formatBoldText(test.result.recommendation.suggested_actions)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
