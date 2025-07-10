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

  if (pathnameHasLocale) {
    return await updateSession(request);
  }

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
