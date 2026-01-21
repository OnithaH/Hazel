'use client';

import React, { useState } from 'react';
import { Clock, Gamepad2, TrendingUp, Target, X } from 'lucide-react';

export default function Page() {
  const [selectedGame, setSelectedGame] = useState(null);
  const stats = [
    {
      icon: <Clock className="w-5 h-5 text-blue-400" />,
      value: '45m',
      label: 'Play Time Today',
      gradient: 'from-blue-500/20 to-blue-500/5',
      border: 'border-blue-500/20'
    },
    {
      icon: <Gamepad2 className="w-5 h-5 text-purple-400" />,
      value: '156',
      label: 'Total Points',
      gradient: 'from-purple-500/20 to-purple-500/5',
      border: 'border-purple-500/20'
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-pink-400" />,
      value: '8',
      label: 'Win Streak',
      gradient: 'from-pink-500/20 to-pink-500/5',
      border: 'border-pink-500/20'
    },
    {
      icon: <Target className="w-5 h-5 text-green-400" />,
      value: '2/5',
      label: 'Games Left',
      gradient: 'from-green-500/20 to-green-500/5',
      border: 'border-green-500/20'
    }
  ];

  const games = [
    {
      emoji: '�',
      title: 'Music Maze',
      description: 'Guess the song intro',
      difficulty: 'Medium',
      difficultyColor: 'bg-pink-500/20 text-pink-400'
    },
    {
      emoji: '🏠',
      title: 'Find me Home',
      description: 'Navigate back to home',
      difficulty: 'Easy',
      difficultyColor: 'bg-blue-500/20 text-blue-400'
    },
    {
      emoji: '🔓',
      title: 'Puzzle Escape',
      description: 'Solve puzzles to escape',
      difficulty: 'Hard',
      difficultyColor: 'bg-orange-500/20 text-orange-400'
    }
  ];

  const recentGames = [
    { name: 'Guess the Word', time: '5m ago', result: 'Win', score: 85 },
    { name: 'Music Maze', time: '1h ago', result: 'Win', score: 92 },
    { name: 'Word Fill', time: '2h ago', result: 'Loss', score: 70 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-normal mb-2">Gaming Mode</h1>
            <p className="text-white/60">Mind-refreshing games for focused breaks</p>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-purple-500/20 border border-purple-500/40 rounded-full">
            <Gamepad2 className="w-5 h-5 text-purple-300" />
            <span>Level 12</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`p-6 bg-gradient-to-br ${stat.gradient} border ${stat.border} rounded-2xl`}
            >
              <div className="mb-4">{stat.icon}</div>
              <div className="text-2xl font-normal mb-1">{stat.value}</div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Games Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-normal mb-6">Choose Your Game</h2>
          <div className="grid grid-cols-3 gap-6">
            {games.map((game, index) => (
              <button
                key={index}
                onClick={() => setSelectedGame(game)}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition text-left"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{game.emoji}</span>
                  <span className={`px-3 py-1 ${game.difficultyColor} rounded-full text-xs`}>
                    {game.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-normal mb-2">{game.title}</h3>
                <p className="text-white/60 text-sm">{game.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Game Interface Section */}
        {selectedGame && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{selectedGame.emoji}</span>
                <div>
                  <h2 className="text-3xl font-normal">{selectedGame.title}</h2>
                  <p className="text-white/60 text-sm mt-1">{selectedGame.description}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedGame(null)}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition"
              >
                Back to Games
              </button>
            </div>

            <button className="flex items-center gap-2 px-6 py-3 bg-purple-500/20 border border-purple-500/40 rounded-full text-purple-300 hover:bg-purple-500/30 transition mb-8 ml-auto">
              <Gamepad2 className="w-5 h-5" />
              Start Game
            </button>

            {/* Game Interface */}
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/10 rounded-2xl p-12 mb-8">
              <div className="text-center text-white/40 py-24">
                <div className="text-xl mb-2">🎮</div>
                <div className="text-lg mb-2">Game Interface will load here</div>
                <div className="text-sm">RGB LEDs indicate controller movement patterns</div>
              </div>
            </div>

            {/* Game Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                <div className="text-white/60 text-sm mb-2">Score</div>
                <div className="text-4xl font-normal">0</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                <div className="text-white/60 text-sm mb-2">Lives</div>
                <div className="text-4xl font-normal">3 ❤️</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                <div className="text-white/60 text-sm mb-2">Time</div>
                <div className="text-4xl font-normal">0:00</div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Games */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
          <h2 className="text-2xl font-normal mb-6">Recent Games</h2>
          <div className="space-y-4">
            {recentGames.map((game, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl"
              >
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-base mb-1">{game.name}</div>
                    <div className="text-white/60 text-sm">{game.time}</div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-lg text-sm ${
                      game.result === 'Win'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {game.result}
                  </div>
                  <div className="text-white/60 text-sm">Score: {game.score}</div>
                </div>
                <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition">
                  Play Again
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

