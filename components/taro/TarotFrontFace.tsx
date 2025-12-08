// components/taro/TarotFrontFace.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

interface TarotFrontFaceProps {
  imageUrl: string;
  name: string;
  onImageLoad?: () => void;
}

export default function TarotFrontFace({
  imageUrl,
  name,
  onImageLoad,
}: TarotFrontFaceProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative h-full w-full rounded-xl p-2 md:p-4 border-2 border-accent/20 bg-gradient-to-br from-card to-card/50 shadow-lg">
      <div className="relative h-full w-full rounded-md overflow-hidden">
        {!isLoaded && (
          <div className="absolute inset-0 bg-zinc-800 animate-pulse rounded-md" />
        )}
        <Image
          src={imageUrl}
          alt={`Image of ${name}`}
          fill
          sizes="(max-width: 768px) 260px, 320px"
          className={`rounded-md object-cover transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          priority
          onLoad={() => {
            setIsLoaded(true);
            onImageLoad?.();
          }}
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
