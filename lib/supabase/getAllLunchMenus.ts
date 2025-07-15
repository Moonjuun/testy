// lib/supabase/getAllLunchMenus.ts

import { createClient } from "./client";
import { LunchMenuItem } from "@/constants/play/lunch-constants";

/**
 * 전체 점심 메뉴를 가져와 언어별 이름과 설명으로 변환합니다.
 * @param language 표시할 언어 코드 (기본: 'ko')
 */
export async function getAllLunchMenus(
  language: "ko" | "en" | "ja" | "vi" = "en"
): Promise<LunchMenuItem[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lunch_menu")
    .select(
      "id, name_translations, description_translations, image_url, category_who, category_cuisine, category_meal_type"
    );

  if (error) {
    console.error("Error fetching all lunch menus:", error);
    return [];
  }

  return (data || []).map((menu) => ({
    id: menu.id,
    name:
      menu.name_translations?.[language] ||
      menu.name_translations?.["ko"] ||
      "이름 없음",
    description:
      menu.description_translations?.[language] ||
      menu.description_translations?.["ko"] ||
      "",
    image: menu.image_url,
    categories: {
      who: menu.category_who || [],
      cuisine: menu.category_cuisine || [],
      mealType: menu.category_meal_type || [],
    },
  }));
}
