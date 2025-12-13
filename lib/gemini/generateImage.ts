// lib/gemini/generateImage.ts
// Gemini 3.0 Pro를 사용한 이미지 생성

import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  extractRetryDelay,
  isQuotaExceededError,
  isBillingError,
  sleep,
} from "./utils";

// Gemini API 클라이언트 초기화
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.");
  }
  return new GoogleGenerativeAI(apiKey);
}

/**
 * Gemini 3.0 Pro를 사용하여 이미지 생성
 * @param prompt - 이미지 생성 프롬프트
 * @returns base64 인코딩된 이미지 데이터 (data URL 형식)
 */
export async function generateImageWithGemini(
  prompt: string
): Promise<string | null> {
  const MAX_ATTEMPTS = 3;
  
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const genAI = getGeminiClient();
      // ✅ Gemini 3.0 Pro 사용
      const model = genAI.getGenerativeModel({ model: "gemini-3.0-pro" });

      console.log(`🖼️ 이미지 생성 시작 (시도 ${attempt + 1}/${MAX_ATTEMPTS}): ${prompt.substring(0, 50)}...`);

      // 이미지 생성 요청
      // 참고: Gemini 3.0 Pro는 이미지 생성을 지원합니다
      const result = await model.generateContent(prompt);

      const response = result.response;

      // 응답에서 이미지 데이터 추출
      try {
        const candidates = (response as any).candidates;
        if (candidates && candidates.length > 0) {
          const candidate = candidates[0];
          const parts = candidate.content?.parts || [];

          // 이미지 데이터 찾기
          for (const part of parts) {
            if (part.inlineData) {
              const imageData = part.inlineData.data;
              const mimeType = part.inlineData.mimeType || "image/png";

              // base64 데이터를 data URL로 변환
              const imageUrl = `data:${mimeType};base64,${imageData}`;
              console.log(`✅ 이미지 생성 완료 (${mimeType})`);
              return imageUrl;
            }
          }
        }

        // 텍스트 응답인 경우 (이미지 생성 실패)
        const textResponse = response.text();
        if (textResponse) {
          console.warn("⚠️ Gemini가 텍스트를 반환했습니다 (이미지 생성 실패):", textResponse.substring(0, 200));
        }
      } catch (parseError) {
        console.warn("응답 파싱 오류:", parseError);
      }

      // 재시도
      if (attempt < MAX_ATTEMPTS - 1) {
        console.log(`🔄 이미지 생성 실패, 재시도 중... (${attempt + 2}/${MAX_ATTEMPTS})`);
        await sleep(2000);
        continue;
      }

      console.error("❌ 이미지 데이터를 찾을 수 없습니다.");
      return null;
    } catch (error: any) {
      const isQuotaError = isQuotaExceededError(error);
      const isBilling = isBillingError(error);
      const retryDelay = extractRetryDelay(error);

      // 결제/빌링 에러 (403, 402) - 즉시 포기
      if (isBilling) {
        console.error("❌ Gemini API 결제/빌링 에러 (이미지 생성)");
        console.error(`에러 상세:`, error?.message || error);
        return null;
      }

      // 할당량 초과 에러 - 재시도 대기
      if (isQuotaError && retryDelay && retryDelay > 0 && retryDelay < 60000) {
        console.log(
          `⏳ 할당량 복구 대기 중... (${Math.ceil(retryDelay / 1000)}초)`
        );
        await sleep(retryDelay);
        
        // 마지막 시도가 아니면 재시도
        if (attempt < MAX_ATTEMPTS - 1) {
          continue;
        }
      }

      // 모델 관련 에러 체크
      if (
        error.message?.includes("model") ||
        error.message?.includes("not found") ||
        error.message?.includes("not supported")
      ) {
        console.error("❌ Gemini 3.0 Pro 모델을 사용할 수 없습니다:", error.message);
        return null;
      }

      // 마지막 시도가 아니면 재시도
      if (attempt < MAX_ATTEMPTS - 1) {
        console.error(`❌ 이미지 생성 오류 (시도 ${attempt + 1}/${MAX_ATTEMPTS}):`, error.message);
        await sleep(2000);
        continue;
      }

      console.error("❌ 이미지 생성 실패:", error);
      return null;
    }
  }

  return null;
}

/**
 * 테스트 썸네일 이미지 생성
 * @param prompt - character.prompt_hint 또는 생성된 프롬프트
 * @returns base64 인코딩된 이미지 데이터 (data URL 형식)
 */
export async function generateThumbnailImage(
  prompt: string
): Promise<string | null> {
  return generateImageWithGemini(prompt);
}

/**
 * 결과 이미지 생성 (결과별)
 * @param imagePrompt - 결과의 image_prompt
 * @returns base64 인코딩된 이미지 데이터 (data URL 형식)
 */
export async function generateResultImage(
  imagePrompt: string
): Promise<string | null> {
  return generateImageWithGemini(imagePrompt);
}
