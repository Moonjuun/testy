// app/[locale]/layout.tsx

import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientLayout from "@/components/ClientLayout";
import { createClientForServer } from "@/lib/supabase/server";

const inter = Inter({ subsets: ["latin"] });

export async function generateStaticParams() {
  return [
    { locale: "ko" },
    { locale: "en" },
    { locale: "ja" },
    { locale: "vi" },
  ];
}

// 1. generateMetadata 수정
export async function generateMetadata({
  params, // 바로 구조 분해하지 않고 params를 통째로 받습니다.
}: {
  params: Promise<{ locale: string }>; // 타입을 Promise로 감싸줍니다.
}): Promise<Metadata> {
  const { locale } = await params; // 함수 내부에서 await으로 값을 추출합니다.

  const title = "Testy 테스티 - 가볍게 해보는 성향 테스트";
  const description =
    "간단한 질문들로 숨겨진 나의 모습을 발견해보세요. 성격, 연애, 진로 등 다양한 테스트를 제공합니다.";
  const url = `https://testy.im/${locale}`; // 추출한 locale 변수 사용

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
      locale: locale, // 추출한 locale 변수 사용
    },
    // ... 이하 메타데이터는 동일
    icons: {
      icon: "/favicon.ico",
    },
    twitter: {
      card: "summary_large_image",
      title: "Testy 테스티 - 성향 테스트 플랫폼",
      description:
        "테스트로 나를 알아가는 즐거움. 가볍고 재미있게 시작해보세요!",
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

// 2. RootLayout 수정
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // 타입을 Promise로 감싸줍니다.
}) {
  const { locale } = await params; // 컴포넌트 상단에서 await으로 값을 추출합니다.
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
