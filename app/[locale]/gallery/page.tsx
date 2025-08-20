// app/[locale]/gallery/page.tsx
import {
  getGalleryCategories,
  getGalleryImages,
} from "@/lib/supabase/gallery/getGalleryData";
import { Language } from "@/store/useLanguageStore";
import type { Metadata } from "next";
import GalleryClient from "@/components/gallery/GalleryClient";

export const dynamic = "force-dynamic";

// ✨ 1. 메타데이터 객체를 layout.tsx와 유사한 구조로 확장
const galleryMetadata = {
  ko: {
    title: "AI 이미지 갤러리 | Testy 테스티",
    description:
      "Testy의 AI 테스트로 생성된 다채로운 결과 이미지들을 만나보세요. 판타지, K-POP 스타, 로맨스 등 다양한 테마의 놀라운 작품들을 감상할 수 있습니다.",
    twitterTitle: "Testy AI 이미지 갤러리",
    twitterDescription:
      "AI가 그려낸 당신의 또 다른 모습! Testy 갤러리에서 다른 사람들의 결과도 확인해보세요.",
    ogImage: "/og-image-ko.png", // 갤러리 전용 OG 이미지
    ogImageAlt: "Testy AI 이미지 갤러리 - 다양한 AI 생성 결과 이미지들",
  },
  en: {
    title: "AI Image Gallery | Testy",
    description:
      "Explore a colorful collection of AI-generated result images from Testy's tests. Enjoy stunning creations in themes like fantasy, K-POP stars, romance, and more.",
    twitterTitle: "Testy AI Image Gallery",
    twitterDescription:
      "Another version of you, drawn by AI! Check out others' results in the Testy Gallery.",
    ogImage: "/og-image-en.png", // Gallery-specific OG image
    ogImageAlt: "Testy AI Image Gallery - Various AI-generated result images",
  },
  ja: {
    title: "AI画像ギャラリー | Testy テスティ",
    description:
      "TestyのAIテストで生成された多彩な結果画像をご覧ください。ファンタジー、K-POPスター、ロマンスなど、様々なテーマの素晴らしい作品を鑑賞できます。",
    twitterTitle: "Testy AI画像ギャラリー",
    twitterDescription:
      "AIが描いたあなたのもう一つの姿！Testyギャラリーで他の人の結果もチェックしてみてください。",
    ogImage: "/og-image-ja.png", // ギャラリー専用OG画像
    ogImageAlt: "Testy AI画像ギャラリー - 様々なAI生成結果画像",
  },
  vi: {
    title: "Thư viện ảnh AI | Testy",
    description:
      "Khám phá bộ sưu tập đầy màu sắc các hình ảnh kết quả do AI tạo ra từ các bài kiểm tra của Testy. Thưởng thức những tác phẩm tuyệt đẹp theo các chủ đề như giả tưởng, ngôi sao K-POP, lãng mạn, v.v.",
    twitterTitle: "Thư viện ảnh AI của Testy",
    twitterDescription:
      "Một phiên bản khác của bạn, được vẽ bởi AI! Hãy xem kết quả của những người khác trong Thư viện Testy.",
    ogImage: "/og-image-vi.png", // Hình ảnh OG dành riêng cho thư viện
    ogImageAlt:
      "Thư viện ảnh AI của Testy - Nhiều hình ảnh kết quả do AI tạo ra",
  },
};

// ✨ 2. generateMetadata 함수를 layout.tsx 형식에 맞춰 전체적으로 개선
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = await params;
  const url = `https://testy.im/${locale}/gallery`;

  const meta =
    galleryMetadata[locale as keyof typeof galleryMetadata] ??
    galleryMetadata.en;

  return {
    title: meta.title,
    description: meta.description,
    // ✨ metadataBase 추가: 상대 경로 OG 이미지를 절대 경로로 변환
    metadataBase: new URL("https://testy.im"),
    // ✨ alternates 추가: 다국어 페이지 및 표준 URL 명시
    alternates: {
      canonical: url,
      languages: {
        "ko-KR": "https://testy.im/ko/gallery",
        "en-US": "https://testy.im/en/gallery",
        "ja-JP": "https://testy.im/ja/gallery",
        "vi-VN": "https://testy.im/vi/gallery",
      },
    },
    openGraph: {
      title: meta.title, // ogTitle 대신 title 사용
      description: meta.description, // ogDescription 대신 description 사용
      url: url,
      siteName: "Testy",
      images: [
        {
          url: meta.ogImage, // 정의된 이미지 경로 사용
          width: 1200,
          height: 630,
          alt: meta.ogImageAlt, // 이미지 alt 텍스트 추가
        },
      ],
      type: "website",
      locale: locale,
    },
    // ✨ twitter 카드 메타데이터 추가
    twitter: {
      card: "summary_large_image",
      title: meta.twitterTitle,
      description: meta.twitterDescription,
      images: [meta.ogImage], // OG 이미지를 재사용
    },
  };
}

// 페이지 컴포넌트 (기존과 동일)
export default async function GalleryPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;

  const [initialImages, initialCategories] = await Promise.all([
    getGalleryImages(locale as Language, 1, "all"),
    getGalleryCategories(locale as Language),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <GalleryClient
        initialImages={initialImages}
        initialCategories={initialCategories}
        locale={locale as Language}
      />
    </div>
  );
}
