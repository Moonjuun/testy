"use client";
import { useRef, useEffect, useState } from "react";
import { TestCard } from "@/components/test-card";
import { MobileAdBanner } from "@/components/Banner/mobile-ad-banner";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Brain, Clock } from "lucide-react";
import { testCards } from "@/data/tests";
import CenterBanner from "@/components/Banner/CenterBanner";
import { CategoryFilter } from "@/components/Category/CategoryFilter";
import { useLanguageStore } from "@/store/useLanguageStore";
import { getNewTests } from "@/lib/supabase/getNewTests";
import { NewTest } from "@/types/test";
import { TestCardSkeleton } from "@/components/TestCardSkeleton";

//hooks
import { useActiveCategories } from "@/hooks/useActiveCategories";

export default function HomePage() {
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  const { categories, loading } = useActiveCategories(currentLanguage);

  const [newTestList, setnewTestList] = useState<NewTest[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getNewTests(currentLanguage);
      setnewTestList(data);
    };

    fetchData();
  }, [currentLanguage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      {/* Mobile Top Sticky Ad */}
      <MobileAdBanner type="sticky-top" size="320x50" className="py-4" />

      {/* Hero Section */}
      <section className="relative py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              새로운 테스트가 매주 업데이트!
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              나는 누구일까?
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            간단한 질문들로 알아보는 나의 진짜 모습
          </p>
        </div>
      </section>

      {/* Featured Tests */}
      <section className="px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Clock className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              최신 테스트
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {newTestList.length === 0
              ? Array.from({ length: 4 }).map((_, i) => (
                  <TestCardSkeleton key={i} />
                ))
              : newTestList.map((test) => (
                  <div key={test.id}>
                    <TestCard test={test} featured />
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Center Banner Ad */}
      <CenterBanner size="large" />

      {/* All Tests */}
      <section className="py-8 px-4 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Brain className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              모든 테스트
            </h2>
          </div>

          {/* Category Filter */}
          <CategoryFilter
            categories={categories.map((cat) => cat.name)}
            currentLanguage={currentLanguage}
            loading={loading}
          />

          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {newTestList.length === 0
              ? Array.from({ length: 4 }).map((_, i) => (
                  <TestCardSkeleton key={i} />
                ))
              : newTestList.map((test) => (
                  <div key={test.id}>
                    <TestCard test={test} featured />
                  </div>
                ))}
          </div>

          {/* Load More */}
          {/* <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              더 많은 테스트 보기
            </Button>
          </div> */}
        </div>
      </section>
    </div>
  );
}
