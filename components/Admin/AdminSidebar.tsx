// components/admin/AdminSidebar.tsx
"use client";

interface Props {
  activeTab: "json" | "upload" | "manage";
  setActiveTab: (tab: "json" | "upload" | "manage") => void;
}

export default function AdminSidebar({ activeTab, setActiveTab }: Props) {
  const menuItems: {
    key: "json" | "upload" | "manage";
    label: string;
    icon: string;
  }[] = [
    { key: "json", label: "1. 테스트 JSON 업로드", icon: "🧪" },
    { key: "upload", label: "2. 결과 이미지 등록", icon: "🖼️" },
    { key: "manage", label: "3. 등록된 결과 이미지 관리", icon: "✅" },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
        관리자 메뉴
      </h2>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`block w-full text-left px-4 py-2 rounded-lg ${
              activeTab === item.key
                ? "bg-purple-600 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-800"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
