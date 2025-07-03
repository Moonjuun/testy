import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SideAdContainer } from "@/components/side-ad-container"
import { ThemeProvider } from "@/contexts/theme-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Testy - 나를 알아가는 특별한 여행",
  description: "간단한 질문들로 숨겨진 나의 모습을 발견해보세요. 성격, 연애, 진로 등 다양한 테스트를 제공합니다.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Header />

            <div className="flex flex-1 relative">
              {/* Left Side Ad */}
              <div className="hidden xl:block w-80 flex-shrink-0">
                <SideAdContainer position="left" />
              </div>

              {/* Main Content */}
              <main className="flex-1 min-w-0">{children}</main>

              {/* Right Side Ad */}
              <div className="hidden xl:block w-80 flex-shrink-0">
                <SideAdContainer position="right" />
              </div>
            </div>

            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
