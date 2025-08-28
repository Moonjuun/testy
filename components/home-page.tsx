"use client";
import { TestCard } from "@/components/test-card";
import { TestCardSkeleton } from "@/components/TestCardSkeleton";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sparkles,
  Clock,
  Brain,
  Gamepad2,
  ImageIcon,
  ArrowRight,
  Users,
  Trophy,
  Zap,
} from "lucide-react";
import { NewTest } from "@/types/test"; // 기존 코드의 타입을 가져옵니다.

interface HomePageProps {
  locale: string;
  initialTests: NewTest[];
}

export default function HomePage({ initialTests }: HomePageProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useTranslation("common");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 rounded-full px-6 py-3 mb-6 border border-purple-200 dark:border-purple-700">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
              {isMounted ? t("home.weeklyUpdate") : "\u00A0"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            <span>{isMounted ? t("home.heroTitlePart1") : "\u00A0"}</span>{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {isMounted ? t("home.heroTitlePart2") : ""}
            </span>
          </h1>

          <p className="text-base md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto text-pretty">
            {isMounted ? t("description") : "\u00A0"}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/test/list">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold"
              >
                {isMounted ? t("home.gotoTest") : "\u00A0"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            {/* <Button
              variant="outline"
              size="lg"
              className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/20 font-semibold bg-transparent"
            >
              인기 테스트 보기
            </Button> */}
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      <section className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Popular Tests Section - ADDED */}
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 dark:group-hover:bg-orange-800/50 transition-colors">
                  <Trophy className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                  {t("home.popularTests")}
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  {t("home.popularTestsDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/popular">
                  <Button
                    variant="ghost"
                    className="w-full text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:text-orange-400 dark:hover:text-orange-300 dark:hover:bg-orange-900/20 font-semibold"
                  >
                    {t("home.gotoPopular")}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* MBTI Section */}
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                  <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                  MBTI {t("home.test")}
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  {t("home.mbtiDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/mbti">
                  <Button
                    variant="ghost"
                    className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-900/20 font-semibold"
                  >
                    {t("home.start")}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Playground Section */}
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors">
                  <Gamepad2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                  {t("home.playground")}
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  {t("home.playgroundDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/play/draw">
                  <Button
                    variant="ghost"
                    className="w-full text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/20 font-semibold"
                  >
                    {t("home.gotoPlayground")}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Gallery Section */}
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-200 dark:group-hover:bg-pink-800/50 transition-colors">
                  <ImageIcon className="w-8 h-8 text-pink-600 dark:text-pink-400" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                  {t("home.gallery")}
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  {t("home.galleryDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/gallery">
                  <Button
                    variant="ghost"
                    className="w-full text-pink-600 hover:text-pink-700 hover:bg-pink-50 dark:text-pink-400 dark:hover:text-pink-300 dark:hover:bg-pink-900/20 font-semibold"
                  >
                    {t("home.gotoGallery")}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Latest Tests Section */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                최신 테스트
              </h2>
            </div>

            <div className="grid [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))] gap-6 mb-12">
              {initialTests.length === 0
                ? Array.from({ length: 10 }).map((_, i) => (
                    <TestCardSkeleton key={i} />
                  ))
                : initialTests.map((test) => (
                    <TestCard key={test.id} test={test} featured />
                  ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-10 text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              {t("home.startNow")}
            </h3>
            <p className="text-xl mb-6 text-purple-100">
              {t("home.waitingForYou")}
            </p>
            <Link href="/test/list">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-purple-50 font-semibold"
              >
                {t("home.startFirstTest")}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
