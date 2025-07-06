import { createClient } from "./client";

import { Category } from "@/types/categories";

export async function getActiveCategories(
  language: "ko" | "en" | "ja" | "vi" = "ko"
): Promise<Category[]> {
  const supabase = createClient();

  const { data: testData, error: testError } = await supabase
    .from("tests")
    .select("category_id")
    .not("category_id", "is", null);

  if (testError || !testData) {
    console.error("Error fetching tests:", testError);
    return [];
  }

  const uniqueCategoryIds = [
    ...new Set(testData.map((t) => t.category_id)),
  ] as number[];
  if (uniqueCategoryIds.length === 0) return [];

  const nameField = `name_${language}`;
  const selectFields = ["id", "code", nameField].join(",");

  const { data, error: catError } = await supabase
    .from("categories")
    .select(selectFields)
    .in("id", uniqueCategoryIds);

  if (catError || !data) {
    console.error("Error fetching categories:", catError);
    return [];
  }

  return data.map((cat) => ({
    id: (cat as any).id,
    code: (cat as any).code,
    name: (cat as any)[nameField] ?? "",
  }));
}
