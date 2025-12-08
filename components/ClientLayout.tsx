"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/contexts/theme-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SideAdContainer } from "@/components/banner/side-ad-container";
import type { User } from "@supabase/supabase-js";
import { useUserStore } from "@/store/useUserStore";
import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/app/[locale]/i18n";
import { useLanguageStore, Language } from "@/store/useLanguageStore";
import { AlertProvider } from "./modal/alert-context";

export default function ClientLayout({
  user,
  children,
  locale,
  footerTranslations,
}: {
  user: User | null;
  children: React.ReactNode;
  locale: string;
  footerTranslations: {
    termsLink: string;
    privacyLink: string;
  };
}) {
  const pathname = usePathname() ?? "";
  const isAdminPage = pathname.startsWith("/admin");

  const setUser = useUserStore((state) => state.setUser);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  useEffect(() => {
    i18n.changeLanguage(locale);
    setLanguage(locale as Language);
  }, [locale, setLanguage]);

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <AlertProvider>
          <div className="flex flex-col min-h-screen">
            <Header locale={locale} />

            <div className="flex flex-1 relative">
              {!isAdminPage && (
                // ⬇️ 1280px(xl)에서는 숨기고, 1536px(2xl)부터만 노출
                <div className="hidden 2xl:block w-80 flex-shrink-0">
                  <SideAdContainer position="left" slot="5251424654" />
                </div>
              )}

              <main className="flex-1 min-w-0 w-full">{children}</main>

              {!isAdminPage && (
                // ⬇️ 오른쪽도 동일하게 2xl부터만 노출
                <div className="hidden 2xl:block w-80 flex-shrink-0">
                  <SideAdContainer position="right" slot="2714274112" />
                </div>
              )}
            </div>

            <Footer translations={footerTranslations} />
          </div>
        </AlertProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}
