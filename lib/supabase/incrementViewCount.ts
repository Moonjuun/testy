// lib/supabase/incrementViewCount.ts
import { createClient } from "./client";
/**
 * Supabase RPC 함수를 호출하여 테스트 조회수를 1 증가시킵니다.
 * @param testId - 조회수를 증가시킬 테스트의 ID
 */
export async function incrementTestViewCount(testId: string) {
  // Supabase 클라이언트 인스턴스를 생성합니다.
  const supabase = createClient();

  // 'increment_view_count'라는 이름의 RPC 함수를 호출합니다.
  // testId를 'test_id_param'이라는 파라미터로 전달합니다.
  const { error } = await supabase.rpc("increment_view_count", {
    test_id_param: testId,
  });

  // 에러가 발생하면 콘솔에 로그를 남깁니다.
  if (error) {
    console.error("Error incrementing view count:", error.message);
  }
}
