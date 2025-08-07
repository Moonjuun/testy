import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Heart,
  MessageSquare,
  Sparkles,
  Target,
  AlertTriangle,
  CheckCircle,
  HeartHandshake,
  Swords,
  Compass,
  ShoppingBag,
  Share2,
  Home,
  RotateCcw,
} from "lucide-react";

// MBTI 결과 데이터
const mbtiResult = {
  type: "ENFJ",
  title: "따뜻한 리더",
  description:
    "당신은 타인을 이해하고 도우려는 마음이 강한 따뜻한 리더입니다. 사람들과의 관계를 중시하며, 긍정적인 에너지로 주변을 이끌어가는 능력이 뛰어납니다.",
  profile: [
    {
      axis: "E-I",
      label1: "E",
      label2: "I",
      value1: 70,
      value2: 30,
      color: "bg-gradient-to-r from-blue-500 to-purple-500",
    },
    {
      axis: "S-N",
      label1: "S",
      label2: "N",
      value1: 45,
      value2: 55,
      color: "bg-gradient-to-r from-blue-500 to-purple-500",
    },
    {
      axis: "T-F",
      label1: "T",
      label2: "F",
      value1: 20,
      value2: 80,
      color: "bg-gradient-to-r from-blue-500 to-purple-500",
    },
    {
      axis: "J-P",
      label1: "J",
      label2: "P",
      value1: 60,
      value2: 40,
      color: "bg-gradient-to-r from-blue-500 to-purple-500",
    },
  ],
  keywords: ["사교적인", "공감능력", "계획적인", "열정적인", "따뜻한"],
  compatibility: {
    best: { type: "INFP", comment: "서로의 감정을 깊이 이해하는 환상의 짝꿍!" },
    worst: { type: "ISTP", comment: "서로 다른 가치관으로 충돌할 수 있어요." },
  },
  datingStyle: [
    {
      icon: Heart,
      description: "상대방에게 헌신적이며 로맨틱한 관계를 추구해요.",
    },
    {
      icon: MessageSquare,
      description: "솔직하고 깊은 대화를 통해 유대감을 형성해요.",
    },
  ],
  dailyTips: [
    "새로운 사람들과 교류하며 에너지를 얻으세요.",
    "계획을 세우고 실천하며 성취감을 느껴보세요.",
    "주변 사람들에게 긍정적인 영향을 주는 당신의 능력을 발휘하세요.",
  ],
  recommendedItems: [
    "자기계발 저널",
    "스타일리시 토트백",
    "아로마 디퓨저",
    "감성 인테리어 소품",
  ],
  actions: {
    recommended: [
      "다양한 사람들과 교류하며 새로운 아이디어를 얻으세요.",
      "당신의 긍정적인 에너지를 주변에 나누어 주세요.",
      "목표를 설정하고 체계적으로 달성해나가세요.",
    ],
    caution: [
      "타인의 감정에 너무 몰입하여 자신을 소홀히 하지 않도록 주의하세요.",
      "과도한 계획으로 인해 유연성을 잃지 않도록 조심하세요.",
    ],
  },
};

