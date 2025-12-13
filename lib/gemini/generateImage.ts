// lib/gemini/generateImage.ts
// Google Imagen 4.0 API를 사용한 이미지 생성

import {
  extractRetryDelay,
  isQuotaExceededError,
  isBillingError,
  sleep,
} from "./utils";

/**
 * Google Imagen 4.0 API를 사용하여 이미지 생성
 * @param prompt - 이미지 생성 프롬프트
 * @returns base64 인코딩된 이미지 데이터 (data URL 형식)
 */
export async function generateImageWithGemini(
  prompt: string
): Promise<string | null> {
  const MAX_ATTEMPTS = 3;
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.");
    return null;
  }

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      console.log(`🖼️ Imagen 4.0 API 이미지 생성 시작 (시도 ${attempt + 1}/${MAX_ATTEMPTS}): ${prompt.substring(0, 50)}...`);

      // Imagen 4.0 API 엔드포인트
      // 참고: Imagen API는 Vertex AI를 통해 제공되며, REST API를 통해 호출 가능
      const imagenApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;

      const response = await fetch(imagenApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          number_of_images: 1,
          aspect_ratio: "1:1", // 1:1 비율
          safety_filter_level: "block_some", // 안전 필터 레벨
          person_generation: "allow_all", // 사람 생성 허용
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        
        // 404 에러는 모델을 찾을 수 없음을 의미
        if (response.status === 404) {
          console.error("❌ Imagen 4.0 모델을 찾을 수 없습니다. 모델 이름을 확인하거나 Vertex AI에서 Imagen API를 활성화해야 합니다.");
          console.error("💡 대안: 다른 Imagen 모델 버전을 시도하거나, 다른 이미지 생성 서비스를 사용하세요.");
          return null;
        }

        throw new Error(`Imagen API error: ${response.status} ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();

      // 응답에서 이미지 데이터 추출
      // Imagen API 응답 구조에 따라 조정 필요
      if (data.generatedImages && data.generatedImages.length > 0) {
        const imageBase64 = data.generatedImages[0].bytesBase64Encoded;
        if (imageBase64) {
          const imageUrl = `data:image/png;base64,${imageBase64}`;
          console.log(`✅ 이미지 생성 완료`);
          return imageUrl;
        }
      }

      // 다른 응답 형식 시도
      if (data.image && data.image.bytesBase64Encoded) {
        const imageUrl = `data:image/png;base64,${data.image.bytesBase64Encoded}`;
        console.log(`✅ 이미지 생성 완료`);
        return imageUrl;
      }

      // predictions 형식 시도 (일부 API 버전)
      if (data.predictions && data.predictions.length > 0) {
        const prediction = data.predictions[0];
        if (prediction.bytesBase64Encoded) {
          const imageUrl = `data:image/png;base64,${prediction.bytesBase64Encoded}`;
          console.log(`✅ 이미지 생성 완료`);
          return imageUrl;
        }
      }

      // 재시도
      if (attempt < MAX_ATTEMPTS - 1) {
        console.log(`🔄 이미지 생성 실패, 재시도 중... (${attempt + 2}/${MAX_ATTEMPTS})`);
        console.log("응답 데이터:", JSON.stringify(data).substring(0, 500));
        await sleep(2000);
        continue;
      }

      console.error("❌ 이미지 데이터를 찾을 수 없습니다. 응답:", JSON.stringify(data).substring(0, 500));
      return null;
    } catch (error: any) {
      const isQuotaError = isQuotaExceededError(error);
      const isBilling = isBillingError(error);
      const retryDelay = extractRetryDelay(error);

      // 결제/빌링 에러 (403, 402) - 즉시 포기
      if (isBilling) {
        console.error("❌ Imagen API 결제/빌링 에러");
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

      // 404 에러는 모델을 찾을 수 없음을 의미
      if (error.message?.includes("404") || error.message?.includes("not found")) {
        console.error("❌ Imagen 4.0 모델을 찾을 수 없습니다.");
        console.error("💡 Vertex AI에서 Imagen API를 활성화하거나, 다른 모델 버전을 시도하세요.");
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
