// app/sitemap.ts
import { MetadataRoute } from "next";
import { getAllTests } from "@/lib/supabase/getAllTests";
import { getActiveCategories } from "@/lib/supabase/getActiveCategories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://testy.im";
  const locales = ["ko", "en", "ja", "vi"] as const;

  // 1) 정적 URL
  const staticUrls = locales.flatMap((locale) => [
    { url: `${baseUrl}/${locale}`, lastModified: new Date() },
    { url: `${baseUrl}/${locale}/test/list`, lastModified: new Date() },
    // …etc
  ]);

  // 2) 동적 URL
  const dynamicUrls = (
    await Promise.all(
      locales.map(async (locale) => {
        const [tests, categories] = await Promise.all([
          getAllTests(locale),
          getActiveCategories(locale),
        ]);
        return [
          ...categories.map((cat) => ({
            url: `${baseUrl}/${locale}/category/${cat.code}`,
            lastModified: new Date(),
          })),
          ...tests.map((t) => ({
            url: `${baseUrl}/${locale}/test/${t.id}`,
            lastModified: new Date(t.created_at),
          })),
        ];
      })
    )
  ).flat();

  return [...staticUrls, ...dynamicUrls];
}
