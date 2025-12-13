// app/[locale]/play/lunch/page.tsx

import LunchRecommendation from "@/components/play/lunch/LunchRecommendation";
import { getAllLunchMenus } from "@/lib/supabase/getAllLunchMenus";
import { Language } from "@/store/useLanguageStore";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

// 1. SEO를 위한 generateMetadata 함수를 추가합니다.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const url = `https://testy.im/${locale}/play/lunch`; // TODO: 실제 도메인 주소로 변경해주세요.

  // 언어별 메타데이터를 상세하게 정의합니다.
  const metadataByLocale = {
    ko: {
      title: "오늘 뭐 먹지? 점심 메뉴 추천 룰렛 | Testy",
      description:
        "결정 장애를 위한 최고의 점심 메뉴 추천 룰렛! 한식, 중식, 일식 등 다양한 메뉴 중에서 랜덤으로 골라보세요. 더 이상 점심 메뉴 고민은 그만!",
      ogTitle: "점심 메뉴 추천 룰렛 | Testy",
      ogDescription: "오늘 점심 뭐 먹을지 고민이라면? 룰렛을 돌려보세요!",
    },
    en: {
      title: "What to Eat? Lunch Menu Roulette | Testy",
      description:
        "The ultimate lunch recommendation roulette for the indecisive! Randomly pick from various menus like Korean, Chinese, and Japanese. Stop worrying about what to eat for lunch!",
      ogTitle: "Lunch Menu Recommendation Roulette | Testy",
      ogDescription: "Wondering what to have for lunch? Spin the roulette!",
    },
    ja: {
      title: "今日何食べる？ランチメニュー推薦ルーレット | Testy",
      description:
        "決断できないあなたのための最高のランチメニュー推薦ルーレット！韓国料理、中華、和食など多様なメニューの中からランダムで選んでみましょう。もうランチメニューで悩むのはやめ！",
      ogTitle: "ランチメニュー推薦ルーレット | Testy",
      ogDescription:
        "今日のランチは何にしようか悩んでいますか？ルーレットを回してみてください！",
    },
    vi: {
      title: "Ăn gì hôm nay? Vòng quay gợi ý thực đơn bữa trưa | Testy",
      description:
        "Vòng quay gợi ý thực đơn bữa trưa tuyệt vời nhất dành cho những người thiếu quyết đoán! Chọn ngẫu nhiên từ nhiều thực đơn đa dạng như món Hàn, món Trung, món Nhật. Đừng lo lắng về việc ăn gì vào bữa trưa nữa!",
      ogTitle: "Vòng quay gợi ý thực đơn bữa trưa | Testy",
      ogDescription:
        "Bạn đang phân vân không biết ăn gì trưa nay? Hãy quay vòng quay!",
    },
  };

  const meta =
    metadataByLocale[locale as keyof typeof metadataByLocale] ??
    metadataByLocale.ko;

  const ogImage = `/og-image-${locale}.png`;

  return {
    title: meta.title,
    description: meta.description,
    metadataBase: new URL("https://testy.im"),
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      url: url,
      siteName: "Testy",
      type: "website",
      locale: locale,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: meta.ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.ogTitle,
      description: meta.ogDescription,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
      languages: {
        "ko-KR": `${url.replace(locale, "ko")}`,
        "en-US": `${url.replace(locale, "en")}`,
        "ja-JP": `${url.replace(locale, "ja")}`,
        "vi-VN": `${url.replace(locale, "vi")}`,
      },
    },
  };
}

export default async function LunchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const allMenus = await getAllLunchMenus(locale as Language);
  return <LunchRecommendation allMenus={allMenus} />;
}
