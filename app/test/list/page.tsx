// app/test/list/page.tsx
import { TestListClient } from "./test-list-client";

/**
 * 이 페이지는 이제 매우 단순한 서버 컴포넌트입니다.
 * 주된 역할은 데이터 로딩 및 상호작용을 처리할
 * 클라이언트 컴포넌트를 렌더링하는 것입니다.
 */
export default function TestsListPage() {
  return <TestListClient />;
}
