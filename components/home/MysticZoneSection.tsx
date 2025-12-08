"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MysticZoneSectionProps {
  locale: string;
  translations: {
    mysticZone: string;
    tarotTitle: string;
    tarotDescription: string;
    clickToReveal: string;
    exploreTarot: string;
  };
}

export function MysticZoneSection({
  locale,
  translations,
}: MysticZoneSectionProps) {
  return (
    <section className="relative py-20 md:py-28 px-4 md:px-8 overflow-hidden">
      {/* 상단 그라데이션 전환 (이전 섹션에서 자연스럽게) */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white dark:from-zinc-950 via-white/50 dark:via-zinc-950/50 to-transparent z-0" />
      {/* Deep Purple/Navy 그라데이션 배경 (다크모드) / 라이트 그라데이션 (라이트모드) */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-indigo-100 dark:from-indigo-950 dark:via-purple-950 dark:to-indigo-900" />

      {/* 장식적 패턴 오버레이 */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* 하단 그라데이션 전환 (다음 섹션으로 자연스럽게) */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-zinc-950 via-white/50 dark:via-zinc-950/50 to-transparent z-0" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            <span className="text-purple-600 dark:text-purple-300 font-semibold text-sm uppercase tracking-wider">
              {translations.mysticZone}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-indigo-900 dark:text-white mb-4">
            {translations.tarotTitle}
          </h2>
          <p className="text-lg md:text-xl text-indigo-700 dark:text-purple-200 max-w-2xl mx-auto">
            {translations.tarotDescription}
          </p>
        </motion.div>

        {/* 타로 카드 UI */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center"
        >
          <Link href={`/${locale}/tarot`}>
            <motion.div
              whileHover={{ scale: 1.05, rotateY: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative cursor-pointer group"
            >
              {/* 카드 스택 효과 */}
              <div className="relative w-64 h-96 md:w-80 md:h-[480px]">
                {/* 뒤집힌 카드들 (배경) */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-indigo-300 dark:from-purple-800 dark:to-indigo-900 rounded-2xl shadow-2xl transform rotate-3 opacity-40 dark:opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-indigo-400 dark:from-purple-700 dark:to-indigo-800 rounded-2xl shadow-xl transform -rotate-2 opacity-50 dark:opacity-80" />

                {/* 메인 카드 */}
                <div className="relative w-full h-full bg-gradient-to-br from-purple-400 via-indigo-500 to-purple-500 dark:from-purple-600 dark:via-indigo-700 dark:to-purple-800 rounded-2xl shadow-2xl border-2 border-purple-500/50 dark:border-purple-400/30 overflow-hidden">
                  {/* 카드 패턴 */}
                  <div className="absolute inset-0 opacity-30 dark:opacity-20">
                    <div className="absolute top-4 left-4 w-16 h-16 border-2 border-indigo-900/30 dark:border-white/30 rounded-lg" />
                    <div className="absolute bottom-4 right-4 w-16 h-16 border-2 border-indigo-900/30 dark:border-white/30 rounded-lg" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-indigo-900/30 dark:border-white/30 rounded-full" />
                  </div>

                  {/* 글로우 효과 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-purple-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* 중앙 아이콘 */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Sparkles className="w-24 h-24 md:w-32 md:h-32 text-white/90 dark:text-white/80" />
                    </motion.div>
                  </div>

                  {/* 하단 텍스트 */}
                  <div className="absolute bottom-8 left-0 right-0 text-center">
                    <p className="text-indigo-900 dark:text-white font-semibold text-lg md:text-xl mb-2">
                      {translations.clickToReveal}
                    </p>
                    <div className="inline-flex items-center gap-2 text-indigo-700 dark:text-purple-200 text-sm">
                      {translations.exploreTarot}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 글로우 효과 (외부) */}
              <div className="absolute -inset-4 bg-purple-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
