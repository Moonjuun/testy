"use client";
// 1. useEffect와 useState를 다시 임포트합니다.
import { useEffect, useState } from "react";
import { TestCard } from "@/components/test-card";
import { MobileAdBanner } from "@/components/banner/mobile-ad-banner";
import { Sparkles, Clock } from "lucide-react";
import CenterBanner from "@/components/banner/CenterBanner";
import { useLanguageStore } from "@/store/useLanguageStore";
import { NewTest } from "@/types/test";
import { TestCardSkeleton } from "@/components/TestCardSkeleton";
import { useTranslation } from "react-i18next";
import { Language } from "@/store/useLanguageStore";

interface HomePageProps {
  locale: string;
  initialTests: NewTest[];
}

export default function HomePage({ locale, initialTests }: HomePageProps) {
  const { t } = useTranslation("common");
  const { currentLanguage, setLanguage } = useLanguageStore();

  // 2. 마운트 상태를 관리하는 state를 추가합니다.
  const [isMounted, setIsMounted] = useState(false);

  // 3. 컴포넌트가 클라이언트에서 마운트된 후에 isMounted를 true로 설정합니다.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (locale) {
      setLanguage(locale as Language);
    }
  }, [locale, setLanguage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <MobileAdBanner type="sticky-top" size="320x50" className="py-4" />

      <section className="relative py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isMounted ? t("home.weeklyUpdate") : "\u00A0"}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            <span>{isMounted ? t("home.heroTitlePart1") : "\u00A0"}</span>{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {isMounted ? t("home.heroTitlePart2") : ""}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {isMounted ? t("home.heroDescription") : "\u00A0"}
          </p>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Clock className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {isMounted ? t("home.latestTests") : "\u00A0"}
            </h2>
          </div>
          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))] gap-6 mb-12">
            {initialTests.length === 0
              ? Array.from({ length: 10 }).map((_, i) => (
                  <TestCardSkeleton key={i} />
                ))
              : initialTests.map((test) => (
                  <TestCard key={test.id} test={test} featured />
                ))}
          </div>
          <CenterBanner size="large" slot="1695323020" />
        </div>
      </section>
    </div>
  );
}
