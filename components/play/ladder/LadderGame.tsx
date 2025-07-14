"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Shuffle,
  Play,
  RotateCcw,
  Trash2,
  Moon,
  Sun,
} from "lucide-react";

// Point 타입 정의
interface Point {
  x: number;
  y: number;
}

interface Player {
  id: string;
  name: string;
  emoji: string;
  result?: string;
}

interface LadderConnection {
  level: number;
  position: number;
  connected: boolean;
}

interface Result {
  text: string;
  isWinner: boolean;
}

type GameState = "setup" | "ladder-setup" | "ready" | "playing";
type RevealMode = "one-by-one" | "show-all";

const PLAYER_EMOJIS = [
  "�",
  "🎯",
  "🌟",
  "🎉",
  "🚀",
  "💎",
  "🎪",
  "🌈",
  "⚡",
  "🎭",
  "🌺",
  "🎵",
  "🎲",
  "💡",
  "🏆",
];

const PLAYER_COLUMN_WIDTH = 80;
const LADDER_CANVAS_HEIGHT = 256;

export default function LadderGame() {
  const [gameState, setGameState] = useState<GameState>("setup");
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [ladderConnections, setLadderConnections] = useState<
    LadderConnection[]
  >([]);
  const [winnerCount, setWinnerCount] = useState(1);
  const [results, setResults] = useState<Result[]>([]);
  const [destinationResults, setDestinationResults] = useState<Result[]>([]);
  const [revealMode, setRevealMode] = useState<RevealMode>("one-by-one");
  const [revealedPlayers, setRevealedPlayers] = useState<Set<string>>(
    new Set()
  );
  const [animatingPlayer, setAnimatingPlayer] = useState<string | null>(null);
  const [animationPath, setAnimationPath] = useState<Point[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 참가자 수 변경 시 당첨 갯수 유효성 검사
  useEffect(() => {
    if (winnerCount >= players.length && players.length > 1) {
      setWinnerCount(players.length - 1);
    } else if (players.length <= 1 && winnerCount !== 1) {
      setWinnerCount(1);
    }
  }, [players.length, winnerCount]);

  // 참가자 추가
  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < 15) {
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: newPlayerName.trim(),
        emoji: PLAYER_EMOJIS[players.length % PLAYER_EMOJIS.length],
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName("");
    }
  };

  // 참가자 제거
  const removePlayer = (playerId: string) => {
    setPlayers(players.filter((p) => p.id !== playerId));
  };

  // [수정됨] 랜덤 사다리 생성 로직
  const generateRandomLadder = () => {
    if (players.length < 2) return;
    const newConnections: LadderConnection[] = [];
    const levels = Math.max(5, Math.floor(players.length * 1.5));

    for (let level = 0; level < levels; level++) {
      let lastConnectedPos = -2; // 같은 레벨에서 다리가 연달아 붙는 것을 방지

      for (let pos = 0; pos < players.length - 1; pos++) {
        // 같은 레벨에서 다리가 연달아 붙는 것을 방지
        if (pos === lastConnectedPos + 1) {
          newConnections.push({ level, position: pos, connected: false });
          continue;
        }

        // 바로 윗 레벨의 같은 위치에 다리가 있는지 확인
        const hasRungOnPrevLevel =
          level > 0 &&
          newConnections.some(
            (c) => c.level === level - 1 && c.position === pos && c.connected
          );

        // 윗 레벨에 다리가 있으면, 현재 위치에는 다리를 놓지 않음
        if (hasRungOnPrevLevel) {
          newConnections.push({ level, position: pos, connected: false });
          continue;
        }

        // 확률적으로 다리를 놓음
        if (Math.random() > 0.6) {
          newConnections.push({ level, position: pos, connected: true });
          lastConnectedPos = pos;
        } else {
          newConnections.push({ level, position: pos, connected: false });
        }
      }
    }
    setLadderConnections(newConnections);
  };

  // [수정됨] 사다리 연결 토글 로직
  const toggleConnection = (level: number, position: number) => {
    setLadderConnections((prev) => {
      const targetConn = prev.find(
        (c) => c.level === level && c.position === position
      );

      // 다리를 새로 추가하려고 할 때 (connected: false -> true)
      if (targetConn && !targetConn.connected) {
        // 바로 위 레벨에 다리가 있는지 확인
        const hasRungOnPrevLevel = prev.some(
          (c) => c.level === level - 1 && c.position === position && c.connected
        );
        // 바로 아래 레벨에 다리가 있는지 확인
        const hasRungOnNextLevel = prev.some(
          (c) => c.level === level + 1 && c.position === position && c.connected
        );

        // 위나 아래에 이미 다리가 있으면 추가하지 않고 기존 상태를 반환
        if (hasRungOnPrevLevel || hasRungOnNextLevel) {
          return prev;
        }
      }

      // 다리를 제거하거나, 위/아래에 다리가 없을 경우 토글 실행
      return prev.map((conn) =>
        conn.level === level && conn.position === position
          ? { ...conn, connected: !conn.connected }
          : conn
      );
    });
  };

  // 당첨/꽝 결과를 생성하는 로직
  const generateResults = () => {
    const winningResults = ["🎉 당첨!", "🎁 행운!", "🌟 성공!", "🏆 승리!"];
    const losingResultText = "😥 꽝";

    const shuffledWinning = [...winningResults].sort(() => 0.5 - Math.random());

    const resultPool: Result[] = [];
    for (let i = 0; i < winnerCount; i++) {
      resultPool.push({
        text: shuffledWinning[i % shuffledWinning.length],
        isWinner: true,
      });
    }
    for (let i = 0; i < players.length - winnerCount; i++) {
      resultPool.push({
        text: losingResultText,
        isWinner: false,
      });
    }

    const finalResultDestinations = resultPool.sort(() => 0.5 - Math.random());
    setDestinationResults(finalResultDestinations);

    const playerResults = players.map((_, startIndex) => {
      const finalIndex = traceLadderPath(startIndex, true);
      return finalResultDestinations[finalIndex];
    });
    setResults(playerResults);
  };

  // 게임 시작
  const startGame = () => {
    if (players.length < 2) return;
    generateResults();
    setGameState("playing");
    setRevealedPlayers(new Set());
  };

  // 게임 리셋
  const resetGame = () => {
    setGameState("setup");
    setPlayers([]);
    setLadderConnections([]);
    setResults([]);
    setDestinationResults([]);
    setWinnerCount(1);
    setRevealedPlayers(new Set());
    setAnimatingPlayer(null);
    setAnimationPath([]);
  };

  // 사다리 경로 추적 함수
  const traceLadderPath = (
    startIndex: number,
    finalPositionOnly = false
  ): any => {
    if (players.length < 2) return finalPositionOnly ? startIndex : [];
    const canvas = canvasRef.current;
    if (!canvas) return finalPositionOnly ? startIndex : [];

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    const playerWidth = width / players.length;
    const levels = Math.max(5, Math.floor(players.length * 1.5));
    const levelHeight = (height - 40) / levels;

    const path: Point[] = [];
    let currentPos = startIndex;
    let currentX = (currentPos + 0.5) * playerWidth;
    let currentY = 20;

    path.push({ x: currentX, y: currentY });

    for (let level = 0; level < levels; level++) {
      const yWithOffset = (level + 0.5) * levelHeight + 20;
      path.push({ x: currentX, y: yWithOffset });

      const rightConnection = ladderConnections.find(
        (c) => c.level === level && c.position === currentPos && c.connected
      );
      if (rightConnection) {
        currentPos++;
        currentX = (currentPos + 0.5) * playerWidth;
        path.push({ x: currentX, y: yWithOffset });
        continue;
      }

      const leftConnection = ladderConnections.find(
        (c) => c.level === level && c.position === currentPos - 1 && c.connected
      );
      if (leftConnection) {
        currentPos--;
        currentX = (currentPos + 0.5) * playerWidth;
        path.push({ x: currentX, y: yWithOffset });
      }
    }

    currentY = height - 20;
    path.push({ x: currentX, y: currentY });

    return finalPositionOnly ? currentPos : path;
  };

  // 경로 애니메이션 함수
  const animatePath = (path: Point[], onComplete: () => void) => {
    let startTime: number | null = null;
    const duration = 1200;
    setAnimationPath([]);
    const frame = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const totalPathLength = path.length - 1;
      const currentPathPosition = totalPathLength * progress;
      const pathIndex = Math.floor(currentPathPosition);
      const newPath = path.slice(0, pathIndex + 1);
      if (pathIndex < totalPathLength) {
        const segmentProgress = currentPathPosition - pathIndex;
        const lastPoint = path[pathIndex];
        const nextPoint = path[pathIndex + 1];
        if (lastPoint && nextPoint) {
          const interpolatedX =
            lastPoint.x + (nextPoint.x - lastPoint.x) * segmentProgress;
          const interpolatedY =
            lastPoint.y + (nextPoint.y - lastPoint.y) * segmentProgress;
          newPath.push({ x: interpolatedX, y: interpolatedY });
        }
      }
      setAnimationPath(newPath);
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        setAnimationPath(path);
        setTimeout(onComplete, 300);
      }
    };
    requestAnimationFrame(frame);
  };

  // 결과 공개 함수
  const revealPlayerResult = (playerId: string, index: number) => {
    if (revealedPlayers.has(playerId) || animatingPlayer) return;
    setAnimatingPlayer(playerId);
    const path = traceLadderPath(index) as Point[];
    animatePath(path, () => {
      setRevealedPlayers((prev) => new Set([...prev, playerId]));
      setAnimatingPlayer(null);
      setAnimationPath([]);
      if (revealMode === "show-all" && index < players.length - 1) {
        setTimeout(() => {
          const nextPlayer = players[index + 1];
          if (nextPlayer) revealPlayerResult(nextPlayer.id, index + 1);
        }, 500);
      }
    });
  };

  // 전체 결과 공개
  const revealAll = () => {
    if (players.length > 0) revealPlayerResult(players[0].id, 0);
  };

  // 캔버스 그리기 useEffect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || players.length < 2) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasWidth = players.length * PLAYER_COLUMN_WIDTH;
    const canvasHeight = LADDER_CANVAS_HEIGHT;

    const dpr = window.devicePixelRatio || 1;

    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    ctx.scale(dpr, dpr);

    const width = canvasWidth;
    const height = canvasHeight;
    const playerWidth = width / players.length;
    const levels = Math.max(5, Math.floor(players.length * 1.5));
    const levelHeight = (height - 40) / levels;

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = "#CBD5E0"; // Gray-400

    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    for (let i = 0; i < players.length; i++) {
      const x = (i + 0.5) * playerWidth;
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, height - 20);
      ctx.stroke();
    }
    ctx.fillStyle = "#E2E8F0"; // Gray-200
    ctx.lineWidth = 3;
    ladderConnections.forEach((conn) => {
      if (conn.connected) {
        const y = (conn.level + 0.5) * levelHeight + 20;
        const x1 = (conn.position + 0.5) * playerWidth;
        const x2 = (conn.position + 1.5) * playerWidth;
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();
      }
    });
    if (animationPath.length > 1) {
      ctx.beginPath();
      ctx.moveTo(animationPath[0].x, animationPath[0].y);
      for (let i = 1; i < animationPath.length; i++)
        ctx.lineTo(animationPath[i].x, animationPath[i].y);
      ctx.strokeStyle = "#F56565";
      ctx.lineWidth = 5;
      ctx.shadowColor = "rgba(245, 101, 101, 0.5)";
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
    }
  }, [players, ladderConnections, animationPath, gameState]);

  const getFinalPosition = (startIndex: number) => {
    return traceLadderPath(startIndex, true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 font-sans text-gray-800 dark:text-gray-200">
      <div className="max-w-4xl mx-auto space-y-6">
        {gameState === "setup" && (
          <Card className="shadow-lg bg-white dark:bg-slate-800/80 dark:border-slate-700 max-w-md mx-auto">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold mb-4">👥 참가자 추가</h2>
              <div className="flex gap-2">
                <Input
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="참가자 이름 입력 (최대 15명)"
                  onKeyPress={(e) => e.key === "Enter" && addPlayer()}
                  className="flex-1 rounded-full border-2 border-gray-200 focus:border-blue-400 dark:bg-slate-700 dark:border-slate-600"
                />
                <Button
                  onClick={addPlayer}
                  disabled={!newPlayerName.trim() || players.length >= 15}
                  className="rounded-full bg-blue-500 hover:bg-blue-600 text-white px-6"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {players.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    참가자 ({players.length}/15)
                  </p>
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-1">
                    {players.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{player.emoji}</span>
                          <span className="font-medium">{player.name}</span>
                        </div>
                        <Button
                          onClick={() => removePlayer(player.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-2">
                <label
                  htmlFor="winnerCount"
                  className="font-medium text-gray-700 dark:text-gray-300"
                >
                  🏆 당첨 갯수
                </label>
                <Input
                  id="winnerCount"
                  type="number"
                  value={winnerCount}
                  onChange={(e) => {
                    const count = parseInt(e.target.value, 10);
                    if (
                      !isNaN(count) &&
                      count >= 1 &&
                      (players.length === 0 || count < players.length)
                    )
                      setWinnerCount(count);
                  }}
                  min={1}
                  max={players.length > 1 ? players.length - 1 : 1}
                  disabled={players.length < 2}
                  className="w-full rounded-full border-2 border-gray-200 focus:border-blue-400 dark:bg-slate-700 dark:border-slate-600"
                />
              </div>

              {players.length >= 2 && (
                <Button
                  onClick={() => {
                    generateRandomLadder();
                    setGameState("ladder-setup");
                  }}
                  className="w-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 text-lg font-semibold"
                >
                  사다리 설정하기 →
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {gameState === "ladder-setup" && (
          <Card className="shadow-lg bg-white dark:bg-slate-800/80 dark:border-slate-700">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">🎯 사다리 설정</h2>
                <Button
                  onClick={generateRandomLadder}
                  variant="outline"
                  size="sm"
                  className="rounded-full bg-transparent dark:border-slate-600 dark:hover:bg-slate-700"
                >
                  <Shuffle className="w-4 h-4 mr-2" /> 랜덤 생성
                </Button>
              </div>
              <div className="flex justify-center">
                <div className="overflow-x-auto rounded-lg border-2 border-gray-200 dark:border-slate-700 pb-2">
                  <div
                    style={{
                      width: `${players.length * PLAYER_COLUMN_WIDTH}px`,
                    }}
                  >
                    <div
                      className="grid gap-2 p-2"
                      style={{
                        gridTemplateColumns: `repeat(${players.length}, 1fr)`,
                      }}
                    >
                      {players.map((player) => (
                        <div key={player.id} className="text-center">
                          <div className="bg-blue-100 dark:bg-blue-900/50 rounded-lg p-2 mb-1 text-2xl">
                            {player.emoji}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {player.name}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="relative bg-white dark:bg-slate-800">
                      <canvas ref={canvasRef} />
                      <div
                        className="absolute inset-y-0"
                        style={{
                          left: `${PLAYER_COLUMN_WIDTH / 2}px`,
                          right: `${PLAYER_COLUMN_WIDTH / 2}px`,
                        }}
                      >
                        <div
                          className="h-full grid"
                          style={{
                            gridTemplateColumns: `repeat(${
                              players.length - 1
                            }, 1fr)`,
                            gridTemplateRows: `repeat(${Math.max(
                              5,
                              Math.floor(players.length * 1.5)
                            )}, 1fr)`,
                          }}
                        >
                          {/* {Array.from({
                            length: Math.max(
                              5,
                              Math.floor(players.length * 1.5)
                            ),
                          }).map((_, level) =>
                            Array.from({ length: players.length - 1 }).map(
                              (_, pos) => (
                                <button
                                  key={`${level}-${pos}`}
                                  onClick={() => toggleConnection(level, pos)}
                                  className={`border border-transparent hover:bg-blue-100/50 dark:hover:bg-blue-900/30 transition-colors rounded-md ${
                                    ladderConnections.find(
                                      (c) =>
                                        c.level === level && c.position === pos
                                    )?.connected
                                      ? "bg-blue-200/30 dark:bg-blue-800/40"
                                      : ""
                                  }`}
                                  style={{
                                    gridColumn: pos + 1,
                                    gridRow: level + 1,
                                  }}
                                />
                              )
                            )
                          )} */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => {
                  setGameState("ready");
                }}
                className="w-full rounded-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-3 text-lg font-semibold"
              >
                게임 준비 완료! →
              </Button>
            </CardContent>
          </Card>
        )}

        {(gameState === "ready" || gameState === "playing") && (
          <Card className="shadow-lg bg-white dark:bg-slate-800/80 dark:border-slate-700">
            <CardContent className="p-6 space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold">
                  {gameState === "ready" ? "🎮 게임 시작!" : "🎯 결과 확인"}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {gameState === "playing" && revealMode === "one-by-one"
                    ? "참가자를 클릭해서 결과를 확인하세요!"
                    : gameState === "playing"
                    ? "결과가 자동으로 공개됩니다..."
                    : "아래 버튼으로 게임을 시작하세요!"}
                </p>
              </div>

              <div className="flex justify-center">
                <div className="overflow-x-auto rounded-lg border-2 border-gray-200 dark:border-slate-700 pb-2">
                  <div
                    style={{
                      width: `${players.length * PLAYER_COLUMN_WIDTH}px`,
                    }}
                  >
                    <div
                      className="grid gap-2 p-2 bg-gray-50 dark:bg-slate-800/50"
                      style={{
                        gridTemplateColumns: `repeat(${players.length}, 1fr)`,
                      }}
                    >
                      {players.map((player, index) => {
                        const isRevealed = revealedPlayers.has(player.id);
                        const isClickable =
                          gameState === "playing" &&
                          revealMode === "one-by-one" &&
                          !isRevealed &&
                          !animatingPlayer;

                        return (
                          <div
                            key={player.id}
                            className={`text-center p-1 rounded-lg transition-all duration-300 ${
                              isClickable
                                ? "cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900"
                                : ""
                            } ${isRevealed ? "opacity-50" : ""}`}
                            onClick={() => {
                              if (isClickable) {
                                revealPlayerResult(player.id, index);
                              }
                            }}
                          >
                            <div className="bg-blue-100 dark:bg-blue-900/50 rounded-lg p-2 mb-1 text-2xl">
                              {player.emoji}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                              {player.name}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="bg-white dark:bg-slate-800">
                      <canvas ref={canvasRef} />
                    </div>
                    <div
                      className="grid gap-2 p-2 bg-gray-50 dark:bg-slate-800/50"
                      style={{
                        gridTemplateColumns: `repeat(${players.length}, 1fr)`,
                      }}
                    >
                      {(destinationResults.length > 0
                        ? destinationResults
                        : players.map(() => ({ text: "???", isWinner: false }))
                      ).map((result, index) => {
                        let isRevealed = false;
                        for (const pId of revealedPlayers) {
                          const pIndex = players.findIndex((p) => p.id === pId);
                          if (
                            pIndex !== -1 &&
                            getFinalPosition(pIndex) === index
                          ) {
                            isRevealed = true;
                            break;
                          }
                        }
                        return (
                          <div
                            key={index}
                            className={`text-center p-2 rounded-lg transition-colors duration-500 ${
                              isRevealed
                                ? result.isWinner
                                  ? "bg-yellow-100 dark:bg-yellow-900/50"
                                  : "bg-gray-200 dark:bg-slate-600"
                                : "bg-gray-100 dark:bg-slate-700"
                            }`}
                          >
                            <p
                              className={`text-xs font-semibold truncate ${
                                isRevealed
                                  ? result.isWinner
                                    ? "text-yellow-800 dark:text-yellow-400"
                                    : "text-gray-700 dark:text-gray-300"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {isRevealed ? result.text : "???"}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-slate-700">
                {gameState === "ready" && (
                  <Button
                    onClick={startGame}
                    className="w-full rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-4 text-xl font-bold shadow-lg"
                  >
                    <Play className="w-5 h-5 mr-2" /> 게임 시작!
                  </Button>
                )}
                {gameState === "playing" &&
                  revealMode === "show-all" &&
                  revealedPlayers.size === 0 && (
                    <Button
                      onClick={revealAll}
                      className="w-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3"
                      disabled={animatingPlayer !== null}
                    >
                      🔄 모든 결과 공개하기
                    </Button>
                  )}
                {gameState === "playing" &&
                  revealedPlayers.size < players.length &&
                  revealMode === "one-by-one" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1">
                      {players.map((player, index) => {
                        const isRevealed = revealedPlayers.has(player.id);
                        const isAnimating = animatingPlayer === player.id;
                        const result = isRevealed ? results[index] : null;
                        return (
                          <Button
                            key={player.id}
                            variant="ghost"
                            disabled={isRevealed || !!animatingPlayer}
                            onClick={() => revealPlayerResult(player.id, index)}
                            className={`w-full flex justify-start items-center p-3 rounded-lg border-2 transition-all duration-300 ${
                              isAnimating
                                ? "border-yellow-400 bg-yellow-100 dark:bg-yellow-900/50 animate-pulse"
                                : isRevealed
                                ? "border-green-400 bg-green-100 dark:bg-green-900/50 text-gray-500 dark:text-gray-500"
                                : "border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50 hover:border-blue-400 dark:hover:border-blue-500"
                            }`}
                          >
                            <span className="text-xl mr-3">{player.emoji}</span>
                            <span className="font-medium">{player.name}</span>
                            {isAnimating && (
                              <div className="ml-auto w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            )}
                            {result && (
                              <span
                                className={`ml-auto px-2 py-1 text-xs font-bold rounded-full ${
                                  result.isWinner
                                    ? "bg-yellow-400 text-yellow-900"
                                    : "bg-gray-300 text-gray-700 dark:bg-slate-600 dark:text-slate-300"
                                }`}
                              >
                                {result.isWinner ? "🎉 당첨" : "꽝"}
                              </span>
                            )}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                {gameState === "playing" &&
                  revealedPlayers.size === players.length && (
                    <Button
                      onClick={resetGame}
                      variant="outline"
                      className="w-full rounded-full border-2 border-gray-300 dark:border-slate-600 mt-4 bg-transparent dark:hover:bg-slate-700"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" /> 새 게임 시작
                    </Button>
                  )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
