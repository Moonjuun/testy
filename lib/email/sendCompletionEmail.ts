// lib/email/sendCompletionEmail.ts
// 테스트 생성 완료 시 이메일 발송

interface TestResult {
  test: string;
  success: boolean;
  testId?: number;
  title?: string;
  categoryId?: number;
  error?: string;
  imageGeneration?: {
    thumbnailSuccess: boolean;
    resultImagesSuccess: number;
    resultImagesTotal: number;
  };
}

// 카테고리 ID를 이름으로 변환
function getCategoryName(categoryId?: number): string {
  const categoryMap: Record<number, string> = {
    1: "성격",
    2: "연애",
    3: "MBTI",
    4: "진로/직업",
    5: "인간관계",
    6: "휴가/여행",
    7: "동물 캐릭터",
    8: "재미",
  };
  return categoryId ? categoryMap[categoryId] || `카테고리 ${categoryId}` : "알 수 없음";
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

    // 오늘 날짜 포맷팅 (YYYY-MM-DD)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const today = `${year}-${month}-${day}`;

    const emailSubject = `✅ 테스트 자동 생성 완료 [${today}] (${successCount}/${totalCount})`;
    
    const emailBodyText = `
테스트 자동 생성이 완료되었습니다.

📊 생성 결과:
- 성공: ${successCount}개
- 실패: ${totalCount - successCount}개

${successTests.length > 0 ? `
✅ 성공한 테스트:
${successTests
  .map(
    (r, idx) => {
      const imageInfo = r.imageGeneration
        ? `     - 이미지: 썸네일 ${r.imageGeneration.thumbnailSuccess ? "✅" : "❌"}, 결과 ${r.imageGeneration.resultImagesSuccess}/${r.imageGeneration.resultImagesTotal}개 성공`
        : "";
      return `  ${idx + 1}. 테스트 ID: ${r.testId || "N/A"}
     - 주제: ${r.title || "제목 없음"}
     - 카테고리: ${getCategoryName(r.categoryId)}${imageInfo}`;
    }
  )
  .join("\n")}
` : ""}

${failedTests.length > 0 ? `
❌ 실패한 테스트:
${failedTests.map((r, idx) => `  ${idx + 1}. ${r.test}: ${r.error || "알 수 없는 오류"}`).join("\n")}
` : ""}

생성 시간: ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}
`;

    // HTML 형식 이메일 본문
    const emailBodyHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .success { background-color: #e8f5e9; padding: 15px; margin: 10px 0; border-left: 4px solid #4CAF50; }
    .failed { background-color: #ffebee; padding: 15px; margin: 10px 0; border-left: 4px solid #f44336; }
    .test-item { margin: 10px 0; padding: 10px; background-color: #f5f5f5; border-radius: 5px; }
    .test-id { font-weight: bold; color: #2196F3; }
    .test-title { font-size: 1.1em; margin: 5px 0; }
    .test-category { color: #666; font-size: 0.9em; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 0.9em; }
  </style>
</head>
<body>
  <div class="header">
    <h1>✅ 테스트 자동 생성 완료</h1>
  </div>
  <div class="content">
    <h2>📊 생성 결과</h2>
    <p><strong>성공:</strong> ${successCount}개</p>
    <p><strong>실패:</strong> ${totalCount - successCount}개</p>

    ${successTests.length > 0 ? `
    <div class="success">
      <h3>✅ 성공한 테스트</h3>
      ${successTests
        .map(
          (r, idx) => {
            const imageInfo = r.imageGeneration
              ? `<div class="test-category">이미지: 썸네일 ${r.imageGeneration.thumbnailSuccess ? "✅" : "❌"}, 결과 ${r.imageGeneration.resultImagesSuccess}/${r.imageGeneration.resultImagesTotal}개 성공</div>`
              : "";
            return `
      <div class="test-item">
        <div class="test-id">${idx + 1}. 테스트 ID: ${r.testId || "N/A"}</div>
        <div class="test-title">주제: ${r.title || "제목 없음"}</div>
        <div class="test-category">카테고리: ${getCategoryName(r.categoryId)}</div>
        ${imageInfo}
      </div>`;
          }
        )
        .join("")}
    </div>
    ` : ""}

    ${failedTests.length > 0 ? `
    <div class="failed">
      <h3>❌ 실패한 테스트</h3>
      ${failedTests
        .map((r, idx) => `<div class="test-item">${idx + 1}. ${r.test}: ${r.error || "알 수 없는 오류"}</div>`)
        .join("")}
    </div>
    ` : ""}
  </div>
  <div class="footer">
    생성 시간: ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}
  </div>
</body>
</html>
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
        text: emailBodyText,
        html: emailBodyHtml,
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

