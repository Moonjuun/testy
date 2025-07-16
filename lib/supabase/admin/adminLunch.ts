// lib/supabase/adminLunch.ts
import type { LunchMenu } from "@/types/test";
import { createClient } from "../client";

const supabase = createClient();

/**
 * 이미지가 '없는' 점심 메뉴 목록을 불러옵니다.
 */
export async function loadLunchMenusWithoutImages(): Promise<LunchMenu[]> {
  const { data, error } = await supabase
    .from("lunch_menu")
    .select("id, name_translations, image_url")
    .is("image_url", null)
    .order("id", { ascending: false });

  if (error) throw error;
  if (!data) return [];

  return data.map((menu: any) => ({
    id: menu.id,
    name: menu.name_translations?.ko || "이름 없음", // 한국어 이름 우선
    image_url: menu.image_url,
  }));
}

/**
 * ✅ 이미지가 '있는' 점심 메뉴 목록을 불러옵니다. (새로 추가)
 */
export async function loadLunchMenusWithImages(): Promise<LunchMenu[]> {
  const { data, error } = await supabase
    .from("lunch_menu")
    .select("id, name_translations, image_url")
    .not("image_url", "is", null)
    .order("id", { ascending: false });

  if (error) throw error;
  if (!data) return [];

  return data.map((menu: any) => ({
    id: menu.id,
    name: menu.name_translations?.ko || "이름 없음",
    image_url: menu.image_url,
  }));
}

/**
 * 점심 메뉴 이미지를 업로드하고 lunch_menu 테이블의 image_url을 업데이트합니다.
 */
export async function uploadLunchImageToSupabase(
  menuId: number,
  file: File
): Promise<string> {
  const uploadPath = `lunch-images/${menuId}/${Date.now()}-${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("lunch-image")
    .upload(uploadPath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("lunch-image").getPublicUrl(uploadData.path);

  if (!publicUrl) throw new Error("Public URL을 가져올 수 없습니다.");

  const { error: updateError } = await supabase
    .from("lunch_menu")
    .update({ image_url: publicUrl })
    .eq("id", menuId);

  if (updateError) throw updateError;

  return publicUrl;
}
