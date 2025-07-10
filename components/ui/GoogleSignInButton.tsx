// 예: components/ui/GoogleSignInButton.tsx

"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useTranslation } from "react-i18next";

export function GoogleSignInButton() {
  // useFormStatus 훅으로 form의 실행 상태를 가져옵니다.
  const { pending } = useFormStatus();
  const { t } = useTranslation("common");

  return (
    <Button
      type="submit"
      disabled={pending} // Server Action이 실행 중이면 버튼을 비활성화합니다.
      className="w-full h-12 rounded-xl font-medium transition-all bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
    >
      <FcGoogle className="w-7 h-7 mr-3" />
      {t("modal.continueWithGoogle")}
      {pending && (
        <div className="ml-2 w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
    </Button>
  );
}
