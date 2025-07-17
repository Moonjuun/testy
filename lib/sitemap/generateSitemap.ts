import { getAllTests } from "@/lib/supabase/getAllTests";
import { getActiveCategories } from "@/lib/supabase/getActiveCategories";
import { Language } from "@/store/useLanguageStore";

type SitemapUrl = {
  path: string; // locale 포함한 상대 경로
  lastmod?: string;
};

export async function generateSitemapXml() {
  const baseUrl = "https://testy.im";
  const locales: Language[] = ["en", "ko", "ja", "vi"];

  // static urls
  const staticPaths = [
    "", // homepage
    "test/list",
    "play/draw",
    "play/ladder",
    "play/lunch",
  ];

  const staticUrls: SitemapUrl[] = locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      path: `/${locale}/${path}`.replace(/\/+$/, ""), // 중복 슬래시 제거
    }))
  );

  // dynamic urls
  const dynamicUrls: SitemapUrl[] = [];

  for (const locale of locales) {
    const [tests, categories] = await Promise.all([
      getAllTests(locale),
      getActiveCategories(locale),
    ]);

    categories.forEach((cat) => {
      dynamicUrls.push({
        path: `/${locale}/category/${cat.code}`,
      });
    });

    tests.forEach((test) => {
      dynamicUrls.push({
        path: `/${locale}/test/${test.id}`,
        lastmod: new Date(test.created_at).toISOString(),
      });
    });
  }

  const allUrls = [...staticUrls, ...dynamicUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allUrls
  .map(({ path, lastmod }) => {
    const absoluteUrl = `${baseUrl}${path}`;

    // 동일 path의 다국어 페이지들을 cross-link
    const hreflangLinks = locales
      .map(
        (lang) => `
    <xhtml:link 
      rel="alternate" 
      hreflang="${
        lang === "en"
          ? "en-US"
          : lang === "ko"
          ? "ko-KR"
          : lang === "ja"
          ? "ja-JP"
          : "vi-VN"
      }" 
      href="${baseUrl}/${lang}${path.replace(/^\/[a-z]{2}/, "")}" />`
      )
      .join("");

    return `
  <url>
    <loc>${absoluteUrl}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
    ${hreflangLinks}
  </url>`;
  })
  .join("\n")}
</urlset>`.trim();

  return xml;
}
