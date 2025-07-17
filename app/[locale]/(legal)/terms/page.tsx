// app/[locale]/(legal)/terms/page.tsx
import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";

interface Props {
  params: { locale?: string };
}

export default async function TermsPage({ params }: Props) {
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
