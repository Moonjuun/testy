// app/[locale]/page.tsx
import HomePage from "@/components/home-page";
import { getNewTests } from "@/lib/supabase/getNewTests";
import { Language } from "@/store/useLanguageStore";
import { NewTest } from "@/types/test";
import koTranslations from "@/public/locales/ko/common.json";
import enTranslations from "@/public/locales/en/common.json";
import jaTranslations from "@/public/locales/ja/common.json";
import viTranslations from "@/public/locales/vi/common.json";

const translations = {
  ko: koTranslations,
  en: enTranslations,
  ja: jaTranslations,
  vi: viTranslations,
};

// 서버에서 featuredTest 선택 (매 요청마다 랜덤하게 선택)
function selectFeaturedTest(tests: NewTest[]): NewTest | null {
  // 썸네일이 있는 테스트만 필터링
  const testsWithThumbnail = tests.filter(
    (test) => test.thumbnail_url && test.thumbnail_url.trim() !== ""
  );

  if (testsWithThumbnail.length === 0) return null;

  // 인기 있는 테스트들(조회수 1000 이상) 중에서 우선 선택
  const popularTests = testsWithThumbnail.filter(
    (test) => (test.view_count ?? 0) >= 1000
  );

  // 인기 테스트가 있으면 그 중에서 랜덤 선택, 없으면 전체에서 랜덤 선택
  // 서버 컴포넌트는 매 요청마다 실행되므로 새로고침할 때마다 다른 테스트가 표시됨
  const candidates =
    popularTests.length > 0 ? popularTests : testsWithThumbnail;
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex] || null;
}

// 1. 함수를 async로 만듭니다.
export default async function Page({ params }: { params: { locale: string } }) {
  // 2. params를 await으로 받아 구조 분해합니다.
  const { locale } = await params;
  const allTests = await getNewTests(locale as Language);
  // 썸네일이 있는 테스트만 필터링
  const initialTests = allTests.filter(
    (test) => test.thumbnail_url && test.thumbnail_url.trim() !== ""
  );
  const featuredTest = selectFeaturedTest(initialTests);
  const localeTranslations =
    translations[locale as keyof typeof translations] || translations.en;

  return (
    <HomePage
      locale={locale}
      initialTests={initialTests}
      featuredTest={featuredTest}
      translations={{
        featured: localeTranslations.home?.featured || "Featured",
        startNow: localeTranslations.home?.startNow || "Start Now",
        new: localeTranslations.home?.new || "New",
        popular: localeTranslations.home?.popular || "Popular",
        tarot: localeTranslations.home?.tarot || "Tarot",
        love: localeTranslations.home?.love || "Love",
        editorPick: localeTranslations.home?.editorPick || "Editor's Pick",
        editorPickDescription:
          localeTranslations.home?.editorPickDescription ||
          "Discover our recommended popular tests",
        mbtiCollection:
          localeTranslations.home?.mbtiCollection ||
          "Find Your Personality Type",
        mbtiTypes: {
          INTJ: localeTranslations.mbti?.INTJ || "Architect",
          INTP: localeTranslations.mbti?.INTP || "Thinker",
          ENTJ: localeTranslations.mbti?.ENTJ || "Commander",
          ENTP: localeTranslations.mbti?.ENTP || "Debater",
          INFJ: localeTranslations.mbti?.INFJ || "Advocate",
          INFP: localeTranslations.mbti?.INFP || "Mediator",
          ENFJ: localeTranslations.mbti?.ENFJ || "Protagonist",
          ENFP: localeTranslations.mbti?.ENFP || "Campaigner",
          ISTJ: localeTranslations.mbti?.ISTJ || "Logistician",
          ISFJ: localeTranslations.mbti?.ISFJ || "Defender",
          ESTJ: localeTranslations.mbti?.ESTJ || "Executive",
          ESFJ: localeTranslations.mbti?.ESFJ || "Consul",
          ISTP: localeTranslations.mbti?.ISTP || "Virtuoso",
          ISFP: localeTranslations.mbti?.ISFP || "Adventurer",
          ESTP: localeTranslations.mbti?.ESTP || "Entrepreneur",
          ESFP: localeTranslations.mbti?.ESFP || "Entertainer",
        },
        mysticZone: localeTranslations.home?.mysticZone || "Mystic Zone",
        tarotTitle:
          localeTranslations.home?.tarotTitle || "Check Your Fortune Today",
        tarotDescription:
          localeTranslations.home?.tarotDescription ||
          "Discover your future with mysterious tarot cards",
        clickToReveal:
          localeTranslations.home?.clickToReveal || "Click the card",
        exploreTarot: localeTranslations.home?.exploreTarot || "Explore Tarot",
        minutes: localeTranslations.home?.minutes || "3 min",
        takes: localeTranslations.home?.takes || "takes",
        tenThousand: localeTranslations.home?.tenThousand || "K",
        people: localeTranslations.home?.people || "",
        participated: localeTranslations.home?.participated || "participated",
      }}
    />
  );
}
