// app/[locale]/taro/page.tsx
import { Language } from "@/store/useLanguageStore";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

import Tarot from "@/components/taro/Tarot";

// 1) SEO를 위한 generateMetadata
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = await params;
  const url = `https://testy.im/${locale}/play/taro`; // TODO: 실제 도메인으로 교체

  const metadataByLocale = {
    ko: {
      title: "오늘의 운세 타로 | Testy",
      description:
        "카드를 뽑아 오늘의 운세를 확인해보세요! 연애, 금전, 학업, 커리어 등 분야별 메시지를 한 번에.",
      ogTitle: "타로 카드로 보는 오늘의 운세 | Testy",
      ogDescription:
        "궁금한 주제를 떠올리고 카드를 뽑아보세요. 지금 필요한 힌트를 전해드려요.",
    },
    en: {
      title: "Today's Tarot Reading | Testy",
      description:
        "Draw a card and see your daily tarot insights—love, finance, study, and career at a glance.",
      ogTitle: "Tarot Cards for Your Day | Testy",
      ogDescription:
        "Think of a question and pick a card. Get the hint you need right now.",
    },
    ja: {
      title: "今日のタロット占い | Testy",
      description:
        "カードを引いて今日の運勢をチェック！恋愛・金運・学業・キャリアのヒントを一度に。",
      ogTitle: "タロットで見る今日のメッセージ | Testy",
      ogDescription:
        "質問を思い描いてカードを引いてみましょう。今必要なヒントをお届けします。",
    },
    vi: {
      title: "Tarot hôm nay | Testy",
      description:
        "Rút một lá bài để xem thông điệp trong ngày—tình cảm, tài chính, học tập, sự nghiệp.",
      ogTitle: "Thông điệp Tarot cho hôm nay | Testy",
      ogDescription:
        "Hãy nghĩ về câu hỏi của bạn và rút một lá. Nhận gợi ý bạn đang cần.",
    },
  };

  const meta =
    (metadataByLocale as Record<string, any>)[locale] ?? metadataByLocale.ko;

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      url,
      siteName: "Testy",
      type: "website",
      locale,
      // images: [{ url: "https://.../og-taro.png" }], // 필요 시 추가
    },
    twitter: {
      card: "summary_large_image",
      title: meta.ogTitle,
      description: meta.ogDescription,
      // images: ["https://.../og-taro.png"], // 필요 시 추가
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

// 2) 페이지 컴포넌트
export default async function TarotPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;

  return (
    <div className="tarot">
      <Tarot locale={locale as Language} />
    </div>
  );
}
