// lib/email/sendCompletionEmail.ts
// 테스트 생성 완료 시 이메일 발송

interface TestResult {
  test: string;
  success: boolean;
  testId?: number;
  error?: string;
}

export async function sendCompletionEmail(
  results: TestResult[],
  successCount: number,
  totalCount: number
): Promise<{ success: boolean; error?: string }> {
  const recipientEmail = "cmoonjun11@gmail.com";
  
  // Resend API 키 확인
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.warn("⚠️ RESEND_API_KEY가 설정되지 않아 이메일을 발송할 수 없습니다.");
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const successTests = results.filter((r) => r.success);
    const failedTests = results.filter((r) => !r.success);

    const emailSubject = `✅ 테스트 자동 생성 완료 (${successCount}/${totalCount})`;
    
    const emailBody = `
테스트 자동 생성이 완료되었습니다.

📊 생성 결과:
- 성공: ${successCount}개
- 실패: ${totalCount - successCount}개

${successTests.length > 0 ? `
✅ 성공한 테스트:
${successTests.map((r, idx) => `  ${idx + 1}. 테스트 ID: ${r.testId}`).join("\n")}
` : ""}

${failedTests.length > 0 ? `
❌ 실패한 테스트:
${failedTests.map((r, idx) => `  ${idx + 1}. ${r.test}: ${r.error || "알 수 없는 오류"}`).join("\n")}
` : ""}

생성 시간: ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}
`;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Testy <noreply@testy.im>",
        to: recipientEmail,
        subject: emailSubject,
        text: emailBody,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Resend API error: ${JSON.stringify(errorData)}`);
    }

    console.log(`✅ 완료 이메일 발송 성공: ${recipientEmail}`);
    return { success: true };
  } catch (error: any) {
    console.error("❌ 이메일 발송 실패:", error);
    return { success: false, error: error.message };
  }
}

