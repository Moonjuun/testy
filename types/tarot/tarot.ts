export type TarotCard = {
  id: number;
  cardNumber: number;
  cardKey: string;
  arcanaType: string;
  suit: string | null;
  imageUrl: string | null;
  name: string;
  meaning: string;
  description: string;
  keyword: string[];
  advice: string;
};
