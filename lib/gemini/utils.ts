// lib/gemini/utils.ts
// Gemini API 공통 유틸리티 함수

/**
 * 에러 메시지에서 재시도 시간 추출 (초 단위)
 */
export function extractRetryDelay(error: any): number | null {
  try {
    const errorMessage = error?.message || String(error);
    // "Please retry in 10.951974186s" 형식에서 숫자 추출
    const retryMatch = errorMessage.match(/retry in ([\d.]+)s/i);
    if (retryMatch) {
      const seconds = parseFloat(retryMatch[1]);
      return Math.ceil(seconds * 1000); // 밀리초로 변환
    }

    // errorDetails에서 RetryInfo 확인
    if (error?.errorDetails) {
      for (const detail of error.errorDetails) {
        if (detail["@type"] === "type.googleapis.com/google.rpc.RetryInfo") {
          const retryDelay = detail.retryDelay;
          if (retryDelay) {
            // "10s" 형식 파싱
            const match = String(retryDelay).match(/(\d+)s/i);
            if (match) {
              return parseInt(match[1]) * 1000; // 밀리초로 변환
            }
          }
        }
      }
    }
  } catch (e) {
    // 파싱 실패 시 null 반환
  }
  return null;
}

/**
 * 할당량 초과 에러인지 확인
 */
export function isQuotaExceededError(error: any): boolean {
  const errorMessage = error?.message || String(error);
  return (
    errorMessage.includes("429") ||
    errorMessage.includes("Too Many Requests") ||
    errorMessage.includes("quota") ||
    errorMessage.includes("Quota exceeded")
  );
}

/**
 * 모델을 찾을 수 없는 에러(404)인지 확인
 */
export function isModelNotFoundError(error: any): boolean {
  const errorMessage = error?.message || String(error);
  const status = error?.status || error?.statusCode;
  return (
    status === 404 ||
    errorMessage.includes("404") ||
    errorMessage.includes("Not Found") ||
    errorMessage.includes("is not found") ||
    errorMessage.includes("not supported for generateContent")
  );
}

/**
 * 서버 과부하 에러(503)인지 확인
 */
export function isServiceUnavailableError(error: any): boolean {
  const errorMessage = error?.message || String(error);
  const status = error?.status || error?.statusCode;
  return (
    status === 503 ||
    errorMessage.includes("503") ||
    errorMessage.includes("Service Unavailable") ||
    errorMessage.includes("overloaded") ||
    errorMessage.includes("try again later")
  );
}

/**
 * 결제/빌링 관련 에러인지 확인 (403, 402 등)
 * ⚠️ 429 (할당량 초과)는 빌링 에러가 아님 - 할당량 에러로 처리해야 함
 */
export function isBillingError(error: any): boolean {
  const errorMessage = error?.message || String(error);
  const status = error?.status || error?.statusCode;

  // 429 에러는 할당량 초과이므로 빌링 에러가 아님
  if (
    status === 429 ||
    errorMessage.includes("429") ||
    errorMessage.includes("Too Many Requests")
  ) {
    return false;
  }

  return (
    status === 403 ||
    status === 402 ||
    errorMessage.includes("403") ||
    errorMessage.includes("402") ||
    errorMessage.includes("Payment Required") ||
    (errorMessage.includes("Forbidden") && status === 403) ||
    // "billing" 키워드는 429가 아닐 때만 빌링 에러로 간주
    (errorMessage.includes("billing") && status !== 429) ||
    errorMessage.includes("Billing account") ||
    (errorMessage.includes("payment") && status !== 429) ||
    (errorMessage.includes("Payment") && status !== 429) ||
    errorMessage.includes("unpaid") ||
    errorMessage.includes("credit card") ||
    errorMessage.includes("payment method")
  );
}

/**
 * 대기 함수 (Promise 기반)
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
