-- 효율적인 번역 저장 함수
-- 번역에 필요한 데이터만 받아서 저장 (불변 데이터 제외)
--
-- ⚠️ 주의: 이 함수는 다음 테이블 구조를 가정합니다:
--   - test_translations: (test_id, language, title, description)
--   - questions: (id, test_id, order)
--   - question_translations: (question_id, language, question)
--   - options: (id, question_id, score, order)
--   - option_translations: (option_id, language, text)
--   - results: (id, test_id, score_min, score_max)
--   - result_translations: (result_id, language, title, description, recommendation, keywords)
--
-- 실제 스키마에 맞게 수정됨.

CREATE OR REPLACE FUNCTION insert_test_translation_efficient(
  p_translation_data jsonb,
  p_language text,
  p_test_id integer
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_question jsonb;
  v_option jsonb;
  v_result jsonb;
  v_question_id integer;
  v_option_id integer;
  v_result_id integer;
  v_option_index integer;
BEGIN
  -- 1. test_translations 테이블에 번역 메타데이터 저장/업데이트
  INSERT INTO test_translations (test_id, language, title, description)
  VALUES (
    p_test_id,
    p_language,
    p_translation_data->>'title',
    p_translation_data->>'description'
  )
  ON CONFLICT (test_id, language) 
  DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description;

  -- 2. questions 테이블의 번역 업데이트
  -- questions 테이블에서 해당 test_id의 질문들을 순서대로 가져옴
  -- ✅ 수정: order_index -> order (실제 컬럼명)
  FOR v_question_id, v_question IN 
    SELECT id, value
    FROM questions q
    CROSS JOIN LATERAL jsonb_array_elements(p_translation_data->'questions') WITH ORDINALITY AS t(value, idx)
    WHERE q.test_id = p_test_id
      AND q."order" = (t.idx - 1)::integer
    ORDER BY q."order"
  LOOP
    -- ✅ 수정: question_text -> question
    INSERT INTO question_translations (question_id, language, question)
    VALUES (v_question_id, p_language, v_question->>'question')
    ON CONFLICT (question_id, language)
    DO UPDATE SET
      question = EXCLUDED.question;

    -- options 번역 저장/업데이트
    -- ✅ 수정: option_index 대신 option_id와 order를 사용
    v_option_index := 0;
    FOR v_option IN SELECT * FROM jsonb_array_elements(v_question->'options')
    LOOP
      -- options 테이블에서 option_id 찾기
      SELECT id INTO v_option_id
      FROM options
      WHERE question_id = v_question_id
        AND "order" = v_option_index
      LIMIT 1;

      IF v_option_id IS NOT NULL THEN
        -- ✅ 수정: option_text -> text, option_index -> option_id
        INSERT INTO option_translations (option_id, language, text)
        VALUES (v_option_id, p_language, v_option->>'text')
        ON CONFLICT (option_id, language)
        DO UPDATE SET
          text = EXCLUDED.text;
      END IF;
      
      v_option_index := v_option_index + 1;
    END LOOP;
  END LOOP;

  -- 3. results 테이블의 번역 업데이트
  -- results 테이블에서 해당 test_id의 결과들을 순서대로 가져옴
  -- ✅ 수정: score_range_min -> score_min, score_range_max -> score_max
  FOR v_result_id, v_result IN
    SELECT r.id, value
    FROM results r
    CROSS JOIN LATERAL jsonb_array_elements(p_translation_data->'results') WITH ORDINALITY AS t(value, idx)
    WHERE r.test_id = p_test_id
      AND (
        -- score_range로 매칭 (더 정확한 매칭)
        (value->'score_range'->>0)::integer = r.score_min
        AND (value->'score_range'->>1)::integer = r.score_max
      )
    ORDER BY r.score_min
  LOOP
    -- result_translations에 번역 저장/업데이트
    INSERT INTO result_translations (
      result_id,
      language,
      title,
      description,
      recommendation,
      keywords
    )
    VALUES (
      v_result_id,
      p_language,
      v_result->>'title',
      v_result->>'description',
      v_result->'recommendation',
      v_result->'keywords'
    )
    ON CONFLICT (result_id, language)
    DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      recommendation = EXCLUDED.recommendation,
      keywords = EXCLUDED.keywords;
  END LOOP;

END;
$$;

-- 함수 설명 추가
COMMENT ON FUNCTION insert_test_translation_efficient IS 
'효율적인 번역 저장 함수. 번역에 필요한 데이터만 받아서 저장하여 토큰 및 네트워크 사용량을 최소화합니다.';


