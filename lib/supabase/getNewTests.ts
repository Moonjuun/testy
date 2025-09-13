// lib/supabase/getNewTests.ts
import { NewTest } from "@/types/test";
import { createClient } from "./client";
import { unstable_cache } from "next/cache";

type Lang = "ko" | "en" | "ja" | "vi";

// 1) 원본 쿼리(캐시 X) — 내부 전용
async function fetchNewTestsRaw(
  language: Lang = "en",
  limit = 12
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
      categories (
        code,
        ${nameField}
      )
    `
    )
    .eq("is_visible", true)
    .eq("test_translations.language", language)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    console.error("Error fetching new tests:", error);
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
      category: test.categories
        ? { code: test.categories.code, name: test.categories[nameField] ?? "" }
        : null,
      test_translations: {
        title: translation?.title ?? "",
        language: translation?.language ?? language,
        description: translation?.description ?? "",
      },
    } as NewTest;
  });
}

// 2) 캐시 래퍼 — 외부에는 이 이름으로 계속 노출
export async function getNewTests(
  language: Lang = "en",
  limit = 12
): Promise<NewTest[]> {
  // 언어/limit별 캐시 키
  const key = ["new-tests", language, String(limit)];
  const cached = unstable_cache(() => fetchNewTestsRaw(language, limit), key, {
    revalidate: 60 * 60, // 1시간
    tags: [`new-tests:${language}:${limit}`],
  });
  return cached();
}

// (선택) 캐시 없이 강제 최신 조회가 필요하면 이걸 import해서 쓰세요.
export { fetchNewTestsRaw as getNewTestsNoCache };
