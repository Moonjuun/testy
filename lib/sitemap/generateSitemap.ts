import { getAllTests } from "@/lib/supabase/getAllTests";

type SitemapUrl = {
  loc: string;
  lastmod?: string;
};

export async function generateSitemapXml(language: "ko" | "en" | "ja" | "vi") {
  const baseUrl = "https://testy.im";

  const tests = await getAllTests(language);

  const staticUrls: SitemapUrl[] = [
    { loc: `${baseUrl}/` },
    { loc: `${baseUrl}/tests` },
    { loc: `${baseUrl}/about` },
  ];

  const dynamicUrls: SitemapUrl[] = tests.map((test) => ({
    loc: `${baseUrl}/test/${test.id}?lang=${language}`,
    lastmod: new Date(test.created_at).toISOString(),
  }));

  const allUrls: SitemapUrl[] = [...staticUrls, ...dynamicUrls];

  const xml = `
    <?xml version="1.0" encoding="UTF-8" ?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allUrls
        .map(
          ({ loc, lastmod }) => `
        <url>
          <loc>${loc}</loc>
          ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
        </url>`
        )
        .join("\n")}
    </urlset>
  `.trim();

  return xml;
}
