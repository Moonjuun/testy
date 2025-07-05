import type { TestData, TestCard } from "@/types/test";

export const testCards: TestCard[] = [
  {
    id: "summer-vacation-style",
    title: "나에게 어울리는 여름 휴가 스타일",
    description:
      "무더운 여름, 당신에게 가장 잘 어울리는 휴가 스타일은 무엇일까요?",
    thumbnail_url: "/placeholder.svg?height=200&width=300",
    category: "라이프",
  },
  {
    id: "love-style",
    title: "나의 연애 스타일은?",
    description: "12가지 질문으로 알아보는 나만의 연애 패턴",
    thumbnail_url: "/placeholder.svg?height=200&width=300",
    category: "연애",
  },
  {
    id: "mbti-accuracy",
    title: "MBTI 정확도 테스트",
    description: "진짜 내 성격은 무엇일까? 정밀 분석",
    thumbnail_url: "/placeholder.svg?height=200&width=300",
    category: "성격",
  },
  {
    id: "career-match",
    title: "나에게 맞는 직업 찾기",
    description: "적성과 성향을 바탕으로 한 직업 추천",
    thumbnail_url: "/placeholder.svg?height=200&width=300",
    category: "진로",
  },
  {
    id: "inner-animal",
    title: "내 마음속 동물은?",
    description: "숨겨진 나의 본성 발견하기",
    thumbnail_url: "/placeholder.svg?height=200&width=300",
    category: "재미",
  },
  {
    id: "stress-level",
    title: "스트레스 지수 체크",
    description: "현재 나의 스트레스 상태는?",
    thumbnail_url: "/placeholder.svg?height=200&width=300",
    category: "심리",
  },
];

export const testData: Record<string, TestData> = {
  "summer-vacation-style": {
    title: "나에게 어울리는 여름 휴가 스타일",
    description:
      "무더운 여름, 당신에게 가장 잘 어울리는 휴가 스타일은 무엇일까요? 6가지 질문을 통해 알아보세요!",
    questions: [
      {
        question: "여름이 되면 가장 먼저 떠오르는 단어는?",
        options: [
          { text: "바다", score: 1 },
          { text: "에어컨", score: 2 },
          { text: "축제", score: 3 },
        ],
      },
      {
        question: "이상적인 휴가 장소는?",
        options: [
          { text: "사람 없는 한적한 섬", score: 1 },
          { text: "편의시설 많은 리조트", score: 2 },
          { text: "핫한 도시나 페스티벌", score: 3 },
        ],
      },
      {
        question: "여행 중 가장 중요한 것은?",
        options: [
          { text: "자연과의 교감", score: 1 },
          { text: "편안한 휴식", score: 2 },
          { text: "새로운 경험과 사람들", score: 3 },
        ],
      },
      {
        question: "휴가 중 음식 스타일은?",
        options: [
          { text: "직접 요리해 먹기", score: 1 },
          { text: "근처 식당 맛집 탐방", score: 2 },
          { text: "먹방처럼 이것저것 다 시도", score: 3 },
        ],
      },
      {
        question: "휴가 사진 콘셉트는?",
        options: [
          { text: "풍경 위주, 감성샷", score: 1 },
          { text: "숙소, 음식, 나 중심 셀카", score: 2 },
          { text: "재미있는 순간, 에너지 넘치는 샷", score: 3 },
        ],
      },
      {
        question: "휴가 후 당신의 상태는?",
        options: [
          { text: "몸과 마음이 정화된 기분", score: 1 },
          { text: "배터리 100% 충전 완료", score: 2 },
          { text: "신나지만 살짝 탈진 상태", score: 3 },
        ],
      },
    ],
    results: [
      {
        title: "자연 속 힐링러",
        description:
          "당신은 조용하고 한적한 자연 속에서 에너지를 충전하는 타입이에요. 혼자만의 시간과 조용한 환경에서 진짜 휴식을 느낍니다.",
        recommendation: "계곡 근처 한적한 펜션, 숲속 요가 리트릿",
        image_prompt:
          "숲속 나무 아래 명상하는 여성, 고요하고 평화로운 분위기, 2D 일러스트",
        score_range: [6, 7],
      },
      {
        title: "럭셔리 휴식러",
        description:
          "당신은 편안함과 서비스가 최고인 휴가를 선호하는 타입이에요. 고급 리조트에서 아무 걱정 없이 쉬는 게 최고의 힐링이죠.",
        recommendation: "풀빌라 리조트, 올인클루시브 호텔",
        image_prompt:
          "인피니티 풀에서 칵테일 마시는 우아한 여성, 햇살 가득한 리조트, 2D 일러스트",
        score_range: [8, 10],
      },
      {
        title: "에너지 폭발 탐험러",
        description:
          "새로운 경험과 활기를 추구하는 당신은 떠들썩한 축제나 도시 탐험이 잘 어울려요. 지칠 줄 모르는 에너지로 사람들과 어울립니다.",
        recommendation: "도시 여행, 음악 페스티벌, 해외 문화 체험",
        image_prompt:
          "도심 거리에서 셀카 찍는 활발한 여성, 네온 조명과 사람들, 2D 일러스트",
        score_range: [11, 13],
      },
      {
        title: "감성 기록가",
        description:
          "당신은 여행의 분위기와 감정을 중요하게 여기는 사람입니다. 풍경, 감정, 기록… 하나하나 놓치지 않고 차곡차곡 담아두는 스타일이죠.",
        recommendation: "사진 여행, 브이로그 제작, 감성 펜션",
        image_prompt:
          "노트에 여행 일기 쓰는 감성적인 여성, 창밖으로 보이는 노을, 2D 일러스트",
        score_range: [14, 18],
      },
    ],
  },
  "love-style": {
    title: "나의 연애 스타일은?",
    description: "12가지 질문으로 알아보는 나만의 연애 패턴을 확인해보세요!",
    questions: [
      {
        question: "첫 데이트 장소로 어디를 선호하시나요?",
        options: [
          { text: "조용한 카페에서 대화하기", score: 1 },
          { text: "놀이공원이나 액티비티", score: 2 },
          { text: "맛집 탐방하기", score: 3 },
        ],
      },
      {
        question: "연인과 갈등이 생겼을 때 당신의 반응은?",
        options: [
          { text: "즉시 대화로 해결하려고 한다", score: 1 },
          { text: "시간을 두고 생각해본다", score: 2 },
          { text: "감정이 가라앉을 때까지 기다린다", score: 3 },
        ],
      },
    ],
    results: [
      {
        title: "로맨틱한 연인",
        description:
          "당신은 사랑에 있어서 감성적이고 로맨틱한 스타일입니다. 작은 것에서도 의미를 찾고, 상대방과의 깊은 감정적 연결을 중요하게 생각합니다.",
        recommendation:
          "감성적인 데이트, 기념일 챙기기, 편지나 선물로 마음 표현",
        image_prompt:
          "장미꽃을 들고 미소짓는 로맨틱한 여성, 따뜻한 조명, 2D 일러스트",
        score_range: [2, 4],
      },
      {
        title: "실용적인 연인",
        description:
          "당신은 현실적이고 안정적인 관계를 추구합니다. 감정보다는 서로의 성장과 미래를 함께 계획하는 것을 중요하게 여깁니다.",
        recommendation: "함께 목표 세우기, 취미 공유하기, 실용적인 선물",
        image_prompt:
          "노트북으로 계획을 세우는 차분한 여성, 깔끔한 사무실, 2D 일러스트",
        score_range: [5, 6],
      },
    ],
  },
};
