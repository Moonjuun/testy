// types/types.ts

export interface TestOption {
  text: string;
  score: number;
}

export interface TestQuestion {
  question: string;
  options: TestOption[];
}

export interface TestRecommendation {
  matching_type: string;
  suggested_actions: string;
  items: string[];
  short_description: string;
}

export interface TestResultItem {
  test_id: string;
  test_title: string;
  category: string;
  result_id: number;
  title: string;
  description: string;
  recommendation: TestRecommendation;
  keywords: string[];
  image_prompt: string;
  score_range: [number, number];
  result_image_url?: string | null;
}

export interface TestData {
  title: string;
  thumbnail_url: string;
  description: string;
  category: string;
  questions: TestQuestion[];
  results: TestResultItem[];
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
  view_count?: number;
  category: {
    code: string;
    name: string;
  } | null;
  test_translations: {
    title: string;
    language: string;
    description: string;
  };
}

export interface RelatedTest {
  id: number;
  title: string;
  tone: {
    code: string;
    color: string;
  };
  description: string;
  thumbnail_url: string;
  is_visible: boolean;
  created_at: string;
  category: {
    code: string;
    name: string;
  } | null;
  test_translations: {
    title: string;
    language: string;
    description: string;
  };
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
  // ✅ 아래 4개 속성 추가
  tone: any; // 실제 타입에 맞게 수정 가능
  theme: string | null;
  palette: any;
  character: any;
}

export interface TestJsonInsertData {
  title: string;
  thumbnail_url: string | null;
  description: string;
  tone: {
    code: string;
    color: string;
  };
  theme: string;
  palette: string[];
  character: {
    type: string;
    style: string;
    prompt_hint: string;
  };
  category_id: number | null;
  questions: TestQuestion[];
  results: TestResultItem[];
}

/**
 * 번역에 필요한 데이터만 추출한 타입
 * tone, theme, palette, character 등 불변 데이터는 제외
 */
export interface TranslationDataOnly {
  title: string;
  description: string;
  questions: Array<{
    question: string;
    options: Array<{
      text: string;
      score: number; // score는 불변이지만 매핑을 위해 필요
    }>;
  }>;
  results: Array<{
    title: string;
    description: string;
    recommendation: TestRecommendation;
    keywords: string[];
    score_range: [number, number]; // 매핑을 위해 필요
  }>;
}

/** 점심 메뉴 데이터 타입 */
export interface LunchMenu {
  id: number;
  name: string;
  image_url: string | null;
}
