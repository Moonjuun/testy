"use client";
import { useRef, useEffect, useState } from "react";
import { TestCard } from "@/components/test-card";
import { MobileAdBanner } from "@/components/banner/mobile-ad-banner";
import { Sparkles, TrendingUp, Brain, Clock } from "lucide-react";
import CenterBanner from "@/components/banner/CenterBanner";
import { useLanguageStore } from "@/store/useLanguageStore";
import { getNewTests } from "@/lib/supabase/getNewTests";
import { NewTest } from "@/types/test";
import { TestCardSkeleton } from "@/components/TestCardSkeleton";

export default function HomePage() {
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);

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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              가볍게 해보는 성향 테스트
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            심심할 때 가볍게, 생각보다 잘 맞는 테스트
          </p>
        </div>
      </section>

      {/* Featured Tests */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Clock className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              최신 테스트
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

          {/* Center Banner Ad */}
          <CenterBanner size="large" />
        </div>
      </section>

      {/* All Tests */}
      {/* <section className="py-8 px-4 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Brain className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              모든 테스트
            </h2>
          </div>

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
        </div>
      </section> */}
    </div>
  );
}
