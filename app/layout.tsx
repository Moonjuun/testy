// app/layout.tsx
import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

// 1) 루트 레이아웃 기본 메타데이터
export const metadata: Metadata = {
  title: "Testy",
  description: "Testy - Lighthearted Personality Tests.",
  metadataBase: new URL("https://testy.im"),
  alternates: {
    canonical: "https://testy.im",
    languages: {
      ko: "https://testy.im/ko",
      en: "https://testy.im/en",
      ja: "https://testy.im/ja",
      vi: "https://testy.im/vi",
    },
  },
  openGraph: {
    title: "Testy – Personality Tests",
    description: "Browse all psychological & relationship tests in one place.",
    url: "https://testy.im",
    siteName: "Testy",
    images: [
      {
        url: "/og-image-en.png",
        width: 1200,
        height: 630,
        alt: "Testy – Main promotional image",
      },
    ],
    type: "website",
    locale: "en",
  },
  icons: {
    icon: "/favicon.ico",
  },
  twitter: {
    card: "summary_large_image",
    title: "Testy - Personality Test Platform",
    description:
      "The joy of discovering yourself through tests. Start lightly and have fun!",
    images: ["/og-image-en.png"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
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

        {/* Google Tag Manager */}
        <Script
          id="gtm"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-N255D99T');`,
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
