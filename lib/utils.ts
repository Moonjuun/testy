import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Point, ShapeType, ShapeConfig } from "@/types/play/draw";
import { SHAPES } from "@/constants/play/draw";

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

export const detectDominantLanguage = (
  text: string
): "ko" | "ja" | "en" | "vi" | "unknown" => {
  const counts = {
    ko: (text.match(/[\uac00-\ud7af]/g) || []).length,
    ja: (text.match(/[\u3040-\u30ff\u31f0-\u31ff]/g) || []).length,
    vi: (text.match(/[ăâêôơưđ]/gi) || []).length,
    en: (text.match(/[a-zA-Z]/g) || []).length,
  };

  const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return dominant[1] > 10 ? (dominant[0] as any) : "unknown"; // 최소 10자 이상일 때만 확신
};

// Canvas 관련 유틸리티 함수들
const CANVAS_SIZE = 320;
const CENTER_X = CANVAS_SIZE / 2;
const CENTER_Y = CANVAS_SIZE / 2;
const COMPLETENESS_THRESHOLD = 45; // 꼭짓점/특징점을 '방문'했다고 인정할 픽셀 반경

/** 가이드라인 그리기 */
export const drawGuideShape = (
  ctx: CanvasRenderingContext2D,
  shape: ShapeType
) => {
  ctx.strokeStyle = "rgba(147, 197, 253, 0.5)";
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();

  switch (shape) {
    case "circle":
      ctx.arc(CENTER_X, CENTER_Y, 85, 0, 2 * Math.PI);
      break;
    case "triangle":
      const triSize = 95,
        h = (triSize * Math.sqrt(3)) / 2;
      ctx.moveTo(CENTER_X, CENTER_Y - h / 2);
      ctx.lineTo(CENTER_X - triSize / 2, CENTER_Y + h / 2);
      ctx.lineTo(CENTER_X + triSize / 2, CENTER_Y + h / 2);
      ctx.closePath();
      break;
    case "square":
      const sqSize = 110;
      ctx.rect(CENTER_X - sqSize / 2, CENTER_Y - sqSize / 2, sqSize, sqSize);
      break;
    case "umbrella":
      ctx.arc(CENTER_X, CENTER_Y - 25, 60, Math.PI, 0);
      ctx.moveTo(CENTER_X - 60, CENTER_Y - 25);
      ctx.lineTo(CENTER_X + 60, CENTER_Y - 25);
      ctx.moveTo(CENTER_X, CENTER_Y - 25);
      ctx.lineTo(CENTER_X, CENTER_Y + 50);
      ctx.arc(
        CENTER_X + 15,
        CENTER_Y + 62,
        12,
        -Math.PI / 2,
        Math.PI / 2,
        false
      );
    case "star":
      drawStar(ctx, CENTER_X, CENTER_Y, 5, 85, 40);
      break;

    case "diamond":
      ctx.moveTo(CENTER_X, CENTER_Y - 85); // Top
      ctx.lineTo(CENTER_X + 60, CENTER_Y); // Right
      ctx.lineTo(CENTER_X, CENTER_Y + 85); // Bottom
      ctx.lineTo(CENTER_X - 60, CENTER_Y); // Left
      ctx.closePath();
      break;
  }
  ctx.stroke();
  ctx.setLineDash([]);
};

/** 사용자 경로 그리기 */
export const drawUserPath = (
  ctx: CanvasRenderingContext2D,
  path: Point[],
  color: string,
  shadowColor: string
) => {
  if (path.length < 2) return;
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowColor = shadowColor;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(path[0].x, path[0].y);
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(path[i].x, path[i].y);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
};

/** 정답 도형 그리기 */
export const drawPerfectShape = (
  ctx: CanvasRenderingContext2D,
  shape: ShapeType
) => {
  // drawGuideShape과 로직이 유사하므로 필요에 따라 통합 가능
  // 여기서는 스타일만 다르게 적용
  ctx.strokeStyle = "#86EFAC";
  ctx.lineWidth = 3;
  ctx.setLineDash([4, 4]);
  ctx.shadowColor = "rgba(134, 239, 172, 0.4)";
  ctx.shadowBlur = 8;
  ctx.beginPath();
  // ... drawGuideShape와 동일한 switch-case 로직 ...
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.shadowBlur = 0;
};

// 헬퍼 함수 (순수 계산 함수)

/** 두 점 사이의 거리를 계산합니다. */
const distance = (p1: Point, p2: Point) =>
  Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

