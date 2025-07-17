// app/not-found.tsx
"use client";

import Link from "next/link";
import { Sparkles, Compass } from "lucide-react"; // 귀여운 분위기에 어울리는 아이콘 추가
import { useTranslation } from "react-i18next";
export default function NotFound() {
  const { t } = useTranslation("common");
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 text-gray-900 dark:text-white p-4">
      <div className="text-center">
        {/* 귀여운 분위기의 큼지막한 숫자 */}
        <h1
          className="text-8xl md:text-9xl font-extrabold mb-4 animate-bounce-slow"
          style={{ textShadow: "4px 4px 0px rgba(0,0,0,0.1)" }}
        >
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            4
          </span>
          <span className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
            0
          </span>
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            4
          </span>
        </h1>

        {/* 귀여운 일러스트 느낌의 메시지 */}
        <p className="text-2xl md:text-3xl font-bold mb-6">
          <Sparkles className="inline-block w-8 h-8 text-yellow-400 mr-2 animate-spin-slow" />
          Sorry
          <Sparkles className="inline-block w-8 h-8 text-yellow-400 ml-2 animate-spin-slow" />
        </p>

        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
          {t("error.notFound")}
          <br />
          {t("error.waitPlease")}
        </p>

        <Link
          href="/"
          className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
        >
          <Compass className="w-5 h-5 mr-3" />
          Testy {t("error.gotoHome")}
        </Link>
      </div>

      {/* 미세한 애니메이션 (Tailwind CSS 커스텀 애니메이션 필요) */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite ease-in-out;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
