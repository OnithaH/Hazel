'use client';

import React, { useState, useEffect } from 'react';
import { Play, Shield, Sparkles, AlertTriangle, Calendar, BookOpen, Camera, Eye, Zap } from 'lucide-react';
import { Play, Shield, Sparkles, AlertTriangle, Calendar, BookOpen, Camera, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface BreathingExercise {
  id: string;
  title: string;
  duration: number;
}

export default function StudyModePage() {
  const [selectedAroma, setSelectedAroma] = useState('Peppermint');
  const [activeSession, setActiveSession] = useState<any>(null);
  const [sessionElapsed, setSessionElapsed] = useState(0);
  const [focusElapsed, setFocusElapsed] = useState(0);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aromaConfigs, setAromaConfigs] = useState<any[]>([]);
  const [isTracking, setIsTracking] = useState(false);

  // Real Data states
  const [isTriggeringBreak, setIsTriggeringBreak] = useState(false);
  const [breathingExercises, setBreathingExercises] = useState<BreathingExercise[]>([]);

  const aromas = ['Peppermint', 'Lemon', 'Lavender'];

  // Helper to format duration as HH:MM:SS
  const formatDuration = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Timer logic for active session
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeSession && !activeSession.end_time) {
      const startTime = new Date(activeSession.start_time).getTime();
      
      // Initialize focus time if not already set or whenever session changes
      if (focusElapsed === 0) {
        setFocusElapsed(activeSession.actual_focus_seconds || 0);
      }

      const updateTimer = () => {
        // Total elapsed session time
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setSessionElapsed(elapsed > 0 ? elapsed : 0);
        
        // Actual focus time (pauses if distracted)
        if (!activeSession.is_distracted) {
          setFocusElapsed(prev => prev + 1);
        }
      };
      
      updateTimer();
      interval = setInterval(updateTimer, 1000);
    } else {
      setSessionElapsed(0);
      setFocusElapsed(0);
    }
    return () => clearInterval(interval);
  }, [activeSession]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [aromaRes, historyRes, sessionRes] = await Promise.all([
          fetch('/api/aroma'),
          fetch('/api/study/history'),
          fetch('/api/study/session/current')
        ]);

        if (aromaRes.ok) {
          const aromas = await aromaRes.json();
          setAromaConfigs(aromas);
          if (aromas.length > 0) setSelectedAroma(aromas[0].scent_name);
        }

        if (historyRes.ok) {
          const history = await historyRes.json();
          setHistoryData(history);
        }

        if (sessionRes.ok) {
          const session = await sessionRes.json();
          setActiveSession(session);
        }
      } catch (error) {
        console.error("Failed to fetch study data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Poll for active session updates every 10 seconds
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/study/session/current');
        if (res.ok) {
          const session = await res.json();
          setActiveSession(session);
        } else if (res.status === 404) {
          setActiveSession(null);
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleStartSession = async () => {
    try {
      const res = await fetch('/api/study/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration: 60, // Default 60 mins for quick start
          break_activity: 'GAME',
          phone_detection_enabled: true,
          focus_shield_enabled: true,
          focus_goal: 'General Study'
        }),
      });

      if (res.ok) {
        const session = await res.json();
        setActiveSession(session);
        // Change robot mode to STUDY
        await fetch('/api/robot/mode', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'STUDY' })
        });
      }
    } catch (error) {
      console.error("Failed to start session", error);
    }
  };

  const handleStopSession = async () => {
    if (!activeSession) return;
    try {
      const res = await fetch(`/api/study/session/${activeSession.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          is_finished: true,
          actual_focus_seconds: focusElapsed 
        }),
      });

      if (res.ok) {
        setActiveSession(null);
        // Set robot mode back to GENERAL
        await fetch('/api/robot/mode', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'GENERAL' })
        });
        // Refresh history
        const histRes = await fetch('/api/study/history');
        if (histRes.ok) setHistoryData(await histRes.json());
      }
    } catch (error) {
      console.error("Failed to stop session", error);
    }
  };

  const handleTriggerBreak = async (type: 'GAME' | 'BREATHE') => {
    try {
      await fetch('/api/study/trigger-break', { method: 'POST' });
      // In a real app, we'd wait for robot to confirm mode change
    } catch (error) {
      console.error("Failed to trigger break", error);
    }
  };

  const handleTriggerAroma = async (scent: string) => {
    setSelectedAroma(scent);
    try {
      await fetch('/api/aroma/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scent_name: scent })
      });
    } catch (error) {
      console.error("Failed to trigger aroma", error);
    }
  };

  const formatTime = (mins: number) => {
    if (!mins) return '0m';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

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

  const handleTriggerBreak = async (type: 'GAME' | 'BREATHE') => {
    setIsTriggeringBreak(true);
    try {
      // Trigger the break on the server
      const res = await fetch('/api/study/trigger-break', {
        method: 'POST',
      });
      
      if (!res.ok) {
        // Show error but don't strictly crash, as local mockup DB might lack an active session
        const errorText = await res.text();
        console.warn("Trigger break response:", errorText);
      }
      
      alert(`Break triggered! Starting ${type} mode on your robot.`);
      
    } catch (error) {
      console.error(error);
      alert("Failed to trigger break");
    } finally {
      setIsTriggeringBreak(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white p-8 pt-28">
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
                onClick={() => setIsTracking(!isTracking)}
                className="px-6 py-3 bg-blue-500/20 border border-blue-500/40 rounded-2xl flex items-center gap-2 text-blue-400 hover:bg-blue-500/30 transition-all"
              >
                <Play className="w-5 h-5" />
                Start Tracking
              </button>
            </div>

            {/* Video/Eye Tracking Area */}
            <div className="h-64 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden group">
              {!activeSession && <Eye className="w-16 h-16 text-white/10 transition-all duration-700" />}
              {activeSession && (
                <>
                  {activeSession.is_distracted && (
                    <div className="absolute inset-0 bg-orange-500/10 flex items-center justify-center z-10 backdrop-blur-[2px] transition-all">
                      <div className="flex flex-col items-center gap-2 animate-pulse">
                        <AlertTriangle className="w-12 h-12 text-orange-400" />
                        <p className="text-orange-400 font-bold tracking-widest uppercase text-xs">Distraction Detected</p>
                        <button 
                          onClick={async () => {
                            await fetch('/api/study/distraction/recover', { method: 'POST' });
                            // Fetch updated session
                            const res = await fetch('/api/study/session/current');
                            if (res.ok) setActiveSession(await res.json());
                          }}
                          className="mt-2 px-4 py-1.5 bg-orange-500/20 border border-orange-500/40 rounded-full text-[10px] text-orange-400 hover:bg-orange-500/30 transition-all"
                        >
                          Manual Resume
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 border-2 border-blue-500/30 rounded-full animate-[ping_3s_linear_infinite]"></div>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className={`text-6xl font-light tracking-wider mb-2 tabular-nums transition-all ${activeSession.is_distracted ? 'text-white/20' : 'text-white'}`}>
                      {formatDuration(sessionElapsed)}
                    </div>
                    <div className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Total Session Time</div>
                  </div>
                </>
              )}
              <div className={`absolute bottom-0 left-0 right-0 h-4 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 transition-transform duration-500 ${activeSession ? 'translate-y-0' : 'translate-y-full'}`}></div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1 relative overflow-hidden">
                <p className="text-white/60 text-sm">Actual Focus Time</p>
                <p className={`text-3xl font-medium transition-colors ${activeSession?.is_distracted ? 'text-orange-400' : 'text-white'}`}>
                  {activeSession ? formatDuration(focusElapsed) : '00:00:00'}
                </p>
                <div className="absolute top-0 right-0 p-3 opacity-20">
                  <Zap className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
                <p className="text-white/60 text-sm">Distractions</p>
                <p className="text-2xl">3</p>
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
                    className={`flex-1 py-2 rounded-lg text-xs transition-all ${selectedAroma === aroma
                      ? 'bg-pink-500/20 border border-pink-500/40 text-pink-400'
                      : 'bg-white/5 border border-white/10 text-white/60'
                      }`}
                  >
                    {aroma}
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
              <p className="text-white/60 text-sm">You have been focused for 2h</p>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => handleTriggerBreak('GAME')}
                  disabled={isTriggeringBreak}
                  className="py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isTriggeringBreak ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Game'}
                </button>
                <button 
                  onClick={() => handleTriggerBreak('BREATHE')}
                  disabled={isTriggeringBreak}
                  className="py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isTriggeringBreak ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Breathe'}
                </button>
              </div>
              {breathingExercises.length > 0 && (
                <div className="text-xs text-white/40 mt-2 text-center">
                  {breathingExercises.length} breathing exercises loaded
                </div>
              )}
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
          <h2 className="text-2xl">Study History</h2>

          <div className="space-y-4">
            {historyData.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-[#1C1E26] rounded-xl p-4 transition-all"
              >
                <div className="flex items-center gap-16">
                  <div>
                    <p className="text-base">{item.date}</p>
                    <p className="text-white/60 text-sm">{item.time}</p>
                  </div>
                  <p className="text-white/60 text-[13px]">{item.distractions}</p>
                </div>
                <Link href="/study_session" className="px-5 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-all">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}