import type React from "react";
import "./globals.css"; // 전역 스타일시트
import Script from "next/script"; // next/script 컴포넌트 임포트

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* Google Analytics (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-ZLT3VML0DW"
        />
        <Script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ZLT3VML0DW');
            `,
          }}
        />

        {/* Google Tag Manager */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-ZLT3VML0DW"
          strategy="afterInteractive" // 페이지가 상호작용 가능해진 후 스크립트 로드
        />
        {/* Google Analytics (gtag.js) - Inline Configuration */}
        <Script
          id="google-analytics-config" // 인라인 스크립트를 위한 고유 ID
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ZLT3VML0DW');
            `,
          }}
          strategy="afterInteractive" // 페이지가 상호작용 가능해진 후 스크립트 로드
        />

        {/* Google Tag Manager - Inline Script */}
        <Script
          id="google-tag-manager" // 인라인 스크립트를 위한 고유 ID
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-N255D99T');`,
          }}
          strategy="afterInteractive" // 페이지가 상호작용 가능해진 후 스크립트 로드
        />

        {/* Google Adsense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6915584561138880"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N255D99T"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        {children}
      </body>
    </html>
  );
}
