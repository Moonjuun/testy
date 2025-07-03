import Link from "next/link"
import { Heart, Mail, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Testy
              </span>
            </div>
            <p className="text-gray-400 dark:text-gray-500 text-sm leading-relaxed mb-4">
              나를 알아가는 특별한 여행을 시작하세요. 간단한 질문들로 숨겨진 나의 모습을 발견해보세요.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
              <Heart className="w-4 h-4 text-pink-500" />
              <span>이미 100만 명이 참여했어요!</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">인기 테스트</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/test/summer-vacation-style"
                  className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors"
                >
                  여름 휴가 스타일
                </Link>
              </li>
              <li>
                <Link
                  href="/test/love-style"
                  className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors"
                >
                  연애 스타일
                </Link>
              </li>
              <li>
                <Link
                  href="/test/mbti-accuracy"
                  className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors"
                >
                  MBTI 정확도
                </Link>
              </li>
              <li>
                <Link
                  href="/test/career-match"
                  className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors"
                >
                  직업 매칭
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white mb-4">카테고리</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/category/personality"
                  className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors"
                >
                  성격 테스트
                </Link>
              </li>
              <li>
                <Link
                  href="/category/love"
                  className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors"
                >
                  연애 테스트
                </Link>
              </li>
              <li>
                <Link
                  href="/category/career"
                  className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors"
                >
                  진로 테스트
                </Link>
              </li>
              <li>
                <Link
                  href="/category/fun"
                  className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors"
                >
                  재미 테스트
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="font-semibold text-white mb-4">고객지원</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/support"
                  className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  문의하기
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                  이용약관
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 dark:border-gray-900 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400 dark:text-gray-500">© 2024 Testy. All rights reserved.</div>
            <div className="flex items-center gap-6 text-sm text-gray-400 dark:text-gray-500">
              <Link href="/sitemap" className="hover:text-white transition-colors">
                사이트맵
              </Link>
              <Link href="/accessibility" className="hover:text-white transition-colors">
                접근성
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                쿠키 정책
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
