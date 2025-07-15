import { getAllTests } from "@/lib/supabase/getAllTests";
import { getActiveCategories } from "@/lib/supabase/getActiveCategories";
import { Language } from "@/store/useLanguageStore";

// SitemapUrl 타입을 확장하여 hreflang 정보를 포함할 수 있도록 합니다.
type SitemapUrl = {
  loc: string;
  lastmod?: string;
  alternates?: { href: string; hreflang: string }[];
};

// 1. 코드를 재구성하여 URL 그룹별로 hreflang을 쉽게 추가하도록 변경합니다.
export async function generateSitemapXml() {
  const baseUrl = "https://testy.im";
  const locales: Language[] = ["en", "ko", "ja", "vi"];

  const allUrls: SitemapUrl[] = [];
  const staticPaths = [
    "", // 홈페이지
    "/test/list", // 전체 테스트 목록
    "/play/draw", // 추가된 페이지 1
    "/play/ladder", // 추가된 페이지 2
    "/play/lunch", // 추가된 페이지 3
  ];

  staticPaths.forEach((path) => {
    locales.forEach((locale) => {
      allUrls.push({
        loc: `${baseUrl}/${locale}${path}`,
        // 각 언어별 대체 페이지 정보 추가
        alternates: locales.map((altLocale) => ({
          href: `${baseUrl}/${altLocale}${path}`,
          hreflang: altLocale,
        })),
      });
    });
  });

  // 3. 카테고리 페이지에 대한 URL 및 hreflang 정보 생성
  // 모든 언어의 카테고리를 한 번에 가져옵니다. (실제 구현에 따라 수정 필요)
  // 예시: getActiveCategories()가 모든 언어의 카테고리를 반환한다고 가정
  const allCategories = await getActiveCategories(); // 이 함수는 모든 언어의 카테고리를 가져오도록 수정해야 할 수 있습니다.
  const uniqueCategoryCodes = [
    ...new Set(allCategories.map((cat) => cat.code)),
  ];

  uniqueCategoryCodes.forEach((code) => {
    locales.forEach((locale) => {
      allUrls.push({
        loc: `${baseUrl}/${locale}/category/${code}`,
        alternates: locales.map((altLocale) => ({
          href: `${baseUrl}/${altLocale}/category/${code}`,
          hreflang: altLocale,
        })),
      });
    });
  });

  // 4. 테스트 페이지에 대한 URL 및 hreflang 정보 생성
  // 모든 언어의 테스트를 한 번에 가져옵니다.
  const allTests = await getAllTests(); // 모든 언어의 테스트를 가져오도록 수정
  const uniqueTestIds = [...new Set(allTests.map((test) => test.id))];

  uniqueTestIds.forEach((id) => {
    // 특정 ID의 테스트 중 가장 최신 수정일을 찾습니다.
    const relevantTests = allTests.filter((test) => test.id === id);
    const lastmod = new Date(
      Math.max(
        ...relevantTests.map((test) => new Date(test.created_at).getTime())
      )
    ).toISOString();

    locales.forEach((locale) => {
      allUrls.push({
        loc: `${baseUrl}/${locale}/test/${id}`,
        lastmod: lastmod,
        alternates: locales.map((altLocale) => ({
          href: `${baseUrl}/${altLocale}/test/${id}`,
          hreflang: altLocale,
        })),
      });
    });
  });

  // 5. 최종 XML 생성
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${allUrls
    .map(({ loc, lastmod, alternates }) => {
      const alternatesXml = alternates
        ?.map(
          (alt) =>
            `<xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}"/>`
        )
        .join("\n    ");

      return `<url>
    <loc>${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
    ${alternatesXml || ""}
  </url>`;
    })
    .join("\n")}
</urlset>
  `.trim();

  return xml;
}
