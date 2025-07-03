"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, User, Mail, Calendar, Trophy, Settings, LogOut } from "lucide-react"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "history" | "settings">("profile")

  // 임시 사용자 데이터
  const userData = {
    name: "김테스트",
    email: "test@example.com",
    joinDate: "2024.01.15",
    completedTests: 12,
    favoriteCategory: "성격",
  }

  const testHistory = [
    { id: 1, title: "여름 휴가 스타일", result: "자연 속 힐링러", date: "2024.01.20", category: "라이프" },
    { id: 2, title: "연애 스타일", result: "로맨틱한 연인", date: "2024.01.18", category: "연애" },
    { id: 3, title: "MBTI 정확도", result: "ENFP", date: "2024.01.15", category: "성격" },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">내 프로필</h2>
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
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "history"
                ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <Trophy className="w-4 h-4 inline mr-2" />
            테스트 기록
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "settings"
                ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            설정
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Profile Info */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{userData.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{userData.email}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {userData.completedTests}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">완료한 테스트</div>
                </div>
                <div className="text-center p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
                  <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">{userData.favoriteCategory}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">선호 카테고리</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">30일</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">연속 방문</div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                    이름
                  </Label>
                  <Input
                    id="name"
                    defaultValue={userData.name}
                    className="mt-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                    이메일
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={userData.email}
                    className="mt-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="joinDate" className="text-gray-700 dark:text-gray-300">
                    가입일
                  </Label>
                  <Input
                    id="joinDate"
                    defaultValue={userData.joinDate}
                    disabled
                    className="mt-1 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">최근 테스트 결과</h3>
              {testHistory.map((test) => (
                <div
                  key={test.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{test.title}</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{test.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">{test.result}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{test.category}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      다시 보기
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                전체 기록 보기
              </Button>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">알림 설정</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">새로운 테스트 알림</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">결과 공유 알림</span>
                    <input type="checkbox" className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">마케팅 정보 수신</span>
                    <input type="checkbox" className="rounded" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">개인정보</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    비밀번호 변경
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    개인정보 다운로드
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 bg-transparent border-gray-300 dark:border-gray-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {activeTab === "profile" && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex gap-3">
              <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                저장하기
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-transparent"
              >
                취소
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
