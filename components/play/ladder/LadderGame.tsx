"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Shuffle,
  Eye,
  EyeOff,
  Play,
  RotateCcw,
  Trash2,
} from "lucide-react";

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

type GameState = "setup" | "ladder-setup" | "ready" | "playing" | "finished";
type RevealMode = "one-by-one" | "show-all";

const PLAYER_EMOJIS = [
  "😊",
  "🎯",
  "🌟",
  "🎨",
  "🚀",
  "💎",
  "🎪",
  "🌈",
  "⚡",
  "🎭",
  "🎪",
  "🎨",
  "🌺",
  "🎵",
  "🎲",
];

export function LadderGame() {
  const [gameState, setGameState] = useState<GameState>("setup");
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [ladderConnections, setLadderConnections] = useState<
    LadderConnection[]
  >([]);
  const [results, setResults] = useState<string[]>([]);
  const [revealMode, setRevealMode] = useState<RevealMode>("one-by-one");
  const [showLadder, setShowLadder] = useState(false);
  const [revealedPlayers, setRevealedPlayers] = useState<Set<string>>(
    new Set()
  );
  const [animatingPlayer, setAnimatingPlayer] = useState<string | null>(null);
  const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Add player
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

  // Remove player
  const removePlayer = (playerId: string) => {
    setPlayers(players.filter((p) => p.id !== playerId));
  };

  // Generate random ladder connections
  const generateRandomLadder = () => {
    if (players.length < 2) return;

    const connections: LadderConnection[] = [];
    const levels = Math.max(3, Math.floor(players.length * 1.5));

    for (let level = 0; level < levels; level++) {
      for (let pos = 0; pos < players.length - 1; pos++) {
        connections.push({
          level,
          position: pos,
          connected: Math.random() > 0.6,
        });
      }
    }

    setLadderConnections(connections);
  };

  // Toggle ladder connection
  const toggleConnection = (level: number, position: number) => {
    setLadderConnections((prev) =>
      prev.map((conn) =>
        conn.level === level && conn.position === position
          ? { ...conn, connected: !conn.connected }
          : conn
      )
    );
  };

  // Generate random results
  const generateResults = () => {
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const resultOptions = [
      "🎉 대박! 최고의 운!",
      "✨ 좋은 일이 생길 예정",
      "🌟 평범한 하루",
      "💪 노력이 필요해",
      "🎯 집중하면 성공",
      "🌈 행운이 따를 거야",
      "🎪 재미있는 일 발생",
      "💎 소중한 만남",
      "🚀 새로운 시작",
      "🎨 창의력 발휘",
      "🎵 즐거운 하루",
      "🌺 아름다운 순간",
    ];

    const gameResults = shuffledPlayers.map(
      (player) =>
        resultOptions[Math.floor(Math.random() * resultOptions.length)]
    );

    setResults(gameResults);
  };

  // Start game
  const startGame = () => {
    if (players.length < 2) return;

    generateResults();
    setGameState("playing");
    setRevealedPlayers(new Set());
    setCurrentRevealIndex(0);
  };

  // Reveal player result
  const revealPlayerResult = async (playerId: string, index: number) => {
    if (revealedPlayers.has(playerId) || animatingPlayer) return;

    setAnimatingPlayer(playerId);

    // Simulate ladder tracing animation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setRevealedPlayers((prev) => new Set([...prev, playerId]));
    setAnimatingPlayer(null);

    if (revealMode === "show-all" && index < players.length - 1) {
      setTimeout(() => {
        setCurrentRevealIndex(index + 1);
        revealPlayerResult(players[index + 1].id, index + 1);
      }, 800);
    }
  };

  // Auto reveal all
  const revealAll = () => {
    if (players.length === 0) return;
    setCurrentRevealIndex(0);
    revealPlayerResult(players[0].id, 0);
  };

  // Reset game
  const resetGame = () => {
    setGameState("setup");
    setPlayers([]);
    setLadderConnections([]);
    setResults([]);
    setShowLadder(false);
    setRevealedPlayers(new Set());
    setAnimatingPlayer(null);
    setCurrentRevealIndex(0);
  };

  // Draw ladder on canvas
  useEffect(() => {
    if (!canvasRef.current || players.length < 2) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const playerWidth = width / players.length;
    const levels = Math.max(3, Math.floor(players.length * 1.5));
    const levelHeight = height / (levels + 1);

    ctx.clearRect(0, 0, width, height);

    // Draw vertical lines
    ctx.strokeStyle = "#4A5568";
    ctx.lineWidth = 3;

    for (let i = 0; i < players.length; i++) {
      const x = (i + 0.5) * playerWidth;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw horizontal connections
    ctx.strokeStyle = "#00BFFF";
    ctx.lineWidth = 2;

    ladderConnections.forEach((conn) => {
      if (conn.connected) {
        const y = (conn.level + 1) * levelHeight;
        const x1 = (conn.position + 0.5) * playerWidth;
        const x2 = (conn.position + 1.5) * playerWidth;

        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();
      }
    });
  }, [players, ladderConnections, showLadder]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🪜 사다리 게임
          </h1>
          <p className="text-gray-600">
            최대 15명까지 참여 가능한 재미있는 사다리 게임!
          </p>
        </div>

        {/* Setup Phase */}
        {gameState === "setup" && (
          <Card className="shadow-lg">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                👥 참가자 추가
              </h2>

              {/* Add Player Input */}
              <div className="flex gap-2">
                <Input
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="참가자 이름 입력"
                  onKeyPress={(e) => e.key === "Enter" && addPlayer()}
                  className="flex-1 rounded-full border-2 border-gray-200 focus:border-blue-400"
                />
                <Button
                  onClick={addPlayer}
                  disabled={!newPlayerName.trim() || players.length >= 15}
                  className="rounded-full bg-blue-500 hover:bg-blue-600 text-white px-6"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Player List */}
              {players.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    참가자 ({players.length}/15)
                  </p>
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                    {players.map((player, index) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{player.emoji}</span>
                          <span className="font-medium text-gray-800">
                            {player.name}
                          </span>
                        </div>
                        <Button
                          onClick={() => removePlayer(player.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Button */}
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

        {/* Ladder Setup Phase */}
        {gameState === "ladder-setup" && (
          <Card className="shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  🎯 사다리 설정
                </h2>
                <Button
                  onClick={generateRandomLadder}
                  variant="outline"
                  size="sm"
                  className="rounded-full bg-transparent"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  랜덤 생성
                </Button>
              </div>

              {/* Player Names */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {players.map((player, index) => (
                  <div key={player.id} className="text-center">
                    <div className="bg-blue-100 rounded-lg p-2 mb-1">
                      <span className="text-lg">{player.emoji}</span>
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {player.name}
                    </p>
                  </div>
                ))}
              </div>

              {/* Ladder Canvas */}
              <div className="relative bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={200}
                  className="w-full h-48"
                />

                {/* Connection Toggle Overlay */}
                <div
                  className="absolute inset-0 grid"
                  style={{
                    gridTemplateColumns: `repeat(${players.length - 1}, 1fr)`,
                  }}
                >
                  {Array.from({
                    length: Math.max(3, Math.floor(players.length * 1.5)),
                  }).map((_, level) =>
                    Array.from({ length: players.length - 1 }).map((_, pos) => {
                      const connection = ladderConnections.find(
                        (c) => c.level === level && c.position === pos
                      );
                      return (
                        <button
                          key={`${level}-${pos}`}
                          onClick={() => toggleConnection(level, pos)}
                          className={`border border-transparent hover:bg-blue-100/50 transition-colors ${
                            connection?.connected ? "bg-blue-200/30" : ""
                          }`}
                          style={{
                            gridColumn: pos + 1,
                            gridRow: level + 1,
                          }}
                        />
                      );
                    })
                  )}
                </div>
              </div>

              {/* Game Mode Selection */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">
                  결과 공개 방식
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setRevealMode("one-by-one")}
                    variant={
                      revealMode === "one-by-one" ? "default" : "outline"
                    }
                    className="flex-1 rounded-full"
                  >
                    🎯 하나씩 공개
                  </Button>
                  <Button
                    onClick={() => setRevealMode("show-all")}
                    variant={revealMode === "show-all" ? "default" : "outline"}
                    className="flex-1 rounded-full"
                  >
                    🔄 전체 공개
                  </Button>
                </div>
              </div>

              {/* Start Game Button */}
              <Button
                onClick={() => setGameState("ready")}
                className="w-full rounded-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-3 text-lg font-semibold"
              >
                게임 준비 완료! →
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Ready Phase */}
        {gameState === "ready" && (
          <Card className="shadow-lg">
            <CardContent className="p-6 space-y-6 text-center">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-800">
                  🎮 게임 시작!
                </h2>
                <p className="text-gray-600">
                  {revealMode === "one-by-one"
                    ? "하나씩 클릭해서 결과를 확인하세요"
                    : "모든 결과가 자동으로 공개됩니다"}
                </p>
              </div>

              {/* Player Grid */}
              <div className="grid grid-cols-3 gap-3">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="bg-gray-50 rounded-lg p-3 text-center"
                  >
                    <div className="text-2xl mb-1">{player.emoji}</div>
                    <p className="text-sm text-gray-700 truncate">
                      {player.name}
                    </p>
                  </div>
                ))}
              </div>

              {/* Control Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => setShowLadder(!showLadder)}
                  variant="outline"
                  className="w-full rounded-full border-2 border-gray-300"
                >
                  {showLadder ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      사다리 숨기기
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      사다리 보기
                    </>
                  )}
                </Button>

                <Button
                  onClick={startGame}
                  className="w-full rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-4 text-xl font-bold shadow-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  게임 시작!
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Playing Phase */}
        {gameState === "playing" && (
          <Card className="shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  🎯 결과 확인
                </h2>
                <p className="text-sm text-gray-600">
                  {revealMode === "one-by-one"
                    ? "참가자를 클릭해서 결과를 확인하세요!"
                    : "결과가 자동으로 공개됩니다..."}
                </p>
              </div>

              {/* Show Ladder Toggle */}
              {showLadder && (
                <div className="bg-white rounded-lg border-2 border-gray-200 mb-4">
                  <canvas
                    ref={canvasRef}
                    width={300}
                    height={200}
                    className="w-full h-48"
                  />
                </div>
              )}

              {/* Players and Results */}
              <div className="space-y-3">
                {players.map((player, index) => {
                  const isRevealed = revealedPlayers.has(player.id);
                  const isAnimating = animatingPlayer === player.id;

                  return (
                    <div
                      key={player.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-300 ${
                        isAnimating
                          ? "border-yellow-400 bg-yellow-50 animate-pulse"
                          : isRevealed
                          ? "border-green-400 bg-green-50"
                          : "border-gray-200 bg-gray-50 hover:border-blue-300 cursor-pointer"
                      }`}
                      onClick={() => {
                        if (
                          revealMode === "one-by-one" &&
                          !isRevealed &&
                          !animatingPlayer
                        ) {
                          revealPlayerResult(player.id, index);
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{player.emoji}</span>
                        <span className="font-medium text-gray-800">
                          {player.name}
                        </span>
                      </div>

                      <div className="text-right">
                        {isAnimating ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm text-blue-600">
                              추적 중...
                            </span>
                          </div>
                        ) : isRevealed ? (
                          <span className="text-sm font-medium text-green-700">
                            {results[index]}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">
                            클릭해서 확인
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Auto Reveal Button */}
              {revealMode === "show-all" && revealedPlayers.size === 0 && (
                <Button
                  onClick={revealAll}
                  className="w-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3"
                >
                  🔄 모든 결과 공개하기
                </Button>
              )}

              {/* Reset Button */}
              {revealedPlayers.size === players.length && (
                <Button
                  onClick={resetGame}
                  variant="outline"
                  className="w-full rounded-full border-2 border-gray-300 mt-4 bg-transparent"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />새 게임 시작
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
