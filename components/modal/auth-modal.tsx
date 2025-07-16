"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, User, Sparkles, Heart, Star, History, Bell } from "lucide-react";
import { signInWithGoogle } from "@/lib/supabase/action";
import { GoogleSignInButton } from "../ui/GoogleSignInButton";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/useLanguageStore";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태는 추후 확장성을 위해 유지
  const language = useLanguageStore((state) => state.currentLanguage);
  const { t } = useTranslation("common");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Decorative Header (기존과 동일) */}
        <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-pink-600/90" />
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full p-2 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="relative text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{t("welcome")}</h2>
            <p className="text-white/80 text-sm">{t("description")}</p>
          </div>
          <div className="absolute top-8 left-8 opacity-30">
            <Heart className="w-4 h-4 animate-pulse" />
          </div>
          <div className="absolute bottom-8 right-8 opacity-30">
            <Star className="w-5 h-5 animate-bounce" />
          </div>
        </div>

        <div className="p-8">
          {/* 혜택 목록 */}
          <div className="space-y-4 mb-8">
            {/* 혜택 1: 테스트 기록 관리 (현재 핵심 기능) */}
            <div className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-4">
                <History className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">
                  {t("modal.feature1.title")}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("modal.feature1.description")}
                </p>
              </div>
            </div>
            {/* 혜택 2: 업데이트 알림 (미래 가치) */}
            <div className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mr-4">
                <Bell className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">
                  {t("modal.feature2.title")}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("modal.feature2.description")}
                </p>
              </div>
            </div>
            {/* 혜택 3: 맞춤형 경험 (미래 가치) */}
            <div className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center mr-4">
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">
                  {t("modal.feature3.title")}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("modal.feature3.description")}
                </p>
              </div>
            </div>
          </div>

          {/* Google 로그인 버튼 */}
          <form action={signInWithGoogle}>
            <input type="hidden" name="locale" value={language} />
            <GoogleSignInButton />
          </form>

          {/* 약관 안내 */}
          <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            {t("modal.termsPrefix")}{" "}
            <a
              href="/terms"
              className="underline hover:text-gray-800 dark:hover:text-white"
            >
              {t("modal.termsLink")}
            </a>{" "}
            &{" "}
            <a
              href="/privacy"
              className="underline hover:text-gray-800 dark:hover:text-white"
            >
              {t("modal.privacyLink")}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
