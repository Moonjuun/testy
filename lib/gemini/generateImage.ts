// lib/gemini/generateImage.ts
// Gemini API를 사용한 이미지 생성 + Gemini Vision으로 레퍼런스 이미지 분석

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
 * 레퍼런스 이미지 URL에서 스타일 분석 (Gemini Vision 사용)
 */
async function analyzeReferenceImageStyle(
  referenceImageUrl: string
): Promise<string | null> {
  try {
    const genAI = getGeminiClient();
    // ✅ 유료 모델 사용: Gemini 2.0 Flash (무료 티어 제한 없음)
    // 참고: gemini-2.0-flash-exp는 deprecated되었지만 gemini-2.0-flash는 사용 가능
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // 레퍼런스 이미지 다운로드
    const imageResponse = await fetch(referenceImageUrl);
    if (!imageResponse.ok) {
      console.warn("레퍼런스 이미지 다운로드 실패");
      return null;
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    // Node.js 환경에서 Buffer 사용, 브라우저에서는 다른 방법 필요
    const imageBase64 =
      typeof Buffer !== "undefined"
        ? Buffer.from(imageBuffer).toString("base64")
        : btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
    const mimeType = imageResponse.headers.get("content-type") || "image/png";

    const prompt = `이 이미지의 스타일, 색상, 분위기, 톤을 분석해주세요. 
다음 정보를 포함해서 설명해주세요:
1. 전체적인 색상 톤 (밝은/어두운, 따뜻한/차가운)
2. 스타일 (일러스트/사진, 미니멀/디테일 등)
3. 분위기 (친근한/차분한/활기찬 등)
4. 주요 색상 팔레트
5. 이미지 생성 프롬프트에 사용할 수 있는 스타일 키워드

한국어로 간결하게 설명해주세요.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        },
      },
    ]);

    const styleDescription = result.response.text();
    return styleDescription;
  } catch (error: any) {
    const isQuotaError = isQuotaExceededError(error);
    const isBilling = isBillingError(error);
    const retryDelay = extractRetryDelay(error);

    // 결제/빌링 에러 (403, 402) - 즉시 포기
    if (isBilling) {
      console.error("❌ Gemini API 결제/빌링 에러 (레퍼런스 이미지 분석)");
      console.error(`에러 상세:`, error?.message || error);
      console.error(
        `💡 GCP 결제 계정에 문제가 있습니다. Google Cloud Console에서 결제 상태를 확인하세요.`
      );
      console.error(
        `💡 결제 방법을 업데이트하거나 미납 금액을 결제해야 API를 사용할 수 있습니다.`
      );
      return null; // 즉시 포기
    }

    if (isQuotaError && retryDelay && retryDelay > 0 && retryDelay < 60000) {
      console.log(
        `⏳ 할당량 복구 대기 중... (${Math.ceil(retryDelay / 1000)}초)`
      );
      await sleep(retryDelay);
      // 재시도는 하지 않고 null 반환 (이미지 스타일 분석은 선택적 기능)
    }

    console.error("레퍼런스 이미지 스타일 분석 실패:", error);
    return null;
  }
}

/**
 * Gemini API를 사용하여 테스트 썸네일 이미지 생성
 * 레퍼런스 이미지가 있으면 스타일을 분석하여 활용
 */
export async function generateThumbnailImage(
  prompt: string,
  referenceImageUrl?: string
): Promise<string | null> {
  try {
    // 레퍼런스 이미지가 있으면 스타일 분석
    let styleKeywords = "";
    if (referenceImageUrl) {
      console.log("레퍼런스 이미지 스타일 분석 중...");
      const styleDescription = await analyzeReferenceImageStyle(
        referenceImageUrl
      );
      if (styleDescription) {
        styleKeywords = extractStyleKeywords(styleDescription);
        console.log("분석된 스타일 키워드:", styleKeywords);
      }
    }

    // 프롬프트에서 키워드 추출
    const keywords = extractKeywords(prompt);

    // 레퍼런스 스타일 키워드가 있으면 프롬프트에 추가
    const enhancedPrompt = styleKeywords
      ? `${styleKeywords}, ${prompt}`
      : prompt;

    // Gemini API 키 확인
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      console.warn("Gemini API 키가 없습니다. placeholder 이미지 사용");
      return null; // placeholder 이미지 사용
    }

    // Gemini API로 이미지 생성
    // ⚠️ 참고: gemini-2.5-flash-image는 이미지 생성 전용 모델이지만,
    // 현재 Gemini API에서는 이미지 생성 기능이 제한적일 수 있습니다.
    // 텍스트 생성 모델로 대체하거나, 다른 이미지 생성 서비스 사용 고려
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    console.log("Gemini 이미지 생성 시작...");

    try {
      // 이미지 생성 요청
      // 참고: Gemini 2.5 Flash Image 모델은 generateContent에 config 옵션 사용
      // @ts-ignore - responseModalities와 imageConfig는 타입 정의에 없을 수 있음
      const result = await model.generateContent(enhancedPrompt, {
        responseModalities: ["IMAGE"],
        imageConfig: {
          aspectRatio: "16:9", // 썸네일용 비율
        },
      } as any);

      // 응답에서 이미지 데이터 추출
      const response = result.response;

      // 응답 텍스트 확인 (디버깅용)
      const responseText = response.text();
      console.log("Gemini 응답:", responseText.substring(0, 100));

      // candidates에서 이미지 데이터 찾기
      // 참고: 실제 API 응답 구조에 따라 조정 필요
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
              console.log(`✅ Gemini 이미지 생성 완료 (${mimeType})`);

              // base64 데이터 URL을 반환
              return imageUrl;
            }
          }
        }
      } catch (parseError) {
        console.warn("응답 파싱 오류, 다른 형식 시도:", parseError);
      }

      // 대체 방법: 응답에서 직접 이미지 데이터 추출 시도
      // Gemini API의 실제 응답 구조에 따라 조정 필요
      console.warn("이미지 데이터를 찾을 수 없습니다. API 응답 구조 확인 필요");
      return null;
    } catch (apiError: any) {
      const isBilling = isBillingError(apiError);

      // 결제/빌링 에러 (403, 402) - 즉시 포기
      if (isBilling) {
        console.error("❌ Gemini API 결제/빌링 에러 (이미지 생성)");
        console.error(`에러 상세:`, apiError?.message || apiError);
        console.error(
          `💡 GCP 결제 계정에 문제가 있습니다. Google Cloud Console에서 결제 상태를 확인하세요.`
        );
        console.error(
          `💡 결제 방법을 업데이트하거나 미납 금액을 결제해야 API를 사용할 수 있습니다.`
        );
        return null; // 즉시 포기
      }

      console.error("Gemini API 이미지 생성 오류:", apiError);
      // 모델이 지원되지 않을 경우 대체 모델 시도
      if (
        apiError.message?.includes("model") ||
        apiError.message?.includes("not found") ||
        apiError.message?.includes("not supported")
      ) {
        console.log(
          "Gemini 이미지 생성 모델을 사용할 수 없습니다. placeholder 이미지 사용"
        );
      }
      return null;
    }
  } catch (error: any) {
    const isBilling = isBillingError(error);

    // 결제/빌링 에러 (403, 402) - 즉시 포기
    if (isBilling) {
      console.error("❌ Gemini API 결제/빌링 에러 (이미지 생성)");
      console.error(`에러 상세:`, error?.message || error);
      console.error(
        `💡 GCP 결제 계정에 문제가 있습니다. Google Cloud Console에서 결제 상태를 확인하세요.`
      );
      console.error(
        `💡 결제 방법을 업데이트하거나 미납 금액을 결제해야 API를 사용할 수 있습니다.`
      );
      return null; // 즉시 포기
    }

    console.error("이미지 생성 실패:", error);
    return null;
  }
}

/**
 * 프롬프트에서 키워드 추출
 */
function extractKeywords(prompt: string): string[] {
  // 간단한 키워드 추출 로직
  const words = prompt
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .slice(0, 5);

  return words;
}

/**
 * 스타일 설명에서 검색 가능한 키워드 추출
 */
function extractStyleKeywords(styleDescription: string): string {
  // 스타일 설명에서 주요 키워드 추출
  const keywords: string[] = [];

  // 색상 관련 키워드
  if (
    styleDescription.includes("밝은") ||
    styleDescription.includes("bright")
  ) {
    keywords.push("bright");
  }
  if (
    styleDescription.includes("어두운") ||
    styleDescription.includes("dark")
  ) {
    keywords.push("dark");
  }
  if (
    styleDescription.includes("따뜻한") ||
    styleDescription.includes("warm")
  ) {
    keywords.push("warm");
  }
  if (
    styleDescription.includes("차가운") ||
    styleDescription.includes("cool")
  ) {
    keywords.push("cool");
  }

  // 스타일 관련 키워드
  if (
    styleDescription.includes("일러스트") ||
    styleDescription.includes("illustration")
  ) {
    keywords.push("illustration");
  }
  if (
    styleDescription.includes("미니멀") ||
    styleDescription.includes("minimal")
  ) {
    keywords.push("minimal");
  }
  if (
    styleDescription.includes("친근한") ||
    styleDescription.includes("friendly")
  ) {
    keywords.push("friendly");
  }
  if (
    styleDescription.includes("차분한") ||
    styleDescription.includes("calm")
  ) {
    keywords.push("calm");
  }

  return keywords.join(" ");
}

/**
 * 결과 이미지 생성 (결과별)
 * 레퍼런스 이미지가 있으면 스타일을 분석하여 활용
 */
export async function generateResultImage(
  imagePrompt: string,
  referenceImageUrl?: string
): Promise<string | null> {
  // 결과 이미지도 동일하게 Gemini API 사용
  return generateThumbnailImage(imagePrompt, referenceImageUrl);
}
