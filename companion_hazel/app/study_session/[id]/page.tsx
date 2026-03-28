'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Clock,
  AlertTriangle,
  ArrowLeft,
  Zap,
  Eye,
  Calendar,
  BookOpen,
  Loader2,
  Save,
  CheckCircle2
} from 'lucide-react';

interface Distraction {
  id: string;
  type: string;
  timestamp: string;
}

interface SessionData {
  id: string;
  start_time: string;
  end_time: string | null;
  scheduled_duration: number;
  actual_focus_time: number | null;
  break_activity: string | null;
  break_used: boolean;
  break_time_seconds: number;
  notes: string | null;
  distractions: Distraction[];
}

export default function StudySessionDetails() {
  const { id } = useParams();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/study/session/${id}`);
        if (!res.ok) throw new Error('Failed to fetch session details');
        const data = await res.json();
        setSession(data);
        setNotes(data.notes || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSession();
  }, [id]);

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    setSaveSuccess(false);
    try {
      const res = await fetch(`/api/study/session/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert('Failed to save notes');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving notes');
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1117] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-[#0F1117] flex flex-col items-center justify-center text-white space-y-4">
        <p className="text-red-400">{error || 'Session not found'}</p>
        <Link href="/study_mode" className="text-blue-400 hover:underline">Back to Study Mode</Link>
      </div>
    );
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const totalTimeSeconds = session.end_time 
    ? (new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / 1000 
    : session.scheduled_duration * 60;

  const focusTimeSeconds = session.actual_focus_time || 0;
  const breakTimeSeconds = session.break_time_seconds || 0;
  const distractionCount = session.distractions?.length || 0;

  // Timeline events (simplified)
  const sessionEvents = [
    { icon: Zap, color: 'blue', title: 'Session started', time: formatTime(session.start_time) },
    ...(session.distractions?.map(d => ({
      icon: AlertTriangle,
      color: 'orange',
      title: `${d.type.charAt(0) + d.type.slice(1).toLowerCase()} distraction detected`,
      time: formatTime(d.timestamp)
    })) || []),
    ...(session.end_time ? [{ icon: Clock, color: 'blue', title: 'Session ended', time: formatTime(session.end_time) }] : [])
  ].sort((a, b) => new Date(`2000/01/01 ${a.time}`).getTime() - new Date(`2000/01/01 ${b.time}`).getTime());

  return (
    <div className="min-h-screen bg-[#0F1117] text-white p-8 pt-28 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <Link href="/study_mode" className="flex items-center gap-2 text-white/50 hover:text-white mb-6 text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <h1 className="text-3xl font-medium mb-1">Study Session Details</h1>
            <p className="text-white/40 text-sm">
              {new Date(session.start_time).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}, {formatTime(session.start_time)} 
              {session.end_time ? ` - ${formatTime(session.end_time)}` : ' (In Progress)'}
            </p>
          </div>
          <Link href="/study_mode" className="px-5 py-2 mt-8 bg-[#1B2A4E] text-[#60A5FA] hover:bg-[#233561] rounded-full text-sm font-medium transition-all">
            Study Mode
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-4">
          <div className="bg-[#121E36] border border-[#1E3A5F] rounded-2xl p-5 w-56 flex flex-col justify-center">
            <Clock className="w-5 h-5 text-[#3B82F6] mb-3" />
            <p className="text-[28px] font-medium text-white leading-tight mb-1">{formatDuration(totalTimeSeconds)}</p>
            <p className="text-white/40 text-xs">Total Duration</p>
          </div>

          <div className="bg-[#2D1A14] border border-[#442319] rounded-2xl p-5 w-56 flex flex-col justify-center">
            <AlertTriangle className="w-5 h-5 text-[#F59E0B] mb-3" />
            <p className="text-[28px] font-medium text-white leading-tight mb-1">{distractionCount}</p>
            <p className="text-white/40 text-xs">Distractions</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Timeline & Events */}
          <div className="md:col-span-2 space-y-6">
            {/* Session Timeline */}
            <div className="bg-[#1C1E26] border border-white/5 rounded-2xl p-6">
              <h2 className="text-base font-medium mb-5">Session Timeline</h2>

              {/* Timeline Bar */}
              <div className="mb-4">
                <div className="flex h-10 rounded-xl overflow-hidden mb-3">
                  <div className="bg-[#22C55E]" style={{ width: `${Math.max(10, (focusTimeSeconds / totalTimeSeconds) * 100)}%` }}></div>
                  {distractionCount > 0 && <div className="bg-[#EF4444]" style={{ width: '5%' }}></div>}
                  {breakTimeSeconds > 0 && <div className="bg-[#FBBF24]" style={{ width: `${(breakTimeSeconds / totalTimeSeconds) * 100}%` }}></div>}
                </div>

                {/* Time Labels */}
                <div className="flex justify-between text-[11px] text-white/40 font-medium tracking-wide">
                  <span>{formatTime(session.start_time)}</span>
                  {session.end_time && <span>{formatTime(session.end_time)}</span>}
                </div>
              </div>

              {/* Legend */}
              <div className="flex gap-5 text-xs font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#22C55E] rounded-full"></div>
                  <span className="text-white/50">Focused</span>
                </div>
                {distractionCount > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#EF4444] rounded-full"></div>
                    <span className="text-white/50">Distracted</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#FBBF24] rounded-full"></div>
                  <span className="text-white/50">Break</span>
                </div>
              </div>
            </div>

            {/* Session Events */}
            <div className="bg-[#1C1E26] border border-white/5 rounded-2xl p-6">
              <h2 className="text-base font-medium mb-5">Session Events</h2>

              <div className="space-y-3">
                {sessionEvents.length > 0 ? (
                  sessionEvents.map((event, index) => {
                    const Icon = event.icon;
                    const bgColors: any = {
                      blue: 'bg-[#1D2B4D]',
                      green: 'bg-[#143128]',
                      orange: 'bg-[#332219]',
                      slate: 'bg-[#2A2D3A]'
                    };
                    const iconColors: any = {
                      blue: 'text-[#60A5FA]',
                      green: 'text-[#34D399]',
                      orange: 'text-[#F59E0B]',
                      slate: 'text-[#94A3B8]'
                    };

                    return (
                      <div key={index} className="flex items-center gap-4 bg-[#262833] rounded-xl p-4">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${bgColors[event.color] || 'bg-[#2A2D3A]'}`}>
                          <Icon className={`w-4 h-4 ${iconColors[event.color] || 'text-[#94A3B8]'}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-[13px] font-medium text-white/90">{event.title}</p>
                          <p className="text-[11px] text-white/40 mt-1">{event.time}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-white/40 py-4 italic text-sm">No significant events to show</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Focus Breakdown, Environment, Notes */}
          <div className="space-y-6">
            {/* Focus Breakdown */}
            <div className="bg-[#1C1E26] border border-white/5 rounded-2xl p-6">
              <h2 className="text-base font-medium mb-5">Focus Breakdown</h2>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-2">
                    <span className="text-white/60">Actual Focus</span>
                    <span className="text-[#22C55E]">{Math.round((focusTimeSeconds / (session.scheduled_duration * 60)) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#22C55E]" style={{ width: `${Math.min(100, (focusTimeSeconds / (session.scheduled_duration * 60)) * 100)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-2">
                    <span className="text-white/60">Breaks</span>
                    <span className="text-[#FBBF24]">{Math.round((breakTimeSeconds / totalTimeSeconds) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#FBBF24]" style={{ width: `${(breakTimeSeconds / totalTimeSeconds) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-2">
                    <span className="text-white/60">Distraction Risk</span>
                    <span className="text-[#EF4444]">{distractionCount > 5 ? 'High' : distractionCount > 2 ? 'Medium' : 'Low'}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#EF4444]" style={{ width: `${Math.min(100, distractionCount * 10)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Notes */}
            <div className="bg-[#1C1E26] border border-white/5 rounded-2xl p-6">
              <h2 className="text-base font-medium mb-4">Session Notes</h2>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this session (e.g., covered topics, difficulties...)"
                className="w-full h-32 bg-[#14161C] border border-white/5 rounded-xl p-4 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-[#3B82F6]/40 resize-none mb-4"
              />

              <button 
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  saveSuccess 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                    : 'bg-[#1B2A4E] text-[#60A5FA] hover:bg-[#233561]'
                }`}
              >
                {savingNotes ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Saved Successfully
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Notes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
