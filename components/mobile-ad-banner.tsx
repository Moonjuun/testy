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
  // Initialize with the default width for SSR, will be updated on client
  const [currentWidth, setCurrentWidth] = useState(0);

  const dimensions = {
    "320x50": { width: 320, height: 50 },
    "320x100": { width: 320, height: 100 },
    "300x250": { width: 300, height: 250 },
  };

  const { width: defaultWidth, height } = dimensions[size];

  // Set the actual width on the client side after hydration
  useEffect(() => {
    // This code only runs in the browser
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
  }, [defaultWidth]); // Dependency on defaultWidth is important

  // 스티키 광고의 경우 스크롤에 따른 표시/숨김 처리
  useEffect(() => {
    if (type === "sticky-bottom") {
      const handleScroll = () => {
        const footer = document.querySelector("footer");
        if (!footer) return;

        const footerRect = footer.getBoundingClientRect();
        // window.innerHeight is safe here as this useEffect only runs on client
        const windowHeight = window.innerHeight;

        setIsVisible(footerRect.top > windowHeight - 100);
      };

      // Only add event listener if window is defined (on client)
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

  // On the server, render with the defaultWidth.
  // On the client, it will hydrate with defaultWidth, then useEffect will update currentWidth.
  return (
    <div className={`xl:hidden ${className}`}>
      <div
        className={getContainerClasses()}
        style={{
          width: currentWidth === 0 ? defaultWidth : currentWidth,
          height,
        }}
      >
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-xs font-medium">모바일 광고</div>
          <div className="text-xs">{size}</div>
        </div>
      </div>
    </div>
  );
}
