// app/[locale]/page.tsx
import HomePage from "@/components/home-page";
import { getNewTests } from "@/lib/supabase/getNewTests";
import { Language } from "@/store/useLanguageStore";

// 1. 함수를 async로 만듭니다.
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // 2. params를 await으로 받아 구조 분해합니다.
  const { locale } = await params;
  const initialTests = await getNewTests(locale as Language);

  return <HomePage locale={locale} initialTests={initialTests} />;
}
