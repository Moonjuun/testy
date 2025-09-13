import { createClient } from "../client";
import { TarotCard } from "@/types/tarot/tarot";

type MeaningType = "free" | "paid";

export async function getTarotCardsByIds(
  cardIds: number[],
  language: "ko" | "en" | "ja" | "vi" = "ko",
  meaningType: MeaningType = "free" // 기본값 'free'로 설정
): Promise<TarotCard[]> {
  const supabase = createClient();

  // meaningType에 따라 동적으로 컬럼 이름을 생성합니다.
  const meaningCol = `${meaningType}_meaning_translations`;
  const descriptionCol = `${meaningType}_description_translations`;
  const adviceCol = `${meaningType}_advice_translations`;

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
      meaning:${meaningCol}->>${language},
      description:${descriptionCol}->>${language},
      advice:${adviceCol}->>${language}
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

  return data.map((card: any) => ({
    id: card.id,
    cardNumber: card.card_number,
    cardKey: card.card_key,
    arcanaType: card.arcana_type,
    suit: card.suit,
    imageUrl: card.image_url,
    name: card.name,
    meaning: card.meaning || "",
    description: card.description || "",
    // ✅ 'keyword_translations'에서 현재 언어에 맞는 키워드를 추출합니다.
    keyword: card.keyword_translations?.[language] || [],
    // ✅ 새로 추가된 'advice' 필드를 매핑합니다.
    advice: card.advice || "",
  }));
}
