export interface TestOption {
  text: string;
  score: number;
}

export interface TestQuestion {
  question: string;
  options: TestOption[];
}

export interface TestResult {
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
  results: TestResult[];
}

export interface TestCard {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  category: string;
}

export type NewTest = {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  tone: { code: string; color: string };
  theme: string | null;
  palette: any | null;
  character: string | null;
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
};

export interface TestCardProps {
  test: NewTest;
  featured?: boolean;
}

export interface TestResult {
  id: string; // result_id
  test_id: string; // test 테이블의 id
  test_name: string; // test_translations.title
  result_title: string; // result_translations.title
  result_image_url?: string | null; // results.result_image_url
  image_prompt: string; // results.image_prompt
}
