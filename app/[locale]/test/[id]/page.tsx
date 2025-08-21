// app/test/[id]/page.tsx
import { createClient } from "@/lib/supabase/client";
import TestView from "@/components/test/TestView";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";

// Next.js가 페이지와 메타데이터 함수 간의 동일한 데이터 요청을 자동으로 캐싱(deduping)하므로,
// 두 함수에서 동일한 RPC를 호출해도 성능 저하는 거의 없습니다.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { id: string; locale: string };
}): Promise<Metadata> {
  const { id, locale } = await params;
  const origin = absoluteUrl();
  const url = `${origin}/${locale}/test/${id}`;
  const testId = Number(id);

  // 1. 메타데이터 생성을 위해 테스트 데이터 직접 호출
  const supabase = createClient();
  const { data: testData, error } = await supabase.rpc("get_test_data", {
    test_id_param: testId,
    language_param: locale,
  });

  let title = `테스트 결과 보기 | Testy`;
  let description = `흥미로운 심리 테스트 결과를 확인해보세요.`;
  // thumnail_img_url이 없을 경우를 대비한 기본 이미지
  let imageUrl = `${origin}/og-image-${locale}.png`;

  // 2. 데이터가 성공적으로 로드되면 해당 값으로 메타데이터 설정
  if (testData && !error) {
    title = `${testData.title} | Testy`;
    description = testData.description;
    // thumnail_img_url이 존재할 경우에만 해당 URL 사용
    if (testData.thumbnail_url) {
      imageUrl = testData.thumbnail_url;
    }
  } else {
    // 3. 데이터 로드 실패 시, 기존의 언어별 폴백 로직 사용
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
      metadataByLocale.en;
    title = meta.title;
    description = meta.description;
  }

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ko: `${origin}/ko/test/${id}`,
        en: `${origin}/en/test/${id}`,
        ja: `${origin}/ja/test/${id}`,
        vi: `${origin}/vi/test/${id}`,
        "x-default": `${origin}/en/test/${id}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [
        {
          url: imageUrl,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

// 페이지 컴포넌트는 변경할 필요가 없습니다.
export default async function TestPage({
  params,
}: {
  params: { id: string; locale: string };
}) {
  const { id, locale } = await params;

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
