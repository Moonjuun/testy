// app/[locale]/mbti/page.tsx

import TestViewMbti from "./TestViewMbti";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMbtiTest } from "@/lib/supabase/mbti/getMbtiTest"; // 데이터 호출 함수 import

export const dynamic = "force-dynamic";

// 1. generateMetadata: 하드코딩된 메타데이터를 사용합니다.
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = await params;
  const url = `https://testy.im/${locale}/mbti`;

  const metadataByLocale = {
    ko: {
      title: "MBTI 성격 유형 검사 - 나의 진짜 성향은? | Testy",
      description:
        "100개의 질문으로 알아보는 16가지 성격 유형! Testy에서 무료 MBTI 성향 테스트를 통해 숨겨진 나의 모습을 발견해보세요.",
      ogTitle: "MBTI 성격 유형 검사 | Testy",
      ogDescription:
        "과연 나의 진짜 성격 유형은 무엇일까요? 지금 바로 확인해보세요!",
    },
    en: {
      title: "MBTI Personality Test - What's My True Type? | Testy",
      description:
        "Discover your hidden self with our 16 personality types test based on 100 questions. Find your type on Testy for free!",
      ogTitle: "MBTI Personality Test | Testy",
      ogDescription: "What is your true personality type? Find out now!",
    },
    ja: {
      title: "MBTI性格診断 - 私の本当のタイプは？ | Testy",
      description:
        "100の質問でわかる16タイプの性格診断！Testyで無料のMBTI傾向テストを通じて、隠れた自分を発見しましょう。",
      ogTitle: "MBTI性格診断 | Testy",
      ogDescription:
        "果たして私の本当の性格タイプは何でしょう？今すぐチェック！",
    },
    vi: {
      title:
        "Bài kiểm tra tính cách MBTI - Loại tính cách thực sự của tôi là gì? | Testy",
      description:
        "Khám phá bản thân ẩn giấu của bạn với bài kiểm tra 16 loại tính cách dựa trên 100 câu hỏi. Tìm loại của bạn trên Testy miễn phí!",
      ogTitle: "Bài kiểm tra tính cách MBTI | Testy",
      ogDescription: "Loại tính cách thực sự của bạn là gì? Tìm hiểu ngay!",
    },
  };

  const meta =
    metadataByLocale[locale as keyof typeof metadataByLocale] ??
    metadataByLocale.ko;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: url,
      languages: {
        "ko-KR": `${url.replace(locale, "ko")}`,
        "en-US": `${url.replace(locale, "en")}`,
        "ja-JP": `${url.replace(locale, "ja")}`,
        "vi-VN": `${url.replace(locale, "vi")}`,
      },
    },
  };
}

// 2. 페이지 컴포넌트: getMbtiTest 함수를 사용하여 'original_v1' 테스트 데이터를 가져옵니다.
export default async function MbtiTestPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;
  const testCode = "original_v1"; // 테스트 코드를 고정값으로 사용

  // 분리된 함수를 호출하여 테스트 데이터를 한번에 가져옵니다.
  const testData = await getMbtiTest(testCode, locale);

  // testData가 null이면 404 페이지를 보여줍니다.
  if (!testData) {
    notFound();
  }

  const { testInfo, questions } = testData;

  return (
    <TestViewMbti
      initialTestData={{ ...testInfo, questions }}
      testCode={testCode}
      locale={locale}
    />
  );
}
