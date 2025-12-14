"use client";

import { useEffect } from "react";

interface AdBannerProps {
  type: "side" | "center";
  size: "300x600" | "728x90" | "336x280";
  slot: string;
}

export function AdBanner({ type, size, slot }: AdBannerProps) {
  const dimensions = {
    "300x600": { width: 300, height: 600 },
    "728x90": { width: 728, height: 90 },
    "336x280": { width: 336, height: 280 },
  };

  const { width, height } = dimensions[size];

  useEffect(() => {
    const tryPushAds = (retryCount = 0) => {
      // 최대 30번 재시도 (더 여유있게)
      if (retryCount > 30) {
        if (process.env.NODE_ENV === "development") {
          console.warn("AdSense: Max retries reached");
        }
        return;
      }

      const adElement = document.querySelector(
        `ins[data-ad-slot="${slot}"]`
      ) as HTMLElement | null;

      if (!adElement) {
        requestAnimationFrame(() => tryPushAds(retryCount + 1));
        return;
      }

      const isAlreadyRendered =
        adElement.getAttribute("data-adsbygoogle-status") === "done" ||
        adElement.getAttribute("data-adsbygoogle-status") === "unfilled";

      if (isAlreadyRendered) return;

      // 요소의 실제 크기 확인
      const rect = adElement.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(adElement);
      const actualWidth =
        rect.width ||
        parseFloat(computedStyle.width) ||
        parseFloat(computedStyle.minWidth) ||
        0;

      // 너비가 0이거나 아직 레이아웃이 완료되지 않은 경우 재시도
      if (actualWidth === 0 || !rect.height) {
        requestAnimationFrame(() => tryPushAds(retryCount + 1));
        return;
      }

      // adsbygoogle 스크립트가 로드되었는지 확인
      const adsbygoogle = (window as any).adsbygoogle;
      if (typeof adsbygoogle === "undefined") {
        // 스크립트 로드 대기
        const checkScript = setInterval(() => {
          if (typeof (window as any).adsbygoogle !== "undefined") {
            clearInterval(checkScript);
            tryPushAds(retryCount);
          }
        }, 100);

        // 5초 후 타임아웃
        setTimeout(() => {
          clearInterval(checkScript);
        }, 5000);
        return;
      }

      // push() 호출
      const finalCheck = () => {
        const parentElement = adElement.parentElement;
        if (!parentElement) {
          if (retryCount < 15) {
            requestAnimationFrame(() => tryPushAds(retryCount + 1));
          }
          return;
        }

        // 부모 요소의 크기 확인
        const parentRect = parentElement.getBoundingClientRect();
        const parentStyle = window.getComputedStyle(parentElement);
        const isParentVisible =
          parentStyle.display !== "none" &&
          parentStyle.visibility !== "hidden" &&
          parentStyle.opacity !== "0" &&
          parentRect.width > 0 &&
          parentRect.height > 0;

        if (!isParentVisible) {
          if (retryCount < 15) {
            requestAnimationFrame(() => tryPushAds(retryCount + 1));
          }
          return;
        }

        // 요소에 직접 인라인 스타일 설정하여 크기 보장
        adElement.style.width = `${width}px`;
        adElement.style.height = `${height}px`;
        adElement.style.minWidth = `${width}px`;
        adElement.style.minHeight = `${height}px`;
        adElement.style.display = "block";
        adElement.style.visibility = "visible";
        adElement.style.opacity = "1";

        try {
          ((window as any).adsbygoogle =
            (window as any).adsbygoogle || []).push({});
        } catch (pushError) {
          // 403 에러는 개발 환경이나 정책 문제일 수 있으므로 조용히 처리
          if (process.env.NODE_ENV === "development") {
            console.warn("AdSense push error (dev mode):", pushError);
          } else {
            console.error("AdSense push error:", pushError);
          }
        }
      };

      // 한 프레임 더 기다린 후 최종 확인
      requestAnimationFrame(finalCheck);
    };

    // DOM이 완전히 렌더링된 후 실행
    const timer = setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => tryPushAds());
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [slot, width, height]);

  return (
    <div
      className={`flex items-center justify-center ${
        type === "center" ? "mx-auto" : ""
      }`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        minWidth: `${width}px`,
        minHeight: `${height}px`,
      }}
    >
      {/* 개발 모드에서 광고 영역 표시 (로컬 테스트용) */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800 rounded-lg border-2 border-dashed border-zinc-400 dark:border-zinc-600 flex items-center justify-center z-10 pointer-events-none">
          <div className="text-center">
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
              사이드 광고 영역
            </div>
            <div className="text-[10px] text-zinc-400 dark:text-zinc-500">
              {width} × {height}
            </div>
          </div>
        </div>
      )}

      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          width: `${width}px`,
          height: `${height}px`,
          minWidth: `${width}px`,
          minHeight: `${height}px`,
        }}
        data-ad-client="ca-pub-6915584561138880"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="false"
        data-ad-width={width}
        data-ad-height={height}
      ></ins>
    </div>
  );
}
