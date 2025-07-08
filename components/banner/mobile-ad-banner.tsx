"use client";

import { useState, useEffect } from "react";

interface MobileAdBannerProps {
  type: "inline" | "sticky-bottom" | "sticky-top";
  size: "320x50" | "320x100" | "300x250";
  className?: string;
}

export function MobileAdBanner({
  type,
  size,
  className = "",
}: MobileAdBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentWidth, setCurrentWidth] = useState(0);

  const dimensions = {
    "320x50": {
      width: 320,
      height: 50,
      slot: "5251424654", // ✅ 슬롯 ID 지정
    },
    "320x100": {
      width: 320,
      height: 100,
      slot: "5251424654",
    },
    "300x250": {
      width: 300,
      height: 250,
      slot: "5251424654",
    },
  };

  const { width: defaultWidth, height, slot } = dimensions[size];

  useEffect(() => {
    setCurrentWidth(
      Math.min(defaultWidth, window.innerWidth - 32) || defaultWidth
    );

    const handleResize = () => {
      setCurrentWidth(
        Math.min(defaultWidth, window.innerWidth - 32) || defaultWidth
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [defaultWidth]);

  useEffect(() => {
    if (type === "sticky-bottom") {
      const handleScroll = () => {
        const footer = document.querySelector("footer");
        if (!footer) return;

        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        setIsVisible(footerRect.top > windowHeight - 100);
      };

      window.addEventListener("scroll", handleScroll);
      handleScroll();

      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [type]);

  // ✅ AdSense 광고 삽입
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

  const getContainerClasses = () => {
    const base = "bg-transparent flex items-center justify-center";

    switch (type) {
      case "sticky-bottom":
        return `${base} fixed bottom-0 left-0 right-0 z-40 mx-auto transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "translate-y-full"
        } shadow-lg`;
      case "sticky-top":
        return `${base} sticky top-16 z-30 mx-auto shadow-sm`;
      default:
        return `${base} mx-auto my-4`;
    }
  };

  return (
    <div className={`xl:hidden ${className}`}>
      <div
        className={getContainerClasses()}
        style={{
          width: currentWidth === 0 ? defaultWidth : currentWidth,
          height,
        }}
      >
        <ins
          className="adsbygoogle"
          style={{
            display: "block",
            width: currentWidth || defaultWidth,
            height,
          }}
          data-ad-client="ca-pub-6915584561138880"
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="false"
        ></ins>
      </div>
    </div>
  );
}
