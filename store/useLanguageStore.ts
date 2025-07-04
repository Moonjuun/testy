// store/useLanguageStore.ts
import { create } from "zustand";

export type Language = "ko" | "en" | "ja" | "vi";

interface LanguageState {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  currentLanguage: "ko",
  setLanguage: (lang) => set({ currentLanguage: lang }),
}));
