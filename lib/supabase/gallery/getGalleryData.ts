// lib/supabase/gallery/getGalleryData.ts
import { createClient } from "../client";
import { GalleryImage, Category } from "@/types/gallery/gallery";

type Language = "ko" | "en" | "ja" | "vi";

const PAGE_SIZE = 12; // 한 번에 불러올 이미지 개수

/**
 * 갤러리 이미지를 페이지네이션하여 가져옵니다.
 * 카테고리별 필터링을 지원합니다.
 */
export async function getGalleryImages(
  language: Language = "en",
  page: number = 1,
  categoryId?: number | "all"
): Promise<GalleryImage[]> {
  const supabase = createClient();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  // 기본 쿼리 빌더 생성
  // 이미지가 있는 항목만 가져오기 위해 .not("result_image_url", "is", null) 추가
  let query = supabase
    .from("results")
    .select(
      `
      id,
      result_image_url,
      image_prompt,
      test:tests!inner (
        id,
        is_visible,
        thumbnail_url,
        category_id, 
        category:categories ( id, name_ko, name_en, name_ja, name_vi ),
        test_translations!inner ( title )
      ),
      result_translations!inner ( title, keywords )
    `
    )
    .not("result_image_url", "is", null) // 이미지가 있는 항목만
    .neq("result_image_url", "") // 빈 문자열도 제외
    .eq("tests.is_visible", true)
    .eq("tests.test_translations.language", language)
    .eq("result_translations.language", language);

  // categoryId가 있고 "all"가 아닐 경우, 'tests' 테이블의 'category_id'를 직접 필터링합니다.
  if (categoryId && categoryId !== "all") {
    query = query.eq("tests.category_id", categoryId);
  }

  const { data, error } = await query
    .order("id", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching gallery images:", error);
    return [];
  }

  return data.map((result) => {
    const test = result.test as any; // 타입 단언으로 오류 해결
    const resultTranslation = result.result_translations[0];
    const testTranslation = test.test_translations[0];

    const categoryName = test.category?.[`name_${language}`];

    return {
      id: result.id,
      src: result.result_image_url,
      title: resultTranslation?.title ?? "제목 없음",
      tags: resultTranslation?.keywords || [],
      prompt: result.image_prompt,
      testId: test.id,
      testTitle: testTranslation?.title ?? "테스트 제목 없음",
      testThumbnailUrl: test.thumbnail_url,
      category: categoryName,
    };
  });
  // 데이터베이스 쿼리에서 이미 필터링했으므로 추가 필터링 불필요
}

/**
 * 현재 'tests' 테이블에서 사용 중인 카테고리 목록만 가져옵니다.
 * (is_visible = true 인 테스트의 카테고리만 조회)
 */
export async function getGalleryCategories(
  language: Language = "en"
): Promise<Category[]> {
  const supabase = createClient();

  // tests 테이블과 INNER JOIN하여 실제로 사용되는 카테고리만 조회합니다.
  // 또한, is_visible이 true인 테스트에 속한 카테고리만 가져옵니다.
  const { data, error } = await supabase
    .from("categories")
    .select(
      "id, name_ko, name_en, name_ja, name_vi, tests!inner(category_id, is_visible)"
    )
    .eq("tests.is_visible", true)
    .order("id");

  if (error) {
    console.error("Error fetching active categories:", error);
    return [];
  }

  // 중복된 카테고리를 제거하고 반환합니다.
  const uniqueCategories = Array.from(
    new Map(data.map((cat) => [cat.id, cat])).values()
  );

  return uniqueCategories.map((cat) => ({
    id: cat.id,
    name: cat[`name_${language}`],
  }));
}
