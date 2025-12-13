export const NewPromptText = `
아래 조건에 따라 성향 기반 테스트 데이터를 JSON 형식으로 생성해주세요. 이 데이터는 Supabase DB에 자동 삽입될 수 있도록 사용됩니다.  
---
[요구 사항]  
1. 전체 구조는 다음 JSON 스키마를 따릅니다:  
{
  "title": string,
  "description": string,
  "tone": {
    "code": string,
    "color": string
  },
  "theme": string,
  "palette": [string],
  "character": {
    "type": string,
    "style": string,
    "prompt_hint": string
  },
  "thumbnail_url": string (or null),
  "category_id": number (or null),
  "questions": [
    {
      "question": string,
      "options": [
        {
          "text": string,
          "score": number
        }
      ]
    }
  ],
  "results": [
    {
      "title": string,
      "description": string,
      "recommendation": {
        "matching_type": string,
        "suggested_actions": string,
        "items": [string]
      },
      "keywords": [string],
      "image_prompt": string,
      "result_image_url": string (or null),
      "score_range": [number, number]
    }
  ]
}
---
[생성 규칙]  
- 질문은 최소 10개 이상, 각 질문마다 2~4개의 선택지를 포함할 것  
- 결과는 최소 3개 이상, 점수 범위는 겹치지 않게 분배  
- tone, theme, palette, character는 프론트에서 스타일을 결정하므로 적절하게 다양하고 창의적으로 작성  
- image_prompt는 2D 일러스트 스타일로 생성에 적합한 묘사를 넣을 것 (영어)  
- character.prompt_hint는 이미지 생성 AI를 위한 자연어 프롬프트로 구체적인 외형 및 분위기를 묘사할 것  
- 검색엔진에 잘 노출될 주제 
- 너무 오글거리고 유치한 주제는 제외해줘 
- 부담없이 담백한 주제

---
[결과 콘텐츠 작성 가이드]

\`results\` 항목의 \`description\`, \`recommendation\`, \`image_prompt\`는 다음 기준을 포함하여 작성합니다:

1. \`description\`에는 다음 내용을 자연스럽게 포함시켜야 합니다:
  - 해당 유형의 사람들의 성격 키워드 (예: 내향적, 감성적 등)
  - 이상적인 라이프스타일이나 행동 묘사
  - 감정을 다루는 방식, 중요하게 여기는 가치관 등
  - 공백 포함 300자 이상 500자 이내
  - 특수 문자나 이모지 사용을 자제
  - ** ** 강조같은 마크업 추가

2. \`recommendation\`은 다음 항목을 포함하는 객체로 작성합니다:
  - \`"matching_type"\`: 궁합이 잘 맞는 유형 설명
  - \`"suggested_actions"\`: 실생활에서 도움이 되는 행동 제안
  - \`"items"\`: 해당 유형에게 어울리는 스타일/소지품/아이템 (예: ["린넨 셔츠", "디퓨저", "브이로그 카메라"])
  - 각 텍스트 항목은 공백 포함 150~250자 이내, 아이템은 2~5개 정도
  - ** ** 강조같은 마크업 추가

3. \`keywords\`는 다음과 같이 작성합니다:
  - 해당 결과를 요약하는 2~4개의 키워드
  - 배열 형태이며 해시태그 없이 단어만 사용

4. \`image_prompt\`는 다음 구조로 작성합니다:
  - 영어로 작성하고, 시각적으로 매력적인 프롬프트로 구성할 것

5. 카테고리는 category_id 필드로 반드시 입력되어야 하며, 해당 ID는 사전에 정의된 값 중에서 적절히 선택할 것  
📁 카테고리 목록  
ID | code        | name_ko     | name_en  
-- | ----------- | ----------- | ---------  
1  | personality | 성격        | Personality  
2  | love        | 연애        | Love & Dating  
3  | mbti        | MBTI        | MBTI  
4  | career      | 진로/직업   | Career & Job  
5  | friendship  | 인간관계    | Friendship  
6  | vacation    | 휴가/여행   | Travel & Vacation  
7  | animal      | 동물 캐릭터 | Animal Character  
8  | fun         | 재미        | Just for Fun  

---
[예시 주제]  
- T발놈 테스트: 당신의 T기질은?
- 남자어 능력 고사
- 만약 당신이 오징어 게임 참가자라면?
- 테토남 vs 에겐남 테스트
- 연인이 바람을 핀다면?
---
이제 위 기준에 따라 새로운 테스트 데이터를 JSON으로 생성해주세요.  
예시 주제는 제외하고, 참신하고 자극적이고 재밌는 주제로 만들어주세요.
`;

