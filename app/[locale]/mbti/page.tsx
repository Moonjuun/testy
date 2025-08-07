// app/mbti/[id]/page.tsx

import TestViewMbti from "./TestViewMbti";
import type { Metadata } from "next";
import { mbtiTestData } from "@/constants/test/mbti";
import { notFound } from "next/navigation";

// 1. generateMetadata: MBTI 테스트에 맞게 메타데이터를 수정합니다.
export async function generateMetadata({
  params,
}: {
  params: { id: string; locale: string };
}): Promise<Metadata> {
  const { id, locale } = await params;
  const url = `https://testy.im/${locale}/mbti/${id}`;

  const metadataByLocale = {
    ko: {
      title: `MBTI 성격 유형 검사 | Testy`,
      description: `100개의 질문으로 알아보는 나의 진짜 성격 유형! Testy에서 MBTI를 확인해보세요.`,
    },
    en: {
      title: `MBTI Personality Test | Testy`,
      description: `Find out your true personality type with 100 questions! Check your MBTI on Testy.`,
    },
    ja: {
      title: `MBTI性格診断テスト | Testy`,
      description: `100の質問でわかる、あなたの本当の性格タイプ！TestyでMBTIを確認してみましょう。`,
    },
    vi: {
      title: `Bài kiểm tra tính cách MBTI | Testy`,
      description: `Tìm ra loại tính cách thực sự của bạn với 100 câu hỏi! Kiểm tra MBTI của bạn trên Testy.`,
    },
  };

  const meta =
    metadataByLocale[locale as keyof typeof metadataByLocale] ??
    metadataByLocale.en;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: url,
      languages: {
        "ko-KR": `https://testy.im/ko/mbti/${id}`,
        "en-US": `https://testy.im/en/mbti/${id}`,
        "ja-JP": `https://testy.im/ja/mbti/${id}`,
        "vi-VN": `https://testy.im/vi/mbti/${id}`,
      },
    },
  };
}

// 2. 페이지 컴포넌트: 정적 MBTI 데이터를 TestViewMbti 컴포넌트로 전달합니다.
export default async function MbtiTestPage({
  params,
}: {
  params: { id: string; locale: string };
}) {
  const { id, locale } = await params;

  // DB 호출 대신, 미리 정의된 MBTI 질문 데이터를 사용합니다.
  // 이 데이터는 lib/mbti-data.ts 와 같은 파일에 분리하여 관리하는 것이 좋습니다.
  const testData = mbtiTestData;

  if (!testData || !testData.questions) {
    // 데이터가 없는 경우 404 페이지를 표시합니다.
    console.error("MBTI test data could not be loaded.");
    return notFound();
  }

  return (
    <TestViewMbti initialTestData={testData} testId={id} locale={locale} />
  );
}
