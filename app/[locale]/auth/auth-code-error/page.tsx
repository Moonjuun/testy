// app/[locale]/auth/auth-code-error/page.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AuthCodeErrorPage() {
  const { t } = useTranslation("common");
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "ko";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white p-4">
      <div className="text-center max-w-md">
        {/* 에러 아이콘 */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-500/20 rounded-full mb-6">
          <AlertCircle className="w-10 h-10 text-rose-500" />
        </div>

        {/* 제목 */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {t("modal.loginError")}
        </h1>

        {/* 설명 */}
        <p className="text-lg text-zinc-400 mb-8">
          {t("modal.googleLoginFailed")}
        </p>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors duration-200"
          >
            <Home className="w-5 h-5 mr-2" />
            {t("gotoHome") || "홈으로"}
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-colors duration-200"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            {t("retry") || "다시 시도"}
          </button>
        </div>
      </div>
    </div>
  );
}
