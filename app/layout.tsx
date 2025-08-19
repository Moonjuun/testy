// app/layout.tsx
import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

const metadataTranslations = {
  ko: {
    // ✨ 변경된 부분: 핵심 콘텐츠를 제목에 포함
    title: "Testy 테스티 - MBTI, 사다리게임, 성향 테스트",
    // ✨ 변경된 부분: 제공하는 게임/테스트 종류를 명확히 나열
    description:
      "MBTI, 사다리게임, 점심 메뉴 고르기, 스피드 드로우 등 다양한 테스트와 게임을 즐겨보세요! 성격, 연애, 진로를 탐색하며 숨겨진 나를 발견하는 즐거움.",
    twitterTitle: "Testy 테스티 - 성향 테스트 & 미니게임 플랫폼",
    twitterDescription:
      "MBTI부터 사다리게임까지, 테스트로 나를 알아가는 즐거움. 지금 바로 시작해보세요!",
    ogImage: "/og-image-ko.png",
    ogImageAlt: "Testy 테스티(MBTI, 사다리게임) 한국어 대표 이미지",
  },
  en: {
    // ✨ Changed: Included key content in the title
    title: "Testy - MBTI, Ladder Game & Personality Tests",
    // ✨ Changed: Clearly listed the types of games/tests offered
    description:
      "Enjoy various tests and games like MBTI, Ladder Game, Lunch Picker, and Speed Draw. Discover your hidden self by exploring personality, relationships, and career paths.",
    twitterTitle: "Testy - Personality Tests & Mini-Games Platform",
    twitterDescription:
      "From MBTI to the Ladder Game, discover the joy of getting to know yourself. Start now!",
    ogImage: "/og-image-en.png",
    ogImageAlt: "Testy (MBTI, Ladder Game) - Main promotional image in English",
  },
  ja: {
    // ✨ 変更点: 主要なコンテンツをタイトルに含める
    title: "Testy テスティ - MBTI、あみだくじ、性格テスト",
    // ✨ 変更点: 提供するゲーム・テストの種類を明確にリストアップ
    description:
      "MBTI、あみだくじ、ランチルーレット、スピードドローなど、様々なテストやゲームを楽しんでください！性格、恋愛、進路を探りながら、隠れた自分を発見する楽しさを。",
    twitterTitle: "Testy テスティ - 性格テスト＆ミニゲームプラットフォーム",
    twitterDescription:
      "MBTIからあみだくじまで、テストで自分を知る楽しさ。今すぐ始めてみましょう！",
    ogImage: "/og-image-ja.png",
    ogImageAlt: "Testy テスティ (MBTI, あみだくじ) 日本語版の代表画像",
  },
  vi: {
    // ✨ Thay đổi: Bao gồm nội dung chính trong tiêu đề
    title: "Testy - Kiểm tra MBTI, Trò chơi bậc thang & Tính cách",
    // ✨ Thay đổi: Liệt kê rõ ràng các loại trò chơi/bài kiểm tra được cung cấp
    description:
      "Thưởng thức các bài kiểm tra và trò chơi đa dạng như MBTI, Trò chơi bậc thang, Chọn bữa trưa và Vẽ nhanh. Khám phá bản thân ẩn giấu qua việc tìm hiểu tính cách, các mối quan hệ và con đường sự nghiệp.",
    twitterTitle: "Testy - Nền tảng kiểm tra tính cách & Trò chơi nhỏ",
    twitterDescription:
      "Từ MBTI đến Trò chơi bậc thang, hãy khám phá niềm vui khi tìm hiểu về bản thân. Bắt đầu ngay bây giờ!",
    ogImage: "/og-image-vi.png",
    ogImageAlt:
      "Hình ảnh đại diện Testy (MBTI, Trò chơi bậc thang) bằng tiếng Việt",
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
