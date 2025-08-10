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
  const url = `https://your-domain.com/${locale}/mbti`; // TODO: 실제 도메인 주소로 변경해주세요.

  const metadataByLocale = {
    ko: {
      title: `MBTI 성격 유형 검사 | Testy`,
      description: `100개의 질문으로 알아보는 나의 진짜 성격 유형!`,
    },
    en: {
      title: `MBTI Personality Test | Testy`,
      description: `Find out your true personality type with 100 questions!`,
    },
    ja: {
      title: `MBTI性格診断テスト | Testy`,
      description: `100の質問でわかる、あなたの本当の性格タイプ！`,
    },
    vi: {
      title: `Bài kiểm tra tính cách MBTI | Testy`,
      description: `Tìm ra loại tính cách thực sự của bạn với 100 câu hỏi!`,
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
