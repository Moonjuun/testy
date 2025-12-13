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

/**
 * JSON 파싱 헬퍼 함수 (견고한 파싱)
 * 중첩된 중괄호를 고려하여 정확한 JSON 객체 추출
 * 마크다운 코드 블록, 추가 텍스트, 제어 문자 등을 처리
 */
export function parseJsonResponse(text: string): any {
  // 1. 마크다운 코드 블록 제거
  let cleanedText = text
    .replace(/```json\n?/gi, "")
    .replace(/```\n?/g, "")
    .trim();

  // 2. JSON 객체 시작 찾기
  const firstBrace = cleanedText.indexOf("{");
  if (firstBrace === -1) {
    throw new Error("JSON 객체를 찾을 수 없습니다 (시작 중괄호 없음).");
  }

  // 3. 중첩된 중괄호를 고려하여 정확한 JSON 객체 추출
  let braceCount = 0;
  let jsonEnd = -1;

  for (let i = firstBrace; i < cleanedText.length; i++) {
    if (cleanedText[i] === "{") {
      braceCount++;
    } else if (cleanedText[i] === "}") {
      braceCount--;
      if (braceCount === 0) {
        jsonEnd = i;
        break;
      }
    }
  }

  if (jsonEnd === -1) {
    throw new Error("JSON 객체를 찾을 수 없습니다 (끝 중괄호 없음).");
  }

  // 4. JSON 부분만 추출 (첫 번째 완전한 JSON 객체만)
  cleanedText = cleanedText.substring(firstBrace, jsonEnd + 1);

  // 5. 제어 문자 제거 (JSON 파싱을 방해하는 문자들, 단 줄바꿈과 탭은 유지)
  cleanedText = cleanedText
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F]/g, "") // 제어 문자 제거 (단 \n, \r, \t는 유지)
    .trim();

  // 6. JSON 파싱 시도
  try {
    return JSON.parse(cleanedText);
  } catch (parseError: any) {
    // 파싱 실패 시 더 자세한 에러 정보 제공
    const errorPosition = parseError.message.match(/position (\d+)/)?.[1];
    if (errorPosition) {
      const pos = parseInt(errorPosition);
      const start = Math.max(0, pos - 50);
      const end = Math.min(cleanedText.length, pos + 50);
      const context = cleanedText.substring(start, end);
      throw new Error(
        `JSON 파싱 실패 (위치 ${pos}): ${parseError.message}\n` +
          `주변 컨텍스트: ...${context}...`
      );
    }
    throw parseError;
  }
}
