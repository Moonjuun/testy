// middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "./lib/supabase/middleware";

const locales = ["ko", "en", "ja", "vi"];

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language") ?? "en";
  const browserLanguage = acceptLanguage.split(",")[0].split("-")[0];
  return locales.includes(browserLanguage) ? browserLanguage : "en";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // API 경로를 로케일 처리 대상에서 제외
  if (pathname.startsWith("/api")) {
    return await updateSession(request); // API 경로는 세션 업데이트만 수행하고 로케일 처리 건너뛰기
  }

  if (pathnameHasLocale) {
    return await updateSession(request);
  }

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // API 라우트 및 robots.txt, favicon.ico 등 특정 파일을 제외합니다.
    "/((?!_next/static|_next/image|favicon.ico|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)",
  ],
};
