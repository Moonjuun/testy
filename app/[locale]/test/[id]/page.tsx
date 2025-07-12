// api/test/[id].page.tsx
import { createClient } from "@/lib/supabase/client";
import TestView from "@/components/test/TestView";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

// generateMetadata도 새로운 구조에 맞게 수정합니다.
export async function generateMetadata({
  params,
}: {
  params: { id: string; locale: string };
}): Promise<Metadata> {
  const { id, locale } = await params;
  const url = `https://testy.im/${locale}/test/${id}`;

  return {
    alternates: {
      canonical: url,
    },
  };
}

// 2. 페이지 컴포넌트의 props 시그니처를 수정합니다.
export default async function TestPage({
  params,
}: {
  params: { id: string; locale: string }; // searchParams는 더 이상 필요 없습니다.
}) {
  const { id, locale } = await params; // 경로에서 id와 locale을 직접 받습니다.

  // 3. 서버 전용 클라이언트를 사용합니다.
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_test_data", {
    test_id_param: Number(id),
    language_param: locale, // 경로에서 받은 locale을 사용합니다.
  });

  if (error || !data?.questions || !data?.results) {
    console.error("Supabase 데이터 로딩 에러:", error);
    notFound();
  }

  return <TestView initialTestData={data} testId={id} locale={locale} />;
}
