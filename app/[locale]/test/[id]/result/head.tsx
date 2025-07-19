// app/[locale]/test/[id]/result/head.tsx
"use server"; // head.tsx는 서버 컴포넌트로 작성해야 합니다.

import { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: { locale: string; id: string };
}): Promise<Metadata> {
  const { locale, id } = params;
  const origin = absoluteUrl(); // e.g. "https://testy.im"

  // 각 언어별 URL
  const paths = {
    ko: `${origin}/ko/test/${id}/result`,
    en: `${origin}/en/test/${id}/result`,
    ja: `${origin}/ja/test/${id}/result`,
    vi: `${origin}/vi/test/${id}/result`,
  };

  return {
    alternates: {
      canonical: paths[locale as keyof typeof paths],
      languages: {
        ko: paths.ko,
        en: paths.en,
        ja: paths.ja,
        vi: paths.vi,
        // 기본 언어가 결정되지 않은 경우
        "x-default": `${origin}/${locale}/test/${id}/result`,
      },
    },
  };
}
