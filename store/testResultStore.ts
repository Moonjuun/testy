// store/testResultStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { TestResultItem } from "@/types/test";

interface ResultState {
  result: TestResultItem | null;
  setResult: (result: TestResultItem) => void;
  clearResult: () => void;
}

export const useTestResultStore = create(
  persist<ResultState>(
    (set) => ({
      result: null,
      setResult: (newResult) => set({ result: newResult }),
      clearResult: () => set({ result: null }),
    }),
    {
      name: "test-result-storage", // sessionStorage에 저장될 키 이름
      storage: createJSONStorage(() => sessionStorage), // sessionStorage 사용
    }
  )
);
