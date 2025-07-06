import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// utils/formatDateByStyle.ts
export type DateFormatStyle =
  | "dot" // 2025.07.06
  | "dash" // 2025-07-06
  | "slash" // 2025/07/06
  | "compact" // 20250706
  | "time" // 2025.07.06 19:17
  | "datetime" // 2025-07-06 19:17:34
  | "iso" // 2025-07-06T10:17:34.704Z
  | "kr"; // 2025년 07월 06일

export function formatDateByStyle(
  isoDate?: string,
  style: DateFormatStyle = "dot"
): string {
  if (!isoDate) return "알 수 없음";

  const date = new Date(isoDate);
  const yyyy = date.getFullYear();
  const mm = `${date.getMonth() + 1}`.padStart(2, "0");
  const dd = `${date.getDate()}`.padStart(2, "0");
  const hh = `${date.getHours()}`.padStart(2, "0");
  const min = `${date.getMinutes()}`.padStart(2, "0");
  const ss = `${date.getSeconds()}`.padStart(2, "0");

  switch (style) {
    case "dot":
      return `${yyyy}.${mm}.${dd}`;
    case "dash":
      return `${yyyy}-${mm}-${dd}`;
    case "slash":
      return `${yyyy}/${mm}/${dd}`;
    case "compact":
      return `${yyyy}${mm}${dd}`;
    case "time":
      return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
    case "datetime":
      return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
    case "iso":
      return date.toISOString();
    case "kr":
      return `${yyyy}년 ${mm}월 ${dd}일`;
    default:
      return `${yyyy}.${mm}.${dd}`;
  }
}
