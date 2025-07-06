"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "default" | "destructive" | "outline" | "ghost" | "link";
  cancelVariant?: "default" | "destructive" | "outline" | "ghost" | "link";
}

// Confirm Dialog 컴포넌트 (useConfirm 훅 내부에서 렌더링될 예정)
const ConfirmDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  options: ConfirmOptions;
}> = ({ isOpen, onClose, onConfirm, options }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-hidden p-6 z-[101] animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {options.title || "확인"}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300 text-base">
            {options.message || "작업을 계속하시겠습니까?"}
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant={options.cancelVariant || "outline"}
            onClick={onClose}
            className={`border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-transparent`}
          >
            {options.cancelText || "취소"}
          </Button>
          <Button
            variant={options.confirmVariant || "default"}
            onClick={onConfirm}
            className={`${
              options.confirmVariant === "default" || !options.confirmVariant // default 일 때 그라디언트 적용
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

export default ConfirmDialog;
