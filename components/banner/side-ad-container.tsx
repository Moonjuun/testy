"use client";

import { useEffect, useState } from "react";
import { AdBanner } from "@/components/banner/ad-banner";

interface SideAdContainerProps {
  position: "left" | "right";
  slot: string;
}

export function SideAdContainer({ position, slot }: SideAdContainerProps) {
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

      if (
        footerRect.top < windowHeight &&
        footerRect.top < adRect.bottom + 20
      ) {
        setIsVisible(false); // 여기서 "사라지지 않고 반투명"으로
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [position]);

  return (
    <div
      className="relative h-full bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20"
      style={{ minHeight: "100vh" }}
    >
      <div
        data-ad-position={position}
        className={`sticky top-20 p-4 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-50"
        }`}
      >
        <AdBanner type="side" size="300x600" slot={slot} />
      </div>
    </div>
  );
}
