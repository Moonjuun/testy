// src/utils/supabase/middleware.ts 파일

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const allowedEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_ALLOWED_EMAILS; // 클라이언트에서도 접근 가능하게 NEXT_PUBLIC_ 접두사 사용
  const allowedEmails = allowedEmailsEnv
    ? allowedEmailsEnv.split(",").map((email) => email.trim())
    : [];

  // admin 경로 체크: /admin 또는 /[locale]/admin
  const pathname = request.nextUrl.pathname;
  const isAdminPath =
    pathname.startsWith("/admin") ||
    /\/[a-z]{2}\/admin/.test(pathname); // /ko/admin, /en/admin 등

  if (isAdminPath) {
    // 로그인하지 않았거나 허용된 이메일이 아닌 경우
    if (!user || !allowedEmails.includes(user.user_metadata?.email || "")) {
      const url = request.nextUrl.clone();
      // locale이 있으면 해당 locale의 홈으로, 없으면 기본 홈으로
      const localeMatch = pathname.match(/\/([a-z]{2})\/admin/);
      if (localeMatch) {
        url.pathname = `/${localeMatch[1]}`;
      } else {
        url.pathname = "/ko"; // 기본 locale로 리다이렉트
      }
      return NextResponse.redirect(url);
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
