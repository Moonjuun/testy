// lib/supabase/mbti/getMbtiTest.ts
import { createClient } from "../client"; // 서버용 클라이언트 사용

// MbtiQuestion 타입을 정의하여 반환 값의 타입을 명확히 합니다.
interface MbtiQuestion {
  id: number;
  text: string;
  dimension: "EI" | "SN" | "TF" | "JP";
  direction: "I" | "N" | "F" | "P";
}

export async function getMbtiTest(test_code: string, locale: string) {
  const supabase = createClient();

  // 1. 테스트 정보를 다국어로 하드코딩합니다.
  const testInfoByLocale = {
    ko: {
      title: "MBTI 성격 유형 검사",
      description: "100개의 질문을 통해 당신의 성격 유형을 알아보세요.",
    },
    en: {
      title: "MBTI Personality Test",
      description: "Find out your personality type through 100 questions.",
    },
    ja: {
      title: "MBTI性格診断テスト",
      description: "100の質問を通じてあなたの性格タイプを調べてみましょう。",
    },
    vi: {
      title: "Bài kiểm tra tính cách MBTI",
      description: "Tìm hiểu loại tính cách của bạn qua 100 câu hỏi.",
    },
  };

  const translatedInfo =
    testInfoByLocale[locale as keyof typeof testInfoByLocale] ??
    testInfoByLocale.en;

  const testInfo = {
    ...translatedInfo,
    thumbnail_url:
      "https://xxlvfknsbwfjyzdlucyz.supabase.co/storage/v1/object/public/thumbnail-image/test-thumbnails/mbti/3.png",
  };

  // 2. mbti_questions 테이블에서 질문 목록을 가져옵니다.
  const { data: rawQuestions, error: questionsError } = await supabase
    .from("mbti_questions")
    .select(
      `
      id,
      text, 
      dimension,
      direction
    `
    )
    .eq("test_code", test_code) // 파라미터로 받은 test_code를 사용
    .order("order", { ascending: true });

  if (questionsError || !rawQuestions) {
    console.error("MBTI 질문 데이터 로딩 에러:", questionsError);
    return null;
  }

  // 3. 가져온 데이터를 MbtiQuestion[] 타입에 맞게 가공합니다.
  const questions: MbtiQuestion[] = rawQuestions.map((q: any) => ({
    id: q.id,
    // 사용자의 언어를 우선 사용하고, 없으면 한국어로 대체(fallback)합니다.
    text: q.text[locale] || q.text["ko"],
    dimension: q.dimension,
    direction: q.direction,
  }));

  // 최종적으로 조합된 데이터를 반환합니다.
  return {
    testInfo,
    questions,
    testCode: test_code, // 파라미터로 받은 test_code를 그대로 반환
  };
}