// ============================================
// 순차적 생성 프롬프트 (토큰 최적화)
// ============================================

/**
 * 1단계: 테스트 주제 생성 (메타데이터만)
 * 토큰 절감: 주제만 생성하므로 프롬프트가 짧음
 */
export const TopicPrompt = `
검색량이 높고 클릭을 유도할 수 있는 심리 테스트 주제를 생성해주세요.

⚠️ 중요: 매번 다른 카테고리와 주제를 선택하여 다양성을 확보하세요. 이전에 생성된 주제와 유사하거나 중복되지 않도록 창의적으로 작성하세요.

🌍 글로벌 타게팅 고려사항:
- 한국, 미국, 일본, 베트남 등 다양한 국가에서 인기 있는 주제 선택
- 문화적 차이를 고려하되, 보편적으로 공감할 수 있는 주제 우선
- 각 국가별 검색 트렌드를 반영한 주제 선정
- 언어별 번역이 자연스럽게 가능한 주제 선택
- 지역별 금기사항이나 민감한 주제는 피하기

[JSON 구조]
{
  "title": string,
  "description": string,
  "category_id": number,
  "tone": { "code": string, "color": string },
  "theme": string,
  "palette": [string],
  "character": { "type": string, "style": string, "prompt_hint": string }
}

[SEO 최적화 필수]
1. 제목: 검색량 높은 키워드 필수 포함 ("MBTI", "성격 테스트", "심리 테스트", "연애 궁합", "직업", "인간관계", "여행" 등)
   - 질문형/숫자형/비교형 패턴 사용
   - 길이: 18~28자
   - 예시: "당신의 진짜 MBTI 성격 유형 테스트", "10가지 질문으로 알아보는 연애 스타일", "당신에게 맞는 직업은?"
   - 🌍 글로벌 검색 키워드: "personality test", "MBTI", "love compatibility", "career test" 등이 번역 시 자연스럽게 포함되도록

2. 설명: 첫 문장에 핵심 키워드 포함, 90~130자
   - "당신의 [키워드]를 알아보는 심리 테스트입니다."
   - 클릭 유도 문구 포함
   - 🌍 글로벌 호환성: 다른 언어로 번역해도 자연스러운 문구 사용

[카테고리 선택 - 다양성 필수]
다음 카테고리 중 하나를 선택하되, 매번 다른 카테고리를 선택하여 다양성을 확보하세요:

1: personality (성격) - 예: "당신의 성격 유형 테스트", "성향 분석 심리 테스트"
2: love (연애) - 예: "연애 스타일 테스트", "이상형 심리 테스트", "연애 궁합 테스트"
3: mbti (MBTI) - 예: "MBTI 성격 유형 테스트", "진짜 MBTI 알아보기"
4: career (진로/직업) - 예: "당신에게 맞는 직업 테스트", "직업 성향 분석", "진로 적성 테스트"
5: friendship (인간관계) - 예: "인간관계 스타일 테스트", "소통 방식 테스트", "친구 관계 유형"
6: vacation (휴가/여행) - 예: "당신의 여행 스타일 테스트", "휴가 선호도 테스트", "여행지 추천 테스트"
7: animal (동물 캐릭터) - 예: "당신을 나타내는 동물 테스트", "동물 성향 테스트"
8: fun (재미) - 예: "당신의 유머 스타일 테스트", "재미있는 성향 테스트"

⚠️ 중요: 
- 카테고리를 다양하게 선택하세요 (연속으로 같은 카테고리 선택 금지)
- 각 카테고리별로 창의적이고 검색량이 높은 주제를 생성하세요
- 절대 금지: "당신은 어떤 과자?" 같은 유치한 주제

[주제 선택 우선순위]
- 검색량이 높은 주제 우선 (MBTI, 성격 테스트, 연애 궁합 등)
- 하지만 카테고리 다양성을 고려하여 균형있게 선택
- 성인/청소년 대상의 심리적 깊이 있는 주제만 생성

[tone/theme/palette/character]
- 다양하고 창의적으로 작성
- character.prompt_hint는 썸네일 이미지 생성용 자연어 프롬프트로 다음 구조를 따라 영어로 작성 (상세하고 구체적으로):
  * 인물 묘사: 나이, 성별, 헤어스타일, 옷차림 등 구체적으로
  * 배경 설정: 장소, 시간대(낮/밤), 환경 등
  * 포즈와 액션: 손동작, 자세, 행동 등
  * 감정 표현: 표정, 분위기 (surprise, joy, calm 등)
  * 조명 효과: 배경 조명, 그림자, 깊이감 등
  * 스타일: anime, illustration 등
  * 비율: --ar 1:1
  예시: "a young woman with long brown hair, wearing an off-white shirt and jeans, stands in the middle of a field of purple flowers at night. she has her hands outstretched, as if she is catching bubbles or lights floating above her. her expression is one of surprise and joy. the background lighting casts soft shadows on her face and figure, creating depth. in the style of anime. --ar 1:1"

⚠️ 유치한 주제 절대 금지. 성인/청소년 대상 심리적 깊이 있는 주제만 생성.

⚠️ 중요: 반드시 유효한 JSON만 반환하세요. 마크다운 코드 블록, 추가 설명, 주석 없이 순수 JSON만 반환해야 합니다.
JSON은 { 로 시작하고 } 로 끝나야 하며, 그 외의 텍스트는 포함하지 마세요.
`;

