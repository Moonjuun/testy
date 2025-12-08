// src/lib/supabase/client.ts
// Client Component용 Supabase 클라이언트
"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * 클라이언트 컴포넌트에서 사용하는 Supabase 클라이언트를 생성합니다.
 * 
 * @example
 * ```tsx
 * "use client";
 * import { createClient } from "@/lib/supabase/client";
 * 
 * export function MyComponent() {
 *   const supabase = createClient();
 *   // ...
 * }
 * ```
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

