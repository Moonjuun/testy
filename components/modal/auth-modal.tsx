//components/modal/auth-modal.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, User, Sparkles, Heart, Star } from "lucide-react";
import { signInWithGoogle } from "@/lib/supabase/action";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
// No longer need to import AlertDialog directly if using the hook's component
import { useAlert } from "@/hooks/useAlert"; // Corrected import path if it's in a 'hooks' directory

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { customAlert, Alert } = useAlert(); // Destructure showAlert and Alert from useAlert

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
              className="rounded-full p-2 hover:bg-white/20 text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="relative text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">만나서 반가워요!</h2>
            <p className="text-white/80 text-sm">
              심심할 때 가볍게, 생각보다 잘 맞는 테스트!!
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
              아래 방법으로 간편하게 로그인하세요
            </p>

            {/* Google 로그인 */}
            <Button
              onClick={async () => {
                setIsLoading(true);
                try {
                  await signInWithGoogle();
                  onClose();
                } catch (e) {
                  console.error("Google 로그인 실패:", e);
                  await customAlert({
                    title: "로그인 오류",
                    message: "Google 로그인에 실패했습니다. 다시 시도해주세요.",
                    confirmText: "확인",
                  });
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
              className="w-full h-12 rounded-xl font-medium transition-all bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
            >
              <FcGoogle className="w-7 h-7 mr-3" />
              Google로 계속하기
              {isLoading && (
                <div className="ml-2 w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              )}
            </Button>

            {/* Apple 로그인 */}
            <Button
              onClick={async () => {
                // Changed to async to await the alert
                await customAlert({
                  title: "미구현 기능",
                  message: "Apple 로그인 기능은 아직 구현되지 않았습니다.",
                  confirmText: "확인",
                });
              }}
              disabled={isLoading}
              className="w-full h-12 rounded-xl font-medium transition-all bg-black text-white hover:bg-gray-900"
            >
              <span className="mr-3 text-lg"></span>
              Apple로 계속하기
            </Button>

            {/* Facebook 로그인 */}
            <Button
              onClick={async () => {
                // Changed to async to await the alert
                await customAlert({
                  title: "미구현 기능",
                  message: "Facebook 로그인 기능은 아직 구현되지 않았습니다.",
                  confirmText: "확인",
                });
              }}
              disabled={isLoading}
              className="w-full h-12 rounded-xl font-medium transition-all bg-blue-600 hover:bg-blue-700 text-white"
            >
              <FaFacebook className="w-6 h-6 mr-3" />
              Facebook으로 계속하기
            </Button>
          </div>
        </div>
      </div>
      {/* Render the Alert component from the useAlert hook */}
      <Alert />
    </div>
  );
}
