// app/category/[id]/category-test-list.tsx
"use client";

import { useState, useMemo, useEffect } from "react"; // useEffect 추가
import { NewTest } from "@/types/test";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { TestCard } from "@/components/test-card";
import { getTestsByCategory } from "@/lib/supabase/getTestsByCategory"; // 서버에서 가져오던 함수를 클라이언트에서 사용
import { useLanguageStore } from "@/store/useLanguageStore"; // Zustand 스토어 임포트
import { TestCardSkeleton } from "@/components/TestCardSkeleton";

interface Props {
  categoryId: string; // 서버 컴포넌트에서 전달받을 카테고리 ID
}

export function CategoryTestList({ categoryId }: Props) {
  // 서버에서 받아오던 데이터를 저장할 상태(state)를 만듭니다.
  const [initialTests, setInitialTests] = useState<NewTest[]>([]);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  // Zustand 스토어에서 현재 언어 코드를 가져옵니다.
  const currentLangCode = useLanguageStore((state) => state.currentLanguage);

  // 컴포넌트가 마운트되거나 categoryId 또는 언어가 변경될 때 데이터를 가져옵니다.
  // app/category/[id]/category-test-list.tsx 내 useEffect 내부
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const testsData = await getTestsByCategory(categoryId, currentLangCode);
        setInitialTests(testsData);
      } catch (error) {
        console.error("Failed to fetch category tests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [categoryId, currentLangCode]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredTests = useMemo(() => {
    if (!searchTerm) return initialTests;
    return initialTests.filter(
      (t) =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, initialTests]);

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
    <div className="px-4 sm:px-6 lg:px-8">
      {/* 검색창 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8">
        <div className="flex justify-between items-center">
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

          <Badge variant="outline" className="ml-4">
            총 {filteredTests.length}개
          </Badge>
        </div>
      </div>

      {/* 테스트 카드 */}
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(220px,_1fr))] gap-4 md:gap-6 xl:gap-8">
        {paginatedTests.map((test) => (
          <TestCard key={test.id} test={test} />
        ))}
      </div>
    </div>
  );
}
