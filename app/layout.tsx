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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N255D99T');`,
          }}
        />
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
      <body>
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
