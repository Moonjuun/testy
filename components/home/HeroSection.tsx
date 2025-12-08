"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { NewTest } from "@/types/test";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useTranslation } from "react-i18next";

interface HeroSectionProps {
  featuredTest: NewTest | null;
  locale: string;
}

export function HeroSection({ featuredTest, locale }: HeroSectionProps) {
  const language = useLanguageStore((state) => state.currentLanguage);
  const { t } = useTranslation("common");

  if (!featuredTest) {
    return (
      <section className="relative h-[60vh] min-h-[500px] bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center">
        <div className="animate-pulse bg-zinc-300 dark:bg-zinc-700 w-full h-full" />
      </section>
    );
  }

  return (
    <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
      {/* 배경 이미지 (블러 처리) */}
      <div className="absolute inset-0 z-0">
        <Image
          src={featuredTest.thumbnail_url || "/placeholder.svg"}
          alt={featuredTest.test_translations.title}
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        {/* 하단 그라데이션 전환 (다음 섹션으로 자연스럽게) */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-zinc-950 to-transparent" />
        {/* 블러 배경 색상 추출 효과 */}
        <div className="absolute inset-0 backdrop-blur-sm opacity-30" />
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
              {t("home.featured") || "Featured"}
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
              href={
                language
                  ? `/${language}/test/${featuredTest.id}`
                  : `/test/${featuredTest.id}`
              }
              className="inline-flex items-center gap-3 bg-purple-600 dark:bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-700 dark:hover:bg-purple-700 transition-colors shadow-xl shadow-purple-900/20"
            >
              <Play className="w-5 h-5" />
              {t("home.startNow") || "지금 시작하기"}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
