import { forwardRef } from "react";
import { formatBoldText } from "@/utils/formatBoldText";
import { useTranslation } from "react-i18next";
interface ResultDownloadCardProps {
  test_title: string;
  title: string;
  keywords: string[];
  description: string;
  resultImageUrl: string;
  recommendation: {
    items: string[];
    matching_type: string;
    suggested_actions: string;
    short_description: string; // short_description도 recommendation 안에 있으므로 명시
  };
}

const keywordColorClasses = [
  "bg-pink-100 text-pink-700",
  "bg-purple-100 text-purple-700",
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-yellow-100 text-yellow-700",
  "bg-indigo-100 text-indigo-700",
];

const ResultDownloadCard = forwardRef<HTMLDivElement, ResultDownloadCardProps>(
  (
    {
      test_title,
      title,
      keywords,
      description,
      resultImageUrl,
      recommendation,
    },
    ref
  ) => {
    // recommendation 객체가 없을 경우를 대비한 방어 코드
    if (!recommendation) {
      return null; // 또는 로딩이나 에러 UI를 표시할 수 있습니다.
    }

    const { t, i18n } = useTranslation("common");

    return (
      <div
        ref={ref}
        className="font-sans bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 w-[600px] rounded-3xl p-8 text-center space-y-6 shadow-2xl border-4 border-white relative overflow-hidden"
      >
        {/* 기존 배경 장식 요소 (유지) */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-pink-300 rounded-full"></div>
          <div className="absolute top-32 right-8 w-12 h-12 bg-purple-300 rounded-full"></div>
          <div className="absolute bottom-20 left-8 w-16 h-16 bg-blue-300 rounded-full"></div>
          <div className="absolute bottom-10 right-12 w-10 h-10 bg-yellow-300 rounded-full"></div>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {test_title}
            </h3>
            <div className="w-20 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mx-auto"></div>
          </div>

          {/* Character Image */}
          {/* 캐릭터 이미지 (유지) */}
          <div className="relative">
            <img
              src={resultImageUrl}
              alt={title}
              className="w-64 h-64 md:w-72 md:h-72 rounded-full mx-auto object-cover border-4 border-white shadow-xl"
            />
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
              <span className="text-sm">✨</span>
            </div>
          </div>

          {/* 제목 (유지) */}
          <h2 className="text-2xl font-extrabold text-gray-800 leading-tight">
            {title}
          </h2>

          {/* 키워드 (유지) */}
          <div className="flex flex-wrap justify-center gap-2">
            {keywords.map((keyword, idx) => (
              <span
                key={keyword}
                className={`items-center justify-center text-center px-3 h-8 rounded-lg text-[13px] font-medium ${
                  keywordColorClasses[idx % keywordColorClasses.length]
                }`}
              >
                #{keyword}
              </span>
            ))}
          </div>

          {/* ===== 🎨 여기서부터 추가된 섹션입니다 🎨 ===== */}

          {/* 상세 설명 (기존 short_description을 대체) */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-left">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {formatBoldText(recommendation.short_description)}
            </p>
          </div>

          {/* 구분선 */}
          <hr className="border-t border-gray-300/70" />

          {/* 섹션: 환상의 케미 */}
          <div className="text-left space-y-2">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <span className="text-lg">💕</span>
              {t("resultPage.matchingType")}
            </h3>
            <div className="bg-pink-100/80 border-l-4 border-pink-400 text-pink-900 p-3 rounded-r-lg">
              <p className="text-sm leading-6">
                {formatBoldText(recommendation.matching_type)}
              </p>
            </div>
          </div>

          {/* 섹션: 어울리는 아이템 */}
          <div className="text-left space-y-3">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <span className="text-lg">🎁</span>{" "}
              {t("resultPage.suitableItems")}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {recommendation.items.map((item) => (
                <span
                  key={item}
                  className="bg-gray-200/60 rounded-lg text-gray-800 text-left items-center justify-center px-3 h-8 text-[13px] "
                >
                  <span className=" font-semibold">✅ {item}</span>
                </span>
              ))}
            </div>
          </div>

          {/* 섹션: 추천행동 */}
          <div className="text-left space-y-2">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <span className="text-lg">💡</span>{" "}
              {t("resultPage.suggestedActions")}
            </h3>
            <div className="bg-blue-100/80 border-l-4 border-blue-400 text-blue-900 p-3 rounded-r-lg">
              <p className="text-sm leading-6">
                {formatBoldText(recommendation.suggested_actions)}
              </p>
            </div>
          </div>

          <div className="mt-2 border-t border-gray-300/70 pt-2">
            <span>Made on </span>
            <span className="font-bold text-pink-600">Testy </span>
            (https://www.testy.im)
          </div>
        </div>
      </div>
    );
  }
);

ResultDownloadCard.displayName = "ResultDownloadCard";

export default ResultDownloadCard;
