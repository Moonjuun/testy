//apis/sendTestJson.ts
export const sendTestJson = async (jsonData: any) => {
  // Supabase Edge Function 대신 Next.js API Route를 호출합니다.
  // 이 경로는 여러분이 API Route 파일을 생성할 경로입니다.
  const response = await fetch("/api/insert-test-via-rpc", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Next.js API Route는 서버리스 함수이므로, 여기서는 Authorization 헤더가 필요 없습니다.
      // API Route 내부에서 Supabase 클라이언트가 초기화될 때 환경 변수를 사용합니다.
    },
    // JSON 데이터를 문자열로 변환하여 body에 전송
    body: JSON.stringify(jsonData),
  });

  const result = await response.json();

  if (!response.ok) {
    // API Route에서 발생한 에러를 클라이언트로 전달
    throw new Error(result.error || "업로드 실패");
  }

  return result; // 성공 시 서버에서 반환한 결과 (예: testId)
};
