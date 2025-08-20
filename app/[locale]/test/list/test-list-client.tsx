// app/test/list/test-list-client.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { NewTest } from "@/types/test";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Grid, List, Search } from "lucide-react";
import { TestCard } from "@/components/test-card";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useActiveCategories } from "@/hooks/useActiveCategories";
import { getAllTests } from "@/lib/supabase/getAllTests";
import { TestCardSkeleton } from "@/components/TestCardSkeleton";

export function TestListClient() {
  // 서버에서 받아오던 데이터를 저장할 상태(state)를 만듭니다.
  const [initialTests, setInitialTests] = useState<NewTest[]>([]);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  // Zustand 스토어에서 현재 언어 코드를 가져옵니다.
  const currentLangCode = useLanguageStore((state) => state.currentLanguage);

  // 커스텀 훅을 사용해 카테고리 목록을 가져옵니다.
  const { categories } = useActiveCategories(currentLangCode);

  // 컴포넌트가 마운트되거나 언어가 변경될 때 데이터를 가져옵니다.
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const testsData = await getAllTests(currentLangCode);
        setInitialTests(testsData);
      } catch (error) {
        console.error("Failed to fetch tests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentLangCode]); // currentLangCode가 변경될 때마다 데이터를 다시 가져옵니다.

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "all">(
    "all"
  );
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;

  const filteredTests = useMemo(() => {
    let filtered = [...initialTests];

    if (selectedCategory !== "all") {
      const selected = categories.find((c) => c.id === selectedCategory);
      filtered = filtered.filter((t) => t.category?.name === selected?.name);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [initialTests, categories, selectedCategory, searchTerm]);

  const paginatedTests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTests.slice(start, start + itemsPerPage);
  }, [filteredTests, currentPage]);

  if (isLoading) {
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

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* 검색 + 필터 */}

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8 ">
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            {/* 검색어 */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <Input
                placeholder="테스트 검색..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 h-12"
              />
            </div>
          </div>

          {/* 카테고리 */}
          <div className="mt-4 flex flex-wrap gap-2">
            {/* '전체' 버튼 추가 */}
            {(() => {
              const isSelected = selectedCategory === "all";
              return (
                <Button
                  key="all"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory("all");
                    setCurrentPage(1);
                  }}
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

            {/* 기존 카테고리 목록 */}
            {categories.map((category) => {
              const isSelected = selectedCategory === category.id;

              const testCount = initialTests.filter(
                (test) => test.category?.name === category.name
              ).length;

              return (
                <Button
                  key={category.id}
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setCurrentPage(1);
                  }}
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

        {/* 테스트 카드 */}
        <div
          className={
            "grid grid-cols-[repeat(auto-fit,_minmax(220px,_1fr))] gap-4 md:gap-6 xl:gap-8 mb-8"
          }
        >
          {paginatedTests.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>
      </div>
    </>
  );
}
