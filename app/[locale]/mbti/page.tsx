// app/[locale]/mbti/page.tsx
import type { Metadata } from "next";
import MbtiModeSelection from "@/components/mbti/MbtiModeSelection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const url = `https://testy.im/${locale}/mbti`;

  const metadataByLocale = {
    ko: {
      title: "MBTI 성격 유형 검사 | Testy",
      description:
        "16가지 MBTI 성격 유형을 알아보는 무료 테스트. 기본 모드(40문항)와 심화 모드(100문항) 중 선택하여 자신의 성격을 탐구해보세요.",
      ogImage: "/og-image-ko.png",
      ogImageAlt: "MBTI 성격 유형 검사 - Testy",
    },
    en: {
      title: "MBTI Personality Type Test | Testy",
      description:
        "Free test to discover your 16 MBTI personality types. Choose between Basic Mode (40 questions) and Advanced Mode (100 questions) to explore your personality.",
      ogImage: "/og-image-en.png",
      ogImageAlt: "MBTI Personality Type Test - Testy",
    },
    ja: {
      title: "MBTI性格タイプ診断 | Testy",
      description:
        "16種類のMBTI性格タイプを調べる無料テスト。基本モード（40問）と上級モード（100問）から選んで、自分の性格を探求しましょう。",
      ogImage: "/og-image-ja.png",
      ogImageAlt: "MBTI性格タイプ診断 - Testy",
    },
    vi: {
      title: "Kiểm tra tính cách MBTI | Testy",
      description:
        "Bài kiểm tra miễn phí để khám phá 16 loại tính cách MBTI. Chọn giữa Chế độ Cơ bản (40 câu hỏi) và Chế độ Nâng cao (100 câu hỏi) để khám phá tính cách của bạn.",
      ogImage: "/og-image-vi.png",
      ogImageAlt: "Kiểm tra tính cách MBTI - Testy",
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
        "ko-KR": "https://testy.im/ko/mbti",
        "en-US": "https://testy.im/en/mbti",
        "ja-JP": "https://testy.im/ja/mbti",
        "vi-VN": "https://testy.im/vi/mbti",
      },
    },
  };
}

export default async function MbtiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params; // params는 사용하지 않지만 await은 필요
  return <MbtiModeSelection />;
}
