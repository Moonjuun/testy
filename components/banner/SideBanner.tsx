import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface SideBannerProps {
  position: "left" | "right";
}

const SideBanner = ({ position }: SideBannerProps) => {
  return (
    <div className="sticky top-4 space-y-4">
      {/* 300x600 Banner Ad Space */}
      <Card className="w-full h-[600px] border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
        <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center">
          <div className="text-gray-400 mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4 mx-auto flex items-center justify-center">
              📢
            </div>
          </div>
          <h4 className="font-semibold text-gray-600 mb-2">광고 영역</h4>
          <p className="text-sm text-gray-500 mb-4">300 × 600</p>
          <div className="text-xs text-gray-400 space-y-1">
            <p>사이드 배너 광고</p>
            <p>위치: {position === "left" ? "좌측" : "우측"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Additional smaller ad space */}
      <Card className="w-full h-64 border border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardContent className="p-4 h-full flex flex-col items-center justify-center text-center">
          <div className="text-gray-400 mb-3">
            <div className="w-12 h-12 bg-gray-200 rounded-lg mb-3 mx-auto flex items-center justify-center">
              🎯
            </div>
          </div>
          <h4 className="font-semibold text-gray-600 mb-2">추가 광고</h4>
          <p className="text-sm text-gray-500">300 × 250</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SideBanner;
