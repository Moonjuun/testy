# Gemini API 테스트 자동 생성 가이드

## 환경 변수 설정

다음 환경 변수들을 `.env.local` 파일에 추가하거나 Vercel 환경 변수로 설정하세요:

### 필수 환경 변수

```bash
# Gemini API 키 (Google AI Studio에서 발급)
GEMINI_API_KEY=your_gemini_api_key_here

# Vercel Cron Job 인증용 시크릿
CRON_SECRET=your_random_secret_string_here

# Supabase (이미 설정되어 있을 수 있음)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 이미지 생성용 환경 변수 (선택사항)

```bash
# Vertex AI Imagen API 사용 시 필요
# Google Cloud 프로젝트 ID (이미지 생성에 사용)
GOOGLE_CLOUD_PROJECT_ID=your_project_id_here

# Google Cloud 리전 (기본값: us-central1)
GOOGLE_CLOUD_REGION=us-central1
```

**참고**:

- 이미지 생성 기능을 사용하려면 Vertex AI 프로젝트가 필요합니다.
- Vertex AI API는 OAuth 토큰을 사용하므로, 서비스 계정 키를 설정하거나 `gcloud auth print-access-token`을 사용해야 합니다.
- 현재는 API 키를 Bearer 토큰으로 사용하는 실험적 방식을 시도하지만, 정식으로는 OAuth 토큰이 필요합니다.
- 자세한 내용: [Vertex AI Imagen API 문서](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/imagen-api)

## 비용 최적화 (유료 모델 사용)

### 사용 모델

- **Gemini 2.5 Flash-Lite**: 텍스트 생성 및 번역용 (가장 저렴한 모델)
  - Input: $0.10 per million tokens
  - Output: $0.40 per million tokens
- **Gemini 2.5 Flash Image**: 이미지 생성용 모델

### 토큰 최적화 전략

1. **순차적 생성 방식** (최신): 주제 → 질문 → 결과 단계별 생성

   - 기존: 한 번에 모든 데이터 생성 (~5,000 토큰 input)
   - 최적화: 단계별 짧은 프롬프트 사용 (~1,000 + ~2,000 + ~1,500 = ~4,500 토큰 input)
   - **절감률: 약 10% + 각 단계별 검증 가능**
   - 장점: 실패 시 해당 단계만 재시도, 더 정확한 생성
   - **JSON 파싱 개선**: 중첩된 중괄호를 고려한 정확한 JSON 추출, 에러 발생 시 상세한 디버깅 정보 제공

2. **번역 프롬프트 최적화**: 전체 JSON 대신 번역 필요한 필드만 전송

   - 기존: 전체 테스트 데이터 JSON 전송 (~8,000 토큰)
   - 최적화: 번역 필드만 추출하여 전송 (~5,000 토큰)
   - **절감률: 약 37%**

3. **프롬프트 간소화**: 불필요한 설명 제거

   - 주제 생성: SEO 최적화 핵심만 포함
   - 질문 생성: 주제 정보만 전달
   - 결과 생성: 질문 수와 최대 점수만 전달

4. **단일 모델 사용**: 대체 모델 로직 제거로 불필요한 재시도 방지

### 예상 비용 (하루 2개 테스트 기준, 순차적 생성 방식)

- **하나의 테스트 생성** (3단계):

  - 1단계 주제: Input ~1,000 + Output ~500 = $0.00015
  - 2단계 질문: Input ~2,000 + Output ~3,000 = $0.0014
  - 3단계 결과: Input ~1,500 + Output ~4,000 = $0.00175
  - **총: 약 $0.0033 per test** (기존 $0.01 대비 약 67% 절감)

- **일일 비용**: 약 $0.013/day (2개 테스트)
- **월간 비용**: 약 $0.40/month
- **연간 비용**: 약 $4.80/year

**참고**: 실제 비용은 생성되는 콘텐츠 길이에 따라 달라질 수 있습니다.

### 참고사항

- 이미지 생성 비용은 별도 (Vertex AI Imagen API 사용)
- 실제 토큰 사용량은 프롬프트 길이와 응답 길이에 따라 달라질 수 있음

## 이미지 생성 (Vertex AI Imagen API)

### 설정 방법

1. **Google Cloud 프로젝트 생성**

   - [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트 생성
   - Vertex AI API 활성화
   - Imagen API 활성화

2. **환경 변수 설정**

   ```bash
   GOOGLE_CLOUD_PROJECT_ID=your_project_id
   GOOGLE_CLOUD_REGION=us-central1
   ```

3. **인증 설정**
   - Vertex AI API는 OAuth 토큰을 사용합니다
   - 서비스 계정 키를 설정하거나 `gcloud auth print-access-token` 사용
   - 현재는 API 키를 Bearer 토큰으로 사용하는 실험적 방식을 시도합니다

### 사용 모델

- **Imagen 3.0 Generate 002**: 이미지 생성용 모델
  - 참고: [Vertex AI Imagen API 문서](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/imagen-api)

### 이미지 생성 비용

- 이미지 생성 비용은 Vertex AI Imagen API 가격 정책을 따릅니다
- 자세한 가격 정보는 [Vertex AI 가격 책정](https://cloud.google.com/vertex-ai/pricing) 참고

### 에러 처리

- **401 Unauthorized**: OAuth 토큰이 필요합니다. 서비스 계정 키를 설정하세요.
- **404 Not Found**: Imagen 모델을 찾을 수 없습니다. Vertex AI에서 Imagen API를 활성화하세요.
- **400 Bad Request**: 요청 형식이 잘못되었습니다. 문서를 참고하여 요청 형식을 확인하세요.

## 유료 모델 사용 (할당량 제한 없음)

✅ **현재 유료 모델 사용 중**: Gemini 2.5 Flash-Lite

- 할당량 제한 없음 (무료 티어 한도 초과 문제 해결)
- 안정적인 서비스 운영 가능
- 예상 월 비용: 약 $0.60 (하루 2개 테스트 기준)

## 에러 처리

### 서버 과부하 에러 (503 Service Unavailable)

일시적인 서버 과부하로 인한 에러입니다:

```
Error: [503 Service Unavailable] The model is overloaded. Please try again later.
```

**자동 처리**:

- ✅ 지수 백오프 재시도 (5초 → 10초 → 20초)
- ✅ 최대 2번 재시도
- ✅ 명확한 에러 메시지 및 재시도 안내

**해결 방법**:

- 자동으로 재시도되므로 별도 조치 불필요
- 지속적인 503 에러 발생 시 잠시 후 다시 시도

### 개선된 에러 처리

- ✅ 서버 과부하(503) 시 자동 재시도 (지수 백오프)
- ✅ 할당량 초과(429) 시 재시도 시간 감지 및 대기
- ✅ 모델 미지원(404) 시 명확한 에러 메시지
- ✅ **결제/빌링 에러(403, 402) 시 즉시 포기 및 명확한 안내**
- ✅ 명확한 에러 메시지 및 해결 방법 안내
- ✅ 순차적 테스트 생성으로 API 호출 충돌 방지

### 결제/빌링 에러 (403, 402 Payment Required)

GCP 결제 계정에 문제가 있을 때 발생하는 에러입니다:

```
Error: [403 Forbidden] Billing account issue
Error: [402 Payment Required] Payment method required
```

**자동 처리**:

- ✅ 결제 에러 감지 시 즉시 포기 (재시도 불가)
- ✅ 명확한 에러 메시지 및 해결 방법 안내
- ✅ GCP 콘솔에서 결제 상태 확인 안내

**해결 방법**:

1. **Google Cloud Console 접속**: [console.cloud.google.com](https://console.cloud.google.com)
2. **결제 계정 확인**: 결제 → 결제 계정 상태 확인
3. **미납 금액 결제**: 미납 금액이 있으면 즉시 결제
4. **결제 방법 업데이트**: 유효한 결제 방법이 등록되어 있는지 확인
5. **서비스 재개**: 결제 완료 후 몇 분 내 자동으로 서비스 재개

**주의사항**:

- ⚠️ 결제 문제는 재시도로 해결되지 않습니다
- ⚠️ 결제 미납 시 Gemini API뿐만 아니라 같은 결제 계정의 다른 GCP 서비스도 영향받을 수 있습니다
- ⚠️ 결제 완료 후에도 서비스 재개까지 몇 분이 걸릴 수 있습니다

## 다국어 자동 번역 지원

✅ **자동 다국어 번역 기능**: 한국어 테스트가 생성되면 자동으로 다음 언어로 번역됩니다:

- 영어 (en)
- 일본어 (ja)
- 베트남어 (vi)

번역은 Gemini API를 사용하여 자연스럽게 생성되며, 각 언어별로 `test_translations` 테이블에 자동 저장됩니다.

**번역 내용:**

- 테스트 제목 및 설명
- 모든 질문 및 선택지
- 모든 결과 제목 및 설명
- 키워드 및 추천 내용

**번역되지 않는 항목 (공유):**

- 썸네일 이미지 URL
- 결과 이미지 URL
- 이미지 프롬프트 (영어로 유지)
- 점수 범위 및 카테고리 ID
- 테마, 톤, 팔레트 설정

### 효율적인 번역 저장 (개선됨)

✅ **최적화된 저장 방식**: `insert_test_translation_efficient` RPC 함수 사용

**개선사항:**

1. **병렬 처리**: 영어, 일본어, 베트남어 번역을 동시에 저장하여 성능 향상 (순차 → 병렬)
2. **데이터 최소화**: 번역에 필요한 텍스트만 전송 (tone, theme, palette, character 등 불변 데이터 제외)
3. **토큰 절약**: 전체 JSON 대신 번역 데이터만 전송하여 Gemini API 토큰 사용량 최소화
4. **네트워크 효율**: 불필요한 데이터 전송 제거로 네트워크 사용량 감소
5. **실제 스키마 반영**: 모든 컬럼명이 실제 데이터베이스 스키마에 맞게 수정됨
   - `question_text` → `question`
   - `option_text` → `text`
   - `option_index` → `option_id` (options 테이블에서 조회)
   - `order_index` → `order`
   - `score_range_min/max` → `score_min/max`

**사용 방법:**

1. Supabase SQL Editor에서 `supabase/migrations/create_insert_test_translation_efficient.sql` 파일의 SQL을 실행하여 함수 생성
2. 기존 코드는 자동으로 새로운 함수를 사용합니다

**데이터 구조:**

```typescript
// 번역에 필요한 데이터만 전송
{
  title: string;
  description: string;
  questions: Array<{
    question: string;
    options: Array<{ text: string; score: number }>;
  }>;
  results: Array<{
    title: string;
    description: string;
    recommendation: {...};
    keywords: string[];
    score_range: [number, number];
  }>;
}
```

## 글로벌 타게팅

✅ **글로벌 서비스 고려**: 주제 선정 시 한국, 미국, 일본, 베트남 등 다양한 국가에서 인기 있는 주제를 선택합니다.

**글로벌 타게팅 전략:**

- 🌍 문화적 차이를 고려하되, 보편적으로 공감할 수 있는 주제 우선
- 🌍 각 국가별 검색 트렌드를 반영한 주제 선정
- 🌍 언어별 번역이 자연스럽게 가능한 주제 선택
- 🌍 지역별 금기사항이나 민감한 주제는 피하기
- 🌍 글로벌 검색 키워드: "personality test", "MBTI", "love compatibility", "career test" 등이 번역 시 자연스럽게 포함

## 테스트 주제 다양성

✅ **카테고리 다양성 보장**: 매일 생성되는 2개의 테스트는 서로 다른 카테고리로 생성됩니다.

**지원 카테고리 (8개):**

1. **personality** (성격) - 예: "당신의 성격 유형 테스트"
2. **love** (연애) - 예: "연애 스타일 테스트", "이상형 심리 테스트"
3. **mbti** (MBTI) - 예: "MBTI 성격 유형 테스트"
4. **career** (진로/직업) - 예: "당신에게 맞는 직업 테스트"
5. **friendship** (인간관계) - 예: "인간관계 스타일 테스트"
6. **vacation** (휴가/여행) - 예: "당신의 여행 스타일 테스트"
7. **animal** (동물 캐릭터) - 예: "당신을 나타내는 동물 테스트"
8. **fun** (재미) - 예: "당신의 유머 스타일 테스트"

**자동 다양성 확보:**

- 첫 번째 테스트: 랜덤 카테고리 선택
- 두 번째 테스트: 첫 번째와 다른 카테고리 선택
- 매번 다른 주제 생성으로 콘텐츠 다양성 보장

## Vercel Cron Job 설정

`vercel.json` 파일에 다음이 포함되어 있습니다:

```json
{
  "crons": [
    {
      "path": "/api/cron/generate-tests",
      "schedule": "0 23 * * *"
    }
  ]
}
```

- **스케줄**: 매일 23시 (UTC 기준)
- **경로**: `/api/cron/generate-tests`
- **생성 개수**: 매일 2개 (서로 다른 카테고리)

## 수동 실행 (테스트용)

개발 환경에서 수동으로 테스트하려면:

```bash
curl -X GET "http://localhost:3000/api/cron/generate-tests" \
  -H "Authorization: Bearer your_cron_secret"
