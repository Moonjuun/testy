import type React from "react";
import "./globals.css"; // 전역 스타일시트

// 앱 전체의 뼈대를 만드는 가장 기본적인 레이아웃입니다.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <meta
          name="google-site-verification"
          content="XwCW-t3PJfyPYJRWSItA6cY1Yoy3_zuBZ8N9CJEzZwc"
        />
        <meta
          name="naver-site-verification"
          content="4be26cfdfa67a9fe5f9f0b91758530293065fdb8"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6915584561138880"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
