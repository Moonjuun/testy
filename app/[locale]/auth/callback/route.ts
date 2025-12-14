//app/[locale]/auth/callback/route.ts
import { createClientForServer } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const { locale } = await params;

  // 로그인 후 돌아갈 경로는 현재 언어('vi', 'ja' 등)의 홈페이지입니다.
  const next = `/${locale}`;

  if (code) {
    const supabase = await createClientForServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // 에러가 없으면 감지된 언어의 홈페이지로 리디렉션합니다.
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/${locale}/auth/auth-code-error`);
}
