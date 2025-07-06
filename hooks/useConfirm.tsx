import { useState, useCallback } from "react";

interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "default" | "destructive" | "outline" | "ghost" | "link";
  cancelVariant?: "default" | "destructive" | "outline" | "ghost" | "link";
}
import ConfirmDialog from "@/components/modal/confirm-dialog";

export const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({});
  const [resolvePromise, setResolvePromise] = useState<
    ((value: boolean) => void) | null
  >(null);

  const customConfirm = useCallback(
    (opts?: ConfirmOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        setOptions(opts || {});
        setIsOpen(true);
        setResolvePromise(() => resolve); // 프라미스를 해결할 함수 저장
      });
    },
    []
  );

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(true); // '확인' 시 true 반환
      setResolvePromise(null);
    }
  }, [resolvePromise]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(false); // '취소' 시 false 반환
      setResolvePromise(null);
    }
  }, [resolvePromise]);

  const ConfirmComponent = useCallback(
    () => (
      <ConfirmDialog
        isOpen={isOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        options={options}
      />
    ),
    [isOpen, handleCancel, handleConfirm, options]
  );

  return { customConfirm, ConfirmComponent };
};
