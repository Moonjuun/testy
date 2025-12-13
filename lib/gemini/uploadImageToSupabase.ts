// lib/gemini/uploadImageToSupabase.ts
// base64 이미지를 Supabase Storage에 업로드하는 유틸리티

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

/**
 * base64 data URL을 Buffer로 변환
 */
function base64ToBuffer(dataUrl: string): { buffer: Buffer; mimeType: string } {
  // data:image/png;base64,xxxxx 형식에서 추출
  const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) {
    throw new Error("Invalid data URL format");
  }

  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, "base64");

  return { buffer, mimeType };
}

/**
 * 테스트 썸네일 이미지를 Supabase Storage에 업로드
 * @param testId - 테스트 ID
 * @param dataUrl - base64 인코딩된 이미지 데이터 URL
 * @returns publicUrl - 업로드된 이미지의 공개 URL
 */
export async function uploadThumbnailImageToSupabase(
  testId: number,
  dataUrl: string
): Promise<string> {
  try {
    const { buffer, mimeType } = base64ToBuffer(dataUrl);
    
    // MIME 타입에서 확장자 추출
    const extension = mimeType.split("/")[1] || "png";
    const fileName = `thumbnail.${extension}`;
    const uploadPath = `test-thumbnails/${testId}/${Date.now()}-${fileName}`;

    // Supabase Storage에 업로드
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("thumbnail-image")
      .upload(uploadPath, buffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (uploadError || !uploadData) {
      throw uploadError || new Error("썸네일 이미지 업로드 실패");
    }

    // public URL 조회
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("thumbnail-image").getPublicUrl(uploadData.path);

    if (!publicUrl) {
      throw new Error("공개 이미지 URL을 가져올 수 없습니다");
    }

    // tests 테이블에 이미지 URL 업데이트
    const { error: updateError } = await supabaseAdmin
      .from("tests")
      .update({ thumbnail_url: publicUrl })
      .eq("id", testId);

    if (updateError) {
      throw updateError;
    }

    console.log(`✅ 썸네일 이미지 업로드 완료: ${publicUrl}`);
    return publicUrl;
  } catch (error: any) {
    console.error("❌ 썸네일 이미지 업로드 실패:", error);
    throw error;
  }
}

/**
 * 결과 이미지를 Supabase Storage에 업로드
 * @param resultId - 결과 ID
 * @param dataUrl - base64 인코딩된 이미지 데이터 URL
 * @returns publicUrl - 업로드된 이미지의 공개 URL
 */
export async function uploadResultImageToSupabase(
  resultId: number,
  dataUrl: string
): Promise<string> {
  try {
    const { buffer, mimeType } = base64ToBuffer(dataUrl);
    
    // MIME 타입에서 확장자 추출
    const extension = mimeType.split("/")[1] || "png";
    const fileName = `result.${extension}`;
    const uploadPath = `${resultId}/${Date.now()}-${fileName}`;

    // Supabase Storage에 업로드
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("result-images")
      .upload(uploadPath, buffer, {
        contentType: mimeType,
        cacheControl: "3600", // CDN 캐싱 설정 (1시간)
        upsert: true,
      });

    if (uploadError || !uploadData) {
      throw uploadError || new Error("결과 이미지 업로드 실패");
    }

    // public URL 조회
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("result-images").getPublicUrl(uploadData.path);

    if (!publicUrl) {
      throw new Error("공개 이미지 URL을 가져올 수 없습니다");
    }

    // results 테이블에 이미지 URL 업데이트
    const { error: updateError } = await supabaseAdmin
      .from("results")
      .update({ result_image_url: publicUrl })
      .eq("id", resultId);

    if (updateError) {
      throw updateError;
    }

    console.log(`✅ 결과 이미지 업로드 완료: ${publicUrl}`);
    return publicUrl;
  } catch (error: any) {
    console.error("❌ 결과 이미지 업로드 실패:", error);
    throw error;
  }
}

