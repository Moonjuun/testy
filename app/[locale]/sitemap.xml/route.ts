// app/sitemap.xml/route.ts

import { NextResponse } from "next/server";
import { generateSitemapXml } from "@/lib/sitemap/generateSitemap"; // 경로는 그대로 재사용

export async function GET() {
  const xml = await generateSitemapXml(); // 이미 다국어 통합 sitemap 생성하는 함수로 구성되어 있다면 이대로 OK

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
