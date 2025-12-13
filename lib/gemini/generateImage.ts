// lib/gemini/generateImage.ts
// Google Vertex AI Imagen API를 사용한 이미지 생성
// 참고: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/imagen-api

import { GoogleAuth } from "google-auth-library";
import {
  extractRetryDelay,
  isQuotaExceededError,
  isBillingError,
  sleep,
} from "./utils";

/**
 * Google OAuth 토큰 획득
 * 서비스 계정 키 또는 Application Default Credentials 사용
 */
async function getAccessToken(): Promise<string | null> {
  try {
    // 방법 1: 서비스 계정 키 JSON이 환경 변수로 설정된 경우
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountKey) {
      try {
        const keyJson = JSON.parse(serviceAccountKey);
        const auth = new GoogleAuth({
          credentials: keyJson,
          scopes: ["https://www.googleapis.com/auth/cloud-platform"],
        });
        const client = await auth.getClient();
        const accessToken = await client.getAccessToken();
        return accessToken?.token || null;
      } catch (parseError) {
        console.error("❌ GOOGLE_SERVICE_ACCOUNT_KEY JSON 파싱 실패:", parseError);
        return null;
      }
    }

    // 방법 2: GOOGLE_APPLICATION_CREDENTIALS 환경 변수로 파일 경로 지정
    // (로컬 개발 환경에서만 사용 가능, Vercel에서는 사용 불가)
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      const auth = new GoogleAuth({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        scopes: ["https://www.googleapis.com/auth/cloud-platform"],
      });
      const client = await auth.getClient();
      const accessToken = await client.getAccessToken();
      return accessToken?.token || null;
    }

    // 방법 3: Application Default Credentials (ADC) 사용
    // gcloud auth application-default login으로 설정된 경우
    const auth = new GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    return accessToken?.token || null;
  } catch (error: any) {
    console.error("❌ OAuth 토큰 획득 실패:", error.message);
    return null;
  }
}

/**
 * Google Vertex AI Imagen API를 사용하여 이미지 생성
 * @param prompt - 이미지 생성 프롬프트
 * @returns base64 인코딩된 이미지 데이터 (data URL 형식)
 */
