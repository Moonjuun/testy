"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProfileModal } from "@/components/modal/profile-modal";
import { useTheme } from "@/contexts/theme-context";
import { User, Menu, X, Moon, Sun, Globe } from "lucide-react";
import { useActiveCategories } from "@/hooks/useActiveCategories";
import { Skeleton } from "./ui/skeleton";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useUserStore } from "@/store/useUserStore";
import { getAllLabel, languages } from "@/constants/Header";
import { useTranslation } from "react-i18next";
import { AuthModal } from "./modal/auth-modal";
// 1. next/navigation에서 useRouter와 usePathname을 임포트합니다.
import { useRouter, usePathname } from "next/navigation";
import { Language } from "@/store/useLanguageStore";
import { useAlert } from "@/hooks/useAlert";

export function Header() {
  const { t, i18n } = useTranslation("common");
  const { customAlert, Alert } = useAlert();

  // 2. router와 pathname 인스턴스를 생성합니다.
  const router = useRouter();
  const pathname = usePathname();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const user = useUserStore((state) => state.user);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const currentLangCode = useLanguageStore((state) => state.currentLanguage);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  const { theme, toggleTheme } = useTheme();
  const { categories, loading } = useActiveCategories(currentLangCode);
  const [mounted, setMounted] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const [showLogout, setShowLogout] = useState(false); // 이 상태는 현재 사용되지 않는 것 같아 보입니다.

  const currentLanguageName =
    languages.find((l) => l.code === currentLangCode)?.name ?? "한국어";

  // 3. 언어 변경을 처리하는 전용 함수를 만듭니다.
  const handleLanguageChange = async (newLocale: Language) => {
    if (!pathname) {
      return;
    }

    setIsLangOpen(false);

    if (pathname.includes("/result")) {
      // 이제 confirmed 변수는 boolean 타입이 됩니다.
      const confirmed = await customAlert({
        title: t("alert.changeLangOnResultTitle"),
        message: t("alert.changeLangOnResultMessaage"),
        confirmText: t("alert.confirm"),
        cancelText: t("alert.cancel"),
      });

      // ✅ 에러 없이 정상 동작
      if (confirmed) {
        setLanguage(newLocale);
        i18n.changeLanguage(newLocale);
        router.push(`/${newLocale}`);
      }
    } else {
      // 그 외 모든 페이지의 경우
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
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowLogout(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link
              href={`/${currentLangCode}`}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Testy
              </span>
            </Link>

            <nav className="hidden lg:flex items-center space-x-1">
              <Link
                href={`/${currentLangCode}/test/list`}
                className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
              >
                {getAllLabel(currentLangCode)}
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
                      href={`/${currentLangCode}/category/${category.code}`}
                      className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
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
                  <span className="text-sm">{currentLanguageName}</span>
                </Button>

                {isLangOpen && (
                  <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        // 4. 새로 만든 핸들러 함수를 호출합니다.
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
                {mounted ? (
                  theme === "dark" ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )
                ) : (
                  <div className="w-4 h-4" />
                )}
              </Button>

              {user ? (
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

          {isMobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-700">
              <nav className="grid grid-cols-2 gap-2 px-3">
                <Link
                  href={`/${currentLangCode}/test/list`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 text-center"
                >
                  {getAllLabel(currentLangCode)}
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
                        href={`/${currentLangCode}/category/${category.code}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 text-center"
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
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <Alert />
    </>
  );
}
