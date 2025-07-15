// lib/supabase/getRandomLunchMenu.ts 또는 유사한 파일에 추가

import { createClient } from "./client";
import { LunchMenuItem } from "@/constants/play/lunch-constants";

/**
 * 선택된 카테고리에 맞는 점심 메뉴를 무작위로 하나 가져옵니다.
 * @param categories 선택된 카테고리 (who, cuisine, mealType)
 * @param language 표시할 언어 코드 (기본값: 'ko')
 * @returns 추천 메뉴 또는 null
 */
export async function getRandomLunchMenu(
  categories: { who: string; cuisine: string; mealType: string },
  language: "ko" | "en" | "ja" | "vi" = "ko"
): Promise<LunchMenuItem | null> {
  const supabase = createClient();

  // 1단계에서 만든 데이터베이스 함수(RPC)를 호출합니다.
  const { data, error } = await supabase.rpc("get_random_lunch_menu", {
    p_who: categories.who,
    p_cuisine: categories.cuisine,
    p_meal_type: categories.mealType,
  });

  if (error) {
    console.error("Error fetching random lunch menu:", error);
    return null;
  }

  // rpc 호출 결과는 배열이므로 첫 번째 요소를 확인합니다.
  if (!data || data.length === 0) {
    return null; // 조건에 맞는 메뉴가 없음
  }

  const menu = data[0];
  const nameKey = `name_translations`;
  const descriptionKey = `description_translations`;

  // Supabase에서 받은 데이터를 LunchMenuItem 형태로 변환합니다.
  return {
    id: menu.id,
    // JSONB 필드에서 해당 언어의 값을 추출합니다. 없으면 한국어 값을 기본으로 사용합니다.
    name: menu[nameKey]?.[language] || menu[nameKey]?.["ko"] || "이름 없음",
    description:
      menu[descriptionKey]?.[language] || menu[descriptionKey]?.["ko"] || "",
    image: menu.image_url,
    // categories 필드는 UI 표시에 직접 사용되지 않으므로 비워두거나 필요시 채울 수 있습니다.
    categories: {
      who: [],
      cuisine: [],
      mealType: [],
    },
  };
}
