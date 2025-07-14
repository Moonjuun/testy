"use client";

import { useRef, useEffect, useCallback } from "react";
import type { Point, GameState, ShapeType } from "@/types/play/draw";
import { SHAPES } from "@/constants/play/draw";
import { drawGuideShape, drawUserPath, drawPerfectShape } from "@/lib/utils";

interface GameCanvasProps {
  gameState: GameState;
  selectedShape: ShapeType;
  userPath: Point[];
  showComparison: boolean;
  setUserPath: (path: React.SetStateAction<Point[]>) => void;
  onStopDrawing: () => void;
}

const CANVAS_SIZE = 320;

export function GameCanvas({
  gameState,
  selectedShape,
  userPath,
  showComparison,
  setUserPath,
  onStopDrawing,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);

  // 캔버스 다시 그리기 로직
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 캔버스 초기화
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    const gradient = ctx.createRadialGradient(
      CANVAS_SIZE / 2,
      CANVAS_SIZE / 2,
      0,
      CANVAS_SIZE / 2,
      CANVAS_SIZE / 2,
      CANVAS_SIZE / 2
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.9)");
    gradient.addColorStop(1, "rgba(248, 250, 252, 0.9)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // 가이드라인, 사용자 경로, 정답 경로 그리기
    if (gameState === "drawing" || gameState === "countdown") {
      drawGuideShape(ctx, selectedShape);
    }
    if (userPath.length > 0) {
      const config = SHAPES[selectedShape];
      drawUserPath(ctx, userPath, config.strokeColor, config.shadowColor);
    }
    if (showComparison) {
      drawPerfectShape(ctx, selectedShape);
    }
  }, [gameState, selectedShape, userPath, showComparison]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // 마우스/터치 이벤트 좌표 변환 함수
  const getEventPos = (
    e: React.MouseEvent | React.TouchEvent
  ): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_SIZE / rect.width;
    const scaleY = CANVAS_SIZE / rect.height;

    if ("touches" in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  // 그리기 시작/진행/종료 핸들러
  const handleStartDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (gameState !== "drawing") return;
    e.preventDefault();
    const pos = getEventPos(e);
    if (!pos) return;

    isDrawingRef.current = true;
    setUserPath([pos]);
  };

  const handleDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current || gameState !== "drawing") return;
    e.preventDefault();
    const pos = getEventPos(e);
    if (!pos) return;

    setUserPath((prev) => [...prev, pos]);
  };

  const handleStopDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    onStopDrawing(); // 부모 컴포넌트(훅)의 stopDrawing 함수 호출
  };

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      className="w-full h-full rounded-2xl shadow-lg cursor-crosshair touch-none border-2 border-white/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50"
      onMouseDown={handleStartDrawing}
      onMouseMove={handleDraw}
      onMouseUp={handleStopDrawing}
      onMouseLeave={handleStopDrawing}
      onTouchStart={handleStartDrawing}
      onTouchMove={handleDraw}
      onTouchEnd={handleStopDrawing}
      style={{ touchAction: "none" }}
    />
  );
}
