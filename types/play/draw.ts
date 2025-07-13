export interface Point {
  x: number;
  y: number;
}

export interface Player {
  rank: number;
  name: string;
  score: number;
  avatar: string;
}

export type GameState = "idle" | "countdown" | "drawing" | "results";
export type ShapeType =
  | "circle"
  | "triangle"
  | "square"
  | "umbrella"
  | "star"
  | "diamond";

export interface ShapeConfig {
  name: string;
  emoji: string;
  description: string;
  gradient: string;
  shadowColor: string;
  strokeColor: string;
  difficulty: number;
}
