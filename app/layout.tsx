// app/layout.tsx
import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

const metadataTranslations = {
  ko: {
    title: "Testy 테스티 - 타로, MBTI, 사다리게임 성향 테스트",
    description:
      "하루 운세부터 연애·직장 타로까지! MBTI, 사다리게임, 점심 고르기, 스피드 드로우 등 다양한 테스트와 게임으로 나를 탐구하세요. 한국어 타로카드 점 무료 제공.",
    twitterTitle: "Testy 테스티 - 타로&성향 테스트 · 미니게임",
    twitterDescription:
      "오늘의 타로·연애 타로·금전운 타로부터 MBTI까지! 쉽고 빠르게 나를 알아보는 재미.",
    ogImage: "/og-image-ko.png",
    ogImageAlt: "Testy 테스티 - 타로, MBTI, 사다리게임 대표 이미지",
  },
  en: {
    title: "Testy - Tarot, MBTI, Ladder Game & Personality Tests",
    description:
      "Daily tarot, love & career readings plus MBTI, Ladder Game, Lunch Picker, and Speed Draw. Explore yourself with fun quizzes and free tarot spreads in English.",
    twitterTitle: "Testy - Tarot Readings & Personality Mini-Games",
    twitterDescription:
      "From daily tarot to MBTI—quick, fun ways to understand yourself. Try a free tarot spread now!",
    ogImage: "/og-image-en.png",
    ogImageAlt: "Testy - Tarot, MBTI, Ladder Game promotional image",
  },
  ja: {
    title: "Testy テスティ - タロット, MBTI, あみだくじ 性格テスト",
    description:
      "今日の運勢・恋愛・仕事のタロット占いに加え、MBTI、あみだくじ、ランチルーレット、スピードドローなど多彩なテストで自分を発見。日本語の無料タロット展開に対応。",
    twitterTitle: "Testy テスティ - タロット占い＆性格テスト",
    twitterDescription:
      "今日のタロットからMBTIまで。手軽に自己理解を深めよう！",
    ogImage: "/og-image-ja.png",
    ogImageAlt: "Testy テスティ - タロット・MBTI・あみだくじ 代表画像",
  },
  vi: {
    title: "Testy - Tarot, MBTI, Trò chơi bậc thang & Tính cách",
    description:
      "Tarot hằng ngày, tình yêu & sự nghiệp cùng MBTI, Trò chơi bậc thang, Chọn bữa trưa và Speed Draw. Khám phá bản thân với các bài test thú vị, hỗ trợ tiếng Việt.",
    twitterTitle: "Testy - Tarot & Bài test tính cách",
    twitterDescription:
      "Từ tarot hằng ngày đến MBTI – hiểu bản thân nhanh chóng và thú vị. Dùng thử trải bài miễn phí!",
    ogImage: "/og-image-vi.png",
    ogImageAlt: "Testy - Tarot, MBTI, Trò chơi bậc thang - Ảnh đại diện",
  },
};

export async function generateStaticParams() {
  return [
    { locale: "ko" },
    { locale: "en" },
    { locale: "ja" },
    { locale: "vi" },
  ];
}

// 2. generateMetadata 함수 수정
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const translatedMetadata =
    metadataTranslations[locale as keyof typeof metadataTranslations] ||
    metadataTranslations.en;

  const title = translatedMetadata.title;
  const description = translatedMetadata.description;
  const url = `https://testy.im/${locale}`;
  const ogImageUrl = translatedMetadata.ogImage;
  const ogImageAlt = translatedMetadata.ogImageAlt;

  return {
    title,
    description,
    metadataBase: new URL("https://testy.im"),
    openGraph: {
      title,
      description,
      url,
      siteName: "Testy",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
      type: "website",
      locale: locale,
    },
    icons: {
      icon: "/favicon.ico",
    },
    twitter: {
      card: "summary_large_image",
      title: translatedMetadata.twitterTitle,
      description: translatedMetadata.twitterDescription,
      images: [ogImageUrl],
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <head>
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-ZLT3VML0DW"
        />
        <Script
          id="ga-init"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ZLT3VML0DW');
            `,
          }}
          strategy="afterInteractive"
        />

        {/* Google Adsense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6915584561138880"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
