// app/[locale]/play/lunch/page.tsx

import LunchRecommendation from "@/components/play/lunch/LunchRecommendation";
import { getAllLunchMenus } from "@/lib/supabase/getAllLunchMenus";
import { Language } from "@/store/useLanguageStore";

export const dynamic = "force-dynamic";

export default async function LunchPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;

  const allMenus = await getAllLunchMenus(locale as Language);
  return <LunchRecommendation allMenus={allMenus} />;
}
