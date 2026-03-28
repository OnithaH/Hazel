'use client';

import React, { useState, useEffect } from 'react';
import { Play, Shield, AlertTriangle, Calendar, BookOpen, Camera, Eye, Loader2, Clock, Trash2, Smartphone } from 'lucide-react';
import Link from 'next/link';

interface BreathingExercise {
  id: string;
  title: string;
  duration: number;
}

export default function StudyModePage() {
  const [selectedDuration, setSelectedDuration] = useState('1hr');
  const [isTracking, setIsTracking] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Timer and Tracking states
  const [selectedBreakOption, setSelectedBreakOption] = useState<'GAME' | 'BREATHE' | null>(null);
  const [needPhone, setNeedPhone] = useState<boolean | null>(null);
  const [breathingExercises, setBreathingExercises] = useState<BreathingExercise[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [targetSeconds, setTargetSeconds] = useState(0);
  const [focusSeconds, setFocusSeconds] = useState(0);
  const [breakSeconds, setBreakSeconds] = useState(0);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [distractionsCount, setDistractionsCount] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const durations = ['30 min', '1hr', '1hr 30 min', '2hr', '2hr 30 min', '3hrs'];

  const parseDurationSeconds = (dur: string) => {
    const map: Record<string, number> = {
      '30 min': 30,
      '1hr': 60,
      '1hr 30 min': 90,
      '2hr': 120,
      '2hr 30 min': 150,
      '3hrs': 180
    };
    return (map[dur] || 60) * 60;
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const formatHistoryTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const fetchHistory = React.useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch('/api/study/history');
      if (res.ok) {
        const data = await res.json();
        const formatted = data.map((session: any) => ({
          id: session.id,
          date: new Date(session.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
          time: formatHistoryTime(session.actual_focus_time || 0),
          distractions: `${session.distractions_count} distractions`,
          focus: '100%'
        }));
        setHistory(formatted);
      }
    } catch (error) {
      console.error("Failed to fetch history", error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  const recordSessionToHistory = React.useCallback(async () => {
    // Only record if session was at least 5 seconds long
    if (focusSeconds >= 5) {
      if (activeSessionId) {
        try {
          await fetch(`/api/study/session/${activeSessionId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              actual_focus_time: focusSeconds,
              break_time_seconds: breakSeconds,
              is_finished: true
            }),
          });
        } catch (error) {
          console.error("Failed to update session in DB", error);
        }
      }

      const newEntry = {
        id: activeSessionId,
        date: 'Just Now',
        time: formatHistoryTime(focusSeconds),
        focus: '100%',
        distractions: `${distractionsCount} distractions`
      };

      setHistory(prev => [newEntry, ...prev]);

      // Reset current session tracking states for next use
      setElapsedSeconds(0);
      setFocusSeconds(0);
      setBreakSeconds(0);
      setIsOnBreak(false);
      setDistractionsCount(0);
      setActiveSessionId(null);
    } else {
      // Reset states if session was too short
      setElapsedSeconds(0);
      setFocusSeconds(0);
      setDistractionsCount(0);
      setActiveSessionId(null);
    }
  }, [focusSeconds, distractionsCount, activeSessionId]);

  const handleDeleteSession = async (id: string) => {
    if (!confirm("Are you sure you want to delete this study session?")) return;

    try {
      const res = await fetch(`/api/study/session/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setHistory(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete session", error);
    }
  };

  useEffect(() => {
    let interval: any;

    if (isTracking && elapsedSeconds < targetSeconds) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
        if (isOnBreak) {
          setBreakSeconds((prev) => prev + 1);
        } else {
          setFocusSeconds((prev) => prev + 1);
        }
      }, 1000);
    } else if (isTracking && elapsedSeconds >= targetSeconds) {
      setIsTracking(false);
      recordSessionToHistory();
    }

    return () => clearInterval(interval);
  }, [isTracking, elapsedSeconds, targetSeconds, recordSessionToHistory]);

  const handleToggleTracking = async () => {
    if (!isTracking) {
      if (!selectedBreakOption) {
        alert("Please select a break option (Game or Breathe) before starting.");
        return;
      }
      if (needPhone === null) {
        alert("Please select if you need your phone during the session.");
        return;
      }

      try {
        const seconds = parseDurationSeconds(selectedDuration);

        // Start session in DB
        const sessionRes = await fetch('/api/study/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            duration: seconds / 60,
            break_activity: selectedBreakOption,
            phone_detection_enabled: !needPhone, // Inverted: Need Phone = Detection Disabled
            focus_shield_enabled: false,
            focus_goal: "Quick Session from Study Mode",
          }),
        });

        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          setActiveSessionId(sessionData.id);

          // Update Robot Mode
          await fetch('/api/robot/mode', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode: 'STUDY' }),
          });

          // Sync "Just Now" entry if it exists (started stopping before ID came back)
          setHistory(prev => prev.map(item =>
            item.date === 'Just Now' && !item.id ? { ...item, id: sessionData.id } : item
          ));

          setTargetSeconds(seconds);
          setElapsedSeconds(0);
          setFocusSeconds(0);
          setBreakSeconds(0);
          setIsOnBreak(false);
          setDistractionsCount(0);
          setIsTracking(true);
        } else {
          alert("Failed to start session on server.");
        }
      } catch (error) {
        console.error("Error starting session:", error);
      }
    } else {
      // 1. IMMEDIATE UI RESPONSE
      setIsTracking(false);
      await recordSessionToHistory();
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    // Connect the breathing exercises API
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
    fetchBreathingExercises();
  }, []);



  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white p-8 pt-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-normal">Study Mode</h1>
            <p className="text-white/60">Enhanced focus and learning environment</p>
          </div>

          <div className="flex items-center gap-3 px-6 py-3 bg-blue-500/20 border border-blue-500/40 rounded-full">
            <div className="w-2 h-2 bg-blue-500 rounded-full opacity-85"></div>
            <span>Study Mode Active</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Focus Tracking - Large Card */}
          <div className="col-span-2 bg-linear-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-3xl p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl">Focus Tracking</h2>
              <button
                onClick={handleToggleTracking}
                className={`px-6 py-3 border rounded-2xl flex items-center gap-2 transition-all ${isTracking
                    ? 'bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30'
                    : 'bg-blue-500/20 border-blue-500/40 text-blue-400 hover:bg-blue-500/30'
                  }`}
              >
                <Play className={`w-5 h-5 ${isTracking ? 'fill-current' : ''}`} />
                {isTracking ? 'Stop Tracking' : 'Start Tracking'}
              </button>

              {isTracking && isOnBreak && (
                <button
                  onClick={() => setIsOnBreak(false)}
                  className="px-6 py-3 border border-green-500/40 rounded-2xl flex items-center gap-2 transition-all bg-green-500/20 text-green-400 hover:bg-green-500/30"
                >
                  <Clock className="w-5 h-5" />
                  Return to Study
                </button>
              )}
            </div>

            {/* Video/Eye Tracking Area */}
            <div className="h-64 bg-black/40 border border-white/10 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
              {isTracking ? (
                <div className="text-center space-y-2 animate-pulse">
                  <p className="text-blue-400/60 text-sm font-medium uppercase tracking-widest">Active Session</p>
                  <p className="text-6xl font-mono text-white tracking-tighter shadow-blue-500/20 drop-shadow-2xl">
                    {formatTime(elapsedSeconds)}
                  </p>
                </div>
              ) : (
                <Eye className="w-16 h-16 text-blue-400/20" />
              )}
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
                <p className="text-white/60 text-sm">Focus Time</p>
                <p className="text-2xl">{isTracking ? formatTime(focusSeconds) : '0h 0m 0s'}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
                <p className="text-white/60 text-sm">Distractions</p>
                <p className="text-2xl">{distractionsCount}</p>
              </div>
            </div>
          </div>

          {/* Right Sidebar Cards */}
          <div className="space-y-4">
            {/* Session Time Duration */}
            <div className="bg-linear-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-400" />
                <h3 className="text-base">Session Duration</h3>
              </div>
              <p className="text-white/60 text-sm">Selected: {selectedDuration}</p>
              <div className="grid grid-cols-2 gap-2">
                {durations.map((duration) => (
                  <button
                    key={duration}
                    onClick={() => setSelectedDuration(duration)}
                    disabled={isTracking}
                    className={`py-2 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${selectedDuration === duration
                      ? 'bg-purple-500/20 border border-purple-500/40 text-purple-400'
                      : 'bg-white/5 border border-white/10 text-white/60'
                      }`}
                  >
                    {duration}
                  </button>
                ))}
              </div>
            </div>

            {/* Take a Break */}
            <div className="bg-linear-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                <h3 className="text-base">Take a Break?</h3>
              </div>
              {selectedBreakOption && (
                <p className="text-orange-400/60 text-sm text-left font-medium">
                  {selectedBreakOption === 'GAME' ? 'Chosen: Game' : 'Chosen: Breathing Activity'}
                </p>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedBreakOption('GAME')}
                  disabled={isTracking}
                  className={`py-2.5 rounded-lg text-sm transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${selectedBreakOption === 'GAME'
                      ? 'bg-orange-500/20 border border-orange-500/40 text-orange-400'
                      : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                >
                  Game
                </button>
                <button
                  onClick={() => setSelectedBreakOption('BREATHE')}
                  disabled={isTracking}
                  className={`py-2.5 rounded-lg text-sm transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${selectedBreakOption === 'BREATHE'
                      ? 'bg-orange-500/20 border border-orange-500/40 text-orange-400'
                      : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                >
                  Breathe
                </button>
              </div>
              {breathingExercises.length > 0 && (
                <div className="text-xs text-white/40 mt-2 text-center">
                  {breathingExercises.length} breathing exercises loaded
                </div>
              )}
            </div>
            {/* Phone Requirement */}
            <div className="bg-linear-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-blue-400" />
                <h3 className="text-base">Use Phone During Session?</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setNeedPhone(true)}
                  disabled={isTracking}
                  className={`py-2.5 rounded-lg text-sm transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${needPhone === true
                    ? 'bg-blue-500/20 border border-blue-500/40 text-blue-400'
                    : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                >
                  Yes, I need it
                </button>
                <button
                  onClick={() => setNeedPhone(false)}
                  disabled={isTracking}
                  className={`py-2.5 rounded-lg text-sm transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${needPhone === false
                    ? 'bg-blue-500/20 border border-blue-500/40 text-blue-400'
                    : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                >
                  No, I don't
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
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
          <h2 className="text-2xl">Study History (Last 30 Days)</h2>

          <div className="space-y-4">
            {history.length === 0 ? (
              isLoadingHistory ? (
                <div className="text-center py-10">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
                  <p className="text-white/40 text-sm">Loading history...</p>
                </div>
              ) : (
                <div className="text-center py-10 bg-[#1C1E26] rounded-xl border border-dashed border-white/5">
                  <p className="text-white/40 text-sm">No study history yet. Start a session to see your progress!</p>
                </div>
              )
            ) : (
              history.map((item, index) => (
                <div
                  key={item.id || index}
                  className="flex justify-between items-center bg-[#1C1E26] rounded-xl p-4 transition-all"
                >
                  <div className="flex items-center gap-16">
                    <div>
                      <p className="text-base">{item.date}</p>
                      <p className="text-white/60 text-sm">{item.time}</p>
                    </div>
                    <p className="text-white/60 text-[13px]">{item.distractions}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link href={`/study_session/${item.id}`} className="px-5 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-all">
                      View Details
                    </Link>
                    <button
                      onClick={() => item.id && handleDeleteSession(item.id)}
                      disabled={!item.id}
                      className={`p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg transition-all ${!item.id ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                      title={item.id ? "Delete Session" : "Syncing..."}
                    >
                      {item.id ? <Trash2 className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}