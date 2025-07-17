import { getAllTests } from "@/lib/supabase/getAllTests";
import { getActiveCategories } from "@/lib/supabase/getActiveCategories";
import { Language } from "@/store/useLanguageStore";

type SitemapUrl = {
  loc: string;
  lastmod?: string;
};

// 1. 함수가 특정 언어를 인자로 받지 않도록 수정합니다.
export async function generateSitemapXml() {
  const baseUrl = "https://testy.im";
  // 2. 지원하는 모든 언어 목록을 정의합니다.
  const locales: Language[] = ["en", "ko", "ja", "vi"];

  // 3. 정적 페이지 URL을 모든 언어에 대해 생성합니다.
  const staticUrls: SitemapUrl[] = locales.flatMap((locale) => [
    { loc: `${baseUrl}/${locale}` }, // 각 언어의 홈페이지
    { loc: `${baseUrl}/${locale}/test/list` },
    { loc: `${baseUrl}/${locale}/play/draw` },
    { loc: `${baseUrl}/${locale}/play/ladder` },
    { loc: `${baseUrl}/${locale}/play/lunch` },
  ]);

  // 4. 동적 페이지(카테고리, 테스트) URL을 모든 언어에 대해 생성합니다.
  const dynamicUrlsPromises = locales.map(async (locale) => {
    const [tests, categories] = await Promise.all([
      getAllTests(locale),
      getActiveCategories(locale),
    ]);

    const categoryUrls: SitemapUrl[] = categories.map((cat) => ({
      loc: `${baseUrl}/${locale}/category/${cat.code}`,
    }));

    const testUrls: SitemapUrl[] = tests.map((test) => ({
      loc: `${baseUrl}/${locale}/test/${test.id}`,
      lastmod: new Date(test.created_at).toISOString(),
    }));

    return [...categoryUrls, ...testUrls];
  });

  // Promise 배열을 실행하고, 결과를 하나의 배열로 합칩니다.
  const dynamicUrlsArrays = await Promise.all(dynamicUrlsPromises);
  const allDynamicUrls = dynamicUrlsArrays.flat();

  const allUrls: SitemapUrl[] = [...staticUrls, ...allDynamicUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
    .map(
      ({ loc, lastmod }) => `<url>
    <loc>${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
  </url>`
    )
    .join("\n")}
</urlset>
  `.trim();

  return xml;
}
