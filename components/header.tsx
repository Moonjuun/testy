"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProfileModal } from "@/components/modal/profile-modal";
import { useTheme } from "@/contexts/theme-context";
import { User, Menu, X, Moon, Sun, Globe, ChevronDown } from "lucide-react";
import { useActiveCategories } from "@/hooks/useActiveCategories";
import { Skeleton } from "./ui/skeleton";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useUserStore } from "@/store/useUserStore";
import { getAllLabel, languages } from "@/constants/Header";
import { useTranslation } from "react-i18next";
import { AuthModal } from "./modal/auth-modal";
import { useRouter, usePathname } from "next/navigation";
import { Language } from "@/store/useLanguageStore";
import { useAlert } from "./modal/alert-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  locale: string;
}

export function Header({ locale }: HeaderProps) {
  const { t, i18n } = useTranslation("common");
  const customAlert = useAlert();

  const router = useRouter();
  const pathname = usePathname();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const user = useUserStore((state) => state.user);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const setLanguage = useLanguageStore((state) => state.setLanguage);

  const { theme, toggleTheme } = useTheme();
  const { categories, loading } = useActiveCategories(locale as Language);

  const [isClient, setIsClient] = useState(false);

  const currentLanguageName =
    languages.find((l) => l.code === locale)?.name ?? "English";

  const handleLanguageChange = async (newLocale: Language) => {
    if (!pathname) {
      return;
    }

    setIsLangOpen(false);

    if (pathname.includes("/result")) {
      const confirmed = await customAlert({
        title: t("alert.changeLangOnResultTitle"),
        message: t("alert.changeLangOnResultMessaage"),
        confirmText: t("alert.confirm"),
        cancelText: t("alert.cancel"),
      });

      if (confirmed) {
        setLanguage(newLocale);
        i18n.changeLanguage(newLocale);
        router.push(`/${newLocale}`);
      }
    } else {
      setLanguage(newLocale);
      i18n.changeLanguage(newLocale);

      const currentPathParts = pathname.split("/");
      currentPathParts[1] = newLocale;
      const newPath = currentPathParts.join("/");

      router.push(newPath);
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  const playgroundMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="px-4 py-2 text-[15px] font-semibold text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          {/* *** 수정 2: 번역 텍스트를 isClient로 감싸기 *** */}
          {isClient ? t("header.playground") : "Playground"}{" "}
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[160px] rounded-xl shadow-lg bg-white dark:bg-zinc-900 py-2">
        <DropdownMenuItem asChild>
          <Link
            href={`/${locale}/play/draw`}
            className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md"
          >
            {isClient ? t("header.speedDraw") : "Speed Draw"}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={`/${locale}/play/ladder`}
            className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md"
          >
            {isClient ? t("header.ladder") : "Ladder Game"}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={`/${locale}/play/lunch`}
            className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md"
          >
            {isClient ? t("header.lunch") : "Lunch Roulette"}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const testMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="px-4 py-2 text-[15px] font-semibold text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          {isClient ? t("header.test") : "Test"}
          <ChevronDown className="w-4 h-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[180px] rounded-xl shadow-lg bg-white dark:bg-zinc-900 py-2">
        <DropdownMenuItem asChild>
          <Link
            href={`/${locale}/test/list`}
            className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md"
          >
            {isClient ? getAllLabel(locale) : "All Tests"}
          </Link>
        </DropdownMenuItem>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <DropdownMenuItem key={i} disabled>
                <Skeleton className="h-4 w-16 mx-4 my-2" />
              </DropdownMenuItem>
            ))
          : categories.map((category) => (
              <DropdownMenuItem key={category.id} asChild>
                <Link
                  href={`/${locale}/category/${category.code}`}
                  className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md"
                >
                  {category.name}
                </Link>
              </DropdownMenuItem>
            ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const mbtiMenu = (
    <Button
      variant="ghost"
      className="px-4 py-2 text-[15px] font-semibold text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
    >
      <Link href={`/${locale}/mbti`} onClick={() => setIsMobileMenuOpen(false)}>
        MBTI
      </Link>
    </Button>
  );

  const galleryMenu = (
    <Button
      variant="ghost"
      className="px-4 py-2 text-[15px] font-semibold text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
    >
      <Link
        href={`/${locale}/gallery`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {isClient ? t("header.gallery") : "Gallery"}
      </Link>
    </Button>
  );

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Testy
              </span>
            </Link>

            <nav className="hidden lg:flex items-center space-x-1">
              {testMenu}
              {mbtiMenu}
              {playgroundMenu}
              {galleryMenu}
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
                  <span className="text-sm">{currentLanguageName}</span>
                </Button>

                {isLangOpen && (
                  <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() =>
                          handleLanguageChange(lang.code as Language)
                        }
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
                {/* isClient를 사용하여 테마 아이콘 렌더링 */}
                {isClient ? (
                  theme === "dark" ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )
                ) : (
                  <div className="w-4 h-4" />
                )}
              </Button>

              {/* *** 수정 3: 사용자 상태에 따른 UI를 isClient로 감싸고, 초기 렌더링 시 Skeleton 표시 *** */}
              {isClient ? (
                user ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsProfileModalOpen(true)}
                    className="rounded-full p-2"
                  >
                    <User className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="rounded-full p-2"
                  >
                    <User className="w-4 h-4" />
                  </Button>
                )
              ) : (
                <Skeleton className="h-9 w-9 rounded-full" />
              )}

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

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-700">
              <nav className="flex flex-col items-start gap-2 px-3">
                <details className="w-full group">
                  <summary className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                    {isClient ? t("header.test") : "Test"}
                    <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="pl-4 mt-2 space-y-2">
                    <Link
                      href={`/${locale}/test/list`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {isClient ? getAllLabel(locale) : "All Tests"}
                    </Link>
                    {loading
                      ? Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="px-3 py-2">
                            <Skeleton className="h-4 w-20" />
                          </div>
                        ))
                      : categories.map((category) => (
                          <Link
                            key={category.id}
                            href={`/${locale}/category/${category.code}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            {category.name}
                          </Link>
                        ))}
                  </div>
                </details>

                <details className="w-full group">
                  <summary className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                    <Link
                      href={`/${locale}/mbti`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      MBTI
                    </Link>
                  </summary>
                </details>

                <details className="w-full group">
                  <summary className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                    {isClient ? t("header.playground") : "Playground"}
                    <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="pl-4 mt-2 space-y-2">
                    <Link
                      href={`/${locale}/play/draw`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {isClient ? t("header.speedDraw") : "Speed Draw"}
                    </Link>
                    <Link
                      href={`/${locale}/play/ladder`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {isClient ? t("header.ladder") : "Ladder Game"}
                    </Link>
                    <Link
                      href={`/${locale}/play/lunch`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {isClient ? t("header.lunch") : "Lunch Roulette"}
                    </Link>
                  </div>
                </details>

                <details className="w-full group">
                  <summary className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                    <Link
                      href={`/${locale}/gallery`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {isClient ? t("header.gallery") : "Gallery"}
                    </Link>
                  </summary>
                </details>
              </nav>
            </div>
          )}
        </div>
      </header>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
