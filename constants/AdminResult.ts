export const promptText = `
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
      "image_url": string (or null),
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
      "recommendation": string,
      "image_prompt": string,
      "result_image_url": string (or null),
      "score_range": [number, number]
    }
  ]
}
---
[생성 규칙]  
- 질문은 최소 5개 이상, 각 질문마다 2~4개의 선택지를 포함할 것  
- 결과는 최소 3개 이상, 점수 범위는 겹치지 않게 분배  
- tone, theme, palette, character는 프론트에서 스타일을 결정하므로 적절하게 다양하고 창의적으로 작성  
- image_prompt는 2D 일러스트 스타일로 생성에 적합한 묘사를 넣을 것  
- character.prompt_hint는 이미지 생성 AI를 위한 자연어 프롬프트로 구체적인 외형 및 분위기를 묘사할 것

---
[결과 콘텐츠 작성 가이드]

\`results\` 항목의 \`description\`, \`recommendation\`, \`image_prompt\`는 다음 기준을 포함하여 작성합니다:

1. \`description\`에는 다음 내용을 자연스럽게 포함시켜야 합니다:
  - 해당 유형의 사람들의 성격 키워드 (예: 내향적, 감성적 등)
  - 이상적인 여행 방식이나 행동 묘사 (예: 조용한 장소에서 명상하며 하루 보내기)
  - 여행을 통해 느끼는 감정이나 가치관 (예: 진정한 쉼, 새로운 자극 등)
	- 공백포함 300자 이상 500자 이내

2. \`recommendation\`에는 다음을 포함하는 하나의 문장 또는 리스트형 문장으로 작성합니다:
  - 어울리는 여행 장소
  - 추천 활동
  - 어울리는 아이템이나 스타일 (예: 린넨 셔츠, 브이로그 카메라, 선글라스 등)
  - 공백포함 200자 이상 300자 이내

3. \`image_prompt\`는 다음 구조로 작성합니다:
  - "[행동 중인 여성], [주변 배경과 감정], [빛과 분위기], 2D 일러스트"
	- 남녀노소 호불호 없는 이미지의 프롬프트로 영어로 제안해줘
	
4. 카테고리는 category_id 필드로 반드시 입력되어야 하며, 해당 ID는 사전에 정의된 값 중에서 적절히 선택할 것
📁 카테고리 목록
ID	code	name_ko	name_en
1	personality	성격	Personality
2	love	연애	Love & Dating
3	mbti	MBTI	MBTI
4	career	진로/직업	Career & Job
5	friendship	인간관계	Friendship
6	vacation	휴가/여행	Travel & Vacation
7	animal	동물 캐릭터	Animal Character
8	fun	재미	Just for Fun
9	self	자아 탐색	Self Discovery

---
[예시 주제]  
- 당신의 내면 캐릭터는 어떤 동물일까?  
- 당신에게 어울리는 여름 휴가 스타일  
- 나의 공부 스타일 유형  
- 연애할 때 나의 성향은?

---
이제 위 기준에 따라 새로운 테스트 데이터를 JSON으로 생성해주세요.
예시 주제 말고 다른 내용으로 만들어주세요.

`;
