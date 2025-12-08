// app/[locale]/tarot/[type]/results/page.tsx
import React from "react";
import ResultTarotClient from "@/components/taro/ResultTarotClient";
import { getTarotCardsByIds } from "@/lib/supabase/tarot/getTarotCardsByIds";
import { TarotCard } from "@/types/tarot/tarot";

// (선택) 이 페이지는 항상 최신 데이터로 렌더링
export const dynamic = "force-dynamic";

type CardSpread = "single" | "three" | "five";

function parseCardsParam(cardsParam?: string | string[]): number[] {
  if (!cardsParam) return [];
  const raw = Array.isArray(cardsParam) ? cardsParam[0] : cardsParam;
  return raw
    .split(",")
    .map((v) => parseInt(v.trim(), 10))
    .filter((n) => Number.isFinite(n));
}

function parseSpreadParam(spreadParam?: string | string[]): CardSpread {
  const raw =
    (Array.isArray(spreadParam) ? spreadParam[0] : spreadParam) ?? "single";
  if (raw === "three" || raw === "five") return raw;
  return "single";
}

export default async function ResultTarotPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale?: string; type?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // ⚠️ Next.js 16: params와 searchParams는 Promise이므로 await 필수
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const localeParam = (resolvedParams?.locale ?? "ko") as string;
  const validLocales = ["en", "ko", "ja", "vi"] as const;
  const validLocale = (
    validLocales.includes(localeParam as any) ? localeParam : "en"
  ) as "en" | "ko" | "ja" | "vi";

  // ✅ 카드 id와 스프레드는 쿼리스트링으로 받는 예시 (?cards=1,2,3&spread=three)
  const drawnCards = parseCardsParam(resolvedSearchParams?.cards);
  const selectedSpread = parseSpreadParam(resolvedSearchParams?.spread);

  // 서버에서 카드 데이터 가져오기 (클라이언트에서는 fetch 없음)
  let fetchedCards: TarotCard[] = [];
  if (drawnCards.length > 0) {
    fetchedCards = await getTarotCardsByIds(drawnCards, validLocale, "paid");
  }

  // const positions = spreadPositions[selectedSpread];

  return (
    <ResultTarotClient
      fetchedCards={fetchedCards}
      spreadType={selectedSpread}
      locale={validLocale}
    />
  );
}
