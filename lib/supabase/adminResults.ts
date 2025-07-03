import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// 결과 원본 타입
export interface RawResult {
  id: string;
  test_id: string;
  result_image_url: string | null;
  image_prompt: string;
}

// 결과 변환 타입
export interface TranslatedResult {
  id: string;
  test_id: string;
  test_name: string;
  result_title: string;
  result_image_url: string;
  image_prompt: string;
}

/**
 * [1] Supabase에서 이미지가 아직 없는 결과만 단순 조회 (translation 없음)
 */
export async function fetchRawResultsWithoutImages(): Promise<RawResult[]> {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from("results")
    .select("id, test_id, result_image_url, image_prompt")
    .is("result_image_url", null);

  if (error || !data) {
    throw error || new Error("결과 데이터 불러오기 실패");
  }

  return data;
}

/**
 * [2] Supabase에서 이미지가 등록된 테스트 결과를 불러와
 * 한글 번역 제목과 함께 매핑된 결과를 반환
 */
export async function loadResultsWithImages(): Promise<TranslatedResult[]> {
  const supabase = createClientComponentClient();

  const { data: resultsData, error: resultsError } = await supabase
    .from("results")
    .select("id, test_id, result_image_url, image_prompt")
    .not("result_image_url", "is", null);

  if (resultsError || !resultsData) throw resultsError;

  const uniqueTestIds = [...new Set(resultsData.map((r) => r.test_id))];
  const uniqueResultIds = resultsData.map((r) => r.id);

  const { data: resultTranslations } = await supabase
    .from("result_translations")
    .select("result_id, title")
    .eq("language", "ko")
    .in("result_id", uniqueResultIds);

  const { data: testTranslations } = await supabase
    .from("test_translations")
    .select("test_id, title")
    .eq("language", "ko")
    .in("test_id", uniqueTestIds);

  const testTitleMap = Object.fromEntries(
    testTranslations!.map((t) => [t.test_id, t.title])
  );
  const resultTitleMap = Object.fromEntries(
    resultTranslations!.map((r) => [r.result_id, r.title])
  );

  return resultsData.map((item) => ({
    id: item.id,
    test_id: item.test_id,
    test_name: testTitleMap[item.test_id],
    result_title: resultTitleMap[item.id],
    result_image_url: item.result_image_url!,
    image_prompt: item.image_prompt,
  }));
}

/**
 * [3] Supabase에서 이미지가 아직 등록되지 않은 테스트 결과를 불러와
 * 한글 번역 제목과 함께 매핑된 결과를 반환
 */
export async function loadResultsWithoutImages(): Promise<TranslatedResult[]> {
  const supabase = createClientComponentClient();

  const { data: resultsData, error: resultsError } = await supabase
    .from("results")
    .select("id, test_id, result_image_url, image_prompt")
    .is("result_image_url", null);

  if (resultsError || !resultsData) throw resultsError;

  const uniqueTestIds = [...new Set(resultsData.map((r) => r.test_id))];
  const uniqueResultIds = resultsData.map((r) => r.id);

  const { data: resultTranslations } = await supabase
    .from("result_translations")
    .select("result_id, title")
    .eq("language", "ko")
    .in("result_id", uniqueResultIds);

  const { data: testTranslations } = await supabase
    .from("test_translations")
    .select("test_id, title")
    .eq("language", "ko")
    .in("test_id", uniqueTestIds);

  const testTitleMap = Object.fromEntries(
    testTranslations!.map((t) => [t.test_id, t.title])
  );
  const resultTitleMap = Object.fromEntries(
    resultTranslations!.map((r) => [r.result_id, r.title])
  );

  return resultsData.map((item) => ({
    id: item.id,
    test_id: item.test_id,
    test_name: testTitleMap[item.test_id],
    result_title: resultTitleMap[item.id],
    result_image_url: item.result_image_url ?? "",
    image_prompt: item.image_prompt,
  }));
}

/**
 * [4] 결과 ID와 파일을 받아 Supabase Storage에 이미지 업로드 후
 * result_image_url을 업데이트하고 public URL을 반환
 *
 * @param resultId - 결과(result) 테이블의 고유 ID
 * @param file - 업로드할 이미지 파일
 * @returns publicUrl - 업로드된 이미지의 공개 URL
 */
export async function uploadResultImageToSupabase(
  resultId: string,
  file: File
): Promise<string> {
  const supabase = createClientComponentClient();

  // 1. Supabase Storage에 업로드 (중복 경로는 upsert로 덮어쓰기)
  const uploadPath = `${resultId}/${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("result-images")
    .upload(uploadPath, file, {
      cacheControl: "3600", // CDN 캐싱 설정 (1시간)
      upsert: true, // 같은 경로에 업로드 시 덮어쓰기 허용
    });

  if (uploadError || !uploadData) {
    throw uploadError || new Error("이미지 업로드 실패");
  }

  // 2. public URL 조회
  const {
    data: { publicUrl },
  } = supabase.storage.from("result-images").getPublicUrl(uploadData.path);

  if (!publicUrl) {
    throw new Error("공개 이미지 URL을 가져올 수 없습니다");
  }

  // 3. 결과 테이블에 이미지 URL 업데이트
  const { error: updateError } = await supabase
    .from("results")
    .update({ result_image_url: publicUrl })
    .eq("id", resultId);

  if (updateError) {
    throw updateError;
  }

  // 4. 성공적으로 public URL 반환
  return publicUrl;
}
