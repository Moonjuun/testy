import { lunchCategories } from "@/constants/play/lunch-constants";
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
