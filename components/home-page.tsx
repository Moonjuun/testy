"use client";

import { useMemo } from "react";
import { NewTest } from "@/types/test";
import { HeroSection } from "@/components/home/HeroSection";
import { QuickCircleSection } from "@/components/home/QuickCircleSection";
import { MysticZoneSection } from "@/components/home/MysticZoneSection";
import { MBTICollectionSection } from "@/components/home/MBTICollectionSection";
import { EditorPickSection } from "@/components/home/EditorPickSection";

interface HomePageProps {
  locale: string;
  initialTests: NewTest[];
}

// Skeleton 컴포넌트들
function HeroSkeleton() {
  return (
    <section className="relative h-[60vh] min-h-[500px] bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 animate-pulse" />
  );
}

function QuickCircleSkeleton() {
  return (
    <section className="py-8 px-4 md:px-8 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-4 md:gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex flex-col items-center gap-3"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              <div className="w-16 h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MysticZoneSkeleton() {
  return (
    <section className="relative py-16 md:py-24 px-4 md:px-8 bg-gradient-to-br from-indigo-950 via-purple-950 to-indigo-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-32 h-8 bg-purple-800/50 rounded mx-auto mb-4 animate-pulse" />
          <div className="w-96 h-12 bg-purple-800/50 rounded mx-auto mb-4 animate-pulse" />
        </div>
        <div className="flex justify-center">
          <div className="w-64 h-96 md:w-80 md:h-[480px] bg-purple-800/50 rounded-2xl animate-pulse" />
        </div>
      </div>
    </section>
  );
}

function MBTICollectionSkeleton() {
  return (
    <section className="py-12 md:py-16 px-4 md:px-8 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="w-64 h-8 bg-zinc-200 dark:bg-zinc-800 rounded mb-8 animate-pulse" />
        <div className="flex gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-32 h-40 md:w-40 md:h-52 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function EditorPickSkeleton() {
  return (
    <section className="py-12 md:py-16 px-4 md:px-8 bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-6xl mx-auto">
        <div className="w-48 h-8 bg-zinc-200 dark:bg-zinc-800 rounded mb-8 animate-pulse" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-zinc-800 rounded-xl p-4 md:p-6 flex gap-4 md:gap-6"
            >
              <div className="w-24 h-32 md:w-32 md:h-44 bg-zinc-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="w-3/4 h-6 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
                <div className="w-full h-4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
                <div className="w-1/2 h-4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage({ locale, initialTests }: HomePageProps) {
  // 히어로 배너용: 랜덤으로 선택 (새로고침할 때마다 변경)
  const featuredTest = useMemo(() => {
    if (initialTests.length === 0) return null;

    // 인기 있는 테스트들(조회수 1000 이상) 중에서 우선 선택
    const popularTests = initialTests.filter(
      (test) => (test.view_count ?? 0) >= 1000
    );

    // 인기 테스트가 있으면 그 중에서 랜덤 선택, 없으면 전체에서 랜덤 선택
    const candidates = popularTests.length > 0 ? popularTests : initialTests;
    const randomIndex = Math.floor(Math.random() * candidates.length);

    return candidates[randomIndex];
  }, [initialTests]);

  // 에디터 픽: 최신 테스트들 (최대 10개)
  const editorPickTests = initialTests.slice(0, 10);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Section A: 히어로 배너 */}
      {featuredTest ? (
        <HeroSection featuredTest={featuredTest} locale={locale} />
      ) : (
        <HeroSkeleton />
      )}

      {/* Section B: 퀵 서클 */}
      <QuickCircleSection locale={locale} />

      {/* Section C: 미스틱 존 타로 */}
      <MysticZoneSection locale={locale} />

      {/* Section D: MBTI 컬렉션 */}
      <MBTICollectionSection locale={locale} />

      {/* Section E: 에디터 픽 */}
      {editorPickTests.length > 0 ? (
        <EditorPickSection tests={editorPickTests} locale={locale} />
      ) : (
        <EditorPickSkeleton />
      )}
    </div>
  );
}
