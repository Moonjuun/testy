// app/category/[id]/page.tsx
import { CategoryTestList } from "./category-test-list";
import { createClient } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { id: string; locale: string };
}) {
  const { id, locale } = params;
  const supabase = createClient();

  const { data } = await supabase
    .from("categories")
    .select("name_ko, name_en, name_ja, name_vi")
    .eq("code", id)
    .maybeSingle();

  const name =
    locale === "en"
      ? data?.name_en
      : locale === "ja"
      ? data?.name_ja
      : locale === "vi"
      ? data?.name_vi
      : data?.name_ko ?? id;

  return {
    title: `${name} 테스트 모음 | Testy`,
    description: `${name} 관련 심리 테스트, 성향 테스트를 한 곳에 모아봤어요.`,
    alternates: {
      canonical: `https://testy.im/${locale}/category/${id}`,
      languages: {
        "ko-KR": `https://testy.im/ko/category/${id}`,
        "en-US": `https://testy.im/en/category/${id}`,
        "ja-JP": `https://testy.im/ja/category/${id}`,
        "vi-VN": `https://testy.im/vi/category/${id}`,
      },
    },
  };
}

interface CategoryPageProps {
  params: {
    id: string; // 카테고리 코드
  };
}

/**
 * 이 페이지는 이제 매우 단순한 서버 컴포넌트입니다.
 * 주된 역할은 동적 라우트 파라미터(params.id)를 클라이언트 컴포넌트에 전달하고,
 * 데이터 로딩 및 상호작용을 처리할 클라이언트 컴포넌트를 렌더링하는 것입니다.
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  // params가 Promise-like 객체일 수 있으므로 await하여 안전하게 id에 접근합니다.
  const resolvedParams = await params;

  // 카테고리 ID를 클라이언트 컴포넌트에 prop으로 전달합니다.
  return <CategoryTestList categoryId={resolvedParams.id} />;
}
