// app/category/[id]/page.tsx
import { CategoryTestList } from "./category-test-list";

export const dynamic = "force-dynamic";

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
