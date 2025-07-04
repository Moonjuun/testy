import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface CenterBannerProps {
  size: "large" | "medium" | "small";
}

const CenterBanner = ({ size }: CenterBannerProps) => {
  const dimensions = {
    large: { width: "w-full max-w-4xl", height: "h-32", label: "728 × 90" },
    medium: { width: "w-full max-w-2xl", height: "h-64", label: "336 × 280" },
    small: { width: "w-full max-w-xl", height: "h-24", label: "320 × 50" },
  };

  const { width, height, label } = dimensions[size];

  return (
    <div className="flex justify-center">
      <Card
        className={`${width} ${height} border border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50`}
      >
        <CardContent
          className={`p-4 h-full flex items-center justify-center text-center`}
        >
          <div>
            <div className="text-gray-400 mb-2">
              <div className="w-12 h-12 bg-gray-200 rounded-lg mb-2 mx-auto flex items-center justify-center">
                📺
              </div>
            </div>
            <h4 className="font-semibold text-gray-600 mb-1">중앙 배너 광고</h4>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CenterBanner;
