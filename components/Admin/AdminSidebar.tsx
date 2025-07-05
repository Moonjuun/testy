// components/admin/AdminSidebar.tsx
"use client";

import { UploadCloud, ImageIcon, ListChecks, FileImage } from "lucide-react";

// ✅ 타입에 'thumbnail' 추가
type AdminTab = "json" | "upload" | "manage" | "thumbnail";

interface Props {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
}

export default function AdminSidebar({ activeTab, setActiveTab }: Props) {
  const menuItems = [
    {
      key: "json" as const,
      label: "1. 테스트 JSON 업로드",
      icon: <UploadCloud className="w-5 h-5 mr-3" />,
    },
    // ✅ 새로운 메뉴 아이템 추가
    {
      key: "thumbnail" as const,
      label: "2. 테스트 썸네일 등록",
      icon: <FileImage className="w-5 h-5 mr-3" />,
    },
    {
      key: "upload" as const,
      label: "3. 결과 이미지 등록",
      icon: <ImageIcon className="w-5 h-5 mr-3" />,
    },
    {
      key: "manage" as const,
      label: "4. 등록 이미지 관리",
      icon: <ListChecks className="w-5 h-5 mr-3" />,
    },
  ];

  return (
    <aside className="w-72 bg-white dark:bg-gray-800/50 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        어드민 대시보드
      </h1>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`w-full flex items-center text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === item.key
                ? "bg-purple-600 text-white shadow-md"
                : "text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-700"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
