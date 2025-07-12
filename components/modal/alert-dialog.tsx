"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import React from "react";

// 1. props 타입에 cancelText 추가
interface AlertOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string; // 취소 버튼 텍스트 옵션
  confirmVariant?: "default" | "destructive" | "outline" | "ghost" | "link";
}

// 2. props를 onClose 대신 onConfirm과 onCancel로 받도록 변경
const AlertDialog: React.FC<{
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  options: AlertOptions;
}> = ({ isOpen, onConfirm, onCancel, options }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        // 3. 배경 클릭 시 onCancel 호출
        onClick={onCancel}
      />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-hidden p-6 z-[101] animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {options.title || "알림"}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            // 4. X 버튼 클릭 시 onCancel 호출
            onClick={onCancel}
            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300 text-base whitespace-pre-line">
            {options.message}
          </p>
        </div>
        <div className="flex justify-end space-x-3">
          {/* 5. 취소 버튼 추가 및 onCancel 연결 */}
          {options.cancelText && (
            <Button variant="outline" onClick={onCancel}>
              {options.cancelText}
            </Button>
          )}
          {/* 6. 확인 버튼 클릭 시 onConfirm 호출 */}
          <Button
            variant={options.confirmVariant || "default"}
            onClick={onConfirm}
            className={`${
              options.confirmVariant === "default" || !options.confirmVariant
                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                : ""
            }`}
          >
            {options.confirmText || "확인"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;
