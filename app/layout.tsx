// app/layout.tsx - Root Layout (html, body, 메타데이터)
import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

// ⚠️ 루트 레이아웃은 locale 파라미터를 받지 않음
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Testy - Tarot, MBTI, Personality Tests",
    description:
      "Explore yourself with fun quizzes, tarot readings, and personality tests.",
    metadataBase: new URL("https://testy.im"),
    alternates: {
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
          strategy="afterInteractive"
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
      </head>
      <body>
        {/* Google Adsense - body 안에 배치하여 data-nscript 에러 방지 */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6915584561138880"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