/**
 * 2단계: 질문 생성 (주제 기반)
 * 토큰 절감: 주제 정보만 전달하여 프롬프트 간소화
 */
export const QuestionsPrompt = `
다음 테스트 주제에 맞는 질문을 생성해주세요.

테스트: "{{TITLE}}"
설명: "{{DESCRIPTION}}"
카테고리: {{CATEGORY_ID}}

[JSON 구조]
{
  "questions": [
    {
      "question": string,
      "options": [
        { "text": string, "score": number }
      ]
    }
  ]
}

[규칙]
- 질문 10개 이상
- 각 질문마다 2~4개 선택지
- 검색 키워드 자연스럽게 포함
- 일상적이고 공감대 형성 가능한 상황
- 결과 차별화를 위한 질문
- 센스 있고 유머있는 선택지

⚠️ 중요: 반드시 유효한 JSON만 반환하세요. 마크다운 코드 블록, 추가 설명, 주석 없이 순수 JSON만 반환해야 합니다.
JSON은 { 로 시작하고 } 로 끝나야 하며, 그 외의 텍스트는 포함하지 마세요.
`;

/**
 * 3단계: 결과 생성 (질문 기반)
 * 기존 ResultPrompt 유지하되 간소화
 */
export const ResultsPrompt = `
다음 테스트의 결과를 생성해주세요.

테스트: "{{TITLE}}"
질문 수: {{QUESTION_COUNT}}
최대 점수: {{MAX_SCORE}}

[JSON 구조]
{
  "results": [
    {
      "title": string,
      "description": string,
      "recommendation": {
        "matching_type": string,
        "suggested_actions": string,
        "items": [string],
        "short_description": string
      },
      "keywords": [string],
      "image_prompt": string,
      "score_range": [number, number]
    }
  ]
}

[규칙]
- 결과 3개 이상
- 점수 범위: 0~{{MAX_SCORE}}, 겹치지 않게
- description: 600~1000byte, **강조** 사용
- recommendation: 실용적이고 구체적으로
- image_prompt: 다음 구조를 따라 영어로 작성 (상세하고 구체적으로):
  * 인물 묘사: 나이, 성별, 헤어스타일, 옷차림 등 구체적으로
  * 배경 설정: 장소, 시간대(낮/밤), 환경 등
  * 포즈와 액션: 손동작, 자세, 행동 등
  * 감정 표현: 표정, 분위기 (surprise, joy, calm 등)
  * 조명 효과: 배경 조명, 그림자, 깊이감 등
  * 스타일: anime, illustration 등
  * 비율: --ar 1:1
  예시: "a young woman with long brown hair, wearing an off-white shirt and jeans, stands in the middle of a field of purple flowers at night. she has her hands outstretched, as if she is catching bubbles or lights floating above her. her expression is one of surprise and joy. the background lighting casts soft shadows on her face and figure, creating depth. in the style of anime. --ar 1:1"
- 센스 있고 유머있는 결과

⚠️ 중요: 반드시 유효한 JSON만 반환하세요. 마크다운 코드 블록, 추가 설명, 주석 없이 순수 JSON만 반환해야 합니다.
JSON은 { 로 시작하고 } 로 끝나야 하며, 그 외의 텍스트는 포함하지 마세요.
`;

