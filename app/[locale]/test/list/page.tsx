// app/test/list/page.tsx
import { TestListClient } from "./test-list-client";

export function generateMetadata() {
  return {
    title: "테스트 전체 목록 | Testy",
    description:
      "모든 성향 테스트를 한 곳에서 확인하세요. 연애, 성격, 심리 테스트까지!",
    alternates: {
      canonical: "https://testy.im/test/list",
    },
  };
}

/**
 * 이 페이지는 이제 매우 단순한 서버 컴포넌트입니다.
 * 주된 역할은 데이터 로딩 및 상호작용을 처리할
 * 클라이언트 컴포넌트를 렌더링하는 것입니다.
 */
export default function TestsListPage() {
  return <TestListClient />;
}
