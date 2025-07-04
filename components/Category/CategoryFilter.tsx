import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CategoryFilter({
  categories,
  currentLanguage = "ko",
  loading = false,
}: {
  categories: string[];
  currentLanguage?: "ko" | "en" | "ja" | "vi";
  loading?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const scrollAmount = 200;

  const getAllLabel = () => {
    switch (currentLanguage) {
      case "en":
        return "All";
      case "ja":
        return "すべて";
      case "vi":
        return "Tất cả";
      case "ko":
      default:
        return "전체";
    }
  };

  const allLabel = getAllLabel();
  const allCategories = [allLabel, ...categories];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleResize = () => {
      setShowScrollButtons(el.scrollWidth > el.clientWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [categories]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollBy = direction === "left" ? -scrollAmount : scrollAmount;
    el.scrollBy({ left: scrollBy, behavior: "smooth" });
  };

  return (
    <div className="relative mb-8">
      {/* Scroll Left */}
      {showScrollButtons && (
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-900 p-1 rounded-full shadow-md
             hover:bg-gray-100 dark:hover:bg-gray-800 transition-transform active:scale-90"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      )}

      {/* Scrollable Categories */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide px-6"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
        }}
      >
        <div className="flex gap-2 min-w-fit w-full whitespace-nowrap py-1">
          {allCategories.map((category) => {
            const isSelected =
              selectedCategory === category ||
              (selectedCategory === "" && category === allLabel);
            return (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={`rounded-full whitespace-nowrap 
    transition-colors duration-300 ease-in-out 
    ${
      isSelected
        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md ring-1 ring-purple-300 dark:ring-pink-300"
        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent"
    }`}
              >
                {category}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Scroll Right */}
      {showScrollButtons && (
        <button
          onClick={() => handleScroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-900 p-1 rounded-full shadow-md
             hover:bg-gray-100 dark:hover:bg-gray-800 transition-transform active:scale-90"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      )}
    </div>
  );
}
