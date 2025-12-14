"use client";

import { useState, useEffect } from "react";
import { NewTest } from "@/types/test";
import { HeroSection } from "@/components/home/HeroSection";
import { QuickCircleSection } from "@/components/home/QuickCircleSection";
import { MysticZoneSection } from "@/components/home/MysticZoneSection";
import { MBTICollectionSection } from "@/components/home/MBTICollectionSection";
import { EditorPickSection } from "@/components/home/EditorPickSection";
import { InlineAdBanner } from "@/components/banner/inline-ad-banner";
import { MobileAdBanner } from "@/components/banner/mobile-ad-banner";
import { DisplayHorizontalAd } from "@/components/banner/display-horizontal-ad";
import { DisplayVerticalAd } from "@/components/banner/display-vertical-ad";
import { AD_SLOTS } from "@/constants/ads";

interface HomePageProps {
  locale: string;
  initialTests: NewTest[];
  featuredTest: NewTest | null;
  translations: {
    featured: string;
    startNow: string;
    new: string;
    popular: string;
    tarot: string;
    love: string;
    editorPick: string;
    editorPickDescription: string;
    mbtiCollection: string;
    mbtiTypes: {
      INTJ: string;
      INTP: string;
      ENTJ: string;
      ENTP: string;
      INFJ: string;
      INFP: string;
      ENFJ: string;
      ENFP: string;
      ISTJ: string;
      ISFJ: string;
      ESTJ: string;
      ESFJ: string;
      ISTP: string;
      ISFP: string;
      ESTP: string;
      ESFP: string;
    };
    mysticZone: string;
    tarotTitle: string;
    tarotDescription: string;
    clickToReveal: string;
    exploreTarot: string;
    minutes: string;
    takes: string;
    tenThousand: string;
    people: string;
    participated: string;
  };
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

export default function HomePage({
  locale,
  initialTests,
  featuredTest,
  translations,
}: HomePageProps) {
  // 데스크탑 여부 체크 (클라이언트 사이드에서만)
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1280);
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // 썸네일이 있는 테스트만 필터링 (서버에서 이미 필터링되었지만 이중 체크)
  const testsWithThumbnail = initialTests.filter(
    (test) => test.thumbnail_url && test.thumbnail_url.trim() !== ""
  );
  // 에디터 픽: 최신 테스트들 (최대 10개)
  const editorPickTests = testsWithThumbnail.slice(0, 10);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Section A: 히어로 배너 */}
      {featuredTest ? (
        <HeroSection
          featuredTest={featuredTest}
          locale={locale}
          translations={translations}
        />
      ) : (
        <HeroSkeleton />
      )}

      {/* 디스플레이 수평형 광고: 히어로 배너 아래 */}
      <DisplayHorizontalAd />

      {/* Section B: 퀵 서클 */}
      <QuickCircleSection locale={locale} translations={translations} />

      {/* Section C: 미스틱 존 타로 */}
      <MysticZoneSection locale={locale} translations={translations} />

      {/* 광고 1: 미스틱 존과 MBTI 컬렉션 사이 */}
      {/* 데스크탑: 728x90 배너 */}
      {isDesktop && (
        <InlineAdBanner
          size="728x90"
          slot={AD_SLOTS.DESKTOP_INLINE}
          className=""
        />
      )}
      {/* 모바일: 320x100 배너 */}
      <MobileAdBanner type="inline" size="320x100" className="xl:hidden" />

      {/* Section D: MBTI 컬렉션 */}
      <MBTICollectionSection locale={locale} translations={translations} />

      {/* 광고 2: MBTI 컬렉션과 에디터 픽 사이 */}
      {/* 데스크탑: 336x280 사각형 */}
      {isDesktop && (
        <InlineAdBanner
          size="336x280"
          slot={AD_SLOTS.DESKTOP_INLINE}
          className=""
        />
      )}
      {/* 모바일: 300x250 사각형 */}
      <MobileAdBanner type="inline" size="300x250" className="xl:hidden" />

      {/* Section E: 에디터 픽 */}
      {editorPickTests.length > 0 ? (
        <EditorPickSection
          tests={editorPickTests}
          locale={locale}
          translations={translations}
        />
      ) : (
        <EditorPickSkeleton />
      )}

      {/* 광고 3: 에디터 픽 이후 (마지막 콘텐츠 섹션 다음) */}
      {/* 데스크탑: 728x90 배너 */}
      {isDesktop && (
        <InlineAdBanner
          size="728x90"
          slot={AD_SLOTS.DESKTOP_INLINE}
          className=""
        />
      )}
      {/* 모바일: 320x100 배너 */}
      <MobileAdBanner type="inline" size="320x100" className="xl:hidden" />

      {/* 디스플레이 수직형 광고: 페이지 하단 */}
      <DisplayVerticalAd />

      {/* 광고 6: 모바일 - 하단 고정 배너 (푸터 전에 숨김) */}
      <MobileAdBanner
        type="sticky-bottom"
        size="320x50"
        className="xl:hidden"
      />
    </div>
  );
}
