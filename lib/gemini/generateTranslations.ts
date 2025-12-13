// lib/gemini/generateTranslations.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { TestJsonInsertData } from "@/types/test";
import {
  extractRetryDelay,
  isQuotaExceededError,
  isServiceUnavailableError,
  isBillingError,
  sleep,
  parseJsonResponse,
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
 * 한국어 테스트를 다른 언어로 번역
 * @param testData 원본 한국어 테스트 데이터
 * @param targetLanguage 목표 언어 ("en", "ja", "vi")
 */
export async function translateTest(
  testData: TestJsonInsertData,
  targetLanguage: "en" | "ja" | "vi",
  retryCount: number = 2
): Promise<TestJsonInsertData | null> {
  const maxRetries = retryCount;
  // ✅ 유료 모델 사용: Gemini 2.0 Flash (무료 티어 제한 없음)
  // 가격: Input $0.075/M, Output $0.30/M
  // 참고: gemini-2.5-flash-lite는 무료 티어로 분류되어 하루 20회 제한이 있음
  //       API 키가 무료 티어로 인식되면 gemini-2.0-flash 사용 권장
  const models = ["gemini-2.0-flash"];

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    for (const modelName of models) {
      try {
        const genAI = getGeminiClient();
        const model = genAI.getGenerativeModel({ model: modelName });

        const languageNames = {
          en: "영어",
          ja: "일본어",
          vi: "베트남어",
        };

        // ✅ 토큰 최적화: 번역 필요한 필드만 추출하여 전송
        const translationData = {
          title: testData.title,
          description: testData.description,
          questions: testData.questions.map((q) => ({
            question: q.question,
            options: q.options.map((opt) => ({
              text: opt.text,
              score: opt.score, // 매핑을 위해 필요
            })),
          })),
          results: testData.results.map((r) => ({
            title: r.title,
            description: r.description,
            recommendation: {
              matching_type: r.recommendation.matching_type,
              suggested_actions: r.recommendation.suggested_actions,
              items: r.recommendation.items,
              short_description: r.recommendation.short_description,
            },
            keywords: r.keywords,
            score_range: r.score_range, // 매핑을 위해 필요
          })),
        };

        const translationPrompt = `다음은 한국어로 작성된 심리 테스트 데이터입니다. 이 데이터를 ${
          languageNames[targetLanguage]
        }로 자연스럽게 번역해주세요.

⚠️ 중요 규칙:
1. 제목, 설명, 질문, 선택지, 결과 제목/설명을 모두 ${
          languageNames[targetLanguage]
        }로 번역
2. 각국 문화에 맞게 자연스럽게 번역 (직역 금지)
3. JSON 구조는 그대로 유지
4. score, score_range는 숫자 값이므로 변경하지 않음
5. ⚠️ 반드시 유효한 JSON만 반환 (마크다운 코드 블록, 추가 설명, 주석 없이)
6. 이모지나 특수문자는 JSON 문자열 안에 포함 가능하지만, JSON 구문 오류가 없어야 함

번역할 데이터:
${JSON.stringify(translationData, null, 2)}

위 데이터를 ${
          languageNames[targetLanguage]
        }로 번역한 JSON을 반환해주세요. 
⚠️ 반드시 유효한 JSON만 반환하고, 추가 설명이나 마크다운 코드 블록 없이 순수 JSON만 반환해주세요.
JSON은 반드시 { 로 시작하고 } 로 끝나야 합니다.`;

        const result = await model.generateContent(translationPrompt);
        const response = result.response;
        const text = response.text();

        // JSON 파싱 (견고한 파싱 로직 - 공유 유틸리티 사용)
        let translatedJson: TestJsonInsertData;
        try {
          translatedJson = parseJsonResponse(text);
        } catch (parseError: any) {
          console.error(
            `${languageNames[targetLanguage]} 번역 JSON 파싱 실패:`,
            parseError.message || parseError
          );
          console.error("원본 응답 길이:", text.length);
          console.error("원본 응답 (처음 500자):", text.substring(0, 500));
          console.error("원본 응답 (마지막 500자):", text.substring(Math.max(0, text.length - 500)));

          // 재시도 가능한 경우
          if (attempt < maxRetries) {
            console.log(`🔄 JSON 파싱 실패로 재시도 중... (시도 ${attempt + 1}/${maxRetries})`);
            await sleep(2000);
            continue;
          }

          return null;
        }

        // 원본 데이터의 구조 유지 (번역되지 않은 필드들)
        const finalTranslatedData: TestJsonInsertData = {
          ...translatedJson,
          thumbnail_url: testData.thumbnail_url, // 이미지는 공유
          tone: testData.tone,
          theme: testData.theme,
          palette: testData.palette,
          character: testData.character,
          category_id: testData.category_id,
          // 질문과 결과는 번역된 것을 사용하되, 구조는 유지
          questions: translatedJson.questions || testData.questions,
          results:
            translatedJson.results?.map((result, idx) => ({
              ...result,
              // 이미지 URL은 원본 유지 (나중에 생성될 수 있음)
              result_image_url: testData.results[idx]?.result_image_url || null,
              // image_prompt는 영어로 유지
              image_prompt:
                testData.results[idx]?.image_prompt || result.image_prompt,
              // score_range는 원본 유지
              score_range:
                testData.results[idx]?.score_range || result.score_range,
            })) || testData.results,
        };

        console.log(
          `✅ ${languageNames[targetLanguage]} 번역 완료: "${finalTranslatedData.title}"`
        );

        return finalTranslatedData;
      } catch (error: any) {
        const isQuotaError = isQuotaExceededError(error);
        const isServiceUnavailable = isServiceUnavailableError(error);
        const isBilling = isBillingError(error);
        const retryDelay = extractRetryDelay(error);

        // 결제/빌링 에러 (403, 402) - 즉시 포기, 재시도 불가
        if (isBilling) {
          console.error(
            `❌ Gemini API 결제/빌링 에러 (번역: ${targetLanguage}, 모델: ${modelName}, 시도 ${
              attempt + 1
            }/${maxRetries + 1})`
          );
          console.error(`에러 상세:`, error?.message || error);
          console.error(`에러 응답:`, JSON.stringify(error, null, 2));
          console.error(
            `💡 GCP 결제 계정에 문제가 있습니다. Google Cloud Console에서 결제 상태를 확인하세요.`
          );
          console.error(
            `💡 결제 방법을 업데이트하거나 미납 금액을 결제해야 API를 사용할 수 있습니다.`
          );
          console.error(
            `🛑 결제 문제는 재시도로 해결되지 않습니다. 즉시 포기합니다.`
          );
          return null; // 즉시 포기
        }

        if (isServiceUnavailable) {
          // ✅ 서버 과부하 에러 (503) - 일시적 문제이므로 재시도
          console.error(
            `⚠️ Gemini API 서버 과부하 (번역: ${targetLanguage}, 모델: ${modelName}, 시도 ${
              attempt + 1
            }/${maxRetries + 1})`
          );
          console.error(
            `💡 모델이 일시적으로 과부하 상태입니다. 잠시 후 재시도합니다.`
          );

          // 재시도 전 대기 (지수 백오프: 5초, 10초, 20초)
          const backoffDelay = Math.min(5000 * Math.pow(2, attempt), 20000);
          console.log(`⏳ 재시도 대기 중... (${backoffDelay / 1000}초)`);
          await sleep(backoffDelay);

          // 재시도 가능한 경우
          if (attempt < maxRetries) {
            console.log("🔄 재시도 중...");
            continue;
          }

          console.error(
            `❌ 서버 과부하로 인해 ${targetLanguage} 번역 재시도 실패. 잠시 후 다시 시도해주세요.`
          );
          return null;
        } else if (isQuotaError) {
          // ✅ 할당량 완전 소진 감지 (60초 이상 = 일일 할당량 소진)
          if (retryDelay && retryDelay >= 60000) {
            console.error(
              `❌ 할당량 완전 소진 (번역: ${targetLanguage}, 모델: ${modelName})`
            );
            console.error(
              `💡 일일 할당량이 모두 소진되었습니다. 다음 날(UTC 자정)까지 대기해야 합니다.`
            );
            console.error(
              `🛑 더 이상 재시도하지 않습니다. Google AI Studio에서 할당량을 확인하거나 유료 플랜으로 업그레이드하세요.`
            );
            return null; // 즉시 포기
          }

          console.error(
            `⚠️ Gemini API 할당량 초과 (번역: ${targetLanguage}, 모델: ${modelName}, 시도 ${
              attempt + 1
            }/${maxRetries + 1})`
          );
          console.error(`에러 상세:`, error?.message || error);
          console.error(`에러 응답:`, JSON.stringify(error, null, 2));

          // 재시도 시간이 명시된 경우 대기 (60초 미만)
          if (retryDelay && retryDelay > 0 && retryDelay < 60000) {
            console.log(
              `⏳ 할당량 복구 대기 중... (${Math.ceil(retryDelay / 1000)}초)`
            );
            await sleep(retryDelay);
          } else if (!retryDelay) {
            // 재시도 시간이 없으면 기본 대기 (5초)
            console.log(`⏳ 기본 대기 중... (5초)`);
            await sleep(5000);
          }

          // 다음 모델로 시도
          if (modelName !== models[models.length - 1]) {
            console.log(`🔄 대체 모델로 재시도 중... (현재: ${modelName})`);
            continue;
          }

          // 모든 모델 시도 실패
          if (attempt < maxRetries) {
            console.log(`⏳ 재시도 대기 중... (5초)`);
            await sleep(5000); // 재시도 전 대기
            continue;
          }

          console.error(
            `❌ 모든 모델에서 할당량 초과. ${targetLanguage} 번역 실패`
          );
          console.error(
            `💡 Tier 1 유료 플랜 사용 중이라면, Google AI Studio에서 할당량 설정을 확인하세요.`
          );
          console.error(
            `💡 에러 상세: ${error?.message || JSON.stringify(error)}`
          );
          return null;
        } else {
          // 할당량 외 다른 에러
          console.error(
            `${targetLanguage} 번역 실패 (모델: ${modelName}, 시도 ${
              attempt + 1
            }/${maxRetries + 1}):`,
            error
          );

          if (attempt < maxRetries) {
            continue;
          }

          return null;
        }
      }
    }
  }

  return null;
}

