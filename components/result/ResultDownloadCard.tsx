import { forwardRef } from "react";
import { formatBoldText } from "@/utils/formatBoldText";

interface ResultDownloadCardProps {
  title: string;
  keywords: string[];
  description: string;
  resultImageUrl: string;
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
  ({ title, keywords, description, resultImageUrl }, ref) => {
    return (
      <div
        ref={ref}
        className="font-sans bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 w-[400px] rounded-3xl p-8 text-center space-y-6 shadow-2xl border-4 border-white relative overflow-hidden"
      >
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-pink-300 rounded-full"></div>
          <div className="absolute top-32 right-8 w-12 h-12 bg-purple-300 rounded-full"></div>
          <div className="absolute bottom-20 left-8 w-16 h-16 bg-blue-300 rounded-full"></div>
          <div className="absolute bottom-10 right-12 w-10 h-10 bg-yellow-300 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-6">
          {/* Header */}
          {/* <div className="text-center mb-6">
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              🌈 성향 테스트 결과
            </h3>
            <div className="w-20 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mx-auto"></div>
          </div> */}

          {/* Character Image */}
          <div className="relative">
            <img
              src={resultImageUrl}
              alt={title}
              className="w-72 h-72 rounded-full mx-auto object-cover border-4 border-white shadow-xl"
            />
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
              <span className="text-sm">✨</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-800 leading-tight">
            {title}
          </h2>

          {/* Keywords */}
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

          {/* Description */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-left">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {formatBoldText(description)}
            </p>
          </div>

          {/* Footer */}
          {/* <div className="pt-4 border-t border-white/50">
            <div className="flex justify-center space-x-2 text-lg mb-2">
              <span>🌟</span>
              <span>💖</span>
              <span>✨</span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              나만의 특별한 성향을 발견했어요!
            </p>
          </div> */}
        </div>
      </div>
    );
  }
);

ResultDownloadCard.displayName = "ResultDownloadCard";

export default ResultDownloadCard;