export async function generateImageWithGemini(
  prompt: string
): Promise<string | null> {
  const MAX_ATTEMPTS = 3;
  const apiKey = process.env.GEMINI_API_KEY;
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  const region = process.env.GOOGLE_CLOUD_REGION || "us-central1";
  
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.");
    return null;
  }

  // Vertex AI API는 프로젝트 ID가 필요합니다
  // 프로젝트 ID가 없으면 API 키를 사용한 대체 엔드포인트 시도
  if (!projectId) {
    console.warn("⚠️ GOOGLE_CLOUD_PROJECT_ID가 설정되지 않았습니다. Vertex AI API 대신 Gemini API 엔드포인트를 시도합니다.");
    // API 키를 사용한 대체 엔드포인트 (실험적)
    return generateImageWithApiKey(apiKey, prompt, MAX_ATTEMPTS);
  }

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      console.log(`🖼️ Vertex AI Imagen API 이미지 생성 시작 (시도 ${attempt + 1}/${MAX_ATTEMPTS}): ${prompt.substring(0, 50)}...`);

      // Vertex AI Imagen API 엔드포인트
      // 참고: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/imagen-api
      // 엔드포인트 형식: https://REGION-aiplatform.googleapis.com/v1/projects/PROJECT_ID/locations/REGION/publishers/google/models/MODEL_NAME:predict
      const imagenApiUrl = `https://${region}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${region}/publishers/google/models/imagen-3.0-generate-002:predict`;

      // Vertex AI Imagen API 요청 형식
      // 문서 참고: instances 배열에 입력 데이터, parameters에 설정 포함
      const requestBody = {
        instances: [
          {
            prompt: prompt,
          },
        ],
        parameters: {
          sampleCount: 1, // 생성할 이미지 개수
          aspectRatio: "1:1", // 1:1 비율
          safetyFilterLevel: "block_some", // 안전 필터 레벨 (block_some, block_few, block_most, block_none)
          personGeneration: "allow_adult", // 사람 생성 허용 (allow_all, allow_adult, block_all)
        },
      };

      // Vertex AI API는 OAuth 토큰을 사용합니다
      // 서비스 계정 키 또는 Application Default Credentials를 통해 토큰 획득
      const accessToken = await getAccessToken();
      
      if (!accessToken) {
        console.error("❌ OAuth 토큰을 획득할 수 없습니다.");
        console.error("💡 GOOGLE_SERVICE_ACCOUNT_KEY 환경 변수를 설정하거나,");
        console.error("💡 GOOGLE_APPLICATION_CREDENTIALS 환경 변수를 설정하세요.");
        console.error("💡 또는 gcloud auth application-default login을 실행하세요.");
        
        // 마지막 시도가 아니면 재시도
        if (attempt < MAX_ATTEMPTS - 1) {
          await sleep(2000);
          continue;
        }
        return null;
      }

      const response = await fetch(imagenApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
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
        console.error("❌ Imagen 모델을 찾을 수 없습니다. 모델 이름을 확인하거나 Vertex AI에서 Imagen API를 활성화해야 합니다.");
        console.error("💡 대안: 다른 Imagen 모델 버전을 시도하거나, 다른 이미지 생성 서비스를 사용하세요.");
        console.error(`💡 사용 중인 엔드포인트: ${imagenApiUrl}`);
        return null;
      }

      // 401 에러는 인증 실패 (OAuth 토큰 필요)
      if (response.status === 401) {
        console.error("❌ Vertex AI API 인증 실패. OAuth 토큰이 필요합니다.");
        console.error("💡 Vertex AI API는 API 키가 아닌 OAuth 토큰을 사용합니다.");
        console.error("💡 gcloud auth print-access-token을 사용하거나 서비스 계정 키를 설정하세요.");
        console.error("💡 또는 GOOGLE_CLOUD_PROJECT_ID를 설정하지 않으면 API 키 기반 엔드포인트를 시도합니다.");
        return null;
      }

        throw new Error(`Imagen API error: ${response.status} ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();

      // 응답에서 이미지 데이터 추출
      // Vertex AI Imagen API 응답 구조: predictions 배열에 이미지 데이터 포함
      if (data.predictions && data.predictions.length > 0) {
        const prediction = data.predictions[0];
        
        // bytesBase64Encoded 형식
        if (prediction.bytesBase64Encoded) {
          const imageUrl = `data:image/png;base64,${prediction.bytesBase64Encoded}`;
          console.log(`✅ 이미지 생성 완료`);
          return imageUrl;
        }
        
        // base64Encoded 형식
        if (prediction.base64Encoded) {
          const imageUrl = `data:image/png;base64,${prediction.base64Encoded}`;
          console.log(`✅ 이미지 생성 완료`);
          return imageUrl;
        }
        
        // gcsUri 형식 (Google Cloud Storage URI)
        if (prediction.gcsUri) {
          console.log(`⚠️ 이미지가 GCS에 저장되었습니다: ${prediction.gcsUri}`);
          // GCS URI를 다운로드하여 base64로 변환 필요
          // 일단 GCS URI를 반환하거나, 다운로드 로직 추가 필요
          return null; // GCS URI는 나중에 처리
        }
      }

      // 다른 응답 형식 시도 (하위 호환성)
      if (data.generatedImages && data.generatedImages.length > 0) {
        const imageBase64 = data.generatedImages[0].bytesBase64Encoded;
        if (imageBase64) {
          const imageUrl = `data:image/png;base64,${imageBase64}`;
          console.log(`✅ 이미지 생성 완료`);
          return imageUrl;
        }
      }

      if (data.image && data.image.bytesBase64Encoded) {
        const imageUrl = `data:image/png;base64,${data.image.bytesBase64Encoded}`;
        console.log(`✅ 이미지 생성 완료`);
        return imageUrl;
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
 * API 키를 사용한 대체 이미지 생성 (실험적)
 * Vertex AI 프로젝트 ID가 없을 때 사용
 */
async function generateImageWithApiKey(
  apiKey: string,
  prompt: string,
  maxAttempts: number
): Promise<string | null> {
  // API 키 기반 엔드포인트는 현재 Imagen을 지원하지 않을 수 있음
  // 일단 null을 반환하고 나중에 다른 이미지 생성 서비스로 대체 가능
  console.warn("⚠️ API 키 기반 Imagen API는 현재 지원되지 않습니다.");
  console.warn("💡 Vertex AI 프로젝트 ID를 설정하거나, 다른 이미지 생성 서비스를 사용하세요.");
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
