// lib/supabase/getAllTests.ts
import { createClient } from "./client";
import { NewTest } from "@/types/test";

export async function getAllTests(
  language: "ko" | "en" | "ja" | "vi" = "en"
): Promise<NewTest[]> {
  const supabase = createClient();
  const nameField = `name_${language}`;

  const { data, error } = await supabase
    .from("tests")
    .select(
      `
      id,
      tone,
      theme,
      palette,
      character,
      thumbnail_url,
      is_visible,
      created_at,
      view_count,
      test_translations (
        title,
        description,
        language
      ),
      categories (
        code,
        ${nameField}
      )
    `
    )
    .eq("is_visible", true)
    .eq("test_translations.language", language) // ✅ 해당 언어만 조인
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error fetching all tests:", error);
    return [];
  }

  return data.map((test: any) => {
    const translation = Array.isArray(test.test_translations)
      ? test.test_translations.find((t: any) => t.language === language)
      : null;

    return {
      id: test.id,
      title: translation?.title ?? "",
      description: translation?.description ?? "",
      thumbnail_url: test.thumbnail_url,
      tone: test.tone,
      theme: test.theme,
      palette: test.palette,
      character: test.character,
      is_visible: test.is_visible,
      created_at: test.created_at,
      view_count: test.view_count,
      category: test.categories
        ? {
            code: test.categories.code,
            name: test.categories[nameField] ?? "",
          }
        : null,
      test_translations: {
        title: translation?.title ?? "",
        language: translation?.language ?? language,
        description: translation?.description ?? "",
      },
    };
  });
}
