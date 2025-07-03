import { TestCard } from "@/components/test-card"
import { AdBanner } from "@/components/ad-banner"
import { MobileAdBanner } from "@/components/mobile-ad-banner"
import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, Brain } from "lucide-react"
import { testCards } from "@/data/tests"

const featuredTests = testCards.slice(0, 3)
const popularTests = testCards.slice(3)

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      {/* Mobile Top Sticky Ad */}
      <MobileAdBanner type="sticky-top" size="320x50" />

      {/* Hero Section */}
      <section className="relative py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">새로운 테스트가 매주 업데이트!</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            나를 알아가는
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "}
              특별한 여행
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            간단한 질문들로 숨겨진 나의 모습을 발견해보세요. 이미 100만 명이 참여했어요!
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            테스트 시작하기
          </Button>
        </div>

        {/* Desktop Center Banner Ad */}
        <div className="max-w-4xl mx-auto mt-12 hidden xl:block">
          <AdBanner type="center" size="728x90" />
        </div>

        {/* Mobile Inline Ad */}
        <MobileAdBanner type="inline" size="300x250" className="mt-8" />
      </section>

      {/* Featured Tests */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">인기 테스트</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {featuredTests.map((test, index) => (
              <div key={test.id}>
                <TestCard test={test} featured />
                {/* Mobile Inline Ad after first test card */}
                {index === 0 && <MobileAdBanner type="inline" size="320x100" className="mt-6" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Tests */}
      <section className="py-16 px-4 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Brain className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">모든 테스트</h2>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {["전체", "성격", "연애", "진로", "재미", "심리", "관계", "라이프"].map((category) => (
              <Button
                key={category}
                variant={category === "전체" ? "default" : "outline"}
                size="sm"
                className={`rounded-full ${
                  category === "전체"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Mobile Inline Ad before test grid */}
          <MobileAdBanner type="inline" size="320x100" className="mb-6" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTests.map((test, index) => (
              <div key={test.id}>
                <TestCard test={test} />
                {/* Mobile Inline Ad after every 2 test cards */}
                {(index + 1) % 2 === 0 && <MobileAdBanner type="inline" size="300x250" className="mt-6" />}
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              더 많은 테스트 보기
            </Button>
          </div>
        </div>
      </section>

      {/* Mobile Bottom Sticky Ad */}
      <MobileAdBanner type="sticky-bottom" size="320x50" />
    </div>
  )
}
