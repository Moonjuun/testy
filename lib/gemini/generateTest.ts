// lib/gemini/generateTest.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { TestJsonInsertData } from "@/types/test";
import {
  TopicPrompt,
  QuestionsPrompt,
  ResultsPrompt,
} from "@/constants/AdminResult";
import {
  extractRetryDelay,
  isQuotaExceededError,
  isModelNotFoundError,
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

const models = ["gemini-2.0-flash"];

/**
 * 1단계: 테스트 주제 생성 (메타데이터만)
 * 토큰 절감: 주제만 생성하므로 프롬프트가 짧음
 */
async function generateTopic(
  model: any,
  retryCount: number = 1
): Promise<Partial<TestJsonInsertData> | null> {
  const maxRetries = 2;
  const MAX_ATTEMPTS = 5; // 무한 루프 방지: 최대 5번 시도

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const prompt = TopicPrompt;
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      const topicData = parseJsonResponse(text);

      // 검증
      if (
        !topicData.title ||
        !topicData.description ||
        !topicData.category_id
      ) {
        throw new Error("주제 데이터가 불완전합니다.");
      }

      const validCategoryIds = [1, 2, 3, 4, 5, 6, 7, 8];
      if (!validCategoryIds.includes(topicData.category_id)) {
        throw new Error(
          `category_id는 1, 2, 3, 4, 5, 6, 7, 8 중 하나여야 합니다. (현재: ${topicData.category_id})`
        );
      }

      console.log(`✅ 주제 생성 성공: "${topicData.title}"`);
      return topicData;
    } catch (error: any) {
      console.error(
        `❌ 주제 생성 실패 (시도 ${attempt + 1}/${retryCount + 1}):`,
        error.message
      );

      // JSON 파싱 에러인 경우 원본 응답 로깅
      if (
        error.message?.includes("JSON 파싱") ||
        error.message?.includes("Unexpected")
      ) {
        try {
          const result = await model.generateContent(TopicPrompt);
          const text = result.response.text();
          console.error("원본 응답 (처음 500자):", text.substring(0, 500));
          console.error("원본 응답 길이:", text.length);
        } catch (logError) {
          // 로깅 실패는 무시
        }
      }

      // 무한 루프 방지: MAX_ATTEMPTS를 초과하면 포기
      if (attempt >= MAX_ATTEMPTS - 1) {
        console.error(`❌ 최대 재시도 횟수 초과 (${MAX_ATTEMPTS}번)`);
        return null;
      }

      if (attempt < retryCount && attempt < maxRetries) {
        console.log(`🔄 재시도 대기 중... (2초)`);
        await sleep(2000);
        continue;
      }

      return null;
    }
  }

  return null;
}

/**
 * 2단계: 질문 생성 (주제 기반)
 * 토큰 절감: 주제 정보만 전달하여 프롬프트 간소화
 */
async function generateQuestions(
  model: any,
  topic: Partial<TestJsonInsertData>,
  retryCount: number = 1
): Promise<TestJsonInsertData["questions"] | null> {
  const maxRetries = 2;
  const MAX_ATTEMPTS = 5; // 무한 루프 방지: 최대 5번 시도

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const prompt = QuestionsPrompt.replace("{{TITLE}}", topic.title || "")
        .replace("{{DESCRIPTION}}", topic.description || "")
        .replace("{{CATEGORY_ID}}", String(topic.category_id || ""));

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      let questionsData: any;
      try {
        questionsData = parseJsonResponse(text);
      } catch (parseError: any) {
        // JSON 파싱 에러인 경우 원본 응답 전체 로깅
        console.error("원본 응답 전체:", text);
        console.error("원본 응답 길이:", text.length);
        throw parseError;
      }

      // 검증 (최소 10개 이상)
      if (!questionsData.questions || questionsData.questions.length < 10) {
        throw new Error(
          `질문 수가 부족합니다. (현재: ${
            questionsData.questions?.length || 0
          }, 최소: 10개)`
        );
      }

      questionsData.questions.forEach((q: any, idx: number) => {
        // 선택지 개수 검증 (최소 2개, 최대 4개)
        if (!q.options || q.options.length < 2) {
          throw new Error(
            `질문 ${idx + 1}: 선택지는 최소 2개 이상이어야 합니다. (현재: ${
              q.options?.length || 0
            }개)`
          );
        }
        if (q.options.length > 4) {
          throw new Error(
            `질문 ${idx + 1}: 선택지는 최대 4개까지 가능합니다. (현재: ${
              q.options.length
            }개)`
          );
        }
      });

      console.log(`✅ 질문 생성 성공: ${questionsData.questions.length}개`);
      return questionsData.questions;
    } catch (error: any) {
      console.error(
        `❌ 질문 생성 실패 (시도 ${attempt + 1}/${retryCount + 1}):`,
        error.message
      );

      // 무한 루프 방지: MAX_ATTEMPTS를 초과하면 포기
      if (attempt >= MAX_ATTEMPTS - 1) {
        console.error(`❌ 최대 재시도 횟수 초과 (${MAX_ATTEMPTS}번)`);
        return null;
      }

      if (attempt < retryCount && attempt < maxRetries) {
        console.log(`🔄 재시도 대기 중... (2초)`);
        await sleep(2000);
        continue;
      }

      return null;
    }
  }

  return null;
}

