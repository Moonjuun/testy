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
    short_description: string;
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
    if (!recommendation) {
      return null;
    }

    const { t } = useTranslation("common");

    return (
      <div
        ref={ref}
        // ✅ 너비를 w-[400px]로 고정하여 항상 동일한 크기로 렌더링
        className="font-sans bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 w-[400px] rounded-2xl p-6 text-center space-y-4 shadow-2xl border-2 border-white relative overflow-hidden"
      >
        {/* --- 나머지 코드는 이전과 동일합니다 --- */}

        {/* 배경 장식 요소 */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-pink-300 rounded-full"></div>
          <div className="absolute top-32 right-8 w-12 h-12 bg-purple-300 rounded-full"></div>
          <div className="absolute bottom-20 left-8 w-16 h-16 bg-blue-300 rounded-full"></div>
          <div className="absolute bottom-10 right-12 w-10 h-10 bg-yellow-300 rounded-full"></div>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="relative z-10 space-y-4">
          {/* Header */}
          <div className="text-center mb-4">
            <h3 className="text-base font-medium text-gray-600 mb-1.5">
              {test_title}
            </h3>
            <div className="w-16 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mx-auto"></div>
          </div>

          {/* Character Image */}
          <div className="relative">
            <img
              src={resultImageUrl}
              alt={title}
              className="w-48 h-48 rounded-full mx-auto object-cover border-4 border-white shadow-xl"
            />
            <div className="absolute top-0 right-1/4 translate-x-12 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
              <span className="text-sm">✨</span>
            </div>
          </div>

          {/* 제목 */}
          <h2 className="text-xl font-extrabold text-gray-800 leading-tight">
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

          {/* 상세 설명 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-left">
            <p className="text-sm text-gray-700 leading-normal whitespace-pre-line">
              {formatBoldText(recommendation.short_description)}
            </p>
          </div>

          {/* 구분선 */}
          <hr className="border-t border-gray-300/70" />

          {/* 섹션: 환상의 케미 */}
          <div className="text-left space-y-2">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <span className="text-base">💕</span>
              {t("resultPage.matchingType")}
            </h3>
            <div className="bg-pink-100/80 border-l-4 border-pink-400 text-pink-900 p-3 rounded-r-lg">
              <p className="text-sm leading-normal">
                {formatBoldText(recommendation.matching_type)}
              </p>
            </div>
          </div>

          {/* 섹션: 어울리는 아이템 */}
          <div className="text-left space-y-2">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <span className="text-base">🎁</span>{" "}
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
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <span className="text-base">💡</span>{" "}
              {t("resultPage.suggestedActions")}
            </h3>
            <div className="bg-blue-100/80 border-l-4 border-blue-400 text-blue-900 p-3 rounded-r-lg">
              <p className="text-sm leading-normal">
                {formatBoldText(recommendation.suggested_actions)}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="!mt-4 border-t border-gray-300/70 pt-3 text-sm text-gray-500">
            <span>Made on </span>
            <span className="font-bold text-pink-600">Testy </span>
            <span>(www.testy.im)</span>
          </div>
        </div>
      </div>
    );
  }
);

ResultDownloadCard.displayName = "ResultDownloadCard";

export default ResultDownloadCard;