/** 한 점에서 선분까지의 최단 거리를 계산합니다. */
const distanceToLineSegment = (
  point: Point,
  lineStart: Point,
  lineEnd: Point
): number => {
  const A = point.x - lineStart.x;
  const B = point.y - lineStart.y;
  const C = lineEnd.x - lineStart.x;
  const D = lineEnd.y - lineStart.y;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  if (lenSq !== 0) param = dot / lenSq;

  let xx, yy;

  if (param < 0) {
    xx = lineStart.x;
    yy = lineStart.y;
  } else if (param > 1) {
    xx = lineEnd.x;
    yy = lineEnd.y;
  } else {
    xx = lineStart.x + param * C;
    yy = lineStart.y + param * D;
  }

  const dx = point.x - xx;
  const dy = point.y - yy;
  return Math.sqrt(dx * dx + dy * dy);
};

// 도형별 계산 로직

/** 원의 편차와 완성도를 계산합니다. */
/**
 * [수정됨] 원 그리기 경로를 평가합니다.
 * 완성도(Completeness) 계산이 주요 지점 방문 방식으로 변경되어 더 넉넉해졌습니다.
 * @param path 사용자가 그린 경로(점들의 배열)
 * @returns { deviation: 편차, completeness: 완성도 }
 */
const calculateCircleMetrics = (
  path: Point[]
): { deviation: number; completeness: number } => {
  const targetRadius = 85;
  let totalDeviation = 0;

  // 편차 계산: 경로의 각 점이 목표 반지름에서 얼마나 벗어났는지의 총합
  path.forEach((point) => {
    totalDeviation += Math.abs(
      distance(point, { x: CENTER_X, y: CENTER_Y }) - targetRadius
    );
  });

  // 완성도 계산: 삼각형처럼 주요 지점(상,하,좌,우)을 방문했는지 체크
  const keyPoints = [
    { x: CENTER_X, y: CENTER_Y - targetRadius }, // 상
    { x: CENTER_X + targetRadius, y: CENTER_Y }, // 우
    { x: CENTER_X, y: CENTER_Y + targetRadius }, // 하
    { x: CENTER_X - targetRadius, y: CENTER_Y }, // 좌
  ];

  let visitedKeyPoints = 0;
  for (const keyPoint of keyPoints) {
    // 원은 꼭짓점을 정확히 지나갈 필요가 없으므로, 임계값을 약간 더 넉넉하게 설정 (예: 1.2배)
    if (
      path.some((p) => distance(p, keyPoint) < COMPLETENESS_THRESHOLD * 1.2)
    ) {
      visitedKeyPoints++;
    }
  }

  const completeness = visitedKeyPoints / 4.0;
  return { deviation: totalDeviation, completeness };
};

/** 삼각형의 편차와 완성도를 계산합니다. */
const calculateTriangleMetrics = (
  path: Point[]
): { deviation: number; completeness: number } => {
  const vertices = [
    { x: CENTER_X, y: CENTER_Y - 55 },
    { x: CENTER_X - 63.5, y: CENTER_Y + 27.5 },
    { x: CENTER_X + 63.5, y: CENTER_Y + 27.5 },
  ];
  let totalDeviation = 0;
  path.forEach((point) => {
    const d1 = distanceToLineSegment(point, vertices[0], vertices[1]);
    const d2 = distanceToLineSegment(point, vertices[1], vertices[2]);
    const d3 = distanceToLineSegment(point, vertices[2], vertices[0]);
    totalDeviation += Math.min(d1, d2, d3);
  });

  let visitedCorners = 0;
  for (const vertex of vertices) {
    if (path.some((p) => distance(p, vertex) < COMPLETENESS_THRESHOLD)) {
      visitedCorners++;
    }
  }
  const completeness = visitedCorners / 3.0;
  return { deviation: totalDeviation, completeness };
};

/** 사각형의 편차와 완성도를 계산합니다. */
const calculateSquareMetrics = (
  path: Point[]
): { deviation: number; completeness: number } => {
  const vertices = [
    { x: CENTER_X - 55, y: CENTER_Y - 55 },
    { x: CENTER_X + 55, y: CENTER_Y - 55 },
    { x: CENTER_X + 55, y: CENTER_Y + 55 },
    { x: CENTER_X - 55, y: CENTER_Y + 55 },
  ];
  let totalDeviation = 0;
  path.forEach((point) => {
    const d1 = distanceToLineSegment(point, vertices[0], vertices[1]);
    const d2 = distanceToLineSegment(point, vertices[1], vertices[2]);
    const d3 = distanceToLineSegment(point, vertices[2], vertices[3]);
    const d4 = distanceToLineSegment(point, vertices[3], vertices[0]);
    totalDeviation += Math.min(d1, d2, d3, d4);
  });

  let visitedCorners = 0;
  for (const vertex of vertices) {
    if (path.some((p) => distance(p, vertex) < COMPLETENESS_THRESHOLD)) {
      visitedCorners++;
    }
  }
  const completeness = visitedCorners / 4.0;
  return { deviation: totalDeviation, completeness };
};

