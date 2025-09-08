// components/taro/TarotFrontFace.tsx
"use client";

import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

interface TarotFrontFaceProps {
  imageUrl: string;
  name: string;
}

export default function TarotFrontFace({
  imageUrl,
  name,
}: TarotFrontFaceProps) {
  return (
    <div className="relative h-full w-full rounded-xl p-2 md:p-4 border-2 border-accent/20 bg-gradient-to-br from-card to-card/50 shadow-lg">
      <div className="relative h-full w-full rounded-md overflow-hidden">
        <Image
          src={imageUrl}
          alt={`Image of ${name}`}
          layout="fill"
          objectFit="cover"
          className="rounded-md"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="p-4 rounded-full bg-accent/20 backdrop-blur-sm">
            <Sparkles className="w-10 h-10 text-accent" />
          </div>
        </div>
      </div>
    </div>
  );
}
