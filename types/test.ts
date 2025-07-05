// types/test.ts 또는 types.ts

export interface TestOption {
  text: string;
  score: number;
}

export interface TestQuestion {
  question: string;
  options: TestOption[];
}

// 📛 이름 변경: TestResult -> TestResultItem
export interface TestResultItem {
  title: string;
  description: string;
  recommendation: string;
  image_prompt: string;
  score_range: [number, number];
}

export interface TestData {
  title: string;
  description: string;
  questions: TestQuestion[];
  results: TestResultItem[]; // ✅ 이름 변경된 타입 적용
}

// --- 테스트 관련 타입 ---

export interface TestCard {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  category: string;
}

export interface NewTest {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  is_visible: boolean;
  created_at: string;
  category: {
    code: string;
    name: string;
  } | null;
  // ... 기타 속성
}

export interface TestCardProps {
  test: NewTest;
  featured?: boolean;
}

// --- 결과 및 업로드 관련 타입 (정리 및 통합) ---

/** DB에서 불러온, 번역이 적용된 최종 결과 데이터 타입 */
// ✨ TranslatedResult를 통합하고 result_image_url을 옵셔널로 변경
export interface TestResult {
  id: string;
  test_id: string;
  test_name: string;
  result_title: string;
  result_image_url?: string | null; // 이미지가 있을 수도, 없을 수도 있음
  image_prompt: string;
}

/** 테스트 썸네일 업로드 시 사용되는 데이터 타입 */
export interface TestForUpload {
  id: string;
  title: string;
  thumbnail_url: string | null;
}
