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
  const [containerWidth, setContainerWidth] = useState(0); // New state for dynamic width

  const dimensions = {
    "320x50": { width: 320, height: 50 },
    "320x100": { width: 320, height: 100 },
    "300x250": { width: 300, height: 250 },
  };

  const { width, height } = dimensions[size];

  // Set containerWidth after component mounts on the client
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if window is defined (client-side)
      setContainerWidth(Math.min(width, window.innerWidth - 32) || width);

      const handleResize = () => {
        setContainerWidth(Math.min(width, window.innerWidth - 32) || width);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [width]); // Re-run if the base width changes

  // 스티키 광고의 경우 스크롤에 따른 표시/숨김 처리
  useEffect(() => {
    if (type === "sticky-bottom") {
      const handleScroll = () => {
        const footer = document.querySelector("footer");
        if (!footer) return;

        const footerRect = footer.getBoundingClientRect();
        // Ensure window is defined before accessing innerHeight
        const windowHeight =
          typeof window !== "undefined" ? window.innerHeight : 0;

        // 푸터가 화면에 나타나면 하단 광고 숨김
        setIsVisible(footerRect.top > windowHeight - 100);
      };

      // Only add event listener if window is defined
      if (typeof window !== "undefined") {
        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Initial call to set visibility
      }

      return () => {
        if (typeof window !== "undefined") {
          window.removeEventListener("scroll", handleScroll);
        }
      };
    }
  }, [type]);

  const getContainerClasses = () => {
    const baseClasses =
      "bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center";

    switch (type) {
      case "sticky-bottom":
        return `${baseClasses} fixed bottom-0 left-0 right-0 z-40 mx-auto transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "translate-y-full"
        } shadow-lg`;
      case "sticky-top":
        return `${baseClasses} sticky top-16 z-30 mx-auto shadow-sm`;
      default:
        return `${baseClasses} mx-auto my-4`;
    }
  };

  // Render null on the server or until containerWidth is set on the client
  if (typeof window === "undefined" && containerWidth === 0) {
    return null;
  }

  return (
    <div className={`xl:hidden ${className}`}>
      <div
        className={getContainerClasses()}
        style={{ width: containerWidth, height }} // Use containerWidth from state
      >
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-xs font-medium">모바일 광고</div>
          <div className="text-xs">{size}</div>
        </div>
      </div>
    </div>
  );
}
