// src/lib/supabase/server.ts
// Server Component 및 Server Actions용 Supabase 클라이언트
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * 서버 컴포넌트 또는 Server Actions에서 사용하는 Supabase 클라이언트를 생성합니다.
 * 쿠키 기반 세션 관리를 포함합니다.
 * 
 * @example
 * ```tsx
 * // app/[locale]/page.tsx
 * import { createClientForServer } from "@/lib/supabase/server";
 * 
 * export default async function Page() {
 *   const supabase = await createClientForServer();
 *   const { data: { user } } = await supabase.auth.getUser();
 *   // ...
 * }
 * ```
 */
export async function createClientForServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

