"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, Users, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NewTest } from "@/types/test";
import { useLanguageStore } from "@/store/useLanguageStore";

interface EditorPickSectionProps {
  tests: NewTest[];
  locale: string;
}

export function EditorPickSection({ tests, locale }: EditorPickSectionProps) {
  const { t } = useTranslation("common");
  const language = useLanguageStore((state) => state.currentLanguage);

  if (tests.length === 0) {
    return (
      <section className="py-12 md:py-16 px-4 md:px-8 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-8">
            {t("home.editorPick") || "에디터 픽"}
          </h2>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-zinc-200 dark:bg-zinc-800 h-32 rounded-lg"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20 px-4 md:px-8 bg-zinc-50/50 dark:bg-zinc-900">
      <div className="max-w-6xl mx-auto">
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-2">
            {t("home.editorPick") || "에디터 픽"}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base">
            {t("home.editorPickDescription") ||
              "추천하는 인기 테스트를 만나보세요"}
          </p>
        </motion.div>

        {/* 세로 리스트 */}
        <div className="space-y-4">
          {tests.map((test, index) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Link
                href={
                  language ? `/${language}/test/${test.id}` : `/test/${test.id}`
                }
              >
                <motion.div
                  whileHover={{ x: 4 }}
                  className="group bg-white dark:bg-zinc-800 rounded-xl p-4 md:p-6 border border-zinc-300 dark:border-zinc-700 shadow-lg hover:shadow-xl dark:shadow-zinc-900/50 transition-all duration-300 flex gap-4 md:gap-6"
                >
                  {/* 썸네일 (좌측) */}
                  <div className="relative w-24 h-32 md:w-32 md:h-44 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={test.thumbnail_url || "/placeholder.svg"}
                      alt={test.test_translations.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* 텍스트 (우측) */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                        {test.test_translations.title}
                      </h3>
                      <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-4">
                        {test.test_translations.description}
                      </p>
                    </div>

                    {/* 메타 정보 */}
                    <div className="flex items-center gap-4 text-xs md:text-sm text-zinc-500 dark:text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>
                          {t("home.minutes") || "3분"}{" "}
                          {t("home.takes") || "소요"}
                        </span>
                      </div>
                      {test.view_count && (
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          <span>
                            {test.view_count >= 10000
                              ? locale === "en"
                                ? `${(test.view_count / 1000).toFixed(1)}${
                                    t("home.tenThousand") || "K"
                                  } ${t("home.participated") || "participated"}`
                                : locale === "vi"
                                ? `${(test.view_count / 1000).toFixed(1)} ${
                                    t("home.tenThousand") || "nghìn"
                                  } ${t("home.people") || "người"} ${
                                    t("home.participated") || "tham gia"
                                  }`
                                : `${(test.view_count / 10000).toFixed(1)}${
                                    t("home.tenThousand") || "만"
                                  }${t("home.people") || "명"} ${
                                    t("home.participated") || "참여"
                                  }`
                              : `${test.view_count}${
                                  t("home.people") || "명"
                                } ${t("home.participated") || "참여"}`}
                          </span>
                        </div>
                      )}
                      {test.category && (
                        <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-700 rounded-full text-zinc-700 dark:text-zinc-300">
                          {test.category.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 화살표 아이콘 */}
                  <div className="flex items-center flex-shrink-0">
                    <ArrowRight className="w-5 h-5 text-zinc-400 dark:text-zinc-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

