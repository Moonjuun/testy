// app/category/[id]/page.tsx
import { CategoryTestList } from "./category-test-list";
import { createClient } from "@/lib/supabase/client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
  const { id, locale } = await params;
  const supabase = createClient();

  const { data } = await supabase
    .from("categories")
    .select("name_ko, name_en, name_ja, name_vi")
    .eq("code", id)
    .maybeSingle();

  const name =
    locale === "en"
      ? data?.name_en
      : locale === "ja"
      ? data?.name_ja
      : locale === "vi"
      ? data?.name_vi
      : data?.name_ko ?? id;

  const metadataByLocale = {
    ko: {
      title: `${name} 테스트 모음 | Testy`,
      description: `${name} 관련 심리 테스트, 성향 테스트를 한 곳에 모아봤어요.`,
    },
    en: {
      title: `${name} Tests Collection | Testy`,
      description: `Browse all ${name} related psychological and personality tests in one place.`,
    },
    ja: {
      title: `${name} テスト一覧 | Testy`,
      description: `${name}関連の心理テスト・性格テストをまとめてチェック！`,
    },
    vi: {
      title: `Bộ sưu tập bài kiểm tra ${name} | Testy`,
      description: `Tất cả các bài kiểm tra tâm lý và tính cách liên quan đến ${name} ở một nơi.`,
    },
  };

  const meta =
    metadataByLocale[locale as keyof typeof metadataByLocale] ||
    metadataByLocale.en;

  const url = `https://testy.im/${locale}/category/${id}`;
  const ogImage = `/og-image-${locale}.png`;

  return {
    title: meta.title,
    description: meta.description,
    metadataBase: new URL("https://testy.im"),
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      siteName: "Testy",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
      type: "website",
      locale: locale,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
      languages: {
        "ko-KR": `https://testy.im/ko/category/${id}`,
        "en-US": `https://testy.im/en/category/${id}`,
        "ja-JP": `https://testy.im/ja/category/${id}`,
        "vi-VN": `https://testy.im/vi/category/${id}`,
      },
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CategoryTestList categoryId={id} />;
}