/**
 * 한국어 테스트를 모든 지원 언어로 번역
 * 할당량 절약을 위해 순차적으로 처리합니다.
 * @param testData 원본 한국어 테스트 데이터
 */
export async function translateTestToAllLanguages(
  testData: TestJsonInsertData
): Promise<{
  en: TestJsonInsertData | null;
  ja: TestJsonInsertData | null;
  vi: TestJsonInsertData | null;
}> {
  // 순차적으로 번역 (할당량 절약)
  console.log("🌐 영어 번역 시작...");
  const en = await translateTest(testData, "en");

  // ✅ 할당량 완전 소진 시 조기 포기
  if (!en) {
    console.error("❌ 영어 번역 실패로 인해 번역 프로세스 중단");
    return { en: null, ja: null, vi: null };
  }

  // 각 번역 사이에 충분한 지연을 두어 할당량 충돌 방지
  await sleep(2000); // 500ms → 2초로 증가

  console.log("🌐 일본어 번역 시작...");
  const ja = await translateTest(testData, "ja");

  // ✅ 할당량 완전 소진 시 조기 포기
  if (!ja) {
    console.error("❌ 일본어 번역 실패로 인해 번역 프로세스 중단");
    return { en, ja: null, vi: null };
  }

  await sleep(2000); // 500ms → 2초로 증가

  console.log("🌐 베트남어 번역 시작...");
  const vi = await translateTest(testData, "vi");

  return {
    en: en || null,
    ja: ja || null,
    vi: vi || null,
  };
}
