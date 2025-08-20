// app/[locale]/gallery/page.tsx
import {
  getGalleryCategories,
  getGalleryImages,
} from "@/lib/supabase/gallery/getGalleryData";
import { Language } from "@/store/useLanguageStore";
import type { Metadata } from "next";
import GalleryClient from "@/components/gallery/GalleryClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = await params;
  const url = `https://testy.im/${locale}/gallery`;

  const metadataByLocale = {
    ko: {
      title: "AI 이미지 갤러리 | Testy",
      description:
        "Testy에서 생성된 다양한 AI 테스트 결과 이미지들을 둘러보세요. 판타지, K-POP, 연애 등 여러 카테고리의 놀라운 이미지들을 제공합니다.",
      ogTitle: "AI 이미지 갤러리 | Testy",
      ogDescription: "다양한 AI 테스트 결과 이미지를 지금 확인해보세요!",
    },
    en: {
      title: "AI Image Gallery | Testy",
      description:
        "Explore a diverse collection of AI-generated test result images from Testy. Discover amazing images from categories like fantasy, K-POP, romance, and more.",
      ogTitle: "AI Image Gallery | Testy",
      ogDescription: "Check out various AI test result images now!",
    },
    ja: {
      title: "AI画像ギャラリー | Testy",
      description:
        "Testyで生成された多様なAIテスト結果の画像をご覧ください。ファンタジー、K-POP、恋愛など、様々なカテゴリーの素晴らしい画像を提供します。",
      ogTitle: "AI画像ギャラリー | Testy",
      ogDescription: "多様なAIテスト結果の画像を今すぐご覧ください！",
    },
    vi: {
      title: "Thư viện ảnh AI | Testy",
      description:
        "Khám phá bộ sưu tập đa dạng các hình ảnh kết quả thử nghiệm do AI tạo ra từ Testy. Khám phá những hình ảnh tuyệt vời từ các danh mục như giả tưởng, K-POP, lãng mạn, và nhiều hơn nữa.",
      ogTitle: "Thư viện ảnh AI | Testy",
      ogDescription: "Xem ngay các hình ảnh kết quả thử nghiệm AI đa dạng!",
    },
  };

  const meta =
    metadataByLocale[locale as keyof typeof metadataByLocale] ??
    metadataByLocale.en;
  const ogImageUrl = `https://testy.im/og-image-${locale}.png`;
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      url: url,
      siteName: "Testy",
      images: [
        {
          url: ogImageUrl,
          width: 1200, // 권장 사이즈
          height: 630, // 권장 사이즈
          alt: meta.ogTitle,
        },
      ],
      type: "website",
      locale: locale,
    },
  };
}

// 페이지 컴포넌트
export default async function GalleryPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = await params;

  // 서버에서 초기 데이터(첫 페이지 이미지, all 카테고리)를 미리 불러옵니다.
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
