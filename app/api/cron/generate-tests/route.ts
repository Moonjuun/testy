// app/api/cron/generate-tests/route.ts
// Vercel Cron Job: 매일 23시에 테스트 2개 자동 생성

import { NextRequest, NextResponse } from "next/server";
import { generateTwoTests } from "@/lib/gemini/generateTest";
import { saveTestToDatabase } from "@/lib/gemini/saveTestToDatabase";
import { sendCompletionEmail } from "@/lib/email/sendCompletionEmail";

/**
 * Vercel Cron Job 설정:
 * vercel.json에 다음 추가:
 * {
 *   "crons": [{
 *     "path": "/api/cron/generate-tests",
 *     "schedule": "0 23 * * *"
 *   }]
 * }
 */
export async function GET(request: NextRequest) {
  // ⚠️ 보안: CRON_SECRET 인증 필수 (프로덕션 및 개발 환경 모두)
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  // CRON_SECRET이 설정되지 않은 경우 경고
  if (!cronSecret) {
    console.error("⚠️ 보안 경고: CRON_SECRET 환경 변수가 설정되지 않았습니다.");
    console.error(
      "💡 이 API는 비용이 발생하므로 반드시 CRON_SECRET을 설정하세요."
    );
    // 프로덕션에서는 CRON_SECRET이 없으면 거부
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          error:
            "CRON_SECRET이 설정되지 않았습니다. 보안을 위해 이 엔드포인트는 비활성화됩니다.",
        },
        { status: 500 }
      );
    }
  }

  // 인증 확인
  if (cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      console.warn("⚠️ 인증 실패: 잘못된 CRON_SECRET");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else {
    // 개발 환경에서도 CRON_SECRET이 없으면 경고
    console.warn(
      "⚠️ 개발 환경: CRON_SECRET이 없어 인증을 건너뜁니다. 프로덕션에서는 반드시 설정하세요."
    );
  }

  // 환경 변수 확인
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY 환경 변수가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  try {
    console.log("테스트 자동 생성 시작:", new Date().toISOString());

    // 2개의 테스트 생성
    const [test1, test2] = await generateTwoTests();

    const results = [];
    let hasQuotaError = false;

    // 첫 번째 테스트 저장
    if (test1) {
      const result1 = await saveTestToDatabase(test1);
      results.push({
        test: "test1",
        success: result1.success,
        testId: result1.testId,
        title: test1.title,
        categoryId: test1.category_id,
        error: result1.error,
        imageGeneration: result1.imageGeneration,
      });
      console.log("테스트 1 저장 완료:", result1);
    } else {
      results.push({
        test: "test1",
        success: false,
        error: "테스트 생성 실패 (할당량 초과 또는 API 오류 가능)",
      });
      hasQuotaError = true;
    }

    // 두 번째 테스트 저장
    if (test2) {
      const result2 = await saveTestToDatabase(test2);
      results.push({
        test: "test2",
        success: result2.success,
        testId: result2.testId,
        title: test2.title,
        categoryId: test2.category_id,
        error: result2.error,
        imageGeneration: result2.imageGeneration,
      });
      console.log("테스트 2 저장 완료:", result2);
    } else {
      results.push({
        test: "test2",
        success: false,
        error: "테스트 생성 실패 (할당량 초과 또는 API 오류 가능)",
      });
      hasQuotaError = true;
    }

    // 할당량 초과로 인한 실패인 경우 경고 메시지 추가
    const successCount = results.filter((r) => r.success).length;
    const message =
      successCount > 0
        ? `테스트 자동 생성 완료 (성공: ${successCount}/2)`
        : "테스트 자동 생성 실패";

    // 이메일 발송 (비동기, 실패해도 응답은 정상 반환)
    sendCompletionEmail(results, successCount, 2).catch((emailError) => {
      console.error("이메일 발송 실패 (무시됨):", emailError);
    });

    return NextResponse.json(
      {
        success: successCount > 0,
        message,
        results,
        warning: hasQuotaError
          ? "일부 테스트 생성이 실패했습니다. Gemini API 할당량을 확인하세요."
          : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: successCount > 0 ? 200 : 500 }
    );
  } catch (error: any) {
    console.error("테스트 자동 생성 오류:", error);

    const isQuotaError =
      error?.message?.includes("429") ||
      error?.message?.includes("quota") ||
      error?.message?.includes("Too Many Requests");

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unknown error",
        quotaExceeded: isQuotaError,
        message: isQuotaError
          ? "Gemini API 할당량이 초과되었습니다. Google AI Studio에서 할당량을 확인하거나 유료 플랜으로 업그레이드하세요."
          : "테스트 자동 생성 중 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
