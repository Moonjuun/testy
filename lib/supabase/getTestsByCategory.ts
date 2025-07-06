import { createClient } from "./client";
import { NewTest } from "@/types/test";

export async function getTestsByCategory(
  categoryCode: string,
  language: "ko" | "en" | "ja" | "vi" = "ko"
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
      test_translations (
        title,
        description,
        language
      ),
      categories!inner (
        id,
        code,
        ${nameField}
      )
    `
    )
    .eq("is_visible", true)
    .eq("categories.code", categoryCode)
    .eq("test_translations.language", language)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error(
      "Error fetching category tests:",
      error?.message,
      error?.details,
      error?.hint
    );
    return [];
  }

  return data.map((test: any) => {
    const translation = Array.isArray(test.test_translations)
      ? test.test_translations.find((t: any) => t.language === language)
      : test.test_translations;

    const category = test.categories;

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
      category: category
        ? {
            code: category.code,
            name: category[nameField] ?? "",
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