/**
 * 3단계: 결과 생성 (질문 기반)
 * 토큰 절감: 질문 수와 최대 점수만 전달
 */
async function generateResults(
  model: any,
  topic: Partial<TestJsonInsertData>,
  questionCount: number,
  retryCount: number = 1
): Promise<TestJsonInsertData["results"] | null> {
  const maxRetries = 2;
  const MAX_ATTEMPTS = 5; // 무한 루프 방지: 최대 5번 시도
  const maxScore = questionCount * 4; // 각 질문당 최대 4점 가정

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const prompt = ResultsPrompt.replace("{{TITLE}}", topic.title || "")
        .replace("{{QUESTION_COUNT}}", String(questionCount))
        .replace("{{MAX_SCORE}}", String(maxScore));

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      let resultsData: any;
      try {
        resultsData = parseJsonResponse(text);
      } catch (parseError: any) {
        // JSON 파싱 에러인 경우 원본 응답 전체 로깅
        console.error("원본 응답 전체:", text);
        console.error("원본 응답 길이:", text.length);
        throw parseError;
      }

      // 검증
      if (!resultsData.results || resultsData.results.length < 3) {
        throw new Error(
          `결과 수가 부족합니다. (현재: ${
            resultsData.results?.length || 0
          }, 최소: 3개)`
        );
      }

      // 점수 범위 검증 (겹치지 않게)
      const scoreRanges = resultsData.results
        .map((r: any) => r.score_range)
        .filter((range: any) => range && range.length === 2)
        .sort((a: any, b: any) => a[0] - b[0]);

      for (let i = 0; i < scoreRanges.length - 1; i++) {
        const current = scoreRanges[i];
        const next = scoreRanges[i + 1];
        if (current[1] >= next[0]) {
          throw new Error(
            `점수 범위가 겹칩니다: [${current[0]}, ${current[1]}]와 [${next[0]}, ${next[1]}]`
          );
        }
      }

      console.log(`✅ 결과 생성 성공: ${resultsData.results.length}개`);
      return resultsData.results;
    } catch (error: any) {
      console.error(
        `❌ 결과 생성 실패 (시도 ${attempt + 1}/${retryCount + 1}):`,
        error.message
      );

      // 무한 루프 방지: MAX_ATTEMPTS를 초과하면 포기
      if (attempt >= MAX_ATTEMPTS - 1) {
        console.error(`❌ 최대 재시도 횟수 초과 (${MAX_ATTEMPTS}번)`);
        return null;
      }

      if (attempt < retryCount && attempt < maxRetries) {
        console.log(`🔄 재시도 대기 중... (2초)`);
        await sleep(2000);
        continue;
      }

      return null;
    }
  }

  return null;
}

/**
 * 에러 처리 헬퍼 함수
 */
