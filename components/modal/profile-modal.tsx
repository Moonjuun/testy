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
  Edit2,
  ChevronRight,
  Info,
  BadgeInfo,
  Trash2, // 계정 삭제 버튼에 사용할 아이콘 추가
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
  const [activeTab, setActiveTab] = useState<"info" | "history">("info");
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
    } else {
      console.log("로그아웃 취소됨");
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
    } else {
      console.log("계정 삭제 취소됨");
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
    {
      id: 4,
      title: "여행 취향 테스트",
      result: "탐험가",
      date: "2023.12.01",
      category: "라이프",
    },
    {
      id: 5,
      title: "직업 적성 테스트",
      result: "크리에이티브 디자이너",
      date: "2023.11.25",
      category: "직업",
    },
    {
      id: 6,
      title: "성격 유형 테스트",
      result: "ISTP",
      date: "2023.11.10",
      category: "성격",
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md sm:max-w-lg flex flex-col transform transition-all duration-300 ease-out scale-95 opacity-0 animate-scaleIn
        // ⭐ 이 부분을 수정했습니다.
        max-h-[95vh] h-[95vh] // Set a fixed height that accommodates the "My Info" tab
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-purple-700 to-pink-600 text-white shadow-md">
          <h2 className="text-xl sm:text-xl font-bold flex items-center gap-2">
            <User className="w-5 h-5" /> 내 프로필
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full p-2 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("info")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 ease-in-out flex items-center justify-center gap-2
              ${
                activeTab === "info"
                  ? "text-purple-700 dark:text-purple-400 bg-white dark:bg-gray-900 border-b-2 border-purple-700 dark:border-purple-400 shadow-inner"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
          >
            <Info className="w-4 h-4" />내 정보
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 ease-in-out flex items-center justify-center gap-2
              ${
                activeTab === "history"
                  ? "text-purple-700 dark:text-purple-400 bg-white dark:bg-gray-900 border-b-2 border-purple-700 dark:border-purple-400 shadow-inner"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
          >
            <Trophy className="w-4 h-4" />
            테스트 기록
          </button>
        </div>

        {/* Content - overflow-y-auto는 history 탭에만 적용 (조건부 렌더링) */}
        <div
          className={`p-4 sm:p-6 flex-grow overflow-y-auto custom-scrollbar`} // ⭐ overflow-y-auto는 항상 적용
        >
          {activeTab === "info" && (
            <div className="space-y-4">
              {/* Profile Info Section */}
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
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {name}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2">
                  {email}
                </p>
                {joinDate && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center justify-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    가입일: {formatDateByStyle(joinDate)}
                  </p>
                )}
                {/* 닉네임 입력 필드 */}
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
                    readOnly={isNicknameSet} // 닉네임이 이미 설정되었으면 읽기 전용
                    placeholder="닉네임을 입력해주세요"
                    className={`bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 
                      ${isNicknameSet ? "cursor-not-allowed" : "cursor-text"}`}
                  />
                  {isNicknameSet ? (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      닉네임은 최초 1회만 수정할 수 있습니다.
                    </p>
                  ) : (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      닉네임을 설정해 주세요. (최초 1회 등록)
                    </p>
                  )}
                  {!isNicknameSet && (
                    <Button
                      className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 rounded-lg transition-colors flex items-center justify-center gap-2 w-full text-sm"
                      onClick={handleSaveNickname}
                      disabled={nickname.trim() === ""} // 닉네임이 비어있으면 저장 버튼 비활성화
                    >
                      <Edit2 className="w-4 h-4" />
                      닉네임 저장
                    </Button>
                  )}
                </div>
              </div>

              {/* Settings Section */}
              <div className="space-y-3 pt-3">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  설정
                </h3>
                {/* ⭐ 언어 설정 섹션 수정 */}
                <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
                  <div>
                    <p className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200">
                      언어
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {language === "ko" ? "한국어" : "영어"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm py-1 px-3"
                    disabled
                  >
                    변경
                  </Button>
                </div>

                {/* ⭐ 알림 설정 섹션 수정 */}
                <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
                  <div>
                    <p className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200">
                      알림
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      현재 개발 중
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed text-sm py-1 px-3"
                    disabled
                  >
                    설정
                  </Button>
                </div>

                {/* 로그아웃 버튼 (기존 위치 유지) */}
                <Button
                  variant="destructive"
                  className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white font-semibold py-1.5 rounded-lg flex items-center justify-center gap-2 text-sm"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  로그아웃
                </Button>

                {/* 계정 삭제 버튼 (기존 위치 유지) */}
                <Button
                  variant="outline"
                  className="w-full mt-2 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800 flex items-center justify-center gap-2 text-sm"
                  onClick={handleDeleteAccount}
                >
                  <Trash2 className="w-4 h-4" />
                  계정 삭제
                </Button>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">
                최근 테스트 결과
              </h3>
              <div className="grid gap-3">
                {testHistory.map((test) => (
                  <div
                    key={test.id}
                    className="p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md hover:translate-y-[-2px] transition-all duration-200 ease-in-out"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
                        {test.title}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {test.date}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div>
                        <p className="text-sm sm:text-base text-purple-600 dark:text-purple-400 font-medium">
                          결과: {test.result}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          카테고리: {test.category}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors py-1 px-2"
                      >
                        다시 보기
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-3 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
                disabled
              >
                더보기
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        <ConfirmComponent />
      </div>
    </div>
  );
}
