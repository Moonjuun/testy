// components/taro/DragHint.tsx
"use client";

import { ArrowRight } from "lucide-react";
import React, { useState, useEffect } from "react";

export function DragHint() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 터치 시작을 감지하는 이벤트 핸들러
    const handleTouchStart = () => {
      setIsVisible(false);
      // 이벤트 리스너 제거 (한 번만 실행되도록)
      window.removeEventListener("touchstart", handleTouchStart);
    };

    // 컴포넌트가 마운트되면 이벤트 리스너를 추가
    if (isVisible) {
      window.addEventListener("touchstart", handleTouchStart);
    }

    // 컴포넌트가 언마운트되거나 isVisible이 변경되면 이벤트 리스너를 정리
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [isVisible]); // isVisible 상태가 변경될 때마다 useEffect가 다시 실행

  // isVisible이 false가 되면 아무것도 렌더링하지 않음
  if (!isVisible) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none transition-opacity duration-500">
      <div className="bg-background/80 backdrop-blur-sm p-4 rounded-xl flex items-center shadow-lg animate-pulse-slow">
        <ArrowRight className="w-6 h-6 text-accent animate-bounce-horizontal" />
        <span className="ml-2 font-mono text-sm text-foreground">
          카드를 옆으로 드래그해 보세요
        </span>
      </div>
    </div>
  );
}
