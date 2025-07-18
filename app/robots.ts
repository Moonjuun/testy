// app/robots.txt.ts
import { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/admin" }],
    sitemap: "https://testy.im/sitemap.xml",
  };
}
