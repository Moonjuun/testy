// lib/supabase/adminTests.ts
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { TestForUpload } from "@/types/test"; // 아래에서 정의할 타입

const supabase = createClientComponentClient();

/**
 * [1] 썸네일이 '없는' 테스트 목록을 한글 제목과 함께 불러옵니다.
 */
export async function loadTestsWithoutThumbnails(): Promise<TestForUpload[]> {
  const { data: tests, error } = await supabase
    .from("tests")
    .select("id, thumbnail_url")
    .is("thumbnail_url", null);

  if (error) throw error;

  const testIds = tests.map((t) => t.id);

  const { data: translations, error: transError } = await supabase
    .from("test_translations")
    .select("test_id, title")
    .in("test_id", testIds)
    .eq("language", "ko");

  if (transError) throw transError;

  const titleMap = new Map(translations.map((t) => [t.test_id, t.title]));

  return tests.map((test) => ({
    id: test.id,
    title: titleMap.get(test.id) || "제목 없음",
    thumbnail_url: test.thumbnail_url,
  }));
}

/**
 * [2] 썸네일이 '있는' 테스트 목록을 불러옵니다. (확인용)
 */
export async function loadTestsWithThumbnails(): Promise<TestForUpload[]> {
  // 위 함수와 거의 동일하며, .is() 조건만 .not()으로 변경됩니다.
  const { data: tests, error } = await supabase
    .from("tests")
    .select("id, thumbnail_url")
    .not("thumbnail_url", "is", null);

  if (error) throw error;

  // ... (제목을 가져오는 로직은 위와 동일)
  const testIds = tests.map((t) => t.id);
  const { data: translations, error: transError } = await supabase
    .from("test_translations")
    .select("test_id, title")
    .in("test_id", testIds)
    .eq("language", "ko");
  if (transError) throw transError;
  const titleMap = new Map(translations.map((t) => [t.test_id, t.title]));

  return tests.map((test) => ({
    id: test.id,
    title: titleMap.get(test.id) || "제목 없음",
    thumbnail_url: test.thumbnail_url,
  }));
}

/**
 * [3] 테스트 썸네일을 업로드하고 tests 테이블의 thumbnail_url을 업데이트합니다.
 * @param testId - 업데이트할 테스트의 ID
 * @param file - 업로드할 이미지 파일
 * @returns 업로드된 이미지의 public URL
 */
export async function uploadTestThumbnailToSupabase(
  testId: string,
  file: File
): Promise<string> {
  // 1. 스토리지에 업로드
  const uploadPath = `test-thumbnails/${testId}/${Date.now()}-${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("test-thumbnails") // 버킷 이름을 `test-thumbnails`로 가정
    .upload(uploadPath, file, {
      upsert: true,
    });

  if (uploadError) throw uploadError;

  // 2. Public URL 가져오기
  const {
    data: { publicUrl },
  } = supabase.storage.from("test-thumbnails").getPublicUrl(uploadData.path);

  if (!publicUrl) throw new Error("Public URL을 가져올 수 없습니다.");

  // 3. 'tests' 테이블 업데이트
  const { error: updateError } = await supabase
    .from("tests")
    .update({ thumbnail_url: publicUrl })
    .eq("id", testId);

  if (updateError) throw updateError;

  return publicUrl;
}
