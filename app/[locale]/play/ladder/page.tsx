// app/[locale]/play/ladder/page.tsx

import LadderGame from "@/components/play/ladder/LadderGame";
import type { Metadata } from "next";

// 1. SEO를 위한 generateMetadata 함수를 추가합니다.
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  const url = `https://testy.im/${locale}/play/ladder`; // TODO: 실제 도메인 주소로 변경해주세요.

  // 언어별 메타데이터를 상세하게 정의합니다.
  const metadataByLocale = {
    ko: {
      title: "사다리타기 게임 - 온라인 내기 & 벌칙 정하기 | Testy",
      description:
        "친구들과 함께 즐기는 온라인 사다리타기 게임! 점심 내기, 벌칙 정하기 등 다양한 상황에서 간편하게 사용해보세요. 지금 바로 참여하세요!",
      ogTitle: "온라인 사다리타기 게임 | Testy",
      ogDescription:
        "누가 당첨될까? 친구들과 함께 짜릿한 사다리타기를 즐겨보세요!",
    },
    en: {
      title: "Ladder Game - Online Betting & Penalty Decider | Testy",
      description:
        "Enjoy our online ladder game with friends! Perfect for making decisions, like who pays for lunch or choosing penalties. Join now!",
      ogTitle: "Online Ladder Game | Testy",
      ogDescription:
        "Who will be the lucky one? Enjoy the thrilling ladder game with your friends!",
    },
    ja: {
      title: "あみだくじゲーム - オンラインで賭け＆罰ゲーム決め | Testy",
      description:
        "友達と一緒に楽しむオンラインあみだくじゲーム！ランチの奢りや罰ゲーム決めなど、様々な状況で手軽に使ってみましょう。今すぐ参加！",
      ogTitle: "オンラインあみだくじゲーム | Testy",
      ogDescription:
        "当たりは誰の手に？友達と一緒にスリル満点のあみだくじを楽しもう！",
    },
    vi: {
      title: "Trò chơi Dàn Leiter - Quyết định Kèo & Hình phạt Online | Testy",
      description:
        "Cùng bạn bè thưởng thức trò chơi dàn leiter trực tuyến! Hoàn hảo để đưa ra quyết định, như ai trả tiền ăn trưa hoặc chọn hình phạt. Tham gia ngay!",
      ogTitle: "Trò chơi Dàn Leiter Online | Testy",
      ogDescription:
        "Ai sẽ là người may mắn? Cùng bạn bè tận hưởng trò chơi dàn leiter đầy kịch tính!",
    },
  };

  const meta =
    metadataByLocale[locale as keyof typeof metadataByLocale] ??
    metadataByLocale.ko;

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      url: url,
      siteName: "Testy",
      type: "website",
      locale: locale,
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

// 기존 페이지 컴포넌트는 그대로 유지합니다.
export default function LadderGamePage() {
  return <LadderGame />;
}
