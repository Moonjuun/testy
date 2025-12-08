"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Brain,
  Heart,
  Star,
  Zap,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface QuickCategory {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
}

interface QuickCircleSectionProps {
  locale: string;
}

export function QuickCircleSection({ locale }: QuickCircleSectionProps) {
  const { t } = useTranslation("common");
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: false,
    skipSnaps: false,
    dragFree: true,
  });

  const categories: QuickCategory[] = [
    {
      id: "new",
      label: t("home.new") || "신규",
      icon: Sparkles,
      href: `/${locale}/test/list?filter=new`,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "popular",
      label: t("home.popular") || "인기",
      icon: Star,
      href: `/${locale}/test/list?filter=popular`,
      color: "from-orange-500 to-red-500",
    },
    {
      id: "tarot",
      label: t("home.tarot") || "타로",
      icon: Sparkles,
      href: `/${locale}/tarot`,
      color: "from-indigo-500 to-purple-500",
    },
    {
      id: "mbti",
      label: "MBTI",
      icon: Brain,
      href: `/${locale}/mbti`,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "love",
      label: t("home.love") || "연애",
      icon: Heart,
      href: `/${locale}/test/list?category=love`,
      color: "from-pink-500 to-rose-500",
    },
  ];

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <section className="py-12 md:py-16 px-4 md:px-8 bg-white dark:bg-zinc-950 -mt-16 md:-mt-20 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          {/* 좌우 화살표 버튼 (데스크탑) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-10 w-10 rounded-full bg-white dark:bg-zinc-800 shadow-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex h-10 w-10 rounded-full bg-white dark:bg-zinc-800 shadow-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          </Button>

          {/* 가로 스크롤 컨테이너 */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-3 md:gap-6 justify-center items-center">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-shrink-0"
                  >
                    <Link href={category.href}>
                      <div className="flex flex-col items-center gap-2 md:gap-3 group cursor-pointer">
                        {/* 원형 아이콘 */}
                        <div
                          className={`relative w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                        >
                          <Icon className="w-8 h-8 md:w-12 md:h-12 text-white" />
                          {/* 호버 시 글로우 효과 */}
                          <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
                        </div>
                        {/* 라벨 */}
                        <span className="text-xs md:text-base font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                          {category.label}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

