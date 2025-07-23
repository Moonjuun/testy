// lib/supabase/getTestMetadata.ts
import { createClient } from "../client";

// 메타데이터에 필요한 데이터 타입을 정의합니다.
// 필요한 필드만 포함하여 데이터 전송량을 최소화합니다.
export interface TestMetadata {
  title: string;
  description: string;
  testName?: string; // 예시: 테스트 자체의 이름 (필요 시 추가)
  resultSummary?: string; // 예시: 특정 결과 요약 (필요 시 추가)
  // 필요한 경우 썸네일 URL 등 추가 가능
}

export async function getTestMetadata(
  testId: number,
  language: string
): Promise<TestMetadata | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("test_translations")
    .select(
      `
      title,
      description,
      test_id
    `
    )
    .eq("test_id", testId)
    .eq("language", language)
    .single(); // 단일 레코드만 가져오므로 single() 사용

  if (error) {
    console.error(`Error fetching metadata for test ID ${testId}:`, error);
    return null;
  }

  if (!data) {
    return null; // 해당 언어 또는 ID에 대한 번역이 없는 경우
  }

  return {
    title: data.title || "기본 제목", // 데이터가 없을 경우를 대비한 기본값
    description: data.description || "기본 설명", // 데이터가 없을 경우를 대비한 기본값
    // testName, resultSummary 등은 테스트 결과 자체에 대한 내용이므로
    // 필요하다면 rpc 함수(get_test_data)를 통해 추가로 가져와야 합니다.
    // 여기서는 test_translations 테이블에서 직접 가져올 수 있는 필드만 포함합니다.
  };
}
