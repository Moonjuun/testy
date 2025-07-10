"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  X,
  User,
  Mail,
  Calendar,
  Trophy,
  Settings,
  LogOut,
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}
import { formatDateByStyle } from "@/lib/utils";
import { signOut } from "@/lib/supabase/action";
import { useConfirm } from "@/hooks/useConfirm";
import { useLanguageStore } from "@/store/useLanguageStore";

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState<
    "profile" | "history" | "settings"
  >("profile");
  const user = useUserStore((state) => state.user);
  const { customConfirm, ConfirmComponent } = useConfirm();
  const language = useLanguageStore((state) => state.currentLanguage);

  const name =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    "익명 사용자";

  const email = user?.email || user?.user_metadata?.email || "이메일 없음";
  const avatar = user?.user_metadata?.picture || <User />;
  const joinDate = user?.created_at;

  const handleLogout = async () => {
    // useConfirm 훅스의 confirm 함수를 호출하여 확인 다이얼로그 표시
    const confirmed = await customConfirm({
      title: "로그아웃 확인",
      message: "정말 로그아웃 하시겠습니까?",
      confirmText: "로그아웃",
      cancelText: "취소",
      confirmVariant: "destructive", // 로그아웃 버튼 스타일
    });

    // 사용자가 '확인'을 눌렀을 경우에만 로그아웃 진행
    if (confirmed) {
      try {
        await signOut(language); // supabase action의 signOut 함수 호출
        onClose(); // ProfileModal 닫기
        window.location.reload(); // 페이지 새로고침
      } catch (error) {
        console.error("로그아웃 중 오류 발생:", error);
        // 오류 발생 시 사용자에게 알려줄 수 있는 다른 UI (예: 토스트)를 사용하는 것이 좋습니다.
      }
    } else {
      console.log("로그아웃 취소됨");
    }
  };

  const testHistory = [
    {
      id: 1,
      title: "여름 휴가 스타일",
      result: "자연 속 힐링러",
      date: "2024.01.20",
      category: "라이프",
    },
    {
      id: 2,
      title: "연애 스타일",
      result: "로맨틱한 연인",
      date: "2024.01.18",
      category: "연애",
    },
    {
      id: 3,
      title: "MBTI 정확도",
      result: "ENFP",
      date: "2024.01.15",
      category: "성격",
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            내 프로필
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "profile"
                ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            프로필
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Profile Info */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {user?.user_metadata?.picture ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="프로필 이미지"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-xl font-bold">
                      <User className="w-10 h-10 text-white" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {activeTab === "profile" && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex gap-3">
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                로그아웃
              </Button>
              {/* <Button
                variant="outline"
                onClick={onClose}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-transparent"
              >
                취소
              </Button> */}
            </div>
          </div>
        )}
      </div>
      <ConfirmComponent />
    </div>
  );
}
