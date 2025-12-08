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
[생성 규칙]  
- 질문은 최소 10개 이상, 각 질문마다 2~4개의 선택지를 포함할 것  
- 결과는 최소 3개 이상, 점수 범위는 겹치지 않게 분배  
- 센스 있고 유머있는 질문으로 구성해주세요.
- tone, theme, palette, character는 프론트에서 스타일을 결정하므로 적절하게 다양하고 창의적으로 작성  
- image_prompt는 2D 테스트나 결과에 대한 적합한 이미지로 표현 (영어)  
- character.prompt_hint는 이미지 생성 AI를 위한 자연어 프롬프트로 구체적인 외형 및 분위기를 묘사할 것  
- 검색엔진에 잘 노출될 주제 
- 너무 오글거리고 유치한 주제는 제외해줘 
- 부담없이 담백한 주제

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

4. \`image_prompt\`는 다음 구조로 작성합니다:
  - 영어로 작성하고, 직관적이고 심플
  - 웃긴 이미지가 필요할 땐 남자로, 웬만하면 여자로 프롬프트 만들것
  - 1:1 비율로 만들 것
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
