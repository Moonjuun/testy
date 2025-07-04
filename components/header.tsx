"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProfileModal } from "@/components/profile-modal";
import { useTheme } from "@/contexts/theme-context";
import { User, Menu, X, Moon, Sun, Globe } from "lucide-react";
import { useActiveCategories } from "@/hooks/useActiveCategories";
import { Skeleton } from "./ui/skeleton";
import { useLanguageStore } from "@/store/useLanguageStore";

export function Header() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const currentLangCode = useLanguageStore((state) => state.currentLanguage);
  const setCurrentLangCode = useLanguageStore((state) => state.setLanguage);

  const { theme, toggleTheme } = useTheme();

  const { categories, loading } = useActiveCategories(currentLangCode);

  const languages = [
    { code: "ko", name: "한국어" },
    { code: "en", name: "English" },
    { code: "ja", name: "日本語" },
    { code: "vi", name: "Tiếng Việt" },
  ];

  const currentLanguage =
    languages.find((l) => l.code === currentLangCode)?.name ?? "한국어";

  const getAllLabel = () => {
    switch (currentLangCode) {
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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Testy
              </span>
            </Link>

            <nav className="hidden lg:flex items-center space-x-1">
              <Link href="/" className="px-3 py-2 text-sm font-medium ...">
                {getAllLabel()}
              </Link>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="px-3 py-2">
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))
                : categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.code}`}
                      className="px-3 py-2 text-sm font-medium ..."
                    >
                      {category.name}
                    </Link>
                  ))}
            </nav>

            <div className="flex items-center gap-3">
              <div className="relative" ref={langRef}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLangOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">{currentLanguage}</span>
                </Button>

                {isLangOpen && (
                  <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCurrentLangCode(lang.code as any);
                          setIsLangOpen(false);
                        }}
                        className="w-full px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="rounded-full p-2 bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsProfileModalOpen(true)}
                className="hidden sm:flex items-center gap-2 rounded-full bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <User className="w-4 h-4" />
                <span className="hidden md:inline">프로필</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsProfileModalOpen(true)}
                className="sm:hidden rounded-full p-2"
              >
                <User className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden rounded-full p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-700">
              <nav className="grid grid-cols-2 gap-2 px-3">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium ..."
                >
                  {getAllLabel()}
                </Link>

                {loading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="px-3 py-2">
                        <Skeleton className="h-4 w-20 mx-auto" />
                      </div>
                    ))
                  : categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.code}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-3 py-2 text-sm font-medium ..."
                      >
                        {category.name}
                      </Link>
                    ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
}
