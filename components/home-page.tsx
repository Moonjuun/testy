"use client";
import { useEffect, useState } from "react";
import { TestCard } from "@/components/test-card";
import { MobileAdBanner } from "@/components/banner/mobile-ad-banner";
import { Sparkles, Clock } from "lucide-react";
import CenterBanner from "@/components/banner/CenterBanner";
import { useLanguageStore } from "@/store/useLanguageStore";
import { getNewTests } from "@/lib/supabase/getNewTests";
import { NewTest } from "@/types/test";
import { TestCardSkeleton } from "@/components/TestCardSkeleton";
import { useTranslation } from "react-i18next";
import { Language } from "@/store/useLanguageStore";

interface HomePageProps {
  locale: string;
}

export default function HomePage({ locale }: HomePageProps) {
  const [newTestList, setnewTestList] = useState<NewTest[]>([]);
  const { t } = useTranslation("common");

  // 1. Zustand 스토어에서 언어 상태와 설정 함수를 가져옵니다.
  const { currentLanguage, setLanguage } = useLanguageStore();

  // 2. 페이지 첫 로드 시 URL의 locale 값을 스토어에 동기화합니다.
  useEffect(() => {
    if (locale) {
      setLanguage(locale as Language);
    }
  }, [locale, setLanguage]);

  // 3. props.locale 대신 스토어의 currentLanguage 상태가 바뀔 때마다 데이터를 다시 가져옵니다.
  useEffect(() => {
    const fetchData = async () => {
      // currentLanguage 상태가 설정된 후에만 데이터를 가져옵니다.
      if (currentLanguage) {
        setnewTestList([]); // 새로운 데이터를 가져오기 전 목록을 비워 로딩 상태를 표시
        const data = await getNewTests(currentLanguage);
        setnewTestList(data);
      }
    };

    fetchData();
  }, [currentLanguage]); // 의존성을 'locale'에서 'currentLanguage'로 변경

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <MobileAdBanner type="sticky-top" size="320x50" className="py-4" />

      <section className="relative py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("home.weeklyUpdate")}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t("home.heroTitlePart1")}
            </span>
            {t("home.heroTitlePart2")}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {t("home.heroDescription")}
          </p>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Clock className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {t("home.latestTests")}
            </h2>
          </div>

          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))] gap-6 mb-12">
            {newTestList.length === 0
              ? Array.from({ length: 10 }).map((_, i) => (
                  <TestCardSkeleton key={i} />
                ))
              : newTestList.map((test) => (
                  <TestCard key={test.id} test={test} featured />
                ))}
          </div>

          <CenterBanner size="large" slot="1695323020" />
        </div>
      </section>
    </div>
  );
}
