// store/useLanguageStore.ts
import { create } from "zustand";
import i18n from "@/app/i18n";

export type Language = "ko" | "en" | "ja" | "vi";

interface LanguageState {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  // --- 초기 언어 설정 수정: i18n.language에서 언어 코드만 추출 ---
  currentLanguage:
    typeof window !== "undefined"
      ? (i18n.language.split("-")[0] as Language) || "ko" // 'ko-KR' -> 'ko'
      : "ko", // 서버 사이드 렌더링 시 기본값
  setLanguage: (lang) => {
    i18n.changeLanguage(lang); // i18next의 언어 변경 (i18next 자체는 전체 로케일 지원)
    set({ currentLanguage: lang }); // Zustand 스토어 업데이트 (정규화된 언어 코드 저장)
  },
}));
