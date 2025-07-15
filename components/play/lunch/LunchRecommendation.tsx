// components/play/lunch/LunchRecommendation.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  lunchCategories,
  LunchMenuItem,
  LunchCategoryOption,
  LunchCategoryValue,
} from "@/constants/play/lunch-constants";
import { cn } from "@/lib/utils";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
// 아이콘 추가 및 변경
import { Loader2, RefreshCwIcon, ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

type SelectedCategories = {
  who: LunchCategoryValue | null;
  cuisine: LunchCategoryValue | null;
  mealType: LunchCategoryValue | null;
};

type Props = {
  allMenus: LunchMenuItem[];
};

export default function LunchRecommendation({ allMenus }: Props) {
  const { t } = useTranslation("common");

  const [selected, setSelected] = useState<SelectedCategories>({
    who: null,
    cuisine: null,
    mealType: null,
  });
  const [recommendedMenu, setRecommendedMenu] = useState<LunchMenuItem | null>(
    null
  );
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { width, height } = useWindowSize();

  const handleSelect = (
    category: keyof SelectedCategories,
    value: LunchCategoryValue
  ) => {
    setSelected((prev) => ({ ...prev, [category]: value }));
  };

  const handleGetRecommendation = () => {
    const { who, cuisine, mealType } = selected;
    if (!who || !cuisine || !mealType) {
      alert(t("lunch.alert.selectAll"));
      return;
    }

    setIsLoading(true);
    setRecommendedMenu(null);

    setTimeout(() => {
      const filtered = allMenus.filter(
        (item) =>
          item.categories.who.includes(who) &&
          item.categories.cuisine.includes(cuisine) &&
          item.categories.mealType.includes(mealType)
      );

      const randomItem =
        filtered[Math.floor(Math.random() * filtered.length)] || null;
      setRecommendedMenu(randomItem);
      setIsLoading(false);

      if (randomItem) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }, 2000);
  };

  const handleEditSelection = () => {
    setRecommendedMenu(null);
  };

  const allOptionsSelected =
    selected.who && selected.cuisine && selected.mealType;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center space-y-4 flex flex-col items-center justify-center h-64">
          <Loader2 className="w-12 h-12 text-purple-500 dark:text-purple-400 animate-spin" />
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {t("lunch.loading.title")}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {t("lunch.loading.description")}
          </p>
        </div>
      );
    }

    if (recommendedMenu) {
      return (
        <div className="animate-reveal text-center space-y-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200">
            {t("lunch.result.title")}
          </h3>
          <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="relative w-full h-64">
              <Image
                src={recommendedMenu.image || "/image/no-image.png"}
                alt={recommendedMenu.name}
                fill
                style={{ objectFit: "cover" }}
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <CardContent className="p-6 flex flex-col items-center">
              <h4 className="text-3xl sm:text-4xl font-extrabold text-purple-700 dark:text-purple-400 mb-2">
                {recommendedMenu.name}
              </h4>
              <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-md">
                {recommendedMenu.description}
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              onClick={handleEditSelection}
              variant="outline"
              className="flex items-center gap-2 px-6 py-3 text-lg font-semibold rounded-full border-2 border-gray-300 text-gray-700 bg-transparent hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <ArrowLeftIcon className="w-5 h-5" /> {t("lunch.result.retry")}
            </Button>
            <Button
              onClick={handleGetRecommendation}
              className="flex items-center gap-2 px-6 py-3 text-lg font-semibold rounded-full bg-gradient-to-r from-pink-400 to-red-500 text-white shadow-md hover:from-pink-500 hover:to-red-600"
            >
              <RefreshCwIcon className="w-5 h-5" /> {t("lunch.result.reroll")}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <>
        {renderCategorySelector(
          "who",
          lunchCategories.who,
          t("lunch.selectWho")
        )}
        {renderCategorySelector(
          "cuisine",
          lunchCategories.cuisine,
          t("lunch.selectCuisine")
        )}
        {renderCategorySelector(
          "mealType",
          lunchCategories.mealType,
          t("lunch.selectMealType")
        )}
        <div className="mt-8 text-center">
          <Button
            onClick={handleGetRecommendation}
            disabled={!allOptionsSelected || isLoading}
            className={cn(
              "w-full sm:w-auto px-8 py-3 text-lg font-bold rounded-full transition-all duration-300",
              allOptionsSelected
                ? "bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg hover:from-green-500 hover:to-blue-600"
                : "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
            )}
          >
            {isLoading ? t("lunch.recommending") : t("lunch.getRecommendation")}
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-black flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={200}
          drawShape={(ctx) => {
            ctx.beginPath();
            ctx.arc(0, 0, 5, 0, 2 * Math.PI);
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.fill();
            ctx.closePath();
          }}
        />
      )}

      <Card className="w-full max-w-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
        <CardHeader className="text-center mb-8">
          <CardTitle className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight">
            {t("lunch.title")}
          </CardTitle>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            {t("lunch.description")}
          </p>
        </CardHeader>

        <CardContent className="space-y-8">{renderContent()}</CardContent>
      </Card>
    </div>
  );

  function renderCategorySelector(
    categoryKey: keyof SelectedCategories,
    options: LunchCategoryOption[],
    title: string
  ) {
    return (
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          {title}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {options.map((option) => (
            <Button
              key={option.id}
              variant="outline"
              className={cn(
                "flex flex-col items-center justify-center p-4 h-auto min-h-[80px] rounded-xl text-base font-medium transition-all duration-200",
                selected[categoryKey] === option.id
                  ? "bg-gradient-to-br from-pink-400 to-purple-500 text-white shadow-lg scale-105 border-transparent"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
              )}
              onClick={() => handleSelect(categoryKey, option.id)}
            >
              <span className="text-3xl mb-1">{option.emoji}</span>
              <span>{t(`lunch.options.${option.id}`)}</span>
            </Button>
          ))}
        </div>
      </div>
    );
  }
}
