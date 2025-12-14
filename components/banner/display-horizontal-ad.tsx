"use client";

import { useEffect, useState, useRef } from "react";

interface DisplayHorizontalAdProps {
  className?: string;
  showSkeleton?: boolean;
}

export function DisplayHorizontalAd({
  className = "",
  showSkeleton = true,
}: DisplayHorizontalAdProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);

  // Intersection Observer로 광고가 뷰포트에 들어올 때만 로드
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        });
      },
      { rootMargin: "100px" } // 100px 전에 미리 로드
    );

    const adContainer = adRef.current;
    if (adContainer) {
      observer.observe(adContainer);
    }

    return () => {
      if (adContainer) {
        observer.unobserve(adContainer);
      }
    };
  }, [isVisible]);

  // AdSense 광고 삽입
  useEffect(() => {
    if (!isVisible) return;

    const tryPushAds = (retryCount = 0) => {
      // 최대 20번 재시도
      if (retryCount > 20) {
        console.warn("AdSense: Max retries reached");
        setIsLoaded(true);
        return;
      }

      const adElement = adRef.current?.querySelector(
        `ins[data-ad-slot="8905831266"]`
      ) as HTMLElement | null;

      if (!adElement) {
        requestAnimationFrame(() => tryPushAds(retryCount + 1));
        return;
      }

      const isAlreadyRendered =
        adElement.getAttribute("data-adsbygoogle-status") === "done" ||
        adElement.getAttribute("data-adsbygoogle-status") === "unfilled";

      if (isAlreadyRendered) {
        setIsLoaded(true);
        return;
      }

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
          setIsLoaded(true);
        }, 5000);
        return;
      }

      // push() 호출
      const finalCheck = () => {
        const parentElement = adElement.parentElement;
        if (!parentElement) {
          if (retryCount < 15) {
            requestAnimationFrame(() => tryPushAds(retryCount + 1));
          } else {
            setIsLoaded(true);
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
          } else {
            setIsLoaded(true);
          }
          return;
        }

        try {
          ((window as any).adsbygoogle =
            (window as any).adsbygoogle || []).push({});

          // 광고 로드 완료 감지
          const checkLoaded = setInterval(() => {
            const status = adElement.getAttribute("data-adsbygoogle-status");
            if (status === "done" || status === "unfilled") {
              setIsLoaded(true);
              clearInterval(checkLoaded);
            }
          }, 100);

          // 5초 후 타임아웃
          setTimeout(() => {
            clearInterval(checkLoaded);
            setIsLoaded(true);
          }, 5000);
        } catch (pushError) {
          console.error("AdSense push error:", pushError);
          setIsLoaded(true);
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
  }, [isVisible]);

  return (
    <section
      className={`py-8 md:py-12 px-4 md:px-8 bg-white dark:bg-zinc-950 ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        <div
          ref={adRef}
          className="relative flex items-center justify-center"
          style={{
            width: "100%",
            minHeight: "100px",
          }}
        >
          <div className="relative bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 md:p-6 border border-zinc-200 dark:border-zinc-800 w-full">
            {/* 스켈레톤 UI (로딩 중) */}
            {showSkeleton && !isLoaded && (
              <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse flex items-center justify-center border border-zinc-300 dark:border-zinc-700">
                <div className="text-xs text-zinc-400 dark:text-zinc-600">
                  광고 로딩 중...
                </div>
              </div>
            )}

            {/* 개발 모드에서 광고 영역 표시 (로컬 테스트용) */}
            {process.env.NODE_ENV === "development" && !isLoaded && (
              <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800 rounded-lg border-2 border-dashed border-zinc-400 dark:border-zinc-600 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                    디스플레이 수평형 광고 영역
                  </div>
                  <div className="text-[10px] text-zinc-400 dark:text-zinc-500">
                    반응형
                  </div>
                </div>
              </div>
            )}

            {/* AdSense 광고 */}
            {isVisible && (
              <ins
                className="adsbygoogle"
                style={{
                  display: "block",
                  width: "100%",
                }}
                data-ad-client="ca-pub-6915584561138880"
                data-ad-slot="8905831266"
                data-ad-format="auto"
                data-full-width-responsive="true"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
