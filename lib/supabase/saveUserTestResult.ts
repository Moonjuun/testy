// lib/supabase/saveUserTestResult.ts
import { createClient } from "./client";
import { User } from "@supabase/supabase-js";
import { TestResultItem } from "@/types/test";

/**
 * 사용자의 테스트 결과를 Supabase에 저장하고 사용자 프로필을 업데이트합니다.
 * @param user 현재 로그인된 Supabase User 객체
 * @param resultData 저장할 TestResultItem 타입의 테스트 결과 JSON 데이터
 * @returns 저장 성공 여부 (boolean)
 */
export async function saveUserTestResult(
  user: User,
  resultData: TestResultItem
): Promise<boolean> {
  const supabase = createClient();

  try {
    const { test_id, result_id, test_title } = resultData;

    // 동일한 test_id와 result_id라도 다른 시간에 실행되면 새로운 기록으로 저장됩니다.
    // user_test_results 테이블의 id (SERIAL PRIMARY KEY)와 created_at 컬럼이
    // 각 기록의 고유성과 시간 정보를 보장합니다.

    // user_test_results 테이블에 결과 삽입
    const { error: insertError } = await supabase
      .from("user_test_results")
      .insert([
        {
          user_id: user.id,
          test_id: String(test_id),
          test_title: test_title,
          result_id: String(result_id),
          result_data: resultData,
        },
      ]);

    if (insertError) {
      console.error("Error saving test result:", insertError);
      return false;
    }
    console.log("Test result saved successfully.");

    // user_profiles의 last_tested_at 갱신
    const { error: profileUpdateError } = await supabase
      .from("user_profiles")
      .update({
        last_tested_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (profileUpdateError) {
      console.error("Error updating user profile:", profileUpdateError);
      return false;
    }
    console.log("User profile updated successfully.");
    return true;
  } catch (error) {
    console.error(
      "An unexpected error occurred during saving test result:",
      error
    );
    return false;
  }
}
