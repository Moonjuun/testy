// lib/gemini/saveTestToDatabase.ts
import { createClient } from "@supabase/supabase-js";
import { TestJsonInsertData, TranslationDataOnly } from "@/types/test";
import { translateTestToAllLanguages } from "./generateTranslations";
import { generateThumbnailImage, generateResultImage } from "./generateImage";
import {
  uploadThumbnailImageToSupabase,
  uploadResultImageToSupabase,
} from "./uploadImageToSupabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

/**
 * 번역에 필요한 데이터만 추출 (불변 데이터 제외)
 */
function extractTranslationData(
  testData: TestJsonInsertData
): TranslationDataOnly {
  return {
    title: testData.title,
    description: testData.description,
    questions: testData.questions.map((q) => ({
      question: q.question,
      options: q.options.map((opt) => ({
        text: opt.text,
        score: opt.score,
      })),
    })),
    results: testData.results.map((r) => ({
      title: r.title,
      description: r.description,
      recommendation: r.recommendation,
      keywords: r.keywords,
      score_range: r.score_range,
    })),
  };
}

/**
 * 번역 저장 공통 함수 (효율적인 버전)
 * 번역 데이터만 전송하여 토큰 및 네트워크 사용량 최소화
 */
/**
 * 번역 데이터 검증
 */
