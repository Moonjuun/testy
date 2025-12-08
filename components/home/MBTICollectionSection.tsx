"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Brain } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/store/useLanguageStore";

interface MBTICollectionSectionProps {
  locale: string;
}

// MBTI 타입별 정보 (실제 데이터는 나중에 DB에서 가져올 수 있음)
const mbtiTypes = [
  { type: "INTJ", color: "from-blue-600 to-indigo-600", labelKey: "mbti.INTJ" },
  { type: "INTP", color: "from-purple-600 to-pink-600", labelKey: "mbti.INTP" },
  { type: "ENTJ", color: "from-orange-600 to-red-600", labelKey: "mbti.ENTJ" },
  {
    type: "ENTP",
    color: "from-yellow-600 to-orange-600",
    labelKey: "mbti.ENTP",
  },
  {
    type: "INFJ",
    color: "from-green-600 to-emerald-600",
    labelKey: "mbti.INFJ",
  },
  { type: "INFP", color: "from-pink-600 to-rose-600", labelKey: "mbti.INFP" },
  { type: "ENFJ", color: "from-cyan-600 to-blue-600", labelKey: "mbti.ENFJ" },
  {
    type: "ENFP",
    color: "from-violet-600 to-purple-600",
    labelKey: "mbti.ENFP",
  },
  { type: "ISTJ", color: "from-gray-600 to-slate-600", labelKey: "mbti.ISTJ" },
  { type: "ISFJ", color: "from-teal-600 to-cyan-600", labelKey: "mbti.ISFJ" },
  { type: "ESTJ", color: "from-red-600 to-orange-600", labelKey: "mbti.ESTJ" },
  {
    type: "ESFJ",
    color: "from-pink-600 to-fuchsia-600",
    labelKey: "mbti.ESFJ",
  },
  { type: "ISTP", color: "from-indigo-600 to-blue-600", labelKey: "mbti.ISTP" },
  {
    type: "ISFP",
    color: "from-emerald-600 to-green-600",
    labelKey: "mbti.ISFP",
  },
  {
    type: "ESTP",
    color: "from-yellow-500 to-orange-500",
    labelKey: "mbti.ESTP",
  },
  { type: "ESFP", color: "from-rose-600 to-pink-600", labelKey: "mbti.ESFP" },
];

export function MBTICollectionSection({ locale }: MBTICollectionSectionProps) {
  const { t } = useTranslation("common");
  const language = useLanguageStore((state) => state.currentLanguage);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    skipSnaps: false,
    dragFree: true,
    slidesToScroll: 2,
  });

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <section className="py-16 md:py-20 px-4 md:px-8 bg-white dark:bg-zinc-950 -mt-12">
      <div className="max-w-7xl mx-auto">
        {/* 섹션 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">
              {t("home.mbtiCollection") || "내 성격 유형 찾기"}
            </h2>
          </div>

          {/* 좌우 화살표 버튼 (데스크탑) */}
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              className="h-10 w-10 rounded-full border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              className="h-10 w-10 rounded-full border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
            </Button>
          </div>
        </div>

        {/* 가로 스크롤 컨테이너 */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 md:gap-6">
            {mbtiTypes.map((mbti, index) => (
              <motion.div
                key={mbti.type}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0"
              >
                <Link href={language ? `/${language}/mbti` : "/mbti"}>
                  <div className="group cursor-pointer">
                    {/* MBTI 카드 */}
                    <div
                      className={`relative w-32 h-40 md:w-40 md:h-52 rounded-xl bg-gradient-to-br ${mbti.color} shadow-lg group-hover:shadow-xl transition-all duration-300 overflow-hidden`}
                    >
                      {/* 배경 패턴 */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-2 left-2 w-8 h-8 border border-white/30 rounded" />
                        <div className="absolute bottom-2 right-2 w-8 h-8 border border-white/30 rounded" />
                      </div>

                      {/* MBTI 타입 텍스트 */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                        <span className="text-2xl md:text-3xl font-bold text-white mb-2">
                          {mbti.type}
                        </span>
                        <span className="text-xs md:text-sm text-white/90 text-center">
                          {t(mbti.labelKey) || mbti.type}
                        </span>
                      </div>

                      {/* 호버 효과 */}
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

