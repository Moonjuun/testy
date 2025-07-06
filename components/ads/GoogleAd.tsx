"use client";

import { useEffect, useRef } from "react";

export default function GoogleAd() {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 광고가 이미 삽입됐는지 확인
    if (!adRef.current) return;

    const adTag = adRef.current.querySelector("ins.adsbygoogle");
    const alreadyLoaded =
      adTag?.getAttribute("data-adsbygoogle-status") === "done";

    if (!alreadyLoaded) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdsbyGoogle error", e);
      }
    }
  }, []);

  return (
    <div ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-6915584561138880"
        data-ad-slot="9507144688"
        data-ad-format="fluid"
        data-ad-layout-key="-6t+ea+18-5r+ak"
      />
    </div>
  );
}
