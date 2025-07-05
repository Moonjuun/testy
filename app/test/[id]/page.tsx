import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import TestView from "@/components/test/TestView";
import type { TestData } from "@/types/test";

export const dynamic = "force-dynamic";

export default async function TestPage(props: { params: { id: string } }) {
  // props.params를 await으로 처리하여 id를 가져옵니다.
  const { id } = await props.params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.rpc("get_test_data", {
    test_id_param: Number(id),
    language_param: "ko",
  });

  if (error || !data?.questions || !data?.results) {
    console.error("에러:", error);
    notFound();
  }

  return <TestView initialTestData={data as TestData} testId={id} />;
}
