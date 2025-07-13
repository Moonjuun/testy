// app/[locale]/layout.tsx

import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientLayout from "@/components/ClientLayout";
import { createClientForServer } from "@/lib/supabase/server";

const inter = Inter({ subsets: ["latin"] });

// 1. 이미지 경로 및 alt 텍스트 추가
const metadataTranslations = {
  ko: {
    title: "Testy 테스티 - 가볍게 해보는 성향 테스트",
    description:
      "간단한 질문들로 숨겨진 나의 모습을 발견해보세요. 성격, 연애, 진로 등 다양한 테스트를 제공합니다.",
    twitterTitle: "Testy 테스티 - 성향 테스트 플랫폼",
    twitterDescription:
      "테스트로 나를 알아가는 즐거움. 가볍게 재미있게 시작해보세요!",
    ogImage: "/og-image-ko.png",
    ogImageAlt: "Testy 테스티 한국어 대표 이미지",
  },
  en: {
    title: "Testy - Lighthearted Personality Tests",
    description:
      "Discover your hidden self with simple questions. We offer various tests including personality, relationships, and career paths.",
    twitterTitle: "Testy - Personality Test Platform",
    twitterDescription:
      "The joy of discovering yourself through tests. Start lightly and have fun!",
    ogImage: "/og-image-en.png",
    ogImageAlt: "Testy - Main promotional image in English",
  },
  ja: {
    title: "Testy テスティ - 気軽にできる性格テスト",
    description:
      "簡単な質問で隠れた自分を発見してみましょう。性格、恋愛、進路など、様々なテストを提供しています。",
    twitterTitle: "Testy テスティ - 性格テストプラットフォーム",
    twitterDescription: "テストで自分を知る楽しさ。気軽に始めてみましょう！",
    ogImage: "/og-image-ja.png",
    ogImageAlt: "Testy テスティ 日本語版の代表画像",
  },
  vi: {
    title: "Testy - Bài kiểm tra tính cách nhẹ nhàng",
    description:
      "Khám phá bản thân ẩn giấu của bạn với những câu hỏi đơn giản. Chúng tôi cung cấp nhiều bài kiểm tra khác nhau bao gồm tính cách, tình yêu và định hướng nghề nghiệp.",
    twitterTitle: "Testy - Nền tảng kiểm tra tính cách",
    twitterDescription:
      "Niềm vui khám phá bản thân qua các bài kiểm tra. Hãy bắt đầu nhẹ nhàng và vui vẻ!",
    ogImage: "/og-image-vi.png",
    ogImageAlt: "Hình ảnh đại diện Testy bằng tiếng Việt",
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
    metadataTranslations.ko;

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
        ko: "https://testy.im/ko",
        en: "https://testy.im/en",
        ja: "https://testy.im/ja",
        vi: "https://testy.im/vi",
      },
    },
  };
}

// RootLayout (기존과 동일)
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClientForServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div lang={locale} className={inter.className} suppressHydrationWarning>
      <ClientLayout user={user} locale={locale}>
        {children}
      </ClientLayout>
    </div>
  );
}
