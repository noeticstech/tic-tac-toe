import React, { useState, useEffect } from 'react';
import { Zap, RotateCcw, Trophy } from 'lucide-react';

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [particles, setParticles] = useState([]);
  const [hoveredCell, setHoveredCell] = useState(null);

  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  useEffect(() => {
    const result = checkWinner();
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      if (result.winner !== 'Draw') {
        setScores(prev => ({ ...prev, [result.winner]: prev[result.winner] + 1 }));
        createWinParticles();
      } else {
        setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [board]);

  const checkWinner = () => {
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line: combo };
      }
    }
    if (board.every(cell => cell !== null)) {
      return { winner: 'Draw', line: [] };
    }
    return null;
  };

  const createWinParticles = () => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 2 + 1
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 3000);
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine([]);
    setParticles([]);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 });
    resetGame();
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Win particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-purple-400 animate-ping pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`
          }}
        />
      ))}

      <div className="relative z-10 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Zap className="w-8 h-8 text-purple-400 animate-pulse" />
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              NEON TIC TAC TOE
            </h1>
            <Zap className="w-8 h-8 text-blue-400 animate-pulse" />
          </div>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
        </div>

        {/* Score Board */}
        <div className="bg-gray-800 rounded-2xl p-4 mb-6 border-2 border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
          <div className="flex justify-around items-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                {scores.X}
              </div>
              <div className="text-xs text-gray-400 mt-1">Player X</div>
            </div>
            <div className="text-center px-4">
              <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
              <div className="text-lg font-bold text-gray-400">{scores.draws}</div>
              <div className="text-xs text-gray-500">Draws</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]">
                {scores.O}
              </div>
              <div className="text-xs text-gray-400 mt-1">Player O</div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="text-center mb-6">
          {winner ? (
            <div className="text-2xl font-bold">
              {winner === 'Draw' ? (
                <span className="text-yellow-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">
                  It's a Draw! 🤝
                </span>
              ) : (
                <span className={`${winner === 'X' ? 'text-cyan-400' : 'text-pink-400'} drop-shadow-[0_0_15px_currentColor]`}>
                  Player {winner} Wins! 🎉
                </span>
              )}
            </div>
          ) : (
            <div className="text-xl">
              <span className="text-gray-400">Current Player: </span>
              <span className={`font-bold ${isXNext ? 'text-cyan-400' : 'text-pink-400'} drop-shadow-[0_0_10px_currentColor]`}>
                {isXNext ? 'X' : 'O'}
              </span>
            </div>
          )}
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-gray-800/50 rounded-3xl backdrop-blur-sm border-2 border-purple-500/20">
          {board.map((cell, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              onMouseEnter={() => setHoveredCell(i)}
              onMouseLeave={() => setHoveredCell(null)}
              className={`aspect-square rounded-2xl text-5xl font-bold transition-all duration-300 transform
                ${cell ? 'scale-100' : 'scale-95 hover:scale-100'}
                ${winningLine.includes(i) ? 'bg-gradient-to-br from-purple-600 to-pink-600 animate-pulse' : 'bg-gray-700/80'}
                ${!cell && !winner && hoveredCell === i ? 'bg-gray-600 shadow-[0_0_20px_rgba(168,85,247,0.5)]' : ''}
                ${!cell && !winner ? 'hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] cursor-pointer' : ''}
                border-2 ${winningLine.includes(i) ? 'border-yellow-400' : 'border-purple-500/30'}
              `}
              disabled={cell !== null || winner !== null}
            >
              {cell && (
                <span className={`
                  ${cell === 'X' ? 'text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]' : 'text-pink-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]'}
                  animate-[scale-in_0.3s_ease-out]
                `}>
                  {cell}
                </span>
              )}
              {!cell && !winner && hoveredCell === i && (
                <span className={`opacity-30 ${isXNext ? 'text-cyan-400' : 'text-pink-400'}`}>
                  {isXNext ? 'X' : 'O'}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={resetGame}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-bold
              hover:from-purple-500 hover:to-blue-500 transition-all transform hover:scale-105
              shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.7)]
              flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            New Game
          </button>
          <button
            onClick={resetScores}
            className="bg-gradient-to-r from-pink-600 to-red-600 text-white py-3 px-6 rounded-xl font-bold
              hover:from-pink-500 hover:to-red-500 transition-all transform hover:scale-105
              shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:shadow-[0_0_30px_rgba(236,72,153,0.7)]"
          >
            Reset Scores
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          to {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}