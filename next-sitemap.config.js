/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://testy.im",
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000,
  i18n: {
    locales: ["ko", "en", "ja", "vi"],
    defaultLocale: "ko",
  },
  exclude: ["/admin", "/auth", "/404", "/500"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },

  // ✅ 여기 추가
  additionalSitemaps: async () => [
    {
      loc: "https://testy.im/server-sitemap.xml",
    },
  ],
};
