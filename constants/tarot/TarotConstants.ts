import {
  Heart,
  Syringe as Ring,
  FileText,
  TrendingUp,
  Users,
  Lightbulb,
  Wallet,
  Star,
} from "lucide-react";

export const categories = [
  { id: "love", icon: Heart },
  { id: "marriage", icon: Ring },
  { id: "career", icon: FileText },
  { id: "business", icon: TrendingUp },
  { id: "relationships", icon: Users },
  { id: "growth", icon: Lightbulb },
  { id: "finance", icon: Wallet },
  { id: "timing", icon: Star },
];

// /constants/tarot/TarotConstants.ts
export const subcategories = {
  love: [
    { id: "start" },
    { id: "current" },
    { id: "partner" },
    { id: "future" },
    { id: "action" },
  ],
  marriage: [
    { id: "timing" },
    { id: "partner" },
    { id: "family" },
    { id: "preparation" },
  ],
  career: [
    { id: "change" },
    { id: "promotion" },
    { id: "workplace" },
    { id: "skills" },
  ],
  business: [
    { id: "startup" },
    { id: "investment" },
    { id: "partnership" },
    { id: "growth" },
  ],
  relationships: [
    { id: "friends" },
    { id: "family" },
    { id: "conflicts" },
    { id: "networking" },
  ],
  growth: [
    { id: "purpose" },
    { id: "habits" },
    { id: "mindset" },
    { id: "healing" },
  ],
  finance: [
    { id: "saving" },
    { id: "spending" },
    { id: "investment" },
    { id: "debt" },
  ],
  timing: [
    { id: "decision" },
    { id: "opportunity" },
    { id: "luck" },
    { id: "caution" },
  ],
} as const;
