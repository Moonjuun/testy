// app/[locale]/(legal)/privacy/page.tsx
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
  const url = `https://testy.im/${locale}/privacy`;

  const metadataByLocale = {
    ko: {
      title: "개인정보 처리방침 | Testy",
      description: "Testy의 개인정보 처리방침을 확인하세요.",
    },
    en: {
      title: "Privacy Policy | Testy",
      description: "Read Testy's privacy policy.",
    },
    ja: {
      title: "プライバシーポリシー | Testy",
      description: "Testyのプライバシーポリシーをご確認ください。",
    },
    vi: {
      title: "Chính sách bảo mật | Testy",
      description: "Đọc chính sách bảo mật của Testy.",
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
        "ko-KR": "https://testy.im/ko/privacy",
        "en-US": "https://testy.im/en/privacy",
        "ja-JP": "https://testy.im/ja/privacy",
        "vi-VN": "https://testy.im/vi/privacy",
      },
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const filePath = path.join(
    process.cwd(),
    "public",
    "content",
    "privacy",
    `privacy-${locale}.md`
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
