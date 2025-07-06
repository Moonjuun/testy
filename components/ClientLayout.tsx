// components/ClientLayout.tsx (새 파일 생성)

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

export default function ClientLayout({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const isAdminPage = pathname.startsWith("/admin");

  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    console.log("dsadsa", user);
    setUser(user);
  }, [user, setUser]);

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        <Header />

        <div className="flex flex-1 relative">
          {/* Left Side Ad */}
          {!isAdminPage && (
            <div className="hidden xl:block w-80 flex-shrink-0">
              <SideAdContainer position="left" />
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
          {/* Right Side Ad */}
          {!isAdminPage && (
            <div className="hidden xl:block w-80 flex-shrink-0">
              <SideAdContainer position="right" />
            </div>
          )}
        </div>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
