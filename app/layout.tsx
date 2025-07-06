import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout"; // 새로 만들 클라이언트 컴포넌트
import { createClientForServer } from "@/lib/supabase/server";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Testy - 가볍게 해보는 성향 테스트",
  description:
    "간단한 질문들로 숨겨진 나의 모습을 발견해보세요. 성격, 연애, 진로 등 다양한 테스트를 제공합니다. 가볍게 해보는 성향 테스트",
  generator: "v0.dev",
  icons: {
    icon: "/favicon.png", // 또는 "/favicon.ico"
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
        <Script
          strategy="afterInteractive"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6915584561138880"
          crossOrigin="anonymous"
        />
      </head>

      <body className={inter.className}>
        <ClientLayout user={user}>{children}</ClientLayout>
      </body>
    </html>
  );
}
