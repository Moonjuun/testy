"use client";

import { useEffect, useRef } from "react";

export default function GoogleAd() {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
    <div
      ref={adRef}
      style={{ minWidth: 250, minHeight: 100 }} // 최소 사이즈 보장
    >
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
        data-ad-client="ca-pub-6915584561138880"
        data-ad-slot="9507144688"
        data-ad-format="fluid"
        data-ad-layout-key="-6t+ea+18-5r+ak"
      />
    </div>
  );
}
