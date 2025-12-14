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
      className="sticky top-20 self-start h-screen overflow-y-auto"
      style={{
        maxHeight: "calc(100vh - 5rem)",
      }}
    >
      <div
        data-ad-position={position}
        className={`p-4 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-50"
        }`}
        style={{
          width: "100%",
          minHeight: "600px",
        }}
      >
        <AdBanner type="side" size="300x600" slot={slot} />
      </div>
    </div>
  );
}
