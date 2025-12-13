// app/[locale]/page.tsx
import HomePage from "@/components/home-page";
import { getNewTests } from "@/lib/supabase/getNewTests";
import { Language } from "@/store/useLanguageStore";
import { NewTest } from "@/types/test";
import type { Metadata } from "next";
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

// SEO 메타데이터
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const url = `https://testy.im/${locale}`;

  const metadataByLocale = {
    ko: {
      title: "Testy 테스티 - 타로, MBTI, 사다리게임 성향 테스트",
      description:
        "하루 운세부터 연애·직장 타로까지! MBTI, 사다리게임, 점심 고르기, 스피드 드로우 등 다양한 테스트와 게임으로 나를 탐구하세요. 한국어 타로카드 점 무료 제공.",
      ogImage: "/og-image-ko.png",
      ogImageAlt: "Testy 테스티 - 타로, MBTI, 사다리게임 대표 이미지",
    },
    en: {
      title: "Testy - Tarot, MBTI, Ladder Game & Personality Tests",
      description:
        "Daily tarot, love & career readings plus MBTI, Ladder Game, Lunch Picker, and Speed Draw. Explore yourself with fun quizzes and free tarot spreads in English.",
      ogImage: "/og-image-en.png",
      ogImageAlt: "Testy - Tarot, MBTI, Ladder Game promotional image",
    },
    ja: {
      title: "Testy テスティ - タロット, MBTI, あみだくじ 性格テスト",
      description:
        "今日の運勢・恋愛・仕事のタロット占いに加え、MBTI、あみだくじ、ランチルーレット、スピードドローなど多彩なテストで自分を発見。日本語の無料タロット展開に対応。",
      ogImage: "/og-image-ja.png",
      ogImageAlt: "Testy テスティ - タロット・MBTI・あみだくじ 代表画像",
    },
    vi: {
      title: "Testy - Tarot, MBTI, Trò chơi bậc thang & Tính cách",
      description:
        "Tarot hằng ngày, tình yêu & sự nghiệp cùng MBTI, Trò chơi bậc thang, Chọn bữa trưa và Speed Draw. Khám phá bản thân với các bài test thú vị, hỗ trợ tiếng Việt.",
      ogImage: "/og-image-vi.png",
      ogImageAlt: "Testy - Tarot, MBTI, Trò chơi bậc thang - Ảnh đại diện",
    },
  };

  const meta =
    metadataByLocale[locale as keyof typeof metadataByLocale] ||
    metadataByLocale.en;

  return {
    title: meta.title,
    description: meta.description,
    metadataBase: new URL("https://testy.im"),
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      siteName: "Testy",
      images: [
        {
          url: meta.ogImage,
          width: 1200,
          height: 630,
          alt: meta.ogImageAlt,
        },
      ],
      type: "website",
      locale: locale,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [meta.ogImage],
    },
    alternates: {
      canonical: url,
      languages: {
        "ko-KR": "https://testy.im/ko",
        "en-US": "https://testy.im/en",
        "ja-JP": "https://testy.im/ja",
        "vi-VN": "https://testy.im/vi",
      },
    },
  };
}

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

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
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
