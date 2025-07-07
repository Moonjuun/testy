import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout"; // 새로 만들 클라이언트 컴포넌트
import { createClientForServer } from "@/lib/supabase/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Testy 테스티 - 가볍게 해보는 성향 테스트",
  description:
    "간단한 질문들로 숨겨진 나의 모습을 발견해보세요. 성격, 연애, 진로 등 다양한 테스트를 제공합니다.",
  metadataBase: new URL("https://testy.im"),
  openGraph: {
    title: "Testy 테스티 - 가볍게 해보는 성향 테스트",
    description:
      "심플한 질문으로 나의 성향을 알아보는 테스트. 연애, 성격, 진로 등 다양한 주제!",
    url: "https://testy.im/ko",
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
    locale: "ko_KR",
    alternateLocale: ["en_US", "ja_JP", "vi_VN"],
  },
  icons: {
    icon: "/favicon.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "Testy 테스티 - 성향 테스트 플랫폼",
    description: "테스트로 나를 알아가는 즐거움. 가볍고 재미있게 시작해보세요!",
    images: ["/og-image.png"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClientForServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="XwCW-t3PJfyPYJRWSItA6cY1Yoy3_zuBZ8N9CJEzZwc"
        />
        <meta
          name="naver-site-verification"
          content="4be26cfdfa67a9fe5f9f0b91758530293065fdb8"
        />
      </head>
      <body className={inter.className}>
        <ClientLayout user={user}>{children}</ClientLayout>
      </body>
    </html>
  );
}