async function handleApiError(
  error: any,
  modelName: string,
  attempt: number,
  retryCount: number,
  maxRetries: number
): Promise<"retry" | "skip" | "abort"> {
  const isQuotaError = isQuotaExceededError(error);
  const isModelNotFound = isModelNotFoundError(error);
  const isServiceUnavailable = isServiceUnavailableError(error);
  const isBilling = isBillingError(error);
  const retryDelay = extractRetryDelay(error);

  // 결제/빌링 에러 - 즉시 포기
  if (isBilling) {
    console.error(
      `❌ Gemini API 결제/빌링 에러 (모델: ${modelName}, 시도 ${attempt + 1}/${
        retryCount + 1
      })`
    );
    console.error(`에러 상세:`, error?.message || error);
    return "abort";
  }

  // 모델을 찾을 수 없는 경우
  if (isModelNotFound) {
    console.error(
      `⚠️ 모델을 찾을 수 없음 (모델: ${modelName}, 시도 ${attempt + 1}/${
        retryCount + 1
      })`
    );
    return "skip";
  }

  // 서버 과부하 에러
  if (isServiceUnavailable) {
    console.error(
      `⚠️ Gemini API 서버 과부하 (모델: ${modelName}, 시도 ${attempt + 1}/${
        retryCount + 1
      })`
    );
    const backoffDelay = Math.min(5000 * Math.pow(2, attempt), 20000);
    console.log(`⏳ 재시도 대기 중... (${backoffDelay / 1000}초)`);
    await sleep(backoffDelay);
    return attempt < retryCount && attempt < maxRetries ? "retry" : "abort";
  }

  // 할당량 초과 에러
  if (isQuotaError) {
    if (retryDelay && retryDelay >= 60000) {
      console.error(`❌ 할당량 완전 소진`);
      return "abort";
    }

    if (retryDelay && retryDelay > 0 && retryDelay < 60000) {
      console.log(
        `⏳ 할당량 복구 대기 중... (${Math.ceil(retryDelay / 1000)}초)`
      );
      await sleep(retryDelay);
    } else {
      await sleep(5000);
    }

    return attempt < retryCount && attempt < maxRetries ? "retry" : "abort";
  }

  // 기타 에러
  console.error(
    `Gemini API 에러 (모델: ${modelName}, 시도 ${attempt + 1}/${
      retryCount + 1
    }):`,
    error
  );
  return attempt < retryCount && attempt < maxRetries ? "retry" : "abort";
}

/**
 * 순차적 생성 방식: 주제 → 질문 → 결과
 * 토큰 절감: 각 단계별로 최적화된 짧은 프롬프트 사용
 */
export async function generateTestWithGemini(
  retryCount: number = 1
): Promise<TestJsonInsertData | null> {
  const maxRetries = 2;
  const MAX_ATTEMPTS = 5; // 무한 루프 방지: 최대 5번 시도
  const MAX_EXECUTION_TIME = 5 * 60 * 1000; // 최대 실행 시간: 5분
  const startTime = Date.now();

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    // 실행 시간 체크
    if (Date.now() - startTime > MAX_EXECUTION_TIME) {
      console.error(`❌ 최대 실행 시간 초과 (${MAX_EXECUTION_TIME / 1000}초)`);
      return null;
    }
    for (const modelName of models) {
      try {
        const genAI = getGeminiClient();
        const model = genAI.getGenerativeModel({ model: modelName });

        console.log(`📝 1단계: 주제 생성 시작...`);
        const topic = await generateTopic(model, retryCount);
        if (!topic) {
          throw new Error("주제 생성 실패");
        }

        console.log(`📝 2단계: 질문 생성 시작...`);
        const questions = await generateQuestions(model, topic, retryCount);
        if (!questions) {
          throw new Error("질문 생성 실패");
        }

        console.log(`📝 3단계: 결과 생성 시작...`);
        const results = await generateResults(
          model,
          topic,
          questions.length,
          retryCount
        );
        if (!results) {
          throw new Error("결과 생성 실패");
        }

        // 최종 테스트 데이터 조합
        const finalTestData: TestJsonInsertData = {
          title: topic.title || "자동 생성 테스트",
          description: topic.description || "",
          thumbnail_url: null,
          tone: topic.tone || { code: "default", color: "#3b82f6" },
          theme: topic.theme || "modern",
          palette: topic.palette || ["#3b82f6", "#8b5cf6"],
          character: topic.character || {
            type: "illustration",
            style: "2d",
            prompt_hint: "modern illustration style",
          },
          category_id: topic.category_id!,
          questions: questions,
          results: results,
        };

        console.log(
          `✅ 테스트 생성 성공: "${finalTestData.title}" (질문: ${finalTestData.questions.length}개, 결과: ${finalTestData.results.length}개)`
        );

        return finalTestData;
      } catch (error: any) {
        const action = await handleApiError(
          error,
          modelName,
          attempt,
          retryCount,
          maxRetries
        );

        if (action === "abort") {
          return null;
        } else if (action === "skip") {
          continue; // 다음 모델로
        } else if (action === "retry") {
          continue; // 재시도
        }
      }
    }
  }

  return null;
}

/**
 * 두 개의 테스트를 생성 (매일 2개씩)
 * 서로 다른 카테고리로 생성하여 다양성 확보
 */
export async function generateTwoTests(): Promise<
  [TestJsonInsertData | null, TestJsonInsertData | null]
