// app/test/[id]/page.tsx
import { createClient } from "@/lib/supabase/client";
import TestView from "@/components/test/TestView";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";
import { getTestMetadata } from "@/lib/supabase/test/getTestMetadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { id: string; locale: string };
}): Promise<Metadata> {
  const { id, locale } = params; // await 제거 (params는 이미 프로미스가 아님)
  const origin = absoluteUrl();
  const url = `${origin}/${locale}/test/${id}`; // absoluteUrl을 사용하여 전체 URL 생성

  // 1. Supabase에서 해당 테스트의 메타데이터 가져오기
  const testId = Number(id);
  const fetchedMetadata = await getTestMetadata(testId, locale);

  let title = `테스트 결과 보기 | Testy`;
  let description = `흥미로운 심리 테스트 결과를 확인해보세요.`;

  // 가져온 메타데이터가 있다면 사용
  if (fetchedMetadata) {
    title = `${fetchedMetadata.title} | Testy`;
    description = fetchedMetadata.description;
  } else {
    // 특정 locale에 대한 메타데이터가 없을 경우, 기본값 또는 fallback locale 사용
    const metadataByLocale = {
      ko: {
        title: `테스트 결과 보기 | Testy`,
        description: `흥미로운 심리 테스트 결과를 확인해보세요.`,
      },
      en: {
        title: `View Your Test Result | Testy`,
        description: `Check out your personality or psychological test result.`,
      },
      ja: {
        title: `テスト結果を見る | Testy`,
        description: `面白い心理テストの結果をチェックしよう。`,
      },
      vi: {
        title: `Xem kết quả bài kiểm tra | Testy`,
        description: `Khám phá kết quả bài kiểm tra tâm lý thú vị của bạn.`,
      },
    };
    const meta =
      metadataByLocale[locale as keyof typeof metadataByLocale] ??
      metadataByLocale.en; // 기본 fallback을 'en'으로 설정
    title = meta.title;
    description = meta.description;
  }

  return {
    title: title,
    description: description,
    alternates: {
      canonical: url,
      languages: {
        ko: `${origin}/ko/test/${id}`,
        en: `${origin}/en/test/${id}`,
        ja: `${origin}/ja/test/${id}`,
        vi: `${origin}/vi/test/${id}`,
        "x-default": `${origin}/en/test/${id}`, // x-default는 일반적으로 가장 일반적인 언어 버전으로 설정
      },
    },
    // 스키마 마크업 (JSON-LD) 추가 예시
    // test_translations 테이블에서 직접 가져온 정보만으로 간단한 Article 스키마를 구성할 수 있습니다.
    // 더 복잡한 스키마(예: Quiz, Question)는 `TestView` 컴포넌트 내부에서 `initialTestData`를 사용하여 구성하는 것이 좋습니다.
    openGraph: {
      title: title,
      description: description,
      url: url,
      type: "article", // 또는 "website", "quiz" 등 적절한 타입
      images: [
        {
          url: `${origin}/og-image.png`, // 기본 OG 이미지 또는 테스트별 이미지
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [`${origin}/twitter-image.png`], // 트위터 카드 이미지
    },
  };
}

export default async function TestPage({
  params,
}: {
  params: { id: string; locale: string };
}) {
  const { id, locale } = params;

  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_test_data", {
    test_id_param: Number(id),
    language_param: locale,
  });

  if (error || !data?.questions || !data?.results) {
    console.error("Supabase 데이터 로딩 에러:", error);
    notFound();
  }

  return <TestView initialTestData={data} testId={id} locale={locale} />;
}