// ============================================
// 기존 프롬프트 (하위 호환성 유지 - 사용 안 함)
// ⚠️ 순차적 생성 방식(TopicPrompt, QuestionsPrompt, ResultsPrompt) 사용 권장
// ============================================

export const TestPrompt = `
아래 조건에 따라 성향 기반 테스트 데이터를 JSON 형식으로 생성해주세요. 
양질의 컨텐츠, 테스트를 만드는게 제일 중요합니다.
테스트를 먼저 만들고 결과를 만들거야.
---
[요구 사항]  
1. 전체 구조는 다음 JSON 스키마를 따릅니다:  
{
  "title": string,
  "description": string,
  "tone": {
    "code": string,
    "color": string
  },
  "theme": string,
  "palette": [string],
  "character": {
    "type": string,
    "style": string,
    "prompt_hint": string
  },
  "thumbnail_url": string (or null),
  "category_id": number (or null),
  "questions": [
    {
      "question": string,
      "options": [
        {
          "text": string,
          "score": number
        }
      ]
    }
  ]
}
---
[SEO 및 클릭 유도 최적화 - 매우 중요!]

⚠️ **유치한 주제 절대 금지**: 
- "당신은 어떤 과자?", "당신의 색깔은?" 같은 유치한 주제는 절대 생성하지 말 것
- 초등학생 수준의 단순한 주제는 제외
- 성인/청소년 대상의 심리적 깊이가 있는 주제만 생성
- 검색량이 높고 실제로 사람들이 찾는 주제 우선

1. **제목(title) 작성 가이드 - 검색 최적화 필수**:
   - **검색량 높은 키워드 필수 포함**: "MBTI", "성격 테스트", "심리 테스트", "연애 궁합", "성향 테스트", "유형 테스트"
   - **클릭 유도 패턴** (다음 중 하나 이상 포함):
     * 질문형: "당신의 진짜 성격 유형은?", "당신은 어떤 연애 스타일?"
     * 숫자형: "10가지 질문으로 알아보는 MBTI", "12가지 질문으로 보는 진짜 나"
     * 비교형: "당신은 인프피인가 인프제인가?", "연애에서 당신의 위치는?"
     * 호기심 유발: "숨겨진 당신의 성격", "당신도 모르는 진짜 나", "99% 정확도 심리 테스트"
   - **금지 사항**: 이모지, 특수문자 과다 사용, 유치한 표현 ("귀여운", "뽀짝" 등)
   - **길이**: 18~28자 (검색 결과에서 잘리지 않도록)
   - **예시 (좋은 제목)**:
     * "당신의 진짜 MBTI 성격 유형 테스트"
     * "10가지 질문으로 알아보는 연애 스타일 심리 테스트"
     * "당신은 어떤 성향의 사람인가? 성격 유형 테스트"
     * "연애에서 당신의 위치는? 궁합 심리 테스트"

2. **설명(description) 작성 가이드 - 메타 태그 최적화**:
   - **첫 문장에 핵심 키워드 필수 포함** (SEO 최적화):
     * "MBTI 성격 테스트", "연애 궁합 심리 테스트", "성향 분석 테스트" 등
   - **표준 형식 사용**:
     * "당신의 [핵심 키워드]를 알아보는 심리 테스트입니다."
     * "[핵심 키워드]에 대한 정확한 분석 결과를 제공합니다."
   - **클릭 유도 문구 포함**:
     * "지금 바로 확인해보세요", "결과가 궁금하다면", "정확한 분석 결과 확인"
   - **길이**: 90~130자 (구글 메타 설명 최적화)
   - **예시 (좋은 설명)**:
     * "당신의 진짜 MBTI 성격 유형을 알아보는 심리 테스트입니다. 10가지 질문으로 정확한 성격 분석 결과를 제공합니다. 지금 바로 확인해보세요."
     * "연애에서 당신의 스타일과 궁합을 알아보는 심리 테스트입니다. 상대방과의 관계를 더 깊이 이해할 수 있는 결과를 제공합니다."

3. **주제 선택 우선순위 - 검색량 기반**:
   - **최우선 주제** (검색량 매우 높음):
     * MBTI 관련: "MBTI 성격 유형", "MBTI 궁합", "MBTI 연애 스타일"
     * 성격 테스트: "성격 유형 테스트", "성향 분석 테스트", "심리 성향 테스트"
     * 연애 관련: "연애 스타일 테스트", "연애 궁합 테스트", "이상형 테스트"
   - **차순위 주제** (검색량 높음):
     * 인간관계: "인간관계 스타일", "소통 방식 테스트"
     * 진로/직업: "직업 성향 테스트", "적성 테스트"
     * 라이프스타일: "라이프스타일 유형", "가치관 테스트"
   - **트렌드 반영** (최근 화제):
     * 인기 드라마/영화/예능 관련 (예: "오징어 게임", "이상한 변호사 우영우")
     * SNS 화제 키워드 (예: "인프피", "인프제", "에스엔티제")
   - **계절성 고려**:
     * 봄/여름: 연애, 여행, 휴가 관련
     * 가을/겨울: 인간관계, 진로, 자기계발 관련
   - **절대 금지 주제**:
     * 유치한 주제: "당신은 어떤 과자?", "당신의 색깔은?", "당신은 어떤 동물?"
     * 오글거리는 주제: "뽀짝뽀짝 테스트", "귀여운 나 테스트"
     * 의미 없는 주제: "당신의 별명은?", "당신의 생일은?"
   - **권장 주제 톤**:
     * 성인/청소년 대상의 심리적 깊이 있는 주제
     * 실제 검색 의도에 맞는 실용적인 주제
     * 결과를 공유하고 싶게 만드는 흥미로운 주제

4. **질문 작성 가이드 - 검색 키워드 포함**:
   - **각 질문에 검색 키워드 자연스럽게 포함**:
     * MBTI 관련: "당신의 성격 유형", "에너지 방향", "인식 기능" 등
     * 연애 관련: "연애 스타일", "이상형", "데이트 선호도" 등
     * 성격 관련: "성향", "가치관", "라이프스타일" 등
   - **일상적이고 공감대 형성 가능한 상황 제시**:
     * 실제 경험할 수 있는 상황 (예: "친구와의 갈등 상황에서", "연인과의 데이트에서")
   - **결과의 차별화를 만들어낼 수 있는 질문**:
     * 각 선택지가 명확히 다른 성향을 나타내도록
   - **성인/청소년 대상의 깊이 있는 질문**:
     * 단순한 선호도가 아닌 심리적 성향을 파악할 수 있는 질문

---
[생성 규칙]  
- 질문은 최소 10개 이상, 각 질문마다 2~4개의 선택지를 포함할 것  
- 결과는 최소 3개 이상, 점수 범위는 겹치지 않게 분배  
- 센스 있고 유머있는 질문으로 구성해주세요.
- tone, theme, palette, character는 프론트에서 스타일을 결정하므로 적절하게 다양하고 창의적으로 작성  
- image_prompt는 2D 테스트나 결과에 대한 적합한 이미지로 표현 (영어)  
- character.prompt_hint는 이미지 생성 AI를 위한 자연어 프롬프트로 구체적인 외형 및 분위기를 묘사할 것  

5. 카테고리는 category_id 필드로 반드시 입력되어야 하며, 해당 ID는 사전에 정의된 값 중에서 적절히 선택할 것  
카테고리 목록  
ID | code        | name_ko     | name_en  
-- | ----------- | ----------- | ---------  
1  | personality | 성격        | Personality  
2  | love        | 연애        | Love & Dating  
3  | mbti        | MBTI       | MBTI
7  | animal        | 동물      | Animals
8  | fun         | 재미        | Just for Fun  

---
[예시 주제 - 참고용 (제외하고 새로 생성)]  
- T발놈 테스트: 당신의 T기질은?
- 남자어 능력 고사
- 만약 당신이 오징어 게임 참가자라면?
- 테토남 vs 에겐남 테스트
- 연인이 바람을 핀다면?
---
이제 위 기준에 따라 새로운 테스트 데이터를 JSON으로 생성해주세요.  

⚠️ **최우선 체크리스트**:
1. ✅ 제목에 검색량 높은 키워드 포함했는가? (MBTI, 성격 테스트, 연애 궁합 등)
2. ✅ 유치하거나 오글거리는 주제가 아닌가? (절대 금지)
3. ✅ 성인/청소년 대상의 심리적 깊이가 있는 주제인가?
4. ✅ 실제로 사람들이 검색할 만한 주제인가?
5. ✅ 클릭을 유도할 수 있는 제목과 설명인가?

예시 주제는 제외하고, **검색량이 높고 실제로 사람들이 찾는 주제**로 만들어주세요.
유치한 주제는 절대 생성하지 말고, 성인/청소년 대상의 심리적 깊이가 있는 주제만 생성할 것!

`;

