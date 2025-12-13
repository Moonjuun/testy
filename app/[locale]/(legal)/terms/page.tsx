// app/[locale]/(legal)/terms/page.tsx
import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const url = `https://testy.im/${locale}/terms`;

  const metadataByLocale = {
    ko: {
      title: "이용약관 | Testy",
      description: "Testy의 이용약관을 확인하세요.",
    },
    en: {
      title: "Terms of Service | Testy",
      description: "Read Testy's terms of service.",
    },
    ja: {
      title: "利用規約 | Testy",
      description: "Testyの利用規約をご確認ください。",
    },
    vi: {
      title: "Điều khoản dịch vụ | Testy",
      description: "Đọc điều khoản dịch vụ của Testy.",
    },
  };

  const meta =
    metadataByLocale[locale as keyof typeof metadataByLocale] ||
    metadataByLocale.en;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: url,
      languages: {
        "ko-KR": "https://testy.im/ko/terms",
        "en-US": "https://testy.im/en/terms",
        "ja-JP": "https://testy.im/ja/terms",
        "vi-VN": "https://testy.im/vi/terms",
      },
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const filePath = path.join(
    process.cwd(),
    "public",
    "content",
    "legal",
    `terms-${locale}.md`
  );
  let markdown: string;

  try {
    markdown = fs.readFileSync(filePath, "utf8");
  } catch {
    markdown = "# 404\n페이지를 찾을 수 없습니다.";
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <main className="container mx-auto px-4 py-12">
        <article className="prose dark:prose-invert max-w-4xl mx-auto">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </article>
      </main>
    </div>
  );
}