> {
  const validCategoryIds = [1, 2, 3, 4, 5, 6, 7, 8];
  const MAX_TOTAL_TIME = 10 * 60 * 1000; // 전체 최대 실행 시간: 10분
  const startTime = Date.now();

  // 첫 번째 테스트: 랜덤 카테고리
  const category1 =
    validCategoryIds[Math.floor(Math.random() * validCategoryIds.length)];
  console.log(`📝 첫 번째 테스트 생성 시작 (카테고리: ${category1})`);
  let test1 = await generateTestWithGeminiForCategory(category1);

  // 타임아웃 체크
  if (Date.now() - startTime > MAX_TOTAL_TIME) {
    console.error(`❌ 전체 최대 실행 시간 초과 (${MAX_TOTAL_TIME / 1000}초)`);
    return [test1, null];
  }

  if (!test1) {
    console.error(
      `❌ 첫 번째 테스트 생성 실패. 두 번째 테스트 생성을 중단합니다.`
    );
    return [null, null];
  }

  console.log(
    `✅ 첫 번째 테스트 생성 완료: "${test1.title}" (카테고리: ${test1.category_id})`
  );

  await sleep(2000);

  // 타임아웃 체크
  if (Date.now() - startTime > MAX_TOTAL_TIME) {
    console.error(`❌ 전체 최대 실행 시간 초과 (${MAX_TOTAL_TIME / 1000}초)`);
    return [test1, null];
  }

  // 두 번째 테스트: 첫 번째와 다른 카테고리
  const remainingCategories = validCategoryIds.filter((id) => id !== category1);
  const category2 =
    remainingCategories[Math.floor(Math.random() * remainingCategories.length)];
  console.log(`📝 두 번째 테스트 생성 시작 (카테고리: ${category2})`);
  let test2 = await generateTestWithGeminiForCategory(category2);

  return [test1, test2];
}

/**
 * 특정 카테고리로 테스트 생성
 */
export async function generateTestWithGeminiForCategory(
  categoryId: number
): Promise<TestJsonInsertData | null> {
  const maxRetries = 2;
  const MAX_ATTEMPTS = 5; // 무한 루프 방지: 최대 5번 시도
  const MAX_EXECUTION_TIME = 5 * 60 * 1000; // 최대 실행 시간: 5분
  const startTime = Date.now();

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    // 실행 시간 체크
    if (Date.now() - startTime > MAX_EXECUTION_TIME) {
      console.error(`❌ 최대 실행 시간 초과 (${MAX_EXECUTION_TIME / 1000}초)`);
      return null;
    }
    for (const modelName of models) {
      try {
        const genAI = getGeminiClient();
        const model = genAI.getGenerativeModel({ model: modelName });

        // 카테고리 지정 프롬프트
        const categoryPrompt = `${TopicPrompt}

⚠️ 필수 요구사항: 
- category_id는 반드시 ${categoryId}를 선택하세요.
- 카테고리 ${categoryId}에 맞는 주제를 생성하세요.
- 검색량이 높고 클릭을 유도할 수 있는 주제로 작성하세요.`;

        console.log(`📝 1단계: 주제 생성 시작... (카테고리: ${categoryId})`);
        const result = await model.generateContent(categoryPrompt);
        const text = result.response.text();
        const topicData = parseJsonResponse(text);

        // 검증: 지정된 카테고리인지 확인
        if (topicData.category_id !== categoryId) {
          throw new Error(
            `카테고리가 일치하지 않습니다. 요청: ${categoryId}, 생성: ${topicData.category_id}`
          );
        }

        const topic = topicData;
        const questions = await generateQuestions(model, topic, 1);
        if (!questions) {
          throw new Error("질문 생성 실패");
        }

        const results = await generateResults(
          model,
          topic,
          questions.length,
          1
        );
        if (!results) {
          throw new Error("결과 생성 실패");
        }

        const finalTestData: TestJsonInsertData = {
          title: topic.title || "자동 생성 테스트",
          description: topic.description || "",
          thumbnail_url: null,
          tone: topic.tone || { code: "default", color: "#3b82f6" },
          theme: topic.theme || "modern",
          palette: topic.palette || ["#3b82f6", "#8b5cf6"],
          character: topic.character || {
            type: "illustration",
            style: "2d",
            prompt_hint: "modern illustration style",
          },
          category_id: topic.category_id!,
          questions: questions,
          results: results,
        };

        console.log(
          `✅ 테스트 생성 성공: "${finalTestData.title}" (질문: ${questions.length}개, 결과: ${results.length}개)`
        );
        return finalTestData;
      } catch (error: any) {
        console.error(
          `❌ 테스트 생성 실패 (카테고리: ${categoryId}, 시도 ${attempt + 1}/${
            maxRetries + 1
          }):`,
          error.message
        );

        if (attempt < maxRetries) {
          console.log(`🔄 재시도 대기 중... (2초)`);
          await sleep(2000);
          continue;
        }
      }
    }
  }

  return null;
}
