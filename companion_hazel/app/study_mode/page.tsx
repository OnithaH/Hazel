'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Shield, Sparkles, AlertTriangle, Calendar, BookOpen, Camera, Eye, Loader2, StopCircle, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

interface BreathingExercise {
  id: string;
  title: string;
  duration: number;
}

interface StudySession {
  id: string;
  start_time: string;
  end_time: string | null;
  scheduled_duration: number;
  _count?: {
    distractions: number;
  };
}

interface HistoryItem {
  id: string;
  date: string;
  time: string;
  distractions_count: number;
}

export default function StudyModePage() {
  const [selectedAroma, setSelectedAroma] = useState('Peppermint');
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [isTriggeringBreak, setIsTriggeringBreak] = useState(false);
  const [breathingExercises, setBreathingExercises] = useState<BreathingExercise[]>([]);
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Timer states
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [breakActivity, setBreakActivity] = useState<'GAME' | 'BREATHE'>('GAME');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const aromas = ['Peppermint', 'Lemon', 'Lavender'];

  // Initialize data
  useEffect(() => {
    fetchCurrentSession();
    fetchHistory();
    fetchBreathingExercises();
  }, []);

  // Timer and Polling logic
  useEffect(() => {
    let pollingInterval: NodeJS.Timeout | null = null;
    const isActive = (currentSession && !currentSession.end_time) || isStarting;

    if (isActive) {
      // Priority: server start_time > optimistic start_time > now
      const startTime = currentSession
        ? new Date(currentSession.start_time).getTime()
        : (startTimeRef.current || Date.now());

      const updateTimer = () => {
        const now = Date.now();
        setElapsedSeconds(Math.floor((now - startTime) / 1000));
      };

      updateTimer(); // initial call
      timerRef.current = setInterval(updateTimer, 1000);

      if (currentSession) {
        // Add polling for session updates (distractions)
        pollingInterval = setInterval(fetchCurrentSession, 5000);
      }
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setElapsedSeconds(0);
      startTimeRef.current = null;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [currentSession?.id, currentSession?.end_time, isStarting]); // Added isStarting dependency

  const fetchCurrentSession = async () => {
    try {
      const res = await fetch('/api/study/session');
      if (res.ok) {
        const data = await res.json();
        if (data) setCurrentSession(data);
      }
    } catch (error) {
      console.error("Failed to fetch current session", error);
    }
  };

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch('/api/study/history');
      if (res.ok) {
        const data = await res.json();
        // Format dates for display
        const formatted = data.map((session: any) => {
          const date = new Date(session.date);
          const today = new Date();
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);

          let dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          if (date.toDateString() === today.toDateString()) dateLabel = 'Today';
          else if (date.toDateString() === yesterday.toDateString()) dateLabel = 'Yesterday';

          const timeLabel = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

          return {
            id: session.id,
            date: `${dateLabel}, ${timeLabel}`,
            time: `Duration: ${formatDuration(Math.round(session.duration * 60))}`, 
            distractions_count: session.distractions_count
          };
        });
        setHistoryData(formatted);
      }
    } catch (error) {
      console.error("Failed to fetch history", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const fetchBreathingExercises = async () => {
    try {
      const res = await fetch('/api/games/breathing-exercises');
      if (res.ok) {
        const data = await res.json();
        setBreathingExercises(data);
      }
    } catch (error) {
      console.error("Failed to fetch breathing exercises", error);
    }
  };

  const startSession = async (activityType: 'GAME' | 'BREATHE' | 'NONE' = 'NONE') => {
    setIsStarting(true);
    startTimeRef.current = Date.now(); // Capturing start time for optimistic timer
    try {
      const res = await fetch('/api/study/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration: 60, // default 60 mins
          break_activity: activityType !== 'NONE' ? activityType : breakActivity,
          phone_detection_enabled: true,
          focus_shield_enabled: true,
          focus_goal: "Standard Study Session"
        })
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentSession(data);
        fetchHistory(); // Refresh history list
      } else {
        alert("Failed to start session. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Error starting session");
    } finally {
      setIsStarting(false);
    }
  };

  const stopSession = async () => {
    if (!currentSession) return;
    setIsStopping(true);
    try {
      const res = await fetch('/api/study/session', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: currentSession.id })
      });

      if (res.ok) {
        setCurrentSession(null);
        fetchHistory();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsStopping(false);
    }
  };

  const handleTriggerBreak = async (type: 'GAME' | 'BREATHE') => {
    setIsTriggeringBreak(true);
    try {
      const res = await fetch('/api/study/trigger-break', {
        method: 'POST',
      });
      alert(`Break triggered! Starting ${type} mode on your robot.`);
    } catch (error) {
      console.error(error);
      alert("Failed to trigger break");
    } finally {
      setIsTriggeringBreak(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const distractionCount = currentSession?._count?.distractions || 0;
  // Penalty: 5 mins per distraction (300 seconds)
  const penaltySeconds = distractionCount * 300;
  const actualFocusTime = Math.max(0, elapsedSeconds - penaltySeconds);

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white p-8 pt-28">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-normal">Study Mode</h1>
            <p className="text-white/60">Enhanced focus and learning environment</p>
          </div>

          <div className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all ${currentSession
              ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
              : 'bg-white/5 border-white/10 text-white/40'
            }`}>
            <div className={`w-2 h-2 rounded-full ${currentSession ? 'bg-blue-500 animate-pulse' : 'bg-white/20'}`}></div>
            <span>{currentSession ? 'Study Mode Active' : 'Idle'}</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Focus Tracking - Large Card */}
          <div className="lg:col-span-2 bg-linear-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-3xl p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl">Focus Tracking</h2>
              {currentSession ? (
                <button
                  onClick={stopSession}
                  disabled={isStopping}
                  className="px-6 py-3 bg-red-500/20 border border-red-500/40 rounded-2xl flex items-center gap-2 text-red-400 hover:bg-red-500/30 transition-all disabled:opacity-50"
                >
                  {isStopping ? <Loader2 className="w-5 h-5 animate-spin" /> : <StopCircle className="w-5 h-5" />}
                  Stop Tracking
                </button>
              ) : (
                <button
                  onClick={() => startSession()}
                  disabled={isStarting}
                  className="px-6 py-3 bg-blue-500/20 border border-blue-500/40 rounded-2xl flex items-center gap-2 text-blue-400 hover:bg-blue-500/30 transition-all disabled:opacity-50"
                >
                  {isStarting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                  Start Tracking
                </button>
              )}
            </div>

            {/* Focus Tracking Area */}
            <div className="h-64 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden group">
              <div className={`flex flex-col items-center justify-center transition-all duration-1000 ${(currentSession || isStarting) ? 'opacity-100 scale-110' : 'opacity-40'}`}>
                <p className={`text-6xl font-mono font-bold tracking-tighter tabular-nums ${(currentSession || isStarting) ? 'text-blue-400' : 'text-blue-400/20'}`}>
                  {formatDuration(elapsedSeconds)}
                </p>
                {(currentSession || isStarting) && (
                  <p className="text-xs font-mono text-blue-400/60 uppercase tracking-[0.2em] mt-2 animate-pulse">
                    Focusing
                  </p>
                )}
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-4 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 transition-transform duration-500 ${(currentSession || isStarting) ? 'translate-y-0' : 'translate-y-full'}`}></div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-1 group hover:border-blue-500/30 transition-all">
                <p className="text-white/60 text-sm flex items-center gap-2">
                  <RefreshCcw className="w-4 h-4" /> Actual Focus Time
                </p>
                <p className="text-3xl font-medium tracking-tight">
                  {(currentSession || isStarting) ? formatDuration(actualFocusTime) : '0s'}
                </p>
                {distractionCount > 0 && (
                  <p className="text-[10px] text-red-400/60 font-mono">-{formatDuration(penaltySeconds)} distraction penalty</p>
                )}
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-1 group hover:border-orange-500/30 transition-all">
                <p className="text-white/60 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Distractions
                </p>
                <p className="text-3xl font-medium tracking-tight">{distractionCount}</p>
              </div>
            </div>
          </div>

          {/* Right Sidebar Cards */}
          <div className="space-y-4">
            {/* Aroma Pillars */}
            <div className="bg-linear-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/20 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-pink-400" />
                <h3 className="text-base">Aroma Pillars</h3>
              </div>
              <p className="text-white/60 text-sm">Current: {selectedAroma}</p>
              <div className="flex gap-2">
                {aromas.map((aroma) => (
                  <button
                    key={aroma}
                    onClick={() => setSelectedAroma(aroma)}
                    disabled={!!currentSession}
                    className={`flex-1 py-2 rounded-lg text-xs transition-all border ${selectedAroma === aroma
                        ? 'bg-pink-500/20 border-pink-500/40 text-pink-400'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      } disabled:opacity-30 disabled:cursor-not-allowed`}
                  >
                    {aroma}
                  </button>
                ))}
              </div>
            </div>

            {/* Break Activity Selection */}
            <div className="bg-linear-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                <h3 className="text-base">Break Activity</h3>
              </div>
              <p className="text-white/40 text-xs">Chosen activity will trigger on robot during distractions</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setBreakActivity('GAME')}
                  disabled={!!currentSession || isStarting}
                  className={`py-2.5 rounded-lg text-sm transition-all flex justify-center items-center gap-2 border ${breakActivity === 'GAME'
                      ? 'bg-orange-500/20 border-orange-500/40 text-orange-400'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    } disabled:opacity-30 disabled:cursor-not-allowed`}
                >
                  {isStarting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Game'}
                </button>
                <button
                  onClick={() => setBreakActivity('BREATHE')}
                  disabled={!!currentSession || isStarting}
                  className={`py-2.5 rounded-lg text-sm transition-all flex justify-center items-center gap-2 border ${breakActivity === 'BREATHE'
                      ? 'bg-orange-500/20 border-orange-500/40 text-orange-400'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    } disabled:opacity-30 disabled:cursor-not-allowed`}
                >
                  {isStarting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Breathe'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/schedule_session" className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left hover:bg-white/10 transition-all group">
            <Calendar className="w-6 h-6 text-blue-400 mb-3" />
            <h3 className="text-base mb-1">Schedule Session</h3>
            <p className="text-white/60 text-sm">Plan your study time</p>
          </Link>

          <Link href="/revise_page" className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left hover:bg-white/10 transition-all group">
            <BookOpen className="w-6 h-6 text-purple-400 mb-3" />
            <h3 className="text-base mb-1">Revise Q&A</h3>
            <p className="text-white/60 text-sm">Upload & practice</p>
          </Link>
        </div>

        {/* Study History */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl">Study History</h2>
            <button onClick={fetchHistory} className="text-xs text-white/40 hover:text-white flex items-center gap-1">
              <RefreshCcw className="w-3 h-3" /> Refresh
            </button>
          </div>

          <div className="space-y-4">
            {isLoadingHistory ? (
              <div className="flex justify-center py-12 text-white/20">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : historyData.length > 0 ? (
              historyData.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-[#1C1E26] rounded-xl p-4 transition-all hover:bg-[#232630] border border-transparent hover:border-white/5 group"
                >
                  <div className="flex items-center gap-16">
                    <div>
                      <p className="text-base font-medium">{item.date}</p>
                      <p className="text-white/40 text-sm">{item.time}</p>
                    </div>
                    <p className="text-white/60 text-[13px] bg-white/5 px-3 py-1 rounded-full border border-white/5">
                      {item.distractions_count} distractions
                    </p>
                  </div>
                  <Link
                    href={`/study_session?id=${item.id}`}
                    className="px-5 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-all group-hover:bg-blue-500/20 group-hover:border-blue-500/40 group-hover:text-blue-400"
                  >
                    View Details
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white/2 rounded-xl border border-dashed border-white/10">
                <p className="text-white/40">No study sessions found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
