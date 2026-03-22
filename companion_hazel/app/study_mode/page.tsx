'use client';

import React, { useState, useEffect } from 'react';
import { Play, Square, Sparkles, AlertTriangle, Calendar, BookOpen, Camera, Eye, Zap } from 'lucide-react';
import Link from 'next/link';

export default function StudyModePage() {
  const [aromaConfigs, setAromaConfigs] = useState<any[]>([]);
  const [selectedAroma, setSelectedAroma] = useState('Peppermint');
  const [activeSession, setActiveSession] = useState<any>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        body: JSON.stringify({ is_finished: true }),
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

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white p-8 pt-28">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-blue-400" />
              <h1 className="text-4xl font-normal">Study Mode</h1>
            </div>
            <p className="text-white/60">Enhanced focus and learning environment with Hazel</p>
          </div>

          <div className={`flex items-center gap-3 px-6 py-3 border rounded-full transition-all ${activeSession ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' : 'bg-white/5 border-white/10 text-white/40'}`}>
            <div className={`w-2 h-2 rounded-full ${activeSession ? 'bg-blue-500 animate-pulse' : 'bg-white/20'}`}></div>
            <span>{activeSession ? 'Study Session Active' : 'Ready to Focus'}</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Focus Tracking - Large Card */}
          <div className="col-span-2 bg-linear-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-3xl p-8 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl mb-1">Focus Tracking</h2>
                <p className="text-sm text-white/40">{activeSession ? `Current Goal: ${activeSession.focus_goal || 'Focusing'}` : 'Start a session to begin tracking'}</p>
              </div>
              <button
                onClick={activeSession ? handleStopSession : handleStartSession}
                className={`px-6 py-3 border rounded-2xl flex items-center gap-2 transition-all ${activeSession
                  ? 'bg-red-500/10 border-red-500/40 text-red-400 hover:bg-red-500/20'
                  : 'bg-blue-500/20 border-blue-500/40 text-blue-400 hover:bg-blue-500/30'
                  }`}
              >
                {activeSession ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                {activeSession ? 'End Session' : 'Start Tracking'}
              </button>
            </div>

            {/* Video/Eye Tracking Area */}
            <div className="h-64 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden group">
              <Eye className={`w-16 h-16 transition-all duration-700 ${activeSession ? 'text-blue-400 scale-110 opacity-60' : 'text-white/10'}`} />
              {activeSession && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 border-2 border-blue-500/30 rounded-full animate-[ping_3s_linear_infinite]"></div>
                </div>
              )}
              <div className={`absolute bottom-0 left-0 right-0 h-4 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 transition-transform duration-500 ${activeSession ? 'translate-y-0' : 'translate-y-full'}`}></div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1 relative overflow-hidden">
                <p className="text-white/60 text-sm">Actual Focus Time</p>
                <p className="text-3xl font-medium">{formatTime(activeSession?.actual_focus_time || 0)}</p>
                <div className="absolute top-0 right-0 p-3 opacity-20">
                  <Zap className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1 relative overflow-hidden">
                <p className="text-white/60 text-sm">Distractions</p>
                <p className="text-3xl font-medium text-orange-400">{activeSession?.distractions?.length || 0}</p>
                <div className="absolute top-0 right-0 p-3 opacity-20">
                  <AlertTriangle className="w-8 h-8 text-orange-400" />
                </div>
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
              <p className="text-white/60 text-sm">Current Scent: <span className="text-pink-400">{selectedAroma}</span></p>
              <div className="flex flex-wrap gap-2">
                {(aromaConfigs.length > 0 ? aromaConfigs : [{ scent_name: 'Peppermint' }, { scent_name: 'Lavender' }, { scent_name: 'Lemon' }]).map((aroma: any) => (
                  <button
                    key={aroma.scent_name}
                    onClick={() => handleTriggerAroma(aroma.scent_name)}
                    className={`px-4 py-2 rounded-lg text-xs transition-all ${selectedAroma === aroma.scent_name
                      ? 'bg-pink-500/20 border border-pink-500/40 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.1)]'
                      : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                  >
                    {aroma.scent_name}
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
              <p className="text-white/60 text-sm">
                {activeSession
                  ? `Focus period: ${formatTime(activeSession.actual_focus_time || 0)}`
                  : 'Start a session to see break suggestions'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleTriggerBreak('GAME')}
                  disabled={!activeSession}
                  className="py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-orange-500/10 hover:border-orange-500/30 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  Game
                </button>
                <button
                  onClick={() => handleTriggerBreak('BREATHE')}
                  disabled={!activeSession}
                  className="py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-orange-500/10 hover:border-orange-500/30 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  Breathe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/schedule_session" className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left hover:bg-white/10 transition-all group">
            <Calendar className="w-6 h-6 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-base mb-1">Schedule Session</h3>
            <p className="text-white/60 text-sm">Plan your study time in advance</p>
          </Link>

          <Link href="/revise_page" className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left hover:bg-white/10 transition-all group">
            <BookOpen className="w-6 h-6 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-base mb-1">Revise Q&A</h3>
            <p className="text-white/60 text-sm">Upload materials and practice</p>
          </Link>
        </div>

        {/* Study History */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl">Study History</h2>
            <button className="text-sm text-blue-400 hover:underline">View All</button>
          </div>

          <div className="space-y-4">
            {historyData.length > 0 ? historyData.map((item, index) => (
              <div
                key={item.id || index}
                className="flex justify-between items-center bg-[#1C1E26] rounded-xl p-4 transition-all hover:bg-[#252833] border border-transparent hover:border-white/5"
              >
                <div className="flex items-center gap-16">
                  <div>
                    <p className="text-base">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    <p className="text-white/60 text-sm">{formatTime(item.actual_focus_time || 0)} focus time</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-white/60 text-[13px]">{item.distractions_count} distractions</p>
                    <p className="text-white/40 text-[11px]">{Math.round((item.actual_focus_time / item.duration) * 100) || 0}% efficiency</p>
                  </div>
                </div>
                <Link
                  href={`/study_session?id=${item.id}`}
                  className="px-5 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/40 transition-all"
                >
                  View Details
                </Link>
              </div>
            )) : (
              <div className="text-center py-12 text-white/20">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No study history available yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
