// components/admin/AdminSidebar.tsx
"use client";

import {
  UploadCloud,
  FileImage,
  ImageIcon,
  ListChecks,
  GalleryHorizontal,
} from "lucide-react";

// ✅ 5개 탭을 위한 타입 정의
type AdminTab =
  | "json"
  | "thumbnail-upload"
  | "result-upload"
  | "thumbnail-manage"
  | "result-manage";

interface Props {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
}

export default function AdminSidebar({ activeTab, setActiveTab }: Props) {
  const menuItems = [
    { key: "json" as const, label: "1. JSON 업로드", icon: <UploadCloud /> },
    {
      key: "thumbnail-upload" as const,
      label: "2. 테스트 썸네일 등록",
      icon: <FileImage />,
    },

    {
      key: "thumbnail-manage" as const,
      label: "3. 등록된 테스트 썸네일 관리",
      icon: <GalleryHorizontal />,
    },
    {
      key: "result-upload" as const,
      label: "4. 결과 이미지 등록",
      icon: <ImageIcon />,
    },
    {
      key: "result-manage" as const,
      label: "5. 등록된 결과 이미지 관리",
      icon: <ListChecks />,
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
            className={`w-full flex items-center gap-3 text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
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
