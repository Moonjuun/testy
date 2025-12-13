// app/[locale]/test/list/page.tsx
import { absoluteUrl } from "@/lib/utils";
import { TestListClient } from "./test-list-client";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const origin = absoluteUrl();

  const metadataByLocale = {
    ko: {
      title: "테스트 전체 목록 | Testy",
      description:
        "모든 성향 테스트를 한 곳에서 확인하세요. 연애, 성격, 심리 테스트까지!",
    },
    en: {
      title: "All Personality Tests | Testy",
      description:
        "Browse all psychological and relationship tests in one place.",
    },
    ja: {
      title: "すべてのテスト一覧 | Testy",
      description: "心理テストや恋愛テストを一気にチェック！",
    },
    vi: {
      title: "Danh sách tất cả bài kiểm tra | Testy",
      description: "Tất cả bài kiểm tra tính cách và tâm lý ở một nơi.",
    },
  };

  const meta =
    metadataByLocale[locale as keyof typeof metadataByLocale] ??
    metadataByLocale.en;

  const url = `https://testy.im/${locale}/test/list`;
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
        "ko-KR": `${origin}/ko/test/list`,
        "en-US": `${origin}/en/test/list`,
        "ja-JP": `${origin}/ja/test/list`,
        "vi-VN": `${origin}/vi/test/list`,
        "x-default": `${origin}/en/test/list`,
      },
    },
  };
}

/**
 * 이 페이지는 이제 매우 단순한 서버 컴포넌트입니다.
 * 주된 역할은 데이터 로딩 및 상호작용을 처리할
 * 클라이언트 컴포넌트를 렌더링하는 것입니다.
 */
export default function TestsListPage() {
  return <TestListClient />;
}
