import { createClient } from "./client";

// lib/supabase/getTestHistory.ts
export async function getTestHistory(userId: string, offset = 0, limit = 10) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_test_results")
    .select("id, test_title, result_data, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1); // range는 [start, end] 포함

  if (error) {
    console.error("❌ Error loading test history:", error);
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    title: item.test_title,
    result: item.result_data?.title ?? "결과 없음",
    date: new Date(item.created_at).toISOString().split("T")[0],
    category: item.result_data?.category ?? "기타",
  }));
}
