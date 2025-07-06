// hooks/use-alert.tsx
"use client";

import { useState, useCallback } from "react";
import AlertDialog from "@/components/modal/alert-dialog";

interface AlertOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  confirmVariant?: "default" | "destructive" | "outline" | "ghost" | "link";
}

export function useAlert() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<AlertOptions>({});
  const [resolvePromise, setResolvePromise] = useState<
    ((value: void) => void) | null
  >(null);

  const customAlert = useCallback((opts: AlertOptions = {}): Promise<void> => {
    setOptions(opts);
    setIsOpen(true);
    return new Promise((resolve) => {
      setResolvePromise(() => resolve); // 닫혔을 때 resolve할 함수 저장
    });
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(); // alert이 닫히면 Promise resolve
      setResolvePromise(null);
    }
  }, [resolvePromise]);

  const Alert = useCallback(() => {
    return (
      <AlertDialog isOpen={isOpen} onClose={handleClose} options={options} />
    );
  }, [isOpen, handleClose, options]);

  return { customAlert, Alert };
}
