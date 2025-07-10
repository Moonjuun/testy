import { create } from "zustand";

export type Language = "ko" | "en" | "ja" | "vi";

interface LanguageState {
  currentLanguage: Language; // 'currentLanguage'보다 'language'가 더 간결합니다.
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  currentLanguage: "en", // 기본값은 'en'으로 단순하게 설정
  setLanguage: (lang) => set({ currentLanguage: lang }),
}));
