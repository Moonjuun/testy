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
  if (req.method !== "POST")
    return res.status(405).json({ message: "POST only" });

  const { data, language = "ko", test_id } = req.body;

  if (!data || !data.title || !data.questions || !data.results) {
    return res
      .status(400)
      .json({ error: "JSON 누락 (title/questions/results)" });
  }

  try {
    if (language === "ko") {
      const { data: testId, error } = await supabaseAdmin.rpc(
        "insert_test_data",
        {
          p_test_data: data,
        }
      );
      if (error) throw error;
      return res
        .status(200)
        .json({ message: "기본 테스트 업로드 완료", testId });
    } else {
      if (!test_id) return res.status(400).json({ error: "test_id 누락" });

      const { error } = await supabaseAdmin.rpc("insert_test_translation", {
        p_translation_data: data,
        p_language: language,
        p_test_id: test_id,
      });

      if (error) throw error;

      return res
        .status(200)
        .json({ message: "번역 업로드 완료", testId: test_id });
    }
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message || "Server Error" });
  }
}