export const ResultPrompt = `
제일 중요한건 양질의 컨텐츠
결과 프롬프트는 아래 구조를 따릅니다.
아래 구조를 정확히 따라서 만들어주세요

 "results": [
    {
      "title": string,
      "description": string,
      "recommendation": {
        "matching_type": string,
        "suggested_actions": string,
        "items": [string],
        "short_description": string
      },
      "keywords": [string],
      "image_prompt": string,
      "result_image_url": string (or null),
      "score_range": [number, number]
    }
  ]
  
----  
[결과 콘텐츠 작성 가이드]
- 센스 있고 유머있는 결과로 구성해주세요. 
\`results\` 항목의 \`description\`, \`recommendation\`, \`image_prompt\`는 다음 기준을 포함하여 작성합니다:

1. \`description\`에는 다음 내용을 자연스럽게 포함시켜야 합니다:
	- 공백 포함 600byte 이상 1000byte 이내 (제일 중요!!)
  - 해당 유형의 사람들의 성격 키워드 (예: 내향적, 감성적 등)
  - 이상적인 라이프스타일이나 행동 묘사
  - 감정을 다루는 방식, 중요하게 여기는 가치관 등
  - ** ** 강조같은 마크업 추가

2. \`recommendation\`은 다음 항목을 포함하는 객체로 작성합니다:
  - \`"matching_type"\`: 궁합이 잘 맞는 유형 설명
  - \`"suggested_actions"\`: 실생활에서 도움이 되는 행동 제안
  - \`"items"\`: 해당 유형에게 어울리는 스타일/소지품/아이템 (예: ["린넨 셔츠", "디퓨저", "브이로그 카메라"]), 텍스트 항목은 공백 포함 400byte 이내, 아이템은 2~5개 정도
  - \`short_description\`는 다음과 같이 작성합니다: description 요약 내용, 500byte 이내
  - ** ** 강조같은 마크업 추가
  

3. \`keywords\`는 다음과 같이 작성합니다:
  - 해당 결과를 요약하는 2~4개의 키워드
  - 배열 형태이며 해시태그 없이 단어만 사용

4. \`image_prompt\`는 다음 구조를 따라 영어로 작성합니다 (상세하고 구체적으로):
  - 인물 묘사: 나이, 성별, 헤어스타일, 옷차림 등 구체적으로
  - 배경 설정: 장소, 시간대(낮/밤), 환경 등
  - 포즈와 액션: 손동작, 자세, 행동 등
  - 감정 표현: 표정, 분위기 (surprise, joy, calm 등)
  - 조명 효과: 배경 조명, 그림자, 깊이감 등
  - 스타일: anime, illustration 등
  - 비율: --ar 1:1
  - 웃긴 이미지가 필요할 땐 남자로, 웬만하면 여자로 프롬프트 만들것
  예시: "a young woman with long brown hair, wearing an off-white shirt and jeans, stands in the middle of a field of purple flowers at night. she has her hands outstretched, as if she is catching bubbles or lights floating above her. her expression is one of surprise and joy. the background lighting casts soft shadows on her face and figure, creating depth. in the style of anime. --ar 1:1"
`;

