// app/sitemap-ko.xml/route.ts

import { NextResponse } from "next/server";
import { generateSitemapXml } from "@/lib/sitemap/generateSitemap";

export async function GET() {
  const xml = await generateSitemapXml();

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
