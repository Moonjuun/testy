// lib/supabase/getTestResultById.ts
import { createClient } from "./client";

export async function getTestResultById(id: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_test_results")
    .select("id, test_title, result_data, created_at")
    .eq("id", id)
    .single();

  if (error) {
    console.error("❌ Failed to load test result:", error);
    return null;
  }

  return {
    id: data.id,
    title: data.test_title,
    result: data.result_data,
    category: data.result_data?.category ?? "기타",
    description: data.result_data?.description ?? "",
    date: new Date(data.created_at).toISOString().split("T")[0],
  };
}
