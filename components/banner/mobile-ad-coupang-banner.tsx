"use client";

import React from "react";

interface MobileAdCoupangBannerProps {
  type?: "inline" | "sticky-top" | "sticky-bottom";
  className?: string;
}

export function MobileAdCoupangBanner({
  type = "inline",
  className = "",
}: MobileAdCoupangBannerProps) {
  const width = 320;
  const height = 50;

  const getContainerClasses = () => {
    const base = "flex justify-center items-center xl:hidden"; // 👈 여기에 핵심!
    switch (type) {
      case "sticky-top":
        return `${base} fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md ${className}`;
      case "sticky-bottom":
        return `${base} fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md ${className}`;
      default:
        return `${base} my-4 ${className}`;
    }
  };

  return (
    <div className={getContainerClasses()} style={{ height }}>
      <iframe
        src={`https://ads-partners.coupang.com/widgets.html?id=886336&template=carousel&trackingCode=AF0151438&subId=&width=${width}&height=${height}&tsource=`}
        width={width}
        height={height}
        frameBorder="0"
        scrolling="no"
        referrerPolicy="unsafe-url"
      />
    </div>
  );
}
