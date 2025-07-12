// components/profile/ProfileModal.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  X,
  User,
  Calendar,
  Settings,
  LogOut,
  Edit2,
  Info,
  BadgeInfo,
  Trash2,
  Trophy,
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useConfirm } from "@/hooks/useConfirm";
import { formatDateByStyle } from "@/lib/utils";
import { signOut } from "@/lib/supabase/action";
import { TestHistoryTab } from "../profile/TestHistoryTab";
import { getTestResultById } from "@/lib/supabase/getTestResultById";
import { TestHistoryPreview } from "../profile/TestHistoryPreview";
interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [activeView, setActiveView] = useState<"info" | "history" | "preview">(
    "info"
  );
  const [previewTest, setPreviewTest] = useState<any | null>(null);

  const user = useUserStore((state) => state.user);
  const { customConfirm, ConfirmComponent } = useConfirm();
  const language = useLanguageStore((state) => state.currentLanguage);

  const initialNickname = user?.user_metadata?.nickname || "";
  const [nickname, setNickname] = useState(initialNickname);
  const [isNicknameSet, setIsNicknameSet] = useState(initialNickname !== "");

  const name =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    "익명 사용자";
  const email = user?.email || user?.user_metadata?.email || "이메일 없음";
  const avatarUrl =
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const joinDate = user?.created_at;

  const handleLogout = async () => {
    const confirmed = await customConfirm({
      title: "로그아웃 확인",
      message: "정말 로그아웃 하시겠습니까?",
      confirmText: "로그아웃",
      cancelText: "취소",
      confirmVariant: "destructive",
    });

    if (confirmed) {
      try {
        await signOut(language);
        onClose();
        window.location.reload();
      } catch (error) {
        console.error("로그아웃 중 오류 발생:", error);
      }
    }
  };

  const handleSaveNickname = () => {
    console.log("닉네임 저장:", nickname);
    setIsNicknameSet(true);
    alert("닉네임이 저장되었습니다. (실제 저장 로직은 백엔드에 필요)");
  };

  const handleDeleteAccount = async () => {
    const confirmed = await customConfirm({
      title: "계정 삭제 확인",
      message: "정말 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
      confirmText: "계정 삭제",
      cancelText: "취소",
      confirmVariant: "destructive",
    });

    if (confirmed) {
      console.log("계정 삭제 실행");
      alert("계정이 삭제되었습니다. (실제 삭제 로직은 백엔드에 필요)");
      onClose();
    }
  };

  const handlePreview = async (id: number) => {
    const data = await getTestResultById(id);
    if (data) {
      setPreviewTest(data);
      setActiveView("preview");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md sm:max-w-lg flex flex-col max-h-[95vh] h-[95vh]">
        <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-purple-700 to-pink-600 text-white shadow-md">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <User className="w-5 h-5" /> 내 프로필
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full p-2 text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveView("info")}
            className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
              activeView === "info"
                ? "text-purple-700 dark:text-purple-400 bg-white dark:bg-gray-900 border-b-2 border-purple-700 dark:border-purple-400 shadow-inner"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <Info className="w-4 h-4" /> 내 정보
          </button>
          <button
            onClick={() => setActiveView("history")}
            className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
              activeView === "history"
                ? "text-purple-700 dark:text-purple-400 bg-white dark:bg-gray-900 border-b-2 border-purple-700 dark:border-purple-400 shadow-inner"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <Trophy className="w-4 h-4" /> 테스트 기록
          </button>
        </div>

        <div className="p-4 sm:p-6 flex-grow overflow-y-auto custom-scrollbar">
          {activeView === "info" && (
            <div className="space-y-4">
              <div className="text-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 p-1 shadow-lg">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="프로필 이미지"
                      className="w-full h-full object-cover rounded-full border-4 border-white dark:border-gray-900"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold bg-gradient-to-br from-purple-600 to-pink-600">
                      <User className="w-10 h-10 sm:w-12 sm:h-12 text-white/90" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {email}
                </p>
                {joinDate && (
                  <p className="text-xs text-gray-500 flex items-center justify-center">
                    <Calendar className="w-3 h-3 mr-1" /> 가입일:{" "}
                    {formatDateByStyle(joinDate)}
                  </p>
                )}

                <div className="mt-4 text-left px-4 sm:px-0">
                  <Label
                    htmlFor="nickname"
                    className="text-gray-700 dark:text-gray-300 font-semibold mb-1 flex items-center gap-1"
                  >
                    닉네임
                    {isNicknameSet ? (
                      <BadgeInfo className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Edit2 className="w-4 h-4 text-blue-500" />
                    )}
                  </Label>
                  <Input
                    id="nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    readOnly={isNicknameSet}
                    placeholder="닉네임을 입력해주세요"
                    className={`bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 ${
                      isNicknameSet ? "cursor-not-allowed" : "cursor-text"
                    }`}
                  />
                  {!isNicknameSet && (
                    <Button
                      className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 rounded-lg flex items-center justify-center gap-2 w-full text-sm"
                      onClick={handleSaveNickname}
                      disabled={nickname.trim() === ""}
                    >
                      <Edit2 className="w-4 h-4" /> 닉네임 저장
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />{" "}
                  설정
                </h3>

                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
                  <div>
                    <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                      언어
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {language === "ko" ? "한국어" : "영어"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="text-sm py-1 px-3"
                    disabled
                  >
                    변경
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
                  <div>
                    <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                      알림
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      현재 개발 중
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="text-sm py-1 px-3"
                    disabled
                  >
                    설정
                  </Button>
                </div>

                <Button
                  variant="destructive"
                  className="w-full mt-3"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" /> 로그아웃
                </Button>

                <Button
                  variant="outline"
                  className="w-full mt-2 text-red-700 dark:text-red-400"
                  onClick={handleDeleteAccount}
                >
                  <Trash2 className="w-4 h-4" /> 계정 삭제
                </Button>
              </div>
            </div>
          )}

          {activeView === "history" && user?.id && (
            <TestHistoryTab userId={user.id} onPreview={handlePreview} />
          )}

          {activeView === "preview" && previewTest && (
            <TestHistoryPreview
              test={previewTest}
              onBack={() => {
                setActiveView("history");
                setPreviewTest(null);
              }}
            />
          )}
        </div>

        <ConfirmComponent />
      </div>
    </div>
  );
}
