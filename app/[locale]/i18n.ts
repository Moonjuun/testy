// i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// 번역 파일 임포트 (경로를 다시 확인해주세요)
import enCommon from "@/public/locales/en/common.json";
import koCommon from "@/public/locales/ko/common.json";
import jaCommon from "@/public/locales/ja/common.json";
import viCommon from "@/public/locales/vi/common.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: undefined, // 언어를 명시적으로 지정하지 않음 (감지 사용)
    detection: {
      order: ["path", "navigator"],
      // 경로 > 브라우저 순으로 언어 감지
    },
    fallbackLng: "en", // 번역이 없는 경우 기본 언어
    debug: false, // 개발 중에만 true로 설정 (콘솔에 디버그 로그 출력)
    interpolation: {
      escapeValue: false, // React는 기본적으로 이스케이프를 처리
    },
    resources: {
      en: {
        common: enCommon,
      },
      ko: {
        common: koCommon,
      },
      ja: {
        common: jaCommon,
      },
      vi: {
        common: viCommon,
      },
    },
    ns: ["common"], // 불러올 네임스페이스 목록
    defaultNS: "common", // 기본 네임스페이스
  });

export default i18n;