export const tarotPrompt = `
출력 대상:

출력 구조: 
최상위 "Meaning"과 "Description"이라는 키를 제외하고, 다음과 같은 JSON 구조로 작성해줘.
"Meaning 컬럼"과 "Description 컬럼"에 추가할 데이터는 아래의 규칙에 따라 각 JSON 객체의 "free"와 "paid" 값에 넣어줘.

{
  "en": { "free": "", "paid": "" },
  "ja": { "free": "", "paid": "" },
  "ko": { "free": "", "paid": "" },
  "vi": { "free": "", "paid": "" }
}


[Meaning 규칙]
- 내용 1 (free): ...
- 내용 2 (paid): ...

[Description 규칙]
- 내용 1 (free): ...
- 내용 2 (paid): ...

나머지 규칙은 동일하게 적용해줘.

분량 규칙:

Meaning (free): 400바이트 +100

Meaning (paid): 800바이트 +100

Description (free): 800바이트 +100

Description (paid): 1600바이트 +100

굵게(**텍스트**) 표시로 인한 바이트 증가를 고려하여 기준 바이트에서 +100을 추가합니다.

내용 규칙:
공통 규칙
- 모든 내용은 쉽고 간결하게 작성되어야 합니다.
- 각 항목의 핵심 메시지를 명확하게 전달해야 합니다.

Meaning 규칙
카드 그림 속 상징, 카드의 본질적인 의미를 간결하게 설명하고 포인트를 굵게 강조합니다.

Description 규칙
현실 상황(연애, 직업 등)에 적용한 해설을 포함하고, 긍정/부정적 해석을 모두 제공하며 중요한 키워드를 굵게 강조합니다.

번역: 한국어 원문을 기준으로 작성한 후, 영어(en), 일본어(ja), 베트남어(vi)로 번역하여 각 언어에 맞게 내용을 채웁니다.

Meaning JSON과 Description JSON을 각각 분리해서 만들어줘
`;
