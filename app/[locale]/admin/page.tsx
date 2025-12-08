// app/[locale]/admin/page.tsx - Server Component로 접근 제어
import { redirect } from "next/navigation";
import { createClientForServer } from "@/lib/supabase/server";
import AdminPageClient from "./AdminPageClient";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // 서버에서 사용자 인증 및 권한 확인
  const supabase = await createClientForServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 허용된 이메일 목록 확인
  const allowedEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_ALLOWED_EMAILS;
  const allowedEmails = allowedEmailsEnv
    ? allowedEmailsEnv.split(",").map((email) => email.trim())
    : [];

  // 로그인하지 않았거나 허용된 이메일이 아닌 경우 리다이렉트
  if (!user || !allowedEmails.includes(user.user_metadata?.email || "")) {
    redirect(`/${locale}`);
  }

  // 권한이 있는 경우에만 클라이언트 컴포넌트 렌더링
  return <AdminPageClient />;
}
