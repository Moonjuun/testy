// store/testMbtiResultStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// MBTI 결과 데이터 타입을 정의합니다.
interface MbtiResult {
  mbtiType: string;
  scores: {
    score_e: number;
    score_i: number;
    score_s: number;
    score_n: number;
    score_t: number;
    score_f: number;
    score_j: number;
    score_p: number;
  };
  testCode: string;
  title: string;
}

interface MbtiResultState {
  result: MbtiResult | null;
  setResult: (result: MbtiResult) => void;
  clearResult: () => void;
}

export const useMbtiTestResultStore = create(
  persist<MbtiResultState>(
    (set) => ({
      result: null,
      setResult: (newResult) => set({ result: newResult }),
      clearResult: () => set({ result: null }),
    }),
    {
      name: "mbti-test-result-storage", // sessionStorage에 저장될 키 이름
      storage: createJSONStorage(() => sessionStorage), // sessionStorage 사용
    }
  )
);
