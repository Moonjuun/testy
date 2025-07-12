// app/[locale]/layout.tsx

import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientLayout from "@/components/ClientLayout";
import { createClientForServer } from "@/lib/supabase/server";

const inter = Inter({ subsets: ["latin"] });

const metadataTranslations = {
  ko: {
    title: "Testy 테스티 - 가볍게 해보는 성향 테스트",
    description:
      "간단한 질문들로 숨겨진 나의 모습을 발견해보세요. 성격, 연애, 진로 등 다양한 테스트를 제공합니다.",
    twitterTitle: "Testy 테스티 - 성향 테스트 플랫폼",
    twitterDescription:
      "테스트로 나를 알아가는 즐거움. 가볍고 재미있게 시작해보세요!",
  },
  en: {
    title: "Testy - Lighthearted Personality Tests",
    description:
      "Discover your hidden self with simple questions. We offer various tests including personality, relationships, and career paths.",
    twitterTitle: "Testy - Personality Test Platform",
    twitterDescription:
      "The joy of discovering yourself through tests. Start lightly and have fun!",
  },
  ja: {
    title: "Testy テスティ - 気軽にできる性格テスト",
    description:
      "簡単な質問で隠れた自分を発見してみましょう。性格、恋愛、進路など、様々なテストを提供しています。",
    twitterTitle: "Testy テスティ - 性格テストプラットフォーム",
    twitterDescription: "テストで自分を知る楽しさ。気軽に始めてみましょう！",
  },
  vi: {
    title: "Testy - Bài kiểm tra tính cách nhẹ nhàng",
    description:
      "Khám phá bản thân ẩn giấu của bạn với những câu hỏi đơn giản. Chúng tôi cung cấp nhiều bài kiểm tra khác nhau bao gồm tính cách, tình yêu và định hướng nghề nghiệp.",
    twitterTitle: "Testy - Nền tảng kiểm tra tính cách",
    twitterDescription:
      "Niềm vui khám phá bản thân qua các bài kiểm tra. Hãy bắt đầu nhẹ nhàng và vui vẻ!",
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

// generateMetadata 수정: 언어에 맞춰 메타데이터를 동적으로 생성
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // 현재 로케일에 맞는 번역된 메타데이터를 가져옵니다.
  // 만약 해당 로케일의 번역이 없으면 한국어(ko)를 기본값으로 사용합니다.
  const translatedMetadata =
    metadataTranslations[locale as keyof typeof metadataTranslations] ||
    metadataTranslations.ko;

  const title = translatedMetadata.title;
  const description = translatedMetadata.description;
  const url = `https://testy.im/${locale}`;

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
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Testy 테스티 대표 이미지",
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
      title: translatedMetadata.twitterTitle, // 트위터 제목도 언어에 맞춰 변경
      description: translatedMetadata.twitterDescription, // 트위터 설명도 언어에 맞춰 변경
      images: ["/og-image.png"],
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

// RootLayout 수정
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
