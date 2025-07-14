// lib/supabase/incrementTestResultCount.ts
import { createClient } from "./client";

/**
 * Supabase RPC 함수를 호출하여 테스트 결과 수를 1 증가시킵니다.
 * @param testId - 결과 수를 증가시킬 테스트의 ID
 */
export async function incrementTestResultCount(resultId: number) {
  // Supabase 클라이언트 인스턴스를 생성합니다.
  const supabase = createClient();

  // 'increment_result_count'라는 이름의 RPC 함수를 호출합니다.
  // testId를 'test_id_param'이라는 파라미터로 전달합니다.
  const { error } = await supabase.rpc("increment_result_count", {
    result_id_param: resultId,
  });

  // 에러가 발생하면 콘솔에 로그를 남깁니다.
  if (error) {
    console.error("Error incrementing result count:", error.message);
  }
}
