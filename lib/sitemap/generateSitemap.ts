import { getAllTests } from "@/lib/supabase/getAllTests";
import { getActiveCategories } from "@/lib/supabase/getActiveCategories";
import { Language } from "@/store/useLanguageStore";

type PageData = {
  locale: Language;
  path: string; // 로케일을 포함한 전체 상대 경로 (e.g., /en/test/1)
  lastmod?: string;
};

export async function generateSitemapXml() {
  const baseUrl = "https://testy.im";
  const locales: Language[] = ["en", "ko", "ja", "vi"];

  // 페이지를 기본 경로(로케일 제외) 기준으로 그룹화하는 Map
  // Key: "/test/123", Value: [ {locale: 'en', ...}, {locale: 'ko', ...} ]
  const pageGroups = new Map<string, PageData[]>();

  // 페이지를 그룹에 추가하는 헬퍼 함수
  const addPage = (basePath: string, data: PageData) => {
    if (!pageGroups.has(basePath)) {
      pageGroups.set(basePath, []);
    }
    pageGroups.get(basePath)!.push(data);
  };

  // 1. 정적 페이지 추가
  const staticBasePaths = [
    "",
    "/test/list",
    "/play/draw",
    "/play/ladder",
    "/play/lunch",
  ];
  staticBasePaths.forEach((basePath) => {
    locales.forEach((locale) => {
      addPage(basePath, {
        locale,
        // 홈페이지("")의 경우와 그 외 경우를 구분하여 path 생성
        path: basePath ? `/${locale}${basePath}` : `/${locale}`,
      });
    });
  });

  // 2. 동적 페이지 추가 (모든 로케일 데이터 병렬 요청)
  const allLocaleData = await Promise.all(
    locales.map(async (locale) => {
      const [tests, categories] = await Promise.all([
        getAllTests(locale),
        getActiveCategories(locale),
      ]);
      return { locale, tests, categories };
    })
  );

  allLocaleData.forEach(({ locale, tests, categories }) => {
    categories.forEach((cat) => {
      const basePath = `/category/${cat.code}`;
      addPage(basePath, { locale, path: `/${locale}${basePath}` });
    });
    tests.forEach((test) => {
      const basePath = `/test/${test.id}`;
      addPage(basePath, {
        locale,
        path: `/${locale}${basePath}`,
        lastmod: new Date(test.created_at).toISOString(),
      });
    });
  });

  // 3. 그룹화된 페이지를 기반으로 XML 문자열 생성
  const urlEntries = Array.from(pageGroups.values())
    .map((group) => {
      // <loc> 에는 'en' 버전을 우선 사용하고, 없으면 첫 번째 항목 사용
      const primaryPage = group.find((p) => p.locale === "en") || group[0];

      // 그룹 내에서 가장 최신 lastmod 찾기
      const lastmod = group.reduce(
        (latest, { lastmod }) =>
          !lastmod
            ? latest
            : !latest || new Date(lastmod) > new Date(latest)
            ? lastmod
            : latest,
        undefined as string | undefined
      );

      const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";

      // 그룹 내 모든 언어 버전에 대한 hreflang 태그 생성
      const hreflangTags = group
        .map(({ locale, path }) => {
          const hreflang =
            locale === "en"
              ? "en-US"
              : locale === "ko"
              ? "ko-KR"
              : locale === "ja"
              ? "ja-JP"
              : "vi-VN";
          return `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${baseUrl}${path}" />`;
        })
        .join("\n");

      return `
  <url>
    <loc>${baseUrl}${primaryPage.path}</loc>${lastmodTag}
${hreflangTags}
  </url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urlEntries}
</urlset>
`;
}
