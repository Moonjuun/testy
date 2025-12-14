"use client";

import { useState, useEffect, useRef } from "react";
import { AD_SLOTS } from "@/constants/ads";

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
  const adRef = useRef<HTMLDivElement>(null);

  const dimensions = {
    "320x50": {
      width: 320,
      height: 50,
      slot: AD_SLOTS.MOBILE_320x50, // ⚠️ 320x50 전용 슬롯 필요
    },
    "320x100": {
      width: 320,
      height: 100,
      slot: AD_SLOTS.MOBILE_320x100, // ⚠️ 320x100 전용 슬롯 필요
    },
    "300x250": {
      width: 300,
      height: 250,
      slot: AD_SLOTS.MOBILE_300x250, // ⚠️ 300x250 전용 슬롯 필요
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
  // 로컬 개발 환경에서도 테스트 가능하도록 조건 완화
  useEffect(() => {
    // currentWidth가 설정되고 DOM이 준비될 때까지 대기
    if (currentWidth === 0) return;

    // useEffect 내부에서 displayWidth 계산
    const displayWidth = currentWidth === 0 ? defaultWidth : currentWidth;

    const tryPushAds = (retryCount = 0) => {
      // 최대 10번 재시도 (약 1초)
      if (retryCount > 10) {
        console.warn("AdSense: Max retries reached");
        return;
      }

      const adElement = adRef.current?.querySelector(
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
        setTimeout(() => clearInterval(checkScript), 5000);
        return;
      }

      // push() 호출 직전에 한 번 더 크기 확인 (중요!)
      const finalCheck = () => {
        // 요소와 부모 요소가 실제로 보이는지 확인
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
        adElement.style.width = `${displayWidth}px`;
        adElement.style.height = `${height}px`;
        adElement.style.minWidth = `${displayWidth}px`;
        adElement.style.minHeight = `${height}px`;
        adElement.style.display = "block";
        adElement.style.visibility = "visible";
        adElement.style.opacity = "1";

        // 여러 프레임을 기다려서 확실히 렌더링되도록 함
        let frameCount = 0;
        const checkSize = () => {
          frameCount++;
          const finalRect = adElement.getBoundingClientRect();
          const computedStyle = window.getComputedStyle(adElement);
          const computedWidth = parseFloat(computedStyle.width) || 0;
          const computedHeight = parseFloat(computedStyle.height) || 0;
          const rectWidth = finalRect.width || 0;
          const rectHeight = finalRect.height || 0;

          // 실제 렌더링된 크기 확인 (여러 방법으로 확인)
          const actualRenderedWidth = Math.max(
            rectWidth,
            computedWidth,
            displayWidth
          );
          const actualRenderedHeight = Math.max(
            rectHeight,
            computedHeight,
            height
          );

          // 최종 확인: 너비가 여전히 0이면 재시도
          if (
            actualRenderedWidth === 0 ||
            actualRenderedHeight === 0 ||
            frameCount < 3
          ) {
            if (frameCount < 10) {
              requestAnimationFrame(checkSize);
            } else if (retryCount < 15) {
              requestAnimationFrame(() => tryPushAds(retryCount + 1));
            } else {
              console.warn("AdSense: Element size is still 0 after retries");
            }
            return;
          }

          // 명시적인 크기를 data 속성으로 설정
          adElement.setAttribute(
            "data-ad-width",
            actualRenderedWidth.toString()
          );
          adElement.setAttribute(
            "data-ad-height",
            actualRenderedHeight.toString()
          );

          // push() 호출 직전에 한 번 더 최종 확인 (매우 중요!)
          // 여러 방법으로 크기를 확인하여 확실히 보장
          const lastCheck = adElement.getBoundingClientRect();
          const lastComputedStyle = window.getComputedStyle(adElement);
          const lastComputedWidth = parseFloat(lastComputedStyle.width) || 0;
          const lastComputedHeight = parseFloat(lastComputedStyle.height) || 0;
          const lastRectWidth = lastCheck.width || 0;
          const lastRectHeight = lastCheck.height || 0;

          // 모든 방법으로 확인한 크기가 0이면 재시도
          if (
            lastRectWidth === 0 ||
            lastRectHeight === 0 ||
            lastComputedWidth === 0 ||
            lastComputedHeight === 0
          ) {
            if (retryCount < 20) {
              // 더 긴 대기 시간 후 재시도
              setTimeout(() => {
                requestAnimationFrame(() => tryPushAds(retryCount + 1));
              }, 100);
            } else {
              console.warn(
                "AdSense: Element size is still 0 after all retries"
              );
            }
            return;
          }

          // 부모 컨테이너도 다시 확인
          const parentCheck = parentElement.getBoundingClientRect();
          if (parentCheck.width === 0 || parentCheck.height === 0) {
            if (retryCount < 20) {
              setTimeout(() => {
                requestAnimationFrame(() => tryPushAds(retryCount + 1));
              }, 100);
            }
            return;
          }

          // 최종 확인: 실제로 보이는 크기가 최소값 이상인지 확인
          const finalWidth = Math.max(
            lastRectWidth,
            lastComputedWidth,
            displayWidth
          );
          const finalHeight = Math.max(
            lastRectHeight,
            lastComputedHeight,
            height
          );

          if (finalWidth < 50 || finalHeight < 50) {
            if (retryCount < 20) {
              setTimeout(() => {
                requestAnimationFrame(() => tryPushAds(retryCount + 1));
              }, 100);
            }
            return;
          }

          try {
            // push() 호출 직전에 한 번 더 최종 확인
            const immediateCheck = adElement.getBoundingClientRect();
            if (immediateCheck.width === 0 || immediateCheck.height === 0) {
              // 마지막 시도
              setTimeout(() => {
                const finalImmediateCheck = adElement.getBoundingClientRect();
                if (
                  finalImmediateCheck.width > 0 &&
                  finalImmediateCheck.height > 0
                ) {
                  ((window as any).adsbygoogle =
                    (window as any).adsbygoogle || []).push({});
                } else {
                  console.warn("AdSense: Skipping push() - element size is 0");
                }
              }, 50);
              return;
            }

            ((window as any).adsbygoogle =
              (window as any).adsbygoogle || []).push({});
          } catch (e) {
            // 403 에러는 개발 환경이나 정책 문제일 수 있으므로 조용히 처리
            if (process.env.NODE_ENV === "development") {
              console.warn("AdSense push error (dev mode):", e);
            } else {
              console.error("AdSense push error:", e);
            }
          }
        };

        // 첫 번째 프레임 시작
        requestAnimationFrame(checkSize);
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
  }, [slot, currentWidth]);

  const getContainerClasses = () => {
    const base = "flex items-center justify-center";

    switch (type) {
      case "sticky-bottom":
        return `${base} fixed bottom-0 left-0 right-0 z-40 mx-auto transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "translate-y-full"
        } bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-800 shadow-lg`;
      case "sticky-top":
        return `${base} sticky top-16 z-30 mx-auto shadow-sm`;
      default:
        // 인라인 광고는 카드 형태로 감싸서 디자인 시스템과 일치
        return `${base} mx-auto my-6 md:my-8 px-4`;
    }
  };

  // currentWidth가 설정될 때까지 기본값 사용
  const displayWidth = currentWidth === 0 ? defaultWidth : currentWidth;

  // 인라인 광고는 카드 형태로 감싸기
  const isInline = type === "inline";

  return (
    <div className={`xl:hidden ${className}`}>
      {isInline ? (
        // 인라인 광고: 카드 형태로 감싸서 디자인 시스템과 일치
        <section className="py-8 md:py-12 px-4 md:px-8 bg-white dark:bg-zinc-950">
          <div className="max-w-7xl mx-auto">
            <div
              ref={adRef}
              className="flex items-center justify-center"
              style={{
                width: "100%",
                minHeight: height,
              }}
            >
              <div
                className="relative bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 md:p-6 border border-zinc-200 dark:border-zinc-800"
                style={{
                  width: displayWidth,
                  height,
                  minWidth: displayWidth,
                  minHeight: height,
                }}
              >
                {/* 개발 모드에서 광고 영역 표시 (로컬 테스트용) */}
                {process.env.NODE_ENV === "development" && (
                  <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800 rounded-lg border-2 border-dashed border-zinc-400 dark:border-zinc-600 flex items-center justify-center z-10 pointer-events-none">
                    <div className="text-center">
                      <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                        광고 영역
                      </div>
                      <div className="text-[10px] text-zinc-400 dark:text-zinc-500">
                        {displayWidth} × {height}
                      </div>
                    </div>
                  </div>
                )}

                <ins
                  className="adsbygoogle"
                  style={{
                    display: "block",
                    width: `${displayWidth}px`,
                    height: `${height}px`,
                    minWidth: `${displayWidth}px`,
                    minHeight: `${height}px`,
                  }}
                  data-ad-client="ca-pub-6915584561138880"
                  data-ad-slot={slot}
                  data-ad-format="rectangle"
                  data-full-width-responsive="false"
                  data-ad-width={displayWidth}
                  data-ad-height={height}
                ></ins>
              </div>
            </div>
          </div>
        </section>
      ) : (
        // 고정 배너: 기존 스타일 유지
        <div
          ref={adRef}
          className={getContainerClasses()}
          style={{
            width: displayWidth,
            height,
            minWidth: displayWidth,
            minHeight: height,
          }}
        >
          {/* 개발 모드에서 광고 영역 표시 (로컬 테스트용) */}
          {process.env.NODE_ENV === "development" && (
            <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-900 rounded border-2 border-dashed border-zinc-400 dark:border-zinc-600 flex items-center justify-center z-10 pointer-events-none">
              <div className="text-center">
                <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                  광고 영역
                </div>
                <div className="text-[10px] text-zinc-400 dark:text-zinc-500">
                  {displayWidth} × {height}
                </div>
              </div>
            </div>
          )}

          <ins
            className="adsbygoogle"
            style={{
              display: "block",
              width: `${displayWidth}px`,
              height: `${height}px`,
              minWidth: `${displayWidth}px`,
              minHeight: `${height}px`,
            }}
            data-ad-client="ca-pub-6915584561138880"
            data-ad-slot={slot}
            data-ad-format="rectangle"
            data-full-width-responsive="false"
            data-ad-width={displayWidth}
            data-ad-height={height}
          ></ins>
        </div>
      )}
    </div>
  );
}
