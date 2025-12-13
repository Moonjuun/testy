// lib/gemini/generateImage.ts
// Google Vertex AI Gemini 2.5 Flash Image를 사용한 이미지 생성
// 참고: https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-flash-image

import { GoogleAuth } from "google-auth-library";
import {
  extractRetryDelay,
  isQuotaExceededError,
  isBillingError,
  sleep,
} from "./utils";

/**
 * Google OAuth 토큰 획득
 * 서비스 계정 키, Application Default Credentials, 또는 직접 설정된 액세스 토큰 사용
 */
async function getAccessToken(): Promise<string | null> {
  try {
    // 방법 1: 직접 설정된 액세스 토큰 (가장 간단)
    // gcloud auth print-access-token 결과를 환경 변수로 설정
    const directAccessToken = process.env.GOOGLE_ACCESS_TOKEN;
    if (directAccessToken) {
      console.log("✅ 직접 설정된 액세스 토큰 사용");
      return directAccessToken;
    }

    // 방법 2: 서비스 계정 키 JSON이 환경 변수로 설정된 경우
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

    // 방법 3: GOOGLE_APPLICATION_CREDENTIALS 환경 변수로 파일 경로 지정
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

    // 방법 4: Application Default Credentials (ADC) 사용
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
 * Google Vertex AI Gemini 2.5 Flash Image를 사용하여 이미지 생성
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
  if (!projectId) {
    console.error("❌ GOOGLE_CLOUD_PROJECT_ID가 설정되지 않았습니다.");
    console.error("💡 Gemini 2.5 Flash Image는 Vertex AI API를 사용하므로 프로젝트 ID가 필요합니다.");
    return null;
  }

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      console.log(`🖼️ Gemini 2.5 Flash Image 이미지 생성 시작 (시도 ${attempt + 1}/${MAX_ATTEMPTS}): ${prompt.substring(0, 50)}...`);

      // Vertex AI Gemini 2.5 Flash Image API 엔드포인트
      // 참고: https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-flash-image
      // 엔드포인트 형식: https://REGION-aiplatform.googleapis.com/v1/projects/PROJECT_ID/locations/REGION/publishers/google/models/MODEL_NAME:generateContent
      const geminiImageApiUrl = `https://${region}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${region}/publishers/google/models/gemini-2.5-flash-image:generateContent`;

      // Gemini 2.5 Flash Image API 요청 형식
      // generateContent API를 사용하여 이미지 생성
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: `Generate an image based on this prompt: ${prompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 8192,
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

      const response = await fetch(geminiImageApiUrl, {
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
        console.error("❌ Gemini 2.5 Flash Image 모델을 찾을 수 없습니다. 모델 이름을 확인하거나 Vertex AI에서 Gemini API를 활성화해야 합니다.");
        console.error("💡 모델 이름: gemini-2.5-flash-image");
        console.error(`💡 사용 중인 엔드포인트: ${geminiImageApiUrl}`);
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

      // Gemini 2.5 Flash Image API 응답 구조: candidates 배열에 이미지 데이터 포함
      // 참고: generateContent API 응답 형식
      if (data.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        
        // content.parts 배열에서 이미지 데이터 찾기
        if (candidate.content && candidate.content.parts) {
          for (const part of candidate.content.parts) {
            // inlineData 형식 (base64 인코딩된 이미지)
            if (part.inlineData && part.inlineData.data) {
              const mimeType = part.inlineData.mimeType || "image/png";
              const imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
              console.log(`✅ 이미지 생성 완료`);
              return imageUrl;
            }
            
            // fileData 형식 (GCS URI)
            if (part.fileData && part.fileData.fileUri) {
              console.log(`⚠️ 이미지가 GCS에 저장되었습니다: ${part.fileData.fileUri}`);
              // GCS URI를 다운로드하여 base64로 변환 필요
              // 일단 GCS URI를 반환하거나, 다운로드 로직 추가 필요
              return null; // GCS URI는 나중에 처리
            }
          }
        }
      }

      // 하위 호환성: 다른 응답 형식 시도
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
        console.error("❌ Gemini 2.5 Flash Image API 결제/빌링 에러");
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
        console.error("❌ Gemini 2.5 Flash Image 모델을 찾을 수 없습니다.");
        console.error("💡 Vertex AI에서 Gemini API를 활성화하거나, 모델 이름을 확인하세요.");
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
