// components/modal/profile-modal.tsx

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
  Loader2, // Loader2 아이콘 추가
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useConfirm } from "@/hooks/useConfirm";
import { formatDateByStyle } from "@/lib/utils";
import { signOut, deleteUserAccount } from "@/lib/supabase/action"; // deleteUserAccount 임포트
import { TestHistoryTab } from "../profile/TestHistoryTab";
import { getTestResultById } from "@/lib/supabase/getTestResultById";
import { TestHistoryPreview } from "../profile/TestHistoryPreview";
import { useTranslation } from "react-i18next";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [activeView, setActiveView] = useState<"info" | "history" | "preview">(
    "info"
  );
  const [previewTest, setPreviewTest] = useState<any | null>(null);
  const { t } = useTranslation();

  const user = useUserStore((state) => state.user);
  const { customConfirm, ConfirmComponent } = useConfirm();
  const language = useLanguageStore((state) => state.currentLanguage);

  const initialNickname = user?.user_metadata?.nickname || "";
  const [nickname, setNickname] = useState(initialNickname);
  const [isNicknameSet, setIsNicknameSet] = useState(initialNickname !== "");
  const [isDeleting, setIsDeleting] = useState(false); // 삭제 로딩 상태 추가

  const name =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    t("profile.anonymous");
  const email =
    user?.email || user?.user_metadata?.email || t("profile.noEmail");
  const avatarUrl =
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const joinDate = user?.created_at;

  const handleLogout = async () => {
    const confirmed = await customConfirm({
      title: t("profile.logoutConfirmTitle"),
      message: t("profile.logoutConfirmMessage"),
      confirmText: t("alert.confirm"),
      cancelText: t("alert.cancel"),
      confirmVariant: "destructive",
    });

    if (confirmed) {
      try {
        await signOut(language);
        onClose();
        window.location.reload();
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
  };

  const handleSaveNickname = () => {
    console.log("닉네임 저장:", nickname);
    setIsNicknameSet(true);
    alert(t("profile.nicknameSaved"));
  };

  const handleDeleteAccount = async () => {
    const confirmed = await customConfirm({
      title: t("profile.deleteConfirmTitle"),
      message: t("profile.deleteConfirmMessage"),
      confirmText: t("profile.deleteConfirmButton"),
      cancelText: t("alert.cancel"),
      confirmVariant: "destructive",
    });

    if (confirmed) {
      setIsDeleting(true);
      const { error } = await deleteUserAccount();
      if (error) {
        await customConfirm({
          title: t("profile.notification"),
          message: "failed to delete account",
          confirmText: t("alert.confirm"),
        });
        setIsDeleting(false);
      } else {
        await customConfirm({
          title: t("profile.notification"),
          message: t("profile.accountDeleted"),
          confirmText: t("alert.confirm"),
        });
        onClose();
        window.location.href = "/"; // 홈페이지로 리디렉션
      }
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

      <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md sm:max-w-lg flex flex-col max-h-[85vh] h-[85vh]">
        <div className="flex items-center justify-between px-4 py-2 sm:px-5 sm:py-2 bg-gradient-to-r from-purple-700 to-pink-600 text-white shadow-md rounded-t-xl">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <User className="w-5 h-5" /> {t("header.profile")}
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
            <Info className="w-4 h-4" /> {t("profile.infoTab")}
          </button>
          <button
            onClick={() => setActiveView("history")}
            className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
              activeView === "history"
                ? "text-purple-700 dark:text-purple-400 bg-white dark:bg-gray-900 border-b-2 border-purple-700 dark:border-purple-400 shadow-inner"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <Trophy className="w-4 h-4" /> {t("profile.testHistoryTab")}
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
                      alt="Profile"
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
                    <Calendar className="w-3 h-3 mr-1" />{" "}
                    {t("profile.joinDate")}: {formatDateByStyle(joinDate)}
                  </p>
                )}
                <div className="mt-4 text-left px-4 sm:px-0">
                  <Label
                    htmlFor="nickname"
                    className="text-gray-700 dark:text-gray-300 font-semibold mb-1 flex items-center gap-1"
                  >
                    {t("profile.nickname")}
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
                    placeholder={t("profile.nicknamePlaceholder")}
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
                      <Edit2 className="w-4 h-4" /> {t("profile.saveNickname")}
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />{" "}
                  {t("profile.settings")}
                </h3>

                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
                  <div>
                    <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                      {t("profile.language")}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {language === "ko"
                        ? t("profile.korean")
                        : t("profile.english")}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="text-sm py-1 px-3"
                    disabled
                  >
                    {t("profile.change")}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
                  <div>
                    <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                      {t("profile.notification")}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("profile.inDevelopment")}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="text-sm py-1 px-3"
                    disabled
                  >
                    {t("profile.setting")}
                  </Button>
                </div>

                <Button
                  variant="destructive"
                  className="w-full mt-3"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" /> {t("profile.logout")}
                </Button>

                <Button
                  variant="outline"
                  className="w-full mt-2 text-red-700 dark:text-red-400"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  {isDeleting ? "삭제 중..." : t("profile.deleteAccount")}
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
