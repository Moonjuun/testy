"use client";

import { useState, useMemo } from "react";
import { TestCard } from "@/components/test-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Grid,
  List,
  TrendingUp,
  Clock,
  Users,
  Star,
} from "lucide-react";
import { testCards } from "@/data/tests";

const categories = [
  { id: "all", name: "전체", count: testCards.length },
  {
    id: "personality",
    name: "성격",
    count: testCards.filter((t) => t.category === "성격").length,
  },
  {
    id: "love",
    name: "연애",
    count: testCards.filter((t) => t.category === "연애").length,
  },
  {
    id: "career",
    name: "진로",
    count: testCards.filter((t) => t.category === "진로").length,
  },
  {
    id: "fun",
    name: "재미",
    count: testCards.filter((t) => t.category === "재미").length,
  },
  {
    id: "psychology",
    name: "심리",
    count: testCards.filter((t) => t.category === "심리").length,
  },
  {
    id: "relationship",
    name: "관계",
    count: testCards.filter((t) => t.category === "관계").length,
  },
  {
    id: "lifestyle",
    name: "라이프",
    count: testCards.filter((t) => t.category === "라이프").length,
  },
];

const sortOptions = [
  { id: "popular", name: "인기순", icon: TrendingUp },
  { id: "latest", name: "최신순", icon: Clock },
  { id: "participants", name: "참여자순", icon: Users },
  { id: "rating", name: "평점순", icon: Star },
];

export default function TestsPage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 12;

  // 필터링된 테스트들
  const filteredTests = useMemo(() => {
    let filtered = testCards;

    // 카테고리 필터
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (test) =>
          test.category ===
          categories.find((c) => c.id === selectedCategory)?.name
      );
    }

    // 검색 필터
    if (searchTerm) {
      filtered = filtered.filter(
        (test) =>
          test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          test.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          const aParticipants = Number.parseInt(
            a.participants.replace(/[^0-9]/g, "")
          );
          const bParticipants = Number.parseInt(
            b.participants.replace(/[^0-9]/g, "")
          );
          return bParticipants - aParticipants;
        case "latest":
          return b.id.localeCompare(a.id); // ID 기준 최신순 (실제로는 생성일 기준)
        case "participants":
          const aCount = Number.parseInt(a.participants.replace(/[^0-9]/g, ""));
          const bCount = Number.parseInt(b.participants.replace(/[^0-9]/g, ""));
          return bCount - aCount;
        case "rating":
          // 임시로 참여자 수 기준 (실제로는 평점 데이터 필요)
          const aRating = Number.parseInt(
            a.participants.replace(/[^0-9]/g, "")
          );
          const bRating = Number.parseInt(
            b.participants.replace(/[^0-9]/g, "")
          );
          return bRating - aRating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedCategory, searchTerm, sortBy]);

  // 페이지네이션
  const totalPages = Math.ceil(filteredTests.length / itemsPerPage);
  const paginatedTests = filteredTests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 mb-4 shadow-sm">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                총 {filteredTests.length}개의 테스트
              </span>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8">
            {/* Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="테스트 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-base bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
              </div>

              <div className="flex gap-3 flex-wrap">
                {/* Sort Options */}
                {/* <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  {sortOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <Button
                        key={option.id}
                        variant={sortBy === option.id ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setSortBy(option.id)}
                        className="gap-2"
                      >
                        <Icon className="w-4 h-4" />
                        {option.name}
                      </Button>
                    );
                  })}
                </div> */}

                {/* View Toggle */}
                <div className="flex border rounded-lg bg-white dark:bg-gray-800">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                {/* Filter Toggle (Mobile) */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  필터
                </Button>
              </div>
            </div>

            {/* Category Filters */}
            <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setCurrentPage(1);
                    }}
                    className={`rounded-full ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {category.name}
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-white/20 text-current border-0"
                    >
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Test Grid/List */}
              {paginatedTests.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-lg">
                  <div className="text-gray-400 mb-4">
                    <Search className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    검색 결과가 없습니다
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    다른 키워드로 검색하거나 필터를 조정해보세요
                  </p>
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    전체 테스트 보기
                  </Button>
                </div>
              ) : (
                <>
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                        : "space-y-4"
                    }
                  >
                    {paginatedTests.map((test, index) => (
                      <div key={test.id}>
                        <TestCard test={test} />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center mt-12 gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="bg-white dark:bg-gray-800"
                      >
                        이전
                      </Button>

                      <div className="flex gap-1">
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                          const pageNum =
                            Math.max(
                              1,
                              Math.min(totalPages - 4, currentPage - 2)
                            ) + i;
                          if (pageNum > totalPages) return null;

                          return (
                            <Button
                              key={pageNum}
                              variant={
                                currentPage === pageNum ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className="w-10 h-10 p-0"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>

                      <Button
                        variant="outline"
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="bg-white dark:bg-gray-800"
                      >
                        다음
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Desktop Side Ad */}
          </div>
        </div>
      </div>
    </div>
  );
}