/** 우산의 편차와 완성도를 계산합니다. */
const calculateUmbrellaMetrics = (
  path: Point[]
): { deviation: number; completeness: number } => {
  const arcCenter = { x: CENTER_X, y: CENTER_Y - 25 };
  const arcRadius = 60;
  const handleTop = { x: CENTER_X, y: CENTER_Y - 25 };
  const handleBottom = { x: CENTER_X, y: CENTER_Y + 50 };

  let totalDeviation = 0;
  path.forEach((point) => {
    const distToArcCenter = distance(point, arcCenter);
    const arcDistance = Math.abs(distToArcCenter - arcRadius);
    const handleDistance = distanceToLineSegment(
      point,
      handleTop,
      handleBottom
    );
    totalDeviation += Math.min(arcDistance, handleDistance);
  });

  const hasTopPart = path.some((p) => p.y < CENTER_Y - 25);
  const hasMiddlePart = path.some((p) => p.y > CENTER_Y && p.y < CENTER_Y + 50);
  const hasBottomPart = path.some((p) => p.y > CENTER_Y + 50);
  const completeness =
    (hasTopPart ? 0.5 : 0) +
    (hasMiddlePart ? 0.3 : 0) +
    (hasBottomPart ? 0.2 : 0);
  return { deviation: totalDeviation, completeness };
};

// 별표를 그리는 헬퍼 함수
export const drawStar = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
) => {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
};

export const calculateStarMetrics = (
  path: Point[]
): { deviation: number; completeness: number } => {
  const spikes = 5;
  const outerRadius = 85;
  const innerRadius = 40;
  const vertices: Point[] = [];
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;

  for (let i = 0; i < spikes; i++) {
    vertices.push({
      x: CENTER_X + Math.cos(rot) * outerRadius,
      y: CENTER_Y + Math.sin(rot) * outerRadius,
    });
    rot += step;
    vertices.push({
      x: CENTER_X + Math.cos(rot) * innerRadius,
      y: CENTER_Y + Math.sin(rot) * innerRadius,
    });
    rot += step;
  }

  let totalDeviation = 0;
  path.forEach((point) => {
    let minDistance = Infinity;
    for (let i = 0; i < vertices.length; i++) {
      const p1 = vertices[i];
      const p2 = vertices[(i + 1) % vertices.length];
      minDistance = Math.min(minDistance, distanceToLineSegment(point, p1, p2));
    }
    totalDeviation += minDistance;
  });

  let visitedCorners = 0;
  for (const vertex of vertices.filter((_, i) => i % 2 === 0)) {
    // 뾰족한 부분만 체크
    if (path.some((p) => distance(p, vertex) < COMPLETENESS_THRESHOLD + 10)) {
      visitedCorners++;
    }
  }
  const completeness = visitedCorners / 5.0;
  return { deviation: totalDeviation, completeness };
};

// 다이아몬드 개선 로직 예시
export const calculateDiamondMetrics = (
  path: Point[]
): { deviation: number; completeness: number } => {
  const vertices = [
    { x: CENTER_X, y: CENTER_Y - 85 },
    { x: CENTER_X + 60, y: CENTER_Y },
    { x: CENTER_X, y: CENTER_Y + 85 },
    { x: CENTER_X - 60, y: CENTER_Y },
  ];

  let totalDeviation = 0;
  path.forEach((point) => {
    const d1 = distanceToLineSegment(point, vertices[0], vertices[1]);
    const d2 = distanceToLineSegment(point, vertices[1], vertices[2]);
    const d3 = distanceToLineSegment(point, vertices[2], vertices[3]);
    const d4 = distanceToLineSegment(point, vertices[3], vertices[0]);
    totalDeviation += Math.min(d1, d2, d3, d4);
  });

  let visitedCorners = 0;
  for (const vertex of vertices) {
    if (path.some((p) => distance(p, vertex) < COMPLETENESS_THRESHOLD)) {
      visitedCorners++;
    }
  }

  const completeness = visitedCorners / 4.0;
  return { deviation: totalDeviation, completeness };
};

//  메인 점수 계산 함수 (Export)