```

또는 브라우저에서 직접 호출 (인증 제거 후):

```typescript
// 개발용: 인증 체크 제거 가능
```

## 이메일 알림

✅ **자동 완료 이메일**: 테스트 생성이 완료되면 자동으로 `cmoonjun11@gmail.com`으로 결과를 이메일로 발송합니다.

**이메일 내용:**

- 생성 성공/실패 개수
- 성공한 테스트 ID 목록
- 실패한 테스트의 에러 메시지
- 생성 시간

**설정 방법:**

1. Resend API 키 발급: [resend.com](https://resend.com)에서 API 키 발급
2. 환경 변수 설정: `RESEND_API_KEY` 환경 변수에 API 키 추가

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

**참고:**

- 이메일 발송 실패 시에도 테스트 생성은 정상적으로 완료됩니다
- 이메일은 비동기로 발송되므로 API 응답 시간에 영향을 주지 않습니다

## 무한 루프 방지

✅ **방어 로직 추가**: Gemini API 호출 시 무한 루프를 방지하기 위한 여러 안전장치가 추가되었습니다.

**안전장치:**

1. **최대 재시도 횟수 제한**: 각 단계별 최대 5번까지만 재시도

   - 주제 생성: 최대 5번
   - 질문 생성: 최대 5번
   - 결과 생성: 최대 5번

2. **최대 실행 시간 제한**:

   - 단일 테스트 생성: 최대 5분
   - 전체 프로세스 (2개 테스트): 최대 10분

3. **에러 타입별 처리**:
   - 결제/빌링 에러: 즉시 포기 (재시도 불가)
   - 할당량 완전 소진: 즉시 포기
   - 서버 과부하: 지수 백오프 후 재시도 (최대 2번)
   - 기타 에러: 최대 재시도 횟수 내에서 재시도

**로그 예시:**

```
❌ 최대 재시도 횟수 초과 (5번)
❌ 최대 실행 시간 초과 (300초)
```

## 로그 확인

Vercel 대시보드의 Functions 탭에서 실행 로그를 확인할 수 있습니다.

### 로그 예시

**성공 시:**

```
테스트 자동 생성 시작: 2025-12-08T19:00:48.738Z
✅ 테스트 생성 성공: "당신의 성격 유형 테스트" (질문: 12개, 결과: 4개)
테스트 1 저장 완료: { success: true, testId: "123" }
```

**할당량 초과 시:**

```
⚠️ Gemini API 할당량 초과 (모델: gemini-2.0-flash-exp, 시도 1/2)
⏳ 할당량 복구 대기 중... (11초)
🔄 대체 모델로 재시도 중... (현재: gemini-2.0-flash-exp)
```

**완전한 할당량 소진 시:**

```
❌ 할당량이 완전히 소진되었습니다. 다음 날까지 대기해야 합니다.
💡 해결 방법: Google AI Studio에서 할당량을 확인하거나 유료 플랜으로 업그레이드하세요.
```