function validateTranslationData(
  translationData: TranslationDataOnly,
  language: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // 제목 검증
  if (!translationData.title || translationData.title.trim().length === 0) {
    errors.push(`${language}: 제목이 없습니다.`);
  }

  // 설명 검증
  if (
    !translationData.description ||
    translationData.description.trim().length === 0
  ) {
    errors.push(`${language}: 설명이 없습니다.`);
  }

  // 질문 검증
  if (!translationData.questions || translationData.questions.length === 0) {
    errors.push(`${language}: 질문이 없습니다.`);
  } else {
    translationData.questions.forEach((q, idx) => {
      if (!q.question || q.question.trim().length === 0) {
        errors.push(`${language}: 질문 ${idx + 1}의 내용이 없습니다.`);
      }
      if (!q.options || q.options.length < 2) {
        errors.push(
          `${language}: 질문 ${idx + 1}의 선택지가 부족합니다. (최소 2개 필요)`
        );
      }
      q.options?.forEach((opt, optIdx) => {
        if (!opt.text || opt.text.trim().length === 0) {
          errors.push(
            `${language}: 질문 ${idx + 1}의 선택지 ${optIdx + 1}의 내용이 없습니다.`
          );
        }
        if (typeof opt.score !== "number") {
          errors.push(
            `${language}: 질문 ${idx + 1}의 선택지 ${optIdx + 1}의 점수가 유효하지 않습니다.`
          );
        }
      });
    });
  }

  // 결과 검증
  if (!translationData.results || translationData.results.length === 0) {
    errors.push(`${language}: 결과가 없습니다.`);
  } else {
    translationData.results.forEach((r, idx) => {
      if (!r.title || r.title.trim().length === 0) {
        errors.push(`${language}: 결과 ${idx + 1}의 제목이 없습니다.`);
      }
      if (!r.description || r.description.trim().length === 0) {
        errors.push(`${language}: 결과 ${idx + 1}의 설명이 없습니다.`);
      }
      if (!r.score_range || r.score_range.length !== 2) {
        errors.push(
          `${language}: 결과 ${idx + 1}의 점수 범위가 유효하지 않습니다.`
        );
      }
      if (!r.recommendation) {
        errors.push(`${language}: 결과 ${idx + 1}의 추천 정보가 없습니다.`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

async function saveTranslationEfficient(
  translationData: TestJsonInsertData | null,
  language: "ko" | "en" | "ja" | "vi",
  testId: number
): Promise<{ language: string; success: boolean; error?: string }> {
  if (!translationData) {
    console.warn(`⚠️ ${language.toUpperCase()} 번역 생성 실패`);
    return {
      language,
      success: false,
      error: "번역 생성 실패",
    };
  }

  try {
    console.log(
      `💾 ${language.toUpperCase()} 번역 저장 시작... (testId: ${testId})`
    );

    // ✅ 번역에 필요한 데이터만 추출
    const translationOnly = extractTranslationData(translationData);

    // ✅ 데이터 검증
    const validation = validateTranslationData(translationOnly, language);
    if (!validation.valid) {
      const errorMessage = `데이터 검증 실패: ${validation.errors.join(", ")}`;
      console.error(`❌ ${language.toUpperCase()} ${errorMessage}`);
      return {
        language,
        success: false,
        error: errorMessage,
      };
    }

    const { error } = await supabaseAdmin.rpc(
      "insert_test_translation_efficient",
      {
        p_translation_data: translationOnly,
        p_language: language,
        p_test_id: testId,
      }
    );

    if (error) {
      // ✅ updated_at 에러 특별 처리
      if (error.message?.includes("updated_at")) {
        const errorMessage = `데이터베이스 함수 오류: updated_at 컬럼이 존재하지 않습니다. Supabase에서 함수를 업데이트해주세요.`;
        console.error(`❌ ${language.toUpperCase()} ${errorMessage}`);
        console.error(`에러 상세:`, error);
        return {
          language,
          success: false,
          error: errorMessage,
        };
      }

      console.error(`❌ ${language.toUpperCase()} 번역 저장 실패:`, error);
      return {
        language,
        success: false,
        error: error.message,
      };
    }

    console.log(`✅ ${language.toUpperCase()} 번역 저장 완료`);
    return { language, success: true };
  } catch (error: any) {
    console.error(`❌ ${language.toUpperCase()} 번역 저장 중 오류:`, error);
    return {
      language,
      success: false,
      error: error.message || "Unknown error",
    };
  }
}

/**
 * 생성된 테스트를 데이터베이스에 저장
 *
 * ✅ 개선된 플로우 (트랜잭션 방식):
 * 1. 다국어 번역 생성 (한국어, 영어, 일본어, 베트남어)
 * 2. 모든 번역이 성공한 경우에만 한꺼번에 저장
 * 3. 하나라도 실패하면 저장하지 않음 (원자성 보장)
 *
 * ✅ 개선사항:
 * - 모든 다국어가 완료되어야 저장 (원자성 보장)
 * - 번역 실패 시 불완전한 데이터 저장 방지
 * - 병렬 처리로 성능 향상
 * - 번역 데이터만 전송하여 토큰/네트워크 사용량 최소화
 */
export async function saveTestToDatabase(
  testData: TestJsonInsertData
): Promise<{
  success: boolean;
  testId?: number;
  error?: string;
  imageGeneration?: {
    thumbnailSuccess: boolean;
    resultImagesSuccess: number;
    resultImagesTotal: number;
  };
}> {
  let savedTestId: number | null = null;

  try {
    // 1. 다국어 번역 생성 (저장 전에 모든 번역 완료 확인)
    console.log("🌐 다국어 번역 생성 시작...");
    const translations = await translateTestToAllLanguages(testData);

    // ✅ 모든 번역이 성공했는지 확인
    const requiredLanguages: Array<"ko" | "en" | "ja" | "vi"> = [
      "ko",
      "en",
      "ja",
      "vi",
    ];
    const missingTranslations: string[] = [];

    // 한국어는 원본 데이터 사용
    if (!testData.title || !testData.description) {
      missingTranslations.push("ko");
    }

    // 번역 언어 확인
    if (!translations.en) missingTranslations.push("en");
    if (!translations.ja) missingTranslations.push("ja");
    if (!translations.vi) missingTranslations.push("vi");

    if (missingTranslations.length > 0) {
      const errorMessage = `❌ 필수 번역 누락: ${missingTranslations.join(
        ", "
      )}. 모든 다국어(한국어, 영어, 일본어, 베트남어)가 완료되어야 저장됩니다.`;
      console.error(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }

    console.log("✅ 모든 다국어 번역 완료 (한국어, 영어, 일본어, 베트남어)");

    // 2. 메타데이터와 구조만 저장 (번역 없이)
    // ✅ insert_test_metadata_only 사용: 메타데이터와 구조만 저장
    const metadataOnly = {
      tone: testData.tone,
      theme: testData.theme,
      palette: testData.palette,
      character: testData.character,
      category_id: testData.category_id,
      thumbnail_url: testData.thumbnail_url || null,
      view_count: 0, // 초기 조회수 0으로 설정
      questions: testData.questions.map((q) => ({
        image_url: null, // 질문 이미지는 없음
        options: q.options.map((opt) => ({
          score: opt.score,
        })),
      })),
      results: testData.results.map((result) => ({
        score_range: result.score_range,
        image_prompt: result.image_prompt,
        result_image_url: result.result_image_url || null,
      })),
    };

    const { data: testId, error: saveError } = await supabaseAdmin.rpc(
      "insert_test_metadata_only",
      {
        p_metadata: metadataOnly,
      }
    );

    if (saveError) {
      console.error("❌ 테스트 메타데이터 저장 실패:", saveError);
      return { success: false, error: saveError.message };
    }

    savedTestId = testId as number;
    console.log(`✅ 테스트 메타데이터 저장 완료 (ID: ${savedTestId})`);

    // 3. 다국어 번역 병렬 저장 (한국어 포함, 모든 언어 동일 함수 사용)
    console.log("💾 다국어 번역 저장 시작...");
    const translationResults = await Promise.all([
      saveTranslationEfficient(testData, "ko", savedTestId),
      saveTranslationEfficient(translations.en, "en", savedTestId),
      saveTranslationEfficient(translations.ja, "ja", savedTestId),
      saveTranslationEfficient(translations.vi, "vi", savedTestId),
    ]);

    // ✅ 모든 번역 저장이 성공했는지 확인
    const failedTranslations = translationResults.filter((r) => !r.success);
    if (failedTranslations.length > 0) {
      const failedLanguages = failedTranslations
        .map((r) => r.language.toUpperCase())
        .join(", ");
      const errorMessage = `❌ 번역 저장 실패: ${failedLanguages}. 모든 다국어 저장이 실패했습니다.`;

      console.error(errorMessage);
      console.error("실패 상세:", failedTranslations);

      // ✅ 트랜잭션 롤백: 저장된 한국어 테스트 삭제
      if (savedTestId) {
        console.log(`🔄 트랜잭션 롤백: 테스트 ID ${savedTestId} 삭제 중...`);
        const { error: deleteError } = await supabaseAdmin
          .from("tests")
          .delete()
          .eq("id", savedTestId);

        if (deleteError) {
          console.error(
            `⚠️ 롤백 실패: 테스트 ID ${savedTestId} 삭제 중 오류:`,
            deleteError
          );
        } else {
          console.log(`✅ 롤백 완료: 테스트 ID ${savedTestId} 삭제됨`);
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }

    // 모든 번역 저장 성공
    const successCount = translationResults.filter((r) => r.success).length;
    console.log(
      `✅ 다국어 번역 저장 완료: ${successCount}/4 성공 (한국어, 영어, 일본어, 베트남어)`
    );

    // 4. 이미지 생성 및 업로드 (비동기, 실패해도 테스트 저장은 성공으로 처리)
    let thumbnailSuccess = false;
    let resultImagesSuccess = 0;
    let resultImagesTotal = 0;

    try {
      console.log("🖼️ 이미지 생성 및 업로드 시작...");

      // 4-1. 썸네일 이미지 생성 및 업로드
      if (testData.character?.prompt_hint) {
        try {
          console.log("📸 썸네일 이미지 생성 중...");
          const thumbnailDataUrl = await generateThumbnailImage(
            testData.character.prompt_hint
          );

          if (thumbnailDataUrl) {
            await uploadThumbnailImageToSupabase(savedTestId, thumbnailDataUrl);
            console.log(`✅ 썸네일 이미지 업로드 완료 (테스트 ID: ${savedTestId})`);
            thumbnailSuccess = true;
          } else {
            console.warn("⚠️ 썸네일 이미지 생성 실패 (계속 진행)");
          }
        } catch (thumbnailError: any) {
          console.error("❌ 썸네일 이미지 생성/업로드 실패:", thumbnailError.message);
          // 썸네일 실패는 무시하고 계속 진행
        }
      } else {
        console.warn("⚠️ character.prompt_hint가 없어 썸네일 이미지를 생성할 수 없습니다.");
      }

      // 4-2. 결과 이미지들 생성 및 업로드 (병렬 처리)
      if (testData.results && testData.results.length > 0) {
        console.log(`📸 결과 이미지 생성 중 (${testData.results.length}개)...`);

        // 먼저 results 테이블에서 result ID들을 조회
        const { data: savedResults, error: resultsError } = await supabaseAdmin
          .from("results")
          .select("id, score_min, score_max")
          .eq("test_id", savedTestId)
          .order("score_min", { ascending: true });

        if (resultsError || !savedResults || savedResults.length === 0) {
          console.warn("⚠️ 저장된 결과를 찾을 수 없어 결과 이미지를 생성할 수 없습니다.");
        } else {
          resultImagesTotal = testData.results.length;
          
          // 각 결과의 image_prompt와 저장된 result ID를 매칭
          const imagePromises = testData.results.map(async (result, idx) => {
            // score_range로 매칭
            const savedResult = savedResults.find(
              (sr) =>
                sr.score_min === result.score_range[0] &&
                sr.score_max === result.score_range[1]
            );

            if (!savedResult || !result.image_prompt) {
              console.warn(
                `⚠️ 결과 ${idx + 1}의 이미지 프롬프트가 없거나 매칭되는 결과를 찾을 수 없습니다.`
              );
              return null;
            }

            try {
              console.log(`📸 결과 이미지 ${idx + 1}/${testData.results.length} 생성 중...`);
              const resultImageDataUrl = await generateResultImage(result.image_prompt);

              if (resultImageDataUrl) {
                await uploadResultImageToSupabase(
                  savedResult.id,
                  resultImageDataUrl
                );
                console.log(
                  `✅ 결과 이미지 ${idx + 1} 업로드 완료 (결과 ID: ${savedResult.id})`
                );
                return { resultId: savedResult.id, success: true };
              } else {
                console.warn(`⚠️ 결과 이미지 ${idx + 1} 생성 실패`);
                return { resultId: savedResult.id, success: false };
              }
            } catch (resultImageError: any) {
              console.error(
                `❌ 결과 이미지 ${idx + 1} 생성/업로드 실패:`,
                resultImageError.message
              );
              return { resultId: savedResult.id, success: false };
            }
          });

          const imageResults = await Promise.all(imagePromises);
          resultImagesSuccess = imageResults.filter((r) => r?.success).length;
          console.log(
            `✅ 결과 이미지 업로드 완료: ${resultImagesSuccess}/${resultImagesTotal}개 성공`
          );
        }
      }

      console.log("✅ 이미지 생성 및 업로드 프로세스 완료");
    } catch (imageError: any) {
      // 이미지 생성/업로드 실패는 무시하고 테스트 저장은 성공으로 처리
      console.error("❌ 이미지 생성/업로드 중 오류 (무시됨):", imageError.message);
    }

    return {
      success: true,
      testId: savedTestId,
      imageGeneration: {
        thumbnailSuccess,
        resultImagesSuccess,
        resultImagesTotal,
      },
    };
  } catch (error: any) {
    console.error("❌ 테스트 저장 중 오류:", error);

    // ✅ 에러 발생 시 롤백
    if (savedTestId) {
      console.log(
        `🔄 에러 발생으로 인한 롤백: 테스트 ID ${savedTestId} 삭제 중...`
      );
      try {
        const { error: deleteError } = await supabaseAdmin
          .from("tests")
          .delete()
          .eq("id", savedTestId);

        if (deleteError) {
          console.error(
            `⚠️ 롤백 실패: 테스트 ID ${savedTestId} 삭제 중 오류:`,
            deleteError
          );
        } else {
          console.log(`✅ 롤백 완료: 테스트 ID ${savedTestId} 삭제됨`);
        }
      } catch (rollbackError) {
        console.error("롤백 중 오류:", rollbackError);
      }
    }

    return { success: false, error: error.message || "Unknown error" };
  }
}