/**
 * 사용자가 그린 경로, 도형 종류, 시간을 바탕으로 최종 점수를 계산합니다.
 * @param path 사용자가 그린 경로 (Point 배열)
 * @param shape 선택된 도형 종류
 * @param timeTakenMs 그림을 그리는 데 걸린 시간 (ms)
 * @returns 0점에서 100점 사이의 최종 점수
 */
export const calculateScore = (
  path: Point[],
  shape: ShapeType,
  timeTakenMs: number
): number => {
  // 기본적인 유효성 검사: 경로의 점이 너무 적으면 0점 처리
  if (path.length < 20) return 0;

  let metrics = { deviation: 0, completeness: 0 };

  // 도형에 따라 적절한 계산 함수 호출
  switch (shape) {
    case "circle":
      metrics = calculateCircleMetrics(path);
      break;
    case "triangle":
      metrics = calculateTriangleMetrics(path);
      break;
    case "square":
      metrics = calculateSquareMetrics(path);
      break;
    case "umbrella":
      metrics = calculateUmbrellaMetrics(path);
      break;
    case "star":
      metrics = calculateStarMetrics(path);
      break;
    case "diamond":
      metrics = calculateDiamondMetrics(path);
      break;
    default:
      return 0; // 알 수 없는 도형은 0점
  }

  const { deviation, completeness } = metrics;

  // 1. 기본 정확도 점수 계산
  const averageDeviation = deviation / path.length;
  // 난이도에 따른 최대 편차 값을 조정하여 점수를 더 관대하게 책정
  const maxDeviation = 30 + SHAPES[shape].difficulty * 20;

  let accuracyScore = Math.max(
    0,
    100 - (averageDeviation / maxDeviation) * 100
  );

  // 2. 완성도 페널티 적용
  // 완성도 점수를 더 큰 폭으로 반영
  accuracyScore *= Math.pow(completeness, 2);
  if (completeness < 0.7) {
    accuracyScore *= 0.6; // 완성도가 70% 미만이면 추가 페널티
  }

  // 3. 시간 보너스 점수 계산
  const timeTakenSeconds = timeTakenMs / 1000;
  // 시간 보너스 기준을 12초로 늘리고, 보너스 점수 폭을 30점으로 확대
  const maxTimeForBonus = 12;
  const timeBonus = Math.max(0, 1 - timeTakenSeconds / maxTimeForBonus) * 30;

  // 4. 최종 점수 합산 (정확도 70% + 시간 보너스 30%)
  const finalScore = accuracyScore * 0.7 + timeBonus;

  return Math.min(100, finalScore); // 100점을 넘지 않도록 보정
};

export const shareScore = (
  platform: "kakao" | "twitter" | "instagram" | "copy",
  score: number | null,
  shape: ShapeConfig
) => {
  if (score === null) return;

  const text = `${shape.emoji} I scored ${score.toFixed(2)}% drawing a a ${
    shape.name
  }! Can you beat my precision? ✨ #PerfectShapeChallenge`;
  const url = window.location.href;

  switch (platform) {
    case "kakao":
      // 카카오 SDK가 있다면 아래와 같이 구현할 수 있습니다.
      // Kakao.Link.sendDefault({ objectType: 'text', text, link: { mobileWebUrl: url, webUrl: url } });
      alert("카카오 공유는 SDK 연동이 필요합니다. 콘솔에 로그를 출력합니다.");
      console.log("Kakao Share:", text, url);
      break;

    case "twitter":
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(url)}`
      );
      break;

    default: // instagram 및 copy
      navigator.clipboard
        .writeText(`${text} ${url}`)
        .then(() => {
          alert("링크가 클립보드에 복사되었습니다! 📋");
        })
        .catch((err) => {
          console.error("클립보드 복사 실패:", err);
          alert("클립보드 복사에 실패했습니다.");
        });
      break;
  }
};

export const getScoreColor = (score: number): string => {
  if (score >= 95) return "text-emerald-500";
  if (score >= 90) return "text-sky-500";
  if (score >= 80) return "text-purple-500";
  if (score >= 70) return "text-pink-500";
  return "text-gray-500";
};

export const getScoreMessage = (score: number): string => {
  if (score >= 95) return "🎯 Absolutely Perfect! You're a master!";
  if (score >= 90) return "⭐ Outstanding! Nearly flawless!";
  if (score >= 85) return "🔥 Excellent! Amazing precision!";
  if (score >= 80) return "✨ Great job! Very impressive!";
  if (score >= 70) return "👏 Good work! Keep it up!";
  if (score >= 60) return "👍 Not bad! Practice makes perfect!";
  return "💪 Keep practicing! You've got this!";
};
