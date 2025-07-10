// hooks/use-alert.tsx

"use client";

import { useState, useCallback } from "react";
import AlertDialog from "@/components/modal/alert-dialog";

interface AlertOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string; // 취소 버튼 텍스트 옵션 추가
  confirmVariant?: "default" | "destructive" | "outline" | "ghost" | "link";
}

export function useAlert() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<AlertOptions>({});

  // 1. resolve 함수의 타입을 boolean을 받도록 변경합니다.
  const [resolvePromise, setResolvePromise] = useState<
    ((value: boolean) => void) | null
  >(null);

  // 2. customAlert가 Promise<boolean>을 반환하도록 시그니처를 변경합니다.
  const customAlert = useCallback(
    (opts: AlertOptions = {}): Promise<boolean> => {
      setOptions(opts);
      setIsOpen(true);
      // 3. Promise<boolean> 타입의 새로운 Promise를 생성합니다.
      return new Promise<boolean>((resolve) => {
        setResolvePromise(() => resolve);
      });
    },
    []
  );

  // 4. '확인' 버튼을 눌렀을 때 실행될 함수를 만듭니다.
  const handleConfirm = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(true); // Promise를 true로 완료시킵니다.
      setResolvePromise(null);
    }
    setIsOpen(false);
  }, [resolvePromise]);

  // 5. '취소' 버튼을 누르거나 외부를 클릭했을 때 실행될 함수를 만듭니다.
  const handleCancel = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(false); // Promise를 false로 완료시킵니다.
      setResolvePromise(null);
    }
    setIsOpen(false);
  }, [resolvePromise]);

  const Alert = useCallback(() => {
    return (
      // 6. AlertDialog에 onConfirm과 onCancel을 전달합니다.
      <AlertDialog
        isOpen={isOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        options={options}
      />
    );
  }, [isOpen, handleConfirm, handleCancel, options]);

  return { customAlert, Alert };
}
