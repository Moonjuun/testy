// lib/supabase/getTarotCardsByIds.ts

import { createClient } from "../client";
import { TarotCard } from "@/types/tarot/tarot";

type MeaningType = "free" | "paid";

export async function getTarotCardsByIds(
  cardIds: number[],
  language: "ko" | "en" | "ja" | "vi" = "en", // 기본값을 "ko"로 설정
  meaningType: MeaningType = "free"
): Promise<TarotCard[]> {
  const supabase = createClient();

  // ✅ 쿼리 최적화: `select` 구문에서 특정 언어의 텍스트만 가져옵니다.
  const { data, error } = await supabase
    .from("tarot_cards")
    .select(
      `
      id,
      card_number,
      card_key,
      arcana_type,
      suit,
      image_url,
      keyword_translations,
      name:name_translations->>${language},
      meaning:meaning_translations->${language}->>${meaningType},
      description:description_translations->${language}->>${meaningType}
    `
    )
    .in("id", cardIds);

  if (error || !data) {
    console.error(
      "Error fetching tarot cards by IDs:",
      JSON.stringify(error, null, 2)
    );

    return [];
  }

  // ✅ 반환되는 데이터가 이미 필터링되었으므로, 매핑 로직이 간결해집니다.
  return data.map((card: any) => ({
    id: card.id,
    cardNumber: card.card_number,
    cardKey: card.card_key,
    arcanaType: card.arcana_type,
    suit: card.suit,
    imageUrl: card.image_url,
    name: card.name,
    meaning: card.meaning || "", // 값이 없을 경우를 대비해 빈 문자열로 대체
    description: card.description || "", // 값이 없을 경우를 대비해 빈 문자열로 대체
    // keyword는 객체이므로 기존 방식 그대로 유지
    keyword: card.keyword?.[language] || [],
  }));
}
