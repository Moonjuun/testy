import { Card } from "@/components/ui/card";
import { formatBoldText } from "@/utils/formatBoldText";

interface PersonalityResult {
  id: number;
  title: string;
  type: string;
  keywords: string[];
  description: string;
  resultImageUrl: string;
  bgGradient: string;
  accentColor: string;
}

interface PersonalityTestCardProps {
  result: PersonalityResult;
}

const keywordColorClasses = [
  "bg-pink-100 text-pink-700 border-pink-200",
  "bg-purple-100 text-purple-700 border-purple-200",
  "bg-blue-100 text-blue-700 border-blue-200",
  "bg-green-100 text-green-700 border-green-200",
  "bg-yellow-100 text-yellow-700 border-yellow-200",
  "bg-indigo-100 text-indigo-700 border-indigo-200",
];

const PersonalityTestCard = ({ result }: PersonalityTestCardProps) => {
  return (
    <Card
      className={`p-8 space-y-8 bg-gradient-to-br ${result.bgGradient} border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]`}
    >
      {/* Character Image */}
      <div className="text-center">
        <div className="relative inline-block">
          <img
            src={result.resultImageUrl}
            alt={result.title}
            className="w-40 h-40 rounded-full object-cover border-6 border-white shadow-xl mx-auto"
          />
          <div className="absolute -top-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-2xl">✨</span>
          </div>
        </div>
      </div>

      {/* Title Section */}
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-bold text-gray-800 font-serif">
          {result.title}
        </h2>
        <p className="text-xl text-gray-600 font-medium bg-white/50 px-4 py-2 rounded-full inline-block">
          {result.type}
        </p>
      </div>

      {/* Keywords */}
      <div className="flex flex-wrap justify-center gap-3">
        {result.keywords.map((keyword, idx) => (
          <span
            key={keyword}
            className={`px-4 py-2 rounded-full text-sm font-medium border-2 backdrop-blur-sm ${
              keywordColorClasses[idx % keywordColorClasses.length]
            }`}
          >
            #{keyword}
          </span>
        ))}
      </div>

      {/* Description */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-inner">
        <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
          {formatBoldText(result.description)}
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="flex justify-center space-x-4 text-3xl opacity-70">
        <span>🌟</span>
        <span>💖</span>
        <span>🌈</span>
        <span>✨</span>
      </div>
    </Card>
  );
};

export default PersonalityTestCard;
