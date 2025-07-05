import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout"; // 새로 만들 클라이언트 컴포넌트

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
