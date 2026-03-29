'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Gamepad2, TrendingUp, Target, X, Loader2 } from 'lucide-react';
import ModeActivationCard from '@/components/ModeActivationCard';

interface Game {
  id?: string;
  emoji: string;
  title: string;
  description: string;
  difficulty: string;
  difficultyColor: string;
  name?: string;
}

interface GameStats {
  playTimeToday: string;
  totalPoints: number;
  winStreak: number;
  gamesLeft: string;
}

interface GameHistory {
  id: string;
  game_name: string;
  played_at: string;
  result: string | null;
  score: number | null;
}

export default function Page() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  
  // Real Data States
  const [games, setGames] = useState<Game[]>([]);
  const [statsData, setStatsData] = useState<GameStats | null>(null);
  const [recentGames, setRecentGames] = useState<GameHistory[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Action States
  const [isStarting, setIsStarting] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamesRes, statsRes, historyRes] = await Promise.all([
          fetch('/api/games'),
          fetch('/api/games/stats'),
          fetch('/api/games/history')
        ]);
        
        if (gamesRes.ok) {
          const gamesData = await gamesRes.json();
          if (gamesData.length > 0) {
            setGames(gamesData.map((g: any) => ({
              id: g.id,
              emoji: g.emoji || '🎮',
              title: g.name,
              description: g.description || 'A fun game',
              difficulty: g.difficulty || 'Medium',
              difficultyColor: 'bg-blue-500/20 text-blue-400'
            })));
          } else {
             setGames([
              { emoji: '🎵', title: 'Music Maze', description: 'Guess the song intro', difficulty: 'Medium', difficultyColor: 'bg-pink-500/20 text-pink-400' },
              { emoji: '🏠', title: 'Find me Home', description: 'Navigate back to home', difficulty: 'Easy', difficultyColor: 'bg-blue-500/20 text-blue-400' },
              { emoji: '🔓', title: 'Puzzle Escape', description: 'Solve puzzles to escape', difficulty: 'Hard', difficultyColor: 'bg-orange-500/20 text-orange-400' }
            ]);
          }
        }
        
        if (statsRes.ok) setStatsData(await statsRes.json());
        if (historyRes.ok) setRecentGames(await historyRes.json());
      } catch (error) {
        console.error("Failed to fetch game data", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleStartGame = async () => {
    if (!selectedGame) return;
    setIsStarting(true);
    try {
      const res = await fetch('/api/games/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activity_type: 'GAME',
          game_name: selectedGame.title
        })
      });
      if (!res.ok) throw new Error("Failed to start game");
      alert(`${selectedGame.title} started on robot!`);
    } catch (error) {
      console.error(error);
      alert("Failed to start game");
    } finally {
      setIsStarting(false);
    }
  };

  const handleSimulateEndGame = async () => {
    if (!selectedGame) return;
    setIsLogging(true);
    try {
      const res = await fetch('/api/games/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activity_type: 'GAME',
          game_name: selectedGame.title,
          duration: 300,
          score: Math.floor(Math.random() * 100),
          result: Math.random() > 0.5 ? 'Win' : 'Loss'
        })
      });
      if (res.ok) {
        alert("Game logged successfully!");
        const [statsRes, historyRes] = await Promise.all([
          fetch('/api/games/stats'),
          fetch('/api/games/history')
        ]);
        if (statsRes.ok) setStatsData(await statsRes.json());
        if (historyRes.ok) setRecentGames(await historyRes.json());
        setSelectedGame(null);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to log game");
    } finally {
      setIsLogging(false);
    }
  };

  const stats = [
    {
      icon: <Clock className="w-5 h-5 text-blue-400" />,
      value: statsData?.playTimeToday || '0m',
      label: 'Play Time Today',
      gradient: 'from-blue-500/20 to-blue-500/5',
      border: 'border-blue-500/20'
    },
    {
      icon: <Gamepad2 className="w-5 h-5 text-purple-400" />,
      value: statsData?.totalPoints?.toString() || '0',
      label: 'Total Points',
      gradient: 'from-purple-500/20 to-purple-500/5',
      border: 'border-purple-500/20'
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-pink-400" />,
      value: statsData?.winStreak?.toString() || '0',
      label: 'Win Streak',
      gradient: 'from-pink-500/20 to-pink-500/5',
      border: 'border-pink-500/20'
    },
    {
      icon: <Target className="w-5 h-5 text-green-400" />,
      value: statsData?.gamesLeft || '5/5',
      label: 'Games Left',
      gradient: 'from-green-500/20 to-green-500/5',
      border: 'border-green-500/20'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-normal mb-2 tracking-tight">Gaming Mode</h1>
            <p className="text-white/60">Mind-refreshing games for focused breaks</p>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-purple-500/20 border border-purple-500/40 rounded-full shadow-lg shadow-black">
            <Gamepad2 className="w-5 h-5 text-purple-300" />
            <span className="text-sm font-medium tracking-wide">Level 12</span>
          </div>
        </div>

        {/* --- MANUAL MODE ACTIVATION --- */}
        <div className="mb-12">
          <ModeActivationCard 
            targetMode="GAME"
            title="Gaming Mode"
            description="Activate Hazel's gaming state for interactive breaks and focus-refreshing play."
            colorClass="purple"
          />
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

            <button 
              onClick={handleStartGame}
              disabled={isStarting}
              className="flex items-center gap-2 px-6 py-3 bg-purple-500/20 border border-purple-500/40 rounded-full text-purple-300 hover:bg-purple-500/30 transition mb-8 ml-auto disabled:opacity-50"
            >
              {isStarting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Gamepad2 className="w-5 h-5" />}
              {isStarting ? 'Starting...' : 'Start Game'}
            </button>

            {/* Game Interface */}
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/10 rounded-2xl p-12 mb-8 relative">
              <div className="text-center text-white/40 py-24">
                <div className="text-xl mb-2">🎮</div>
                <div className="text-lg mb-2">Game Interface will load here</div>
                <div className="text-sm mb-6">RGB LEDs indicate controller movement patterns</div>
                <button
                   onClick={handleSimulateEndGame}
                   disabled={isLogging}
                   className="px-4 py-2 bg-purple-500/30 border border-purple-500/50 rounded-lg text-purple-200 hover:bg-purple-500/40 transition disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
                >
                   {isLogging ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                   Simulate End Game & Log Score
                </button>
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
            {recentGames.length === 0 ? (
              <div className="text-white/40 text-sm">No recent games played yet.</div>
            ) : (
              recentGames.map((game) => (
                <div
                  key={game.id}
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl"
                >
                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-base mb-1">{game.game_name}</div>
                      <div className="text-white/60 text-sm">
                        {new Date(game.played_at).toLocaleDateString()}
                      </div>
                    </div>
                    {game.result && (
                      <div
                        className={`px-3 py-1 rounded-lg text-sm ${
                          game.result === 'Win'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {game.result}
                      </div>
                    )}
                    {game.score !== null && (
                      <div className="text-white/60 text-sm">Score: {game.score}</div>
                    )}
                  </div>
                  <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition">
                    Play Again
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

