import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import GoogleAd from "../ads/GoogleAd";

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
            AD
            <GoogleAd />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CenterBanner;
