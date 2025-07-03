// pages/api/insert-test-via-rpc.ts

// 중요: 클라이언트 컴포넌트용이 아닌 서버 측 Supabase 클라이언트 임포트
// 이 파일은 Node.js 환경에서 실행되므로, NEXT_PUBLIC_ 접두사가 없는 환경 변수도 접근 가능합니다.
import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";

// Supabase 클라이언트 초기화 (서비스 롤 키 사용)
// 이 키는 클라이언트에게 절대 노출되면 안 됩니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// 서비스 롤 키를 사용하여 Supabase 클라이언트 인스턴스 생성
// 이 인스턴스는 RLS(Row Level Security)를 우회할 수 있습니다.
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // POST 요청만 허용합니다.
  if (req.method !== "POST") {
    // 405 Method Not Allowed 응답
    return res
      .status(405)
      .json({ message: "Method Not Allowed - POST 요청만 허용됩니다." });
  }

  const testData = req.body; // 프론트엔드에서 받은 JSON 데이터

  // 필수 필드에 대한 기본적인 유효성 검사
  // 데이터베이스 함수에서도 더욱 상세한 검사 가능
  if (
    !testData ||
    !testData.title ||
    !testData.questions ||
    !testData.results
  ) {
    // 400 Bad Request 응답
    return res
      .status(400)
      .json({
        error:
          "Invalid test data provided. Missing title, questions, or results.",
      });
  }

  try {
    // Supabase 데이터베이스 함수 'insert_test_data' 호출
    // 'supabaseAdmin' 클라이언트를 사용하여 RLS를 우회하고 함수를 실행합니다.
    const { data: testId, error } = await supabaseAdmin.rpc(
      "insert_test_data",
      { p_test_data: testData }
    );

    // Supabase RPC 호출 중 오류 발생 시
    if (error) {
      console.error("Error calling insert_test_data function:", error);
      // 500 Internal Server Error 응답
      return res
        .status(500)
        .json({ error: error.message || "Database function error" });
    }

    // 성공 시 응답 (삽입된 테스트의 ID 반환)
    // 200 OK 응답
    return res
      .status(200)
      .json({ message: "Data inserted successfully via RPC.", testId: testId });
  } catch (err) {
    // 예상치 못한 서버 측 예외 발생 시
    console.error("Unexpected error in API route:", err);
    // 500 Internal Server Error 응답
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
