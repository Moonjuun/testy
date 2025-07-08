"use client";

import { useEffect } from "react";

interface AdBannerProps {
  type: "side" | "center";
  size: "300x600" | "728x90" | "336x280";
}

export function AdBanner({ type, size }: AdBannerProps) {
  const dimensions = {
    "300x600": { width: 300, height: 600 },
    "728x90": { width: 728, height: 90 },
    "336x280": { width: 336, height: 280 },
  };

  const { width, height } = dimensions[size];

  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Adsense error:", e);
    }
  }, []);

  return (
    <div
      className={`flex items-center justify-center ${
        type === "center" ? "mx-auto" : ""
      }`}
      style={{ width, height }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", width, height }}
        data-ad-client="ca-pub-6915584561138880" // ✅ 본인의 AdSense 퍼블리셔 ID
        data-ad-slot="1234567890" // ✅ 이 부분을 실제 광고 슬롯 ID로 바꿔주세요
        data-ad-format="auto"
        data-full-width-responsive="false"
      ></ins>
    </div>
  );
}
