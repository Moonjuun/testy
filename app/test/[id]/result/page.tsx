"use client"

import { Button } from "@/components/ui/button"
import { AdBanner } from "@/components/ad-banner"
import { MobileAdBanner } from "@/components/mobile-ad-banner"
import { Share2, Download, RotateCcw, Home } from "lucide-react"
import Link from "next/link"
import { testData } from "@/data/tests"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { TestResult } from "@/types/test"

export default function ResultPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [result, setResult] = useState<TestResult | null>(null)
  const currentTestData = testData[params.id]

  useEffect(() => {
    if (!currentTestData) {
      router.push("/")
      return
    }

    // 실제로는 테스트 결과를 localStorage나 상태에서 가져와야 하지만
    // 데모를 위해 첫 번째 결과를 사용
    setResult(currentTestData.results[0])
  }, [currentTestData, router])

  const handleShare = (platform: string) => {
    const url = window.location.href
    const text = `나의 테스트 결과는 "${result?.title}"! 당신도 테스트해보세요!`

    switch (platform) {
      case "kakao":
        console.log("카카오톡 공유")
        break
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
        break
      case "copy":
        navigator.clipboard.writeText(url)
        alert("링크가 복사되었습니다!")
        break
    }
  }

  if (!currentTestData || !result) {
    return <div>결과를 찾을 수 없습니다.</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      {/* Mobile Top Sticky Ad */}
      <MobileAdBanner type="sticky-top" size="320x50" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-4 gap-8">
          {/* Result Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Result Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg text-center">
              <div className="mb-6">
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center border-4 border-purple-200 dark:border-purple-700">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🌟</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 px-4">{result.image_prompt}</div>
                  </div>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                당신은 <span className="text-purple-600 dark:text-purple-400">"{result.title}"</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                {result.description}
              </p>
            </div>

            {/* Mobile Inline Ad after result header */}
            <MobileAdBanner type="inline" size="320x100" />

            {/* Recommendation */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">추천 활동</h2>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{result.recommendation}</p>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">결과 공유하기</h2>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  onClick={() => handleShare("kakao")}
                  className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-6 py-3 rounded-full font-semibold"
                >
                  카카오톡
                </Button>
                <Button
                  onClick={() => handleShare("twitter")}
                  className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-3 rounded-full font-semibold"
                >
                  X (Twitter)
                </Button>
                <Button
                  onClick={() => handleShare("copy")}
                  variant="outline"
                  className="px-6 py-3 rounded-full font-semibold border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-transparent"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  링크 복사
                </Button>
                <Button
                  variant="outline"
                  className="px-6 py-3 rounded-full font-semibold bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  이미지 저장
                </Button>
              </div>
            </div>

            {/* Desktop Center Ad */}
            <div className="hidden xl:block">
              <AdBanner type="center" size="728x90" />
            </div>

            {/* Mobile Inline Ad */}
            <MobileAdBanner type="inline" size="300x250" />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/test/${params.id}`}>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  다시 테스트하기
                </Button>
              </Link>
              <Link href="/">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full px-8"
                >
                  <Home className="w-4 h-4 mr-2" />
                  다른 테스트 하기
                </Button>
              </Link>
            </div>
          </div>

          {/* Desktop Side Ad */}
          <div className="lg:col-span-1 hidden xl:block">
            <div className="sticky top-8">
              <AdBanner type="side" size="300x600" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sticky Ad */}
      <MobileAdBanner type="sticky-bottom" size="320x50" />
    </div>
  )
}
