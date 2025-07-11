//components/modal/auth-modal.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, User, Sparkles, Heart, Star } from "lucide-react";
import { signInWithGoogle } from "@/lib/supabase/action";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { useAlert } from "./alert-context";
import { GoogleSignInButton } from "../ui/GoogleSignInButton";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/useLanguageStore";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const customAlert = useAlert();
  const language = useLanguageStore((state) => state.currentLanguage);

  const { t } = useTranslation("common"); // 'common' 네임스페이스 사용

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Decorative Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-pink-600/90" />
          <div className="absolute top-4 right-4">
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
            <h2 className="text-2xl font-bold mb-2">
              {t("welcome")} {/* 번역 키 사용 */}
            </h2>
            <p className="text-white/80 text-sm">
              {t("description")} {/* 번역 키 사용 */}
            </p>
          </div>

          <div className="absolute top-8 left-8 opacity-30">
            <Heart className="w-4 h-4 animate-pulse" />
          </div>
          <div className="absolute bottom-8 right-8 opacity-30">
            <Star className="w-5 h-5 animate-bounce" />
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="p-6">
          <div className="space-y-3 mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
              {t("modal.loginPrompt")} {/* 번역 키 사용 */}
            </p>

            {/* Google 로그인 */}
            <form action={signInWithGoogle}>
              <input type="hidden" name="locale" value={language} />
              <GoogleSignInButton />
            </form>

            {/* Apple 로그인 */}
            <Button
              onClick={async () => {
                await customAlert({
                  title: t("modal.unimplementedFeature"),
                  message: t("modal.appleLoginNotImplemented"),
                  confirmText: t("modal.confirm"),
                });
              }}
              disabled={isLoading}
              className="w-full h-12 rounded-xl font-medium transition-all bg-black text-white hover:bg-gray-900"
            >
              <span className="mr-3 text-lg"></span>
              {t("modal.continueWithApple")} {/* 번역 키 사용 */}
            </Button>

            {/* Facebook 로그인 */}
            <Button
              onClick={async () => {
                await customAlert({
                  title: t("modal.unimplementedFeature"),
                  message: t("modal.facebookLoginNotImplemented"),
                  confirmText: t("modal.confirm"),
                });
              }}
              disabled={isLoading}
              className="w-full h-12 rounded-xl font-medium transition-all bg-blue-600 hover:bg-blue-700 text-white"
            >
              <FaFacebook className="w-6 h-6 mr-3" />
              {t("modal.continueWithFacebook")} {/* 번역 키 사용 */}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
