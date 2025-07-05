import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { TestForUpload } from "@/types/test";

const supabase = createClientComponentClient();

/**
 * 썸네일이 '없는' 테스트 목록을 한글 제목과 함께 불러옵니다.
 */
export async function loadTestsWithoutThumbnails(): Promise<TestForUpload[]> {
  const { data: tests, error } = await supabase
    .from("tests")
    .select("id, thumbnail_url, tone, theme, palette, character")
    .is("thumbnail_url", null)
    .eq("is_visible", true)
    .order("id", { ascending: false });

  if (error) throw error;
  if (!tests) return [];

  const testIds = tests.map((t) => t.id);
  if (testIds.length === 0) return [];

  const { data: translations } = await supabase
    .from("test_translations")
    .select("test_id, title")
    .in("test_id", testIds)
    .eq("language", "ko");

  const titleMap = new Map(translations?.map((t) => [t.test_id, t.title]));

  return tests.map((test) => ({
    id: test.id,
    title: titleMap.get(test.id) || "제목 없음",
    thumbnail_url: test.thumbnail_url,
    tone: test.tone,
    theme: test.theme,
    palette: test.palette,
    character: test.character,
  }));
}

/**
 * 썸네일이 '있는' 테스트 목록을 불러옵니다. (확인용)
 */
export async function loadTestsWithThumbnails(): Promise<TestForUpload[]> {
  const { data: tests, error } = await supabase
    .from("tests")
    // ✅ 조회할 컬럼 추가
    .select("id, thumbnail_url, tone, theme, palette, character")
    .not("thumbnail_url", "is", null)
    .eq("is_visible", true)
    .order("id", { ascending: false });

  if (error) throw error;
  if (!tests) return [];

  const testIds = tests.map((t) => t.id);
  if (testIds.length === 0) return [];

  const { data: translations } = await supabase
    .from("test_translations")
    .select("test_id, title")
    .in("test_id", testIds)
    .eq("language", "ko");

  const titleMap = new Map(translations?.map((t) => [t.test_id, t.title]));

  // ✅ 반환 객체에 새로운 속성들 추가
  return tests.map((test) => ({
    id: test.id,
    title: titleMap.get(test.id) || "제목 없음",
    thumbnail_url: test.thumbnail_url,
    tone: test.tone,
    theme: test.theme,
    palette: test.palette,
    character: test.character,
  }));
}

/**
 * 테스트 썸네일을 업로드하고 tests 테이블의 thumbnail_url을 업데이트합니다.
 */
export async function uploadTestThumbnailToSupabase(
  testId: string,
  file: File
): Promise<string> {
  // 참고: 'thumbnail-image'는 Supabase에 생성한 버킷 이름과 일치해야 합니다.
  const uploadPath = `test-thumbnails/${testId}/${Date.now()}-${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("thumbnail-image")
    .upload(uploadPath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("thumbnail-image").getPublicUrl(uploadData.path);

  if (!publicUrl) throw new Error("Public URL을 가져올 수 없습니다.");

  const { error: updateError } = await supabase
    .from("tests")
    .update({ thumbnail_url: publicUrl })
    .eq("id", testId);

  if (updateError) throw updateError;

  return publicUrl;
}
