export interface TestOption {
  text: string
  score: number
}

export interface TestQuestion {
  question: string
  options: TestOption[]
}

export interface TestResult {
  title: string
  description: string
  recommendation: string
  image_prompt: string
  score_range: [number, number]
}

export interface TestData {
  title: string
  description: string
  questions: TestQuestion[]
  results: TestResult[]
}

export interface TestCard {
  id: string
  title: string
  description: string
  thumbnail: string
  category: string
  participants: string
  color: string
  duration: string
}
