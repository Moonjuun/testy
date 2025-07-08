// api/test/[id].page.tsx
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import TestView from "@/components/test/TestView";
import type { TestData } from "@/types/test";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const url = `https://testy.im/test/${id}`;

  return {
    alternates: {
      canonical: url,
      languages: {
        ko: url,
        en: url,
        ja: url,
        vi: url,
      },
    },
  };
}

export default async function TestPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params; // params 비동기 처리
  const resolvedSearchParams = await searchParams; // searchParams 비동기 처리
  const language =
    resolvedSearchParams.lang && typeof resolvedSearchParams.lang === "string"
      ? resolvedSearchParams.lang
      : "ko";

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.rpc("get_test_data", {
    test_id_param: Number(id),
    language_param: language,
  });

  if (error || !data?.questions || !data?.results) {
    console.error("에러:", error);
    notFound();
  }

  return (
    <TestView
      initialTestData={data as TestData}
      testId={id}
      language={language}
    />
  );
}
