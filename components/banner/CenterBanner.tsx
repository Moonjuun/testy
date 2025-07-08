"use client";

import React, { useEffect } from "react";

interface CenterBannerProps {
  size: "large" | "medium" | "small";
  slot: string;
}

const CenterBanner = ({ size, slot }: CenterBannerProps) => {
  const dimensionMap = {
    large: {
      width: 728,
      height: 90,
      label: "728 × 90",
    },
    medium: {
      width: 336,
      height: 280,
      label: "336 × 280",
    },
    small: {
      width: 320,
      height: 50,
      label: "320 × 50",
    },
  };

  const { width, height, label } = dimensionMap[size];

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    const tryPushAds = () => {
      const adElement = document.querySelector(`ins[data-ad-slot="${slot}"]`);
      const isAlreadyRendered =
        adElement?.getAttribute("data-adsbygoogle-status") === "done";

      if (!adElement || isAlreadyRendered) return;

      const { width } = adElement.getBoundingClientRect();
      if (width === 0) {
        // 다음 프레임에서 다시 시도
        requestAnimationFrame(tryPushAds);
        return;
      }

      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense push error:", e);
      }
    };

    tryPushAds();
  }, [slot]);

  return (
    <div className="flex justify-center">
      <ins
        className="adsbygoogle"
        style={{ display: "block", width, height }}
        data-ad-client="ca-pub-6915584561138880" // ✅ 본인 퍼블리셔 ID
        data-ad-slot={slot} // ✅ 광고 슬롯 ID에 따라 변경
        data-ad-format="auto"
        data-full-width-responsive="false"
      ></ins>
    </div>
  );
};

export default CenterBanner;
