export const lunchCategories = {
  who: [
    { id: "friend", label: "친구", emoji: "👯" },
    { id: "partner", label: "연인", emoji: "❤️" },
    { id: "family", label: "가족", emoji: "👨‍👩‍👧‍👦" },
    { id: "group", label: "단체", emoji: "🎉" },
  ],
  cuisine: [
    { id: "korean", label: "한식", emoji: "🍚" },
    { id: "chinese", label: "중식", emoji: "🥡" },
    { id: "japanese", label: "일식", emoji: "🍣" },
    { id: "western", label: "양식", emoji: "🍝" },
    { id: "asian", label: "아시아/기타", emoji: "🥢" },
  ],
  mealType: [
    { id: "full_meal", label: "식사", emoji: "🍽️" },
    { id: "dish", label: "간단한 요리", emoji: "🥟" },
  ],
};

export type LunchCategoryKey = keyof typeof lunchCategories;
export type LunchCategoryValue =
  (typeof lunchCategories)[LunchCategoryKey][number]["id"];

export interface LunchMenuItem {
  id: string;
  name: string;
  description: string;
  image: string;
  categories: {
    who: LunchCategoryValue[];
    cuisine: LunchCategoryValue[];
    mealType: LunchCategoryValue[];
  };
}

export interface LunchCategoryOption {
  id: LunchCategoryValue;
  label: string;
  emoji: string;
}