export default function MBTIResultPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 결과 헤더 */}
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-24 h-24 bg-blue-400 rounded-full -translate-x-10 -translate-y-10 animate-ping" />
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-pink-400 rounded-full translate-x-8 translate-y-8 animate-bounce" />
            </div>
            <div className="relative text-center space-y-6">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800">
                <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {mbtiResult.type}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                나는{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  "{mbtiResult.title}"
                </span>
              </h1>
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed max-w-2xl mx-auto">
                {mbtiResult.description}
              </p>
            </div>
          </div>

          {/* MBTI 프로필 */}
          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Compass className="w-6 h-6 text-blue-600" />
                나의 MBTI 프로필
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {mbtiResult.profile.map((item) => (
                <div key={item.axis} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white text-lg">
                      {item.label1} - {item.label2}
                    </span>
                    <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {item.label1} {item.value1}% / {item.label2} {item.value2}
                      %
                    </span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                      <div
                        className={cn(
                          "h-4 rounded-full transition-all duration-1000 shadow-sm",
                          item.color
                        )}
                        style={{ width: `${item.value1}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 궁합 유형 */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-r from-purple-50 via-blue-50 to-pink-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-pink-900/20 border border-purple-100 dark:border-purple-700 shadow-xl">
              <CardContent className="p-6 text-center">
                <HeartHandshake className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  환상의 케미
                </h3>
                <p className="text-3xl font-bold text-pink-600 mb-2">
                  {mbtiResult.compatibility.best.type}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {mbtiResult.compatibility.best.comment}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 dark:from-orange-900/20 dark:via-red-900/20 dark:to-pink-900/20 border border-orange-100 dark:border-orange-700 shadow-xl">
              <CardContent className="p-6 text-center">
                <Swords className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  환장의 케미
                </h3>
                <p className="text-3xl font-bold text-orange-600 mb-2">
                  {mbtiResult.compatibility.worst.type}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {mbtiResult.compatibility.worst.comment}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 성격 키워드 */}
          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                나의 성격 키워드
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 justify-center">
                {mbtiResult.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-200 rounded-full font-medium"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 연애 스타일 */}
          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Heart className="w-6 h-6 text-pink-600" />
                나의 연애 스타일
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              {mbtiResult.datingStyle.map((style, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                >
                  <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mb-3">
                    <style.icon className="w-6 h-6 text-pink-600" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {style.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 추천 가이드 */}
          <Card className="bg-gradient-to-r from-purple-50 via-blue-50 to-pink-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-pink-900/20 border border-purple-100 dark:border-purple-700 shadow-xl">
            <CardContent className="p-8 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Target className="w-6 h-6 text-green-600" />
                추천 가이드
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    추천 행동
                  </h3>
                  <div className="space-y-2">
                    {mbtiResult.actions.recommended.map((action, index) => (
                      <p
                        key={index}
                        className="bg-white/70 dark:bg-gray-700/70 p-3 rounded-lg text-gray-700 dark:text-gray-300 text-sm"
                      >
                        • {action}
                      </p>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    조심해야 할 행동
                  </h3>
                  <div className="space-y-2">
                    {mbtiResult.actions.caution.map((action, index) => (
                      <p
                        key={index}
                        className="bg-white/70 dark:bg-gray-700/70 p-3 rounded-lg text-gray-700 dark:text-gray-300 text-sm"
                      >
                        • {action}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-blue-500" />
                  어울리는 아이템
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {mbtiResult.recommendedItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-white/70 dark:bg-gray-700/70 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 공유하기 */}
          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Share2 className="w-6 h-6 text-blue-600" />
                친구들과 공유하기
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="bg-gradient-to-tr from-blue-600 via-blue-500 to-blue-400 hover:opacity-90 text-white rounded-2xl font-semibold flex flex-col items-center justify-center gap-2 h-20 shadow-lg hover:shadow-xl transition-all">
                  <span className="text-2xl">📘</span>
                  <span className="text-sm">Facebook</span>
                </Button>
                <Button className="bg-blue-400 hover:bg-blue-500 text-white rounded-2xl font-semibold flex flex-col items-center justify-center gap-2 h-20 shadow-lg hover:shadow-xl transition-all">
                  <span className="text-2xl">🐦</span>
                  <span className="text-sm">Twitter</span>
                </Button>
                <Button className="bg-gradient-to-tr from-yellow-400 via-amber-400 to-orange-400 hover:opacity-90 text-white rounded-2xl font-semibold flex flex-col items-center justify-center gap-2 h-20 shadow-lg hover:shadow-xl transition-all">
                  <Share2 className="w-6 h-6" />
                  <span className="text-sm">링크 복사</span>
                </Button>
                <Button className="bg-gradient-to-tr from-emerald-400 via-green-500 to-lime-400 hover:opacity-90 text-white rounded-2xl font-semibold flex flex-col items-center justify-center gap-2 h-20 shadow-lg hover:shadow-xl transition-all">
                  <span className="text-2xl">💾</span>
                  <span className="text-sm">이미지 저장</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 하단 버튼 */}
          <div className="flex flex-row flex-wrap gap-4 justify-center">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              다시 풀기
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 rounded-full px-8 shadow-lg hover:shadow-xl transition-all"
            >
              <Home className="w-4 h-4 mr-2" />
              홈으로 가기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
