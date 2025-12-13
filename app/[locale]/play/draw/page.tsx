// app/[locale]/play/draw/page.tsx

import DrawPage from "@/components/play/draw/DrawGame";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

// 1. SEO를 위한 generateMetadata 함수를 수정합니다.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const url = `https://testy.im/${locale}/play/draw`;

  // '스피드 드로우' 컨셉에 맞게 언어별 메타데이터를 수정합니다.
  const metadataByLocale = {
    ko: {
      title: "스피드 드로우 게임 - 누가 더 빨리 그릴까? | Testy",
      description:
        "제한 시간 안에 제시된 그림을 가장 빠르고 정확하게 그려보세요! 친구들과 함께 즐기는 온라인 스피드 드로우 게임으로 당신의 그림 실력을 뽐내보세요.",
      ogTitle: "온라인 스피드 드로우 게임 | Testy",
      ogDescription: "제한 시간 안에 그림을 완성하세요! 과연 당신의 순발력은?",
    },
    en: {
      title: "Speed Draw Game - How Fast Can You Sketch? | Testy",
      description:
        "Draw the given image as quickly and accurately as you can before time runs out! Show off your drawing skills in this fun online speed draw game.",
      ogTitle: "Online Speed Draw Game | Testy",
      ogDescription:
        "Complete the drawing before the timer ends! How quick are your reflexes?",
    },
    ja: {
      title: "スピードお絵かきゲーム - 誰が一番速く描ける？ | Testy",
      description:
        "制限時間内に提示された絵を最も速く正確に描いてみましょう！友達と一緒に楽しむオンラインスピードお絵かきゲームで、あなたの画力を披露してください。",
      ogTitle: "オンラインスピードお絵かきゲーム | Testy",
      ogDescription: "制限時間内に絵を完成させよう！あなたの瞬発力は果たして？",
    },
    vi: {
      title: "Trò chơi Vẽ Nhanh - Ai Vẽ Nhanh Hơn? | Testy",
      description:
        "Vẽ hình ảnh cho trước một cách nhanh chóng và chính xác nhất trước khi hết giờ! Thể hiện kỹ năng vẽ của bạn trong trò chơi vẽ nhanh trực tuyến thú vị này cùng bạn bè.",
      ogTitle: "Trò chơi Vẽ Nhanh Trực tuyến | Testy",
      ogDescription:
        "Hoàn thành bức vẽ trước khi hết giờ! Phản xạ của bạn nhanh đến mức nào?",
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

// 2. 페이지 컴포넌트가 locale 파라미터를 받을 수 있도록 수정합니다.
export default async function DrawGamePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return <DrawPage />;
}
