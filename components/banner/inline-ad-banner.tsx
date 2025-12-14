"use client";

import { useEffect, useState, useRef } from "react";

interface InlineAdBannerProps {
  size: "728x90" | "336x280" | "320x100" | "300x250";
  slot: string;
  className?: string;
  showSkeleton?: boolean;
}

export function InlineAdBanner({
  size,
  slot,
  className = "",
  showSkeleton = true,
}: InlineAdBannerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);

  const dimensions = {
    "728x90": { width: 728, height: 90 },
    "336x280": { width: 336, height: 280 },
    "320x100": { width: 320, height: 100 },
    "300x250": { width: 300, height: 250 },
  };

  const { width, height } = dimensions[size];

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

    const adContainer = document.querySelector(`[data-ad-container="${slot}"]`);
    if (adContainer) {
      observer.observe(adContainer);
    }

    return () => {
      if (adContainer) {
        observer.unobserve(adContainer);
      }
    };
  }, [slot, isVisible]);

  // AdSense 광고 삽입
  // 로컬 개발 환경에서도 테스트 가능하도록 조건 완화
  useEffect(() => {
    if (!isVisible) return;

    // 화면 크기 체크: 데스크탑에서만 광고 초기화 (728x90, 336x280는 데스크탑 전용)
    const isDesktopSize = size === "728x90" || size === "336x280";
    if (
      isDesktopSize &&
      typeof window !== "undefined" &&
      window.innerWidth < 1280
    ) {
      // xl 브레이크포인트(1280px) 미만에서는 광고를 초기화하지 않음
      return;
    }

    const tryPushAds = (retryCount = 0) => {
      // 최대 10번 재시도 (약 1초)
      if (retryCount > 10) {
        console.warn("AdSense: Max retries reached");
        setIsLoaded(true);
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

      // push() 호출 직전에 한 번 더 크기 확인 (중요!)
      const finalCheck = () => {
        // 요소와 부모 요소가 실제로 보이는지 확인
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

        // 요소에 직접 인라인 스타일 설정하여 크기 보장
        const actualWidth = size.startsWith("728") ? width : width;
        adElement.style.width = `${actualWidth}px`;
        adElement.style.height = `${height}px`;
        adElement.style.minWidth = `${actualWidth}px`;
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
            actualWidth
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
              setIsLoaded(true);
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
              setIsLoaded(true);
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
            } else {
              setIsLoaded(true);
            }
            return;
          }

          // 최종 확인: 실제로 보이는 크기가 최소값 이상인지 확인
          const finalWidth = Math.max(
            lastRectWidth,
            lastComputedWidth,
            actualWidth
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
            } else {
              setIsLoaded(true);
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
                  // requestAnimationFrame으로 한 프레임 더 기다린 후 push
                  requestAnimationFrame(() => {
                    const lastCheck = adElement.getBoundingClientRect();
                    if (lastCheck.width > 0 && lastCheck.height > 0) {
                      try {
                        ((window as any).adsbygoogle =
                          (window as any).adsbygoogle || []).push({});
                      } catch (pushError) {
                        console.warn("AdSense push error:", pushError);
                        setIsLoaded(true);
                      }
                    } else {
                      console.warn(
                        "AdSense: Skipping push() - element size is 0"
                      );
                      setIsLoaded(true);
                    }
                  });
                } else {
                  console.warn("AdSense: Skipping push() - element size is 0");
                  setIsLoaded(true);
                }
              }, 50);
              return;
            }

            // 여러 프레임을 기다려서 확실히 레이아웃이 완료되도록 함
            // 스크롤로 인해 요소가 보이게 되었을 때 레이아웃이 완료되는데 시간이 걸릴 수 있음
            let frameWaitCount = 0;
            const waitForLayout = () => {
              frameWaitCount++;
              const finalCheck = adElement.getBoundingClientRect();
              const finalComputedStyle = window.getComputedStyle(adElement);
              const finalComputedWidth =
                parseFloat(finalComputedStyle.width) || 0;
              const finalComputedHeight =
                parseFloat(finalComputedStyle.height) || 0;

              // 실제 렌더링된 크기 확인 (여러 방법으로 확인)
              const actualWidth = Math.max(
                finalCheck.width,
                finalComputedWidth,
                parseFloat(finalComputedStyle.minWidth) || 0,
                width
              );
              const actualHeight = Math.max(
                finalCheck.height,
                finalComputedHeight,
                parseFloat(finalComputedStyle.minHeight) || 0,
                height
              );

              // 크기가 유효한지 확인
              const isValidSize =
                actualWidth > 0 &&
                actualHeight > 0 &&
                actualWidth >= 50 &&
                actualHeight >= 50;

              // 크기가 유효하지 않고 아직 기다릴 수 있으면 계속 기다림
              if (!isValidSize && frameWaitCount < 5) {
                requestAnimationFrame(waitForLayout);
                return;
              }

              // 최대 프레임을 기다렸는데도 크기가 유효하지 않으면 재시도
              if (!isValidSize) {
                console.warn(
                  `AdSense: Element size is invalid after waiting (${actualWidth}x${actualHeight})`
                );
                if (retryCount < 20) {
                  setTimeout(() => {
                    requestAnimationFrame(() => tryPushAds(retryCount + 1));
                  }, 100);
                } else {
                  setIsLoaded(true);
                }
                return;
              }

              // push() 호출 직전에 data 속성 명시적으로 설정
              adElement.setAttribute(
                "data-ad-width",
                Math.floor(actualWidth).toString()
              );
              adElement.setAttribute(
                "data-ad-height",
                Math.floor(actualHeight).toString()
              );

              // push() 호출 직전에 한 번 더 동기적으로 크기 확인 (매우 중요!)
              const immediateSizeCheck = adElement.getBoundingClientRect();
              const immediateComputedStyle = window.getComputedStyle(adElement);

              // 요소가 실제로 보이는지 확인 (display, visibility, opacity 체크)
              const isElementVisible =
                immediateComputedStyle.display !== "none" &&
                immediateComputedStyle.visibility !== "hidden" &&
                immediateComputedStyle.opacity !== "0" &&
                immediateSizeCheck.width > 0 &&
                immediateSizeCheck.height > 0;

              // 부모 요소도 확인
              const parentElement = adElement.parentElement;
              const isParentVisible = parentElement
                ? (() => {
                    const parentStyle = window.getComputedStyle(parentElement);
                    const parentRect = parentElement.getBoundingClientRect();
                    return (
                      parentStyle.display !== "none" &&
                      parentStyle.visibility !== "hidden" &&
                      parentStyle.opacity !== "0" &&
                      parentRect.width > 0 &&
                      parentRect.height > 0
                    );
                  })()
                : false;

              if (
                !isElementVisible ||
                !isParentVisible ||
                immediateSizeCheck.width < 50 ||
                immediateSizeCheck.height < 50
              ) {
                console.warn(
                  `AdSense: Skipping push() - element not visible or invalid size (${immediateSizeCheck.width}x${immediateSizeCheck.height}, visible: ${isElementVisible}, parentVisible: ${isParentVisible})`
                );
                // 재시도
                if (retryCount < 20) {
                  setTimeout(() => {
                    requestAnimationFrame(() => tryPushAds(retryCount + 1));
                  }, 100);
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
                  const status = adElement.getAttribute(
                    "data-adsbygoogle-status"
                  );
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
                // 403 에러는 개발 환경이나 정책 문제일 수 있으므로 조용히 처리
                if (process.env.NODE_ENV === "development") {
                  console.warn("AdSense push error (dev mode):", pushError);
                } else {
                  console.error("AdSense push error:", pushError);
                }
                setIsLoaded(true);
              }
            };

            // waitForLayout 함수 시작
            requestAnimationFrame(waitForLayout);
          } catch (e) {
            console.error("AdSense error:", e);
            setIsLoaded(true);
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
  }, [slot, isVisible]);

  return (
    <section
      data-ad-container={slot}
      className={`py-8 md:py-12 px-4 md:px-8 bg-white dark:bg-zinc-950 ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        <div
          ref={adRef}
          className="relative flex items-center justify-center"
          style={{
            width: "100%",
            minHeight: `${height}px`,
          }}
        >
          <div
            className="relative bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 md:p-6 border border-zinc-200 dark:border-zinc-800"
            style={{
              width: size.startsWith("728") ? "100%" : `${width}px`,
              maxWidth: `${width}px`,
              minWidth: size.startsWith("728") ? "100%" : `${width}px`,
              minHeight: `${height}px`,
              display: "block",
            }}
          >
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
                    광고 영역
                  </div>
                  <div className="text-[10px] text-zinc-400 dark:text-zinc-500">
                    {width} × {height}
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
                  width: size.startsWith("728") ? "100%" : `${width}px`,
                  maxWidth: `${width}px`,
                  minWidth: size.startsWith("728") ? "100%" : `${width}px`,
                  height: `${height}px`,
                  minHeight: `${height}px`,
                }}
                data-ad-client="ca-pub-6915584561138880"
                data-ad-slot={slot}
                data-ad-format={
                  size.startsWith("728") ? "horizontal" : "rectangle"
                }
                data-full-width-responsive="false"
                data-ad-width={width}
                data-ad-height={height}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
