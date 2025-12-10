"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { NewTest } from "@/types/test";
import { useState, useEffect } from "react";

interface HeroSectionProps {
  featuredTest: NewTest | null;
  locale: string;
  translations: {
    featured: string;
    startNow: string;
  };
}

// 이미지 URL 유효성 검사
function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;

  // base64 data URL 체크
  if (url.startsWith("data:image/")) return true;

  // HTTP/HTTPS URL 체크
  if (url.startsWith("http://") || url.startsWith("https://")) {
    // Supabase Storage URL 또는 일반 이미지 URL
    return true;
  }

  // 상대 경로 체크
  if (url.startsWith("/")) return true;

  return false;
}

export function HeroSection({
  featuredTest,
  locale,
  translations,
}: HeroSectionProps) {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(
    featuredTest?.thumbnail_url || null
  );

  // 컴포넌트 마운트 시 이미지 URL 유효성 검사
  useEffect(() => {
    if (featuredTest?.thumbnail_url) {
      const url = featuredTest.thumbnail_url;

      // URL 유효성 검사
      if (!isValidImageUrl(url)) {
        setImageError(true);
        setImageSrc(null);
        return;
      }

      setImageSrc(url);
      setImageError(false);
    }
  }, [featuredTest?.thumbnail_url]);

  // 이미지 로드 실패 시 placeholder로 대체
  const handleImageError = () => {
    setImageError(true);
    setImageSrc(null);
  };

  if (!featuredTest) {
    return (
      <section className="relative h-[60vh] min-h-[500px] bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center">
        <div className="animate-pulse bg-zinc-300 dark:bg-zinc-700 w-full h-full" />
      </section>
    );
  }

  // 이미지 URL이 없거나 에러가 발생한 경우 그라데이션 배경만 사용
  const hasValidImage = imageSrc && !imageError && isValidImageUrl(imageSrc);
  const isBase64 = imageSrc?.startsWith("data:image/");
  // Supabase Storage URL 감지
  const isSupabaseStorage = imageSrc?.includes(
    "supabase.co/storage/v1/object/public"
  );

  return (
    <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
      {/* 배경 이미지 (블러 처리) */}
      <div className="absolute inset-0 z-0">
        {hasValidImage ? (
          isBase64 || isSupabaseStorage ? (
            // base64 data URL 또는 Supabase Storage URL인 경우 일반 img 태그 사용
            // (Next.js Image 최적화가 402 에러를 유발할 수 있으므로 비활성화)
            <img
              src={imageSrc}
              alt={featuredTest.test_translations.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={handleImageError}
            />
          ) : (
            // 일반 URL인 경우 Next.js Image 컴포넌트 사용
            <Image
              src={imageSrc}
              alt={featuredTest.test_translations.title}
              fill
              className="object-cover"
              priority
              quality={90}
              onError={handleImageError}
              unoptimized={false}
            />
          )
        ) : (
          // 이미지가 없을 때 그라데이션 배경
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800" />
        )}
        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        {/* 하단 그라데이션 전환 (다음 섹션으로 자연스럽게) */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-zinc-950 to-transparent" />
        {/* 블러 배경 색상 추출 효과 */}
        {hasValidImage && (
          <div className="absolute inset-0 backdrop-blur-sm opacity-30" />
        )}
      </div>

      {/* 콘텐츠 */}
      <div className="relative z-10 h-full flex flex-col justify-end px-4 md:px-8 lg:px-16 pb-16 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="mb-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-semibold border border-white/30">
              {translations.featured}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {featuredTest.test_translations.title}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 line-clamp-2">
            {featuredTest.test_translations.description}
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mb-4"
          >
            <Link
              href={`/${locale}/test/${featuredTest.id}`}
              className="inline-flex items-center gap-3 bg-purple-600 dark:bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-700 dark:hover:bg-purple-700 transition-colors shadow-xl shadow-purple-900/20"
            >
              <Play className="w-5 h-5" />
              {translations.startNow}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
