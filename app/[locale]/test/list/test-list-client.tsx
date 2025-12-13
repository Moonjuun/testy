// app/test/list/test-list-client.tsx
"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { NewTest } from "@/types/test";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { TestCard } from "@/components/test-card";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useActiveCategories } from "@/hooks/useActiveCategories";
import { getAllTests } from "@/lib/supabase/getAllTests";
import { TestCardSkeleton } from "@/components/TestCardSkeleton";

const ITEMS_PER_PAGE = 12;
const POPULAR_THRESHOLD = 20 as const;

type CategorySelection = "all" | "popular" | number;

export function TestListClient() {
  // 전체 테스트 데이터
  const [initialTests, setInitialTests] = useState<NewTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 언어에 따라 데이터 로드
  const currentLangCode = useLanguageStore((state) => state.currentLanguage);
  const { categories } = useActiveCategories(currentLangCode);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const testsData = await getAllTests(currentLangCode);
        // 썸네일이 있는 테스트만 필터링
        const testsWithThumbnail = testsData.filter(
          (test) => test.thumbnail_url && test.thumbnail_url.trim() !== ""
        );
        setInitialTests(testsWithThumbnail);
      } catch (error) {
        console.error("Failed to fetch tests:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentLangCode]);

  // 검색/카테고리/페이지 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CategorySelection>("all");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // 인기 개수
  const popularCount = useMemo(
    () =>
      initialTests.filter((t) => (t.view_count ?? 0) >= POPULAR_THRESHOLD)
        .length,
    [initialTests]
  );

  // 필터링
  const filteredTests = useMemo(() => {
    let filtered = [...initialTests];

    if (selectedCategory === "popular") {
      filtered = filtered.filter(
        (t) => (t.view_count ?? 0) >= POPULAR_THRESHOLD
      );
    } else if (selectedCategory !== "all") {
      const selected = categories.find((c) => c.id === selectedCategory);
      filtered = filtered.filter((t) => t.category?.name === selected?.name);
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [initialTests, categories, selectedCategory, searchTerm]);

  // pagination
  const visibleTests = useMemo(
    () => filteredTests.slice(0, visibleCount),
    [filteredTests, visibleCount]
  );

  const observer = useRef<IntersectionObserver | null>(null);
  const hasMore = visibleCount < filteredTests.length;

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  // 로딩 스켈레톤
  if (isLoading && initialTests.length === 0) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(220px,_1fr))] gap-4 md:gap-6 xl:gap-8">
          {Array.from({ length: 12 }).map((_, index) => (
            <TestCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  // 클릭 시 공통 처리
  const onSelectCategory = (cat: CategorySelection) => {
    setSelectedCategory(cat);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* 검색 + 카테고리 필터 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8 mt-8 ">
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <Input
                placeholder="테스트 검색..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
                className="pl-10 h-12"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {/* 전체 */}
            {(() => {
              const isSelected = selectedCategory === "all";
              return (
                <Button
                  key="all"
                  size="sm"
                  onClick={() => onSelectCategory("all")}
                  className={`rounded-full transition-colors duration-200 ${
                    isSelected
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md ring-1 ring-purple-300 dark:ring-pink-300"
                      : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent"
                  }`}
                >
                  전체
                  <Badge
                    variant="secondary"
                    className={`ml-2 ${
                      isSelected
                        ? "bg-white text-purple-600 dark:text-pink-600"
                        : ""
                    }`}
                  >
                    {initialTests.length}
                  </Badge>
                </Button>
              );
            })()}

            {/* 인기(별도 카테고리) */}
            {(() => {
              const isSelected = selectedCategory === "popular";
              return (
                <Button
                  key="popular"
                  size="sm"
                  onClick={() => onSelectCategory("popular")}
                  className={`rounded-full transition-colors duration-200 ${
                    isSelected
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md ring-1 ring-purple-300 dark:ring-pink-300"
                      : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent"
                  }`}
                >
                  인기
                  <Badge
                    variant="secondary"
                    className={`ml-2 ${
                      isSelected
                        ? "bg-white text-purple-600 dark:text-pink-600"
                        : ""
                    }`}
                  >
                    {popularCount}
                  </Badge>
                </Button>
              );
            })()}

            {/* 실제 카테고리들 */}
            {categories.map((category) => {
              const isSelected = selectedCategory === category.id;

              const testCount = initialTests.filter(
                (test) => test.category?.name === category.name
              ).length;

              return (
                <Button
                  key={category.id}
                  size="sm"
                  onClick={() => onSelectCategory(category.id)}
                  className={`rounded-full transition-colors duration-200 ${
                    isSelected
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md ring-1 ring-purple-300 dark:ring-pink-300"
                      : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent"
                  }`}
                >
                  {category.name}
                  <Badge
                    variant="secondary"
                    className={`ml-2 ${
                      isSelected
                        ? "bg-white text-purple-600 dark:text-pink-600"
                        : ""
                    }`}
                  >
                    {testCount}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>

        {/* 테스트 카드 목록 */}
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(220px,_1fr))] gap-4 md:gap-6 xl:gap-8 mb-8">
          {visibleTests.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>

        {/* 무한 스크롤 트리거 */}
        <div ref={lastElementRef} />
        {hasMore && (
          <div className="grid grid-cols-[repeat(auto-fit,_minmax(220px,_1fr))] gap-4 md:gap-6 xl:gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <TestCardSkeleton key={index} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
