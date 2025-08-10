// lib/supabase/mbti/getMbtiResult.ts
import { createClient } from "../client";

// Supabase에서 반환되는 원시 데이터 타입 (이미 JSON 객체로 파싱됨)
interface RawMbtiTypeInfo {
  title: { [key: string]: string };
  description: { [key: string]: string };
  keywords: { [key: string]: string[] };
  compatibility: {
    best: { type: string; comment?: { [key: string]: string } };
    worst: { type: string; comment?: { [key: string]: string } };
  };
  strengths: { [key: string]: string[] };
  weaknesses: { [key: string]: string[] };
  career_paths: { [key: string]: string[] };
  dating_style: { [key: string]: string };
  recommended_items: { [key: string]: string[] }; // ✅ recommended_items 타입 추가
}

// 최종적으로 가공될 데이터 타입
export interface MbtiTypeInfo {
  title: string;
  description: string;
  keywords: string[];
  compatibility: {
    best: { type: string; comment: string };
    worst: { type: string; comment: string };
  };
  strengths: string[];
  weaknesses: string[];
  career_paths: string[];
  dating_style: string;
  recommended_items: string[]; // ✅ recommended_items 타입 추가
}

export async function getMbtiResult(
  testCode: string,
  mbtiType: string,
  locale: string
): Promise<MbtiTypeInfo | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("mbti_types")
    .select(
      `
      title,
      description,
      keywords,
      compatibility,
      strengths,
      weaknesses,
      career_paths,
      dating_style,
      recommended_items 
    `
    )
    .eq("test_code", testCode)
    .eq("type", mbtiType)
    .single<RawMbtiTypeInfo>();

  if (error || !data) {
    console.error("MBTI 유형 정보 로딩 에러:", error);
    return null;
  }

  try {
    // Supabase가 이미 JSON으로 파싱했으므로 JSON.parse()를 제거합니다.
    const {
      title,
      description,
      keywords,
      compatibility,
      strengths,
      weaknesses,
      career_paths,
      dating_style,
      recommended_items, // ✅ recommended_items 추가
    } = data;

    // 파싱된 객체를 사용하여 데이터를 안전하게 가공합니다.
    const processedData: MbtiTypeInfo = {
      title: title[locale] ?? title["en"],
      description: description[locale] ?? description["en"],
      keywords: keywords[locale] ?? keywords["en"],
      compatibility: {
        best: {
          type: compatibility.best.type,
          comment:
            compatibility.best.comment?.[locale] ??
            compatibility.best.comment?.["en"] ??
            "",
        },
        worst: {
          type: compatibility.worst.type,
          comment:
            compatibility.worst.comment?.[locale] ??
            compatibility.worst.comment?.["en"] ??
            "",
        },
      },
      strengths: strengths[locale] ?? strengths["en"],
      weaknesses: weaknesses[locale] ?? weaknesses["en"],
      career_paths: career_paths[locale] ?? career_paths["en"],
      dating_style: dating_style[locale] ?? dating_style["en"],
      recommended_items: recommended_items[locale] ?? recommended_items["en"], // ✅ recommended_items 추가
    };

    return processedData;
  } catch (processError) {
    console.error("MBTI 결과 데이터 가공 에러:", processError);
    return null;
  }
}
