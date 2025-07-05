// components/ClientLayout.tsx (새 파일 생성)

"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/contexts/theme-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SideAdContainer } from "@/components/banner/side-ad-container";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const isAdminPage = pathname.startsWith("/admin");

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
