import Link from "next/link";
import { Heart, Mail, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              {/* 로고와 서비스명 */}
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Testy
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              나를 알아가는 특별한 여행, Testy에서 숨겨진 나를 발견해보세요.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Heart className="w-4 h-4 text-pink-500" />
              <span>이미 100만 명 이상 참여!</span>
            </div>
          </div>

          {/* Navigation Links */}
          {/* <div>
            <h3 className="font-semibold text-white mb-4">둘러보기</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/popular"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  인기 테스트
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  카테고리
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  서비스 소개
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Support & Legal */}
          {/* <div>
            <h3 className="font-semibold text-white mb-4">고객지원</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  문의하기
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  이용약관
                </Link>
              </li>
            </ul>
          </div> */}
        </div>

        {/* Copyright & Additional Links */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center md:flex md:justify-between md:items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} Testy. All rights reserved.
          </div>

          <div className="flex flex-col items-center  mb-4 md:mb-0">
            <span className="text-gray-400 text-sm mb-1">광고/제작 문의</span>
            <a
              href="mailto:cmoonjun11@gmail.com"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
            >
              <Mail className="w-4 h-4" />
              chmj1102@gmail.com
            </a>
          </div>

          <div className="flex flex-col gap-6 text-sm text-gray-400">
            <Link
              href="/sitemap.xml"
              className="hover:text-white transition-colors"
            >
              사이트맵
            </Link>

            <Link
              href="/terms"
              className="text-gray-400 hover:text-white transition-colors"
            >
              {t("modal.termsLink")}
            </Link>

            <Link
              href="/privacy"
              className="text-gray-400 hover:text-white transition-colors"
            >
              {t("modal.privacyLink")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
