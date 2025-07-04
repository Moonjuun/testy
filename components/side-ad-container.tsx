"use client";

import { useEffect, useState } from "react";
import { AdBanner } from "@/components/Banner/ad-banner";

interface SideAdContainerProps {
  position: "left" | "right";
}

export function SideAdContainer({ position }: SideAdContainerProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector("footer");
      const adContainer = document.querySelector(
        `[data-ad-position="${position}"]`
      );

      if (!footer || !adContainer) return;

      const footerRect = footer.getBoundingClientRect();
      const adRect = adContainer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // 푸터가 화면에 나타나기 시작하면 광고를 숨김
      if (
        footerRect.top < windowHeight &&
        footerRect.top < adRect.bottom + 20
      ) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 초기 실행

    return () => window.removeEventListener("scroll", handleScroll);
  }, [position]);

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 min-h-screen">
      <div
        data-ad-position={position}
        className={`sticky top-20 p-4 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <AdBanner type="side" size="300x600" />
      </div>
    </div>
  );
}
