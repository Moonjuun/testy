"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import AlertDialog from "@/components/modal/alert-dialog"; // AlertDialog 경로 확인

interface AlertOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "default" | "destructive" | "outline" | "ghost" | "link";
}

// Context에 전달할 함수의 타입을 정의합니다.
type AlertContextType = (options: AlertOptions) => Promise<boolean>;

// Context를 생성합니다. 기본값은 에러를 발생시키도록 설정합니다.
const AlertContext = createContext<AlertContextType>(() => {
  throw new Error("AlertProvider not found");
});

// 다른 컴포넌트에서 customAlert 함수를 쉽게 사용하기 위한 훅입니다.
export const useAlert = () => {
  return useContext(AlertContext);
};

// Alert의 상태와 UI를 모두 관리하는 Provider 컴포넌트입니다.
export function AlertProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<AlertOptions>({});
  const [resolvePromise, setResolvePromise] = useState<
    ((value: boolean) => void) | null
  >(null);

  const customAlert = useCallback(
    (opts: AlertOptions = {}): Promise<boolean> => {
      setOptions(opts);
      setIsOpen(true);
      return new Promise<boolean>((resolve) => {
        setResolvePromise(() => resolve);
      });
    },
    []
  );

  const handleConfirm = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(true);
      setResolvePromise(null);
    }
    setIsOpen(false);
  }, [resolvePromise]);

  const handleCancel = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(false);
      setResolvePromise(null);
    }
    setIsOpen(false);
  }, [resolvePromise]);

  return (
    <AlertContext.Provider value={customAlert}>
      {children}
      {/* Alert UI는 Provider가 직접 렌더링합니다. */}
      <AlertDialog
        isOpen={isOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        options={options}
      />
    </AlertContext.Provider>
  );
}
