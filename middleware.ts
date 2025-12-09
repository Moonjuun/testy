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

  if (pathname === "/mockServiceWorker.js") {
    return NextResponse.next();
  }

  // ✅ 확장자 있는 정적 자산은 미들웨어를 타지 않도록
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
    return NextResponse.next();
  }

  // ✅ 1. SEO 관련 경로는 미들웨어에서 제외
  const excludedPaths = ["/robots.txt", "/sitemap.xml", "/ads.txt"];
  if (excludedPaths.includes(pathname)) {
    return NextResponse.next(); // 미들웨어 무시하고 통과
  }

  // ✅ 2. API 경로는 세션 처리만 하고 locale 리디렉션 제외
  if (pathname.startsWith("/api")) {
    return await updateSession(request);
  }

  // ✅ 3. 이미 locale이 붙은 경로면 세션만 업데이트
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) {
    return await updateSession(request);
  }

  // 4. 삭제 된 경로는 리디렉션
  const url = request.nextUrl.clone();
  const lang = url.searchParams.get("lang");
  if (lang && locales.includes(lang)) {
    url.searchParams.delete("lang");
    url.pathname = `/${lang}${pathname}`;
    return NextResponse.redirect(url, 301);
  }

  // ✅ 5. locale 없을 경우 브라우저 언어 감지 후 리디렉션
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

// ✅ 6. matcher에서 SEO 파일들은 정규식으로 예외 처리
export const config = {
  matcher: [
    // locale prefix 없는 루트 경로들만 대상으로 지정
    "/((?!_next/|favicon.ico|robots.txt|ads\\.txt|sitemap\\.xml|sitemap-ko\\.xml|sitemap-en\\.xml|sitemap-ja\\.xml|sitemap-vi\\.xml|api|mockServiceWorker\\.js).*)",
  ],
};
