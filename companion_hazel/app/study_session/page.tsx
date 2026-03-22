"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Clock,
  AlertTriangle,
  ArrowLeft,
  Zap,
  Eye,
  Calendar,
  BookOpen,
  Loader2
} from 'lucide-react';

interface Distraction {
  id: string;
  type: string;
  timestamp: string;
}

interface StudySession {
  id: string;
  start_time: string;
  end_time: string | null;
  scheduled_duration: number;
  actual_focus_time: number | null;
  break_activity: string | null;
  distractions: Distraction[];
  _count: {
    distractions: number;
  };
}

export default function StudySessionDetails() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('id');
  const [session, setSession] = useState<StudySession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetails();
    }
  }, [sessionId]);

  const fetchSessionDetails = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/study/session/${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setSession(data);
      } else {
        setError("Failed to fetch session details");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F1117] flex items-center justify-center text-white">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-[#0F1117] flex flex-col items-center justify-center text-white p-8">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Error Loading Session</h1>
        <p className="text-white/60 mb-8">{error || "Session not found"}</p>
        <Link href="/study_mode" className="px-6 py-2 bg-blue-500 rounded-full font-medium hover:bg-blue-600 transition-all">
          Back to Study Mode
        </Link>
      </div>
    );
  }

  const startTime = new Date(session.start_time);
  const endTime = session.end_time ? new Date(session.end_time) : null;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const actualDurationMinutes = session.actual_focus_time ?? (endTime ? Math.floor((endTime.getTime() - startTime.getTime()) / 60000) : 0);
  const distractionCount = session._count?.distractions || 0;

  // Process timeline events
  const sessionEvents = [
    { icon: Zap, color: 'blue', title: 'Session started', time: formatTime(startTime) },
    ...session.distractions.map(d => ({
      icon: AlertTriangle,
      color: 'orange' as const,
      title: `${d.type === 'PHONE' ? 'Phone' : 'Movement'} distraction detected`,
      time: formatTime(new Date(d.timestamp))
    })),
    ...(endTime ? [{ icon: Clock, color: 'blue' as const, title: 'Session ended', time: formatTime(endTime) }] : [])
  ];

  // Logic for the timeline bar
  const totalSessionTime = endTime ? (endTime.getTime() - startTime.getTime()) : Date.now() - startTime.getTime();

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
              {formatDate(startTime)}, {formatTime(startTime)} - {endTime ? formatTime(endTime) : 'Ongoing'}
            </p>
          </div>
          <button className="px-5 py-2 mt-8 bg-[#1B2A4E] text-[#60A5FA] hover:bg-[#233561] rounded-full text-sm font-medium transition-all">
            Study Mode
          </button>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-4">
          <div className="bg-[#121E36] border border-[#1E3A5F] rounded-2xl p-5 w-56 flex flex-col justify-center">
            <Clock className="w-5 h-5 text-[#3B82F6] mb-3" />
            <p className="text-[28px] font-medium text-white leading-tight mb-1">
              {formatDuration(actualDurationMinutes)}
            </p>
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
                <div className="flex h-10 rounded-xl overflow-hidden mb-3 bg-[#262833]">
                  {/* Simplified timeline: Green background, Red marks for distractions */}
                  <div className="relative w-full h-full bg-[#22C55E]">
                    {session.distractions.map((d, i) => {
                      const pos = ((new Date(d.timestamp).getTime() - startTime.getTime()) / totalSessionTime) * 100;
                      return (
                        <div
                          key={i}
                          className="absolute top-0 bottom-0 w-1 bg-[#EF4444]"
                          style={{ left: `${Math.min(99, Math.max(0, pos))}%` }}
                        ></div>
                      );
                    })}
                  </div>
                </div>

                {/* Time Labels */}
                <div className="flex justify-between text-[11px] text-white/40 font-medium tracking-wide">
                  <span>{formatTime(startTime)}</span>
                  <span>{endTime ? formatTime(endTime) : 'Now'}</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex gap-5 text-xs font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#22C55E] rounded-full"></div>
                  <span className="text-white/50">Focused</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#EF4444] rounded-full"></div>
                  <span className="text-white/50">Distracted</span>
                </div>
              </div>
            </div>

            {/* Session Events */}
            <div className="bg-[#1C1E26] border border-white/5 rounded-2xl p-6">
              <h2 className="text-base font-medium mb-5">Session Events ({sessionEvents.length})</h2>

              <div className="space-y-3">
                {sessionEvents.length > 0 ? sessionEvents.map((event, index) => {
                  const Icon = event.icon || Zap;
                  const bgColors: Record<string, string> = {
                    blue: 'bg-[#1D2B4D]',
                    green: 'bg-[#143128]',
                    orange: 'bg-[#332219]',
                    slate: 'bg-[#2A2D3A]'
                  };
                  const iconColors: Record<string, string> = {
                    blue: 'text-[#60A5FA]',
                    green: 'text-[#34D399]',
                    orange: 'text-[#F59E0B]',
                    slate: 'text-[#94A3B8]'
                  };

                  return (
                    <div key={index} className="flex items-center gap-4 bg-[#262833] rounded-xl p-4">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${bgColors[event.color] || bgColors.blue}`}>
                        <Icon className={`w-4 h-4 ${iconColors[event.color] || iconColors.blue}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px] font-medium text-white/90">{event.title}</p>
                        <p className="text-[11px] text-white/40 mt-1">{event.time}</p>
                      </div>
                    </div>
                  );
                }) : (
                  <p className="text-white/40 text-sm py-4">No events logged for this session.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Environment */}
            <div className="bg-[#1C1E26] border border-white/5 rounded-2xl p-6">
              <h2 className="text-base font-medium mb-5">Environment</h2>
              <div className="space-y-3">
                <div className="bg-[#262833] rounded-xl p-4">
                  <p className="text-white/40 text-[11px] font-medium mb-1">Session ID</p>
                  <p className="text-[11px] text-white/60 font-mono break-all">{session.id}</p>
                </div>
                <div className="bg-[#262833] rounded-xl p-4">
                  <p className="text-white/40 text-[11px] font-medium mb-1">Scheduled Time</p>
                  <p className="text-[13px] text-white/90 font-medium">{session.scheduled_duration} mins</p>
                </div>
                {session.break_activity && (
                  <div className="bg-[#262833] rounded-xl p-4">
                    <p className="text-white/40 text-[11px] font-medium mb-1">Break Activity</p>
                    <p className="text-[13px] text-white/90 font-medium capitalize">{session.break_activity}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Session Notes */}
            <div className="bg-[#1C1E26] border border-white/5 rounded-2xl p-6">
              <h2 className="text-base font-medium mb-4">Session Notes</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this session..."
                className="w-full h-24 bg-[#14161C] border border-white/5 rounded-xl p-4 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-[#3B82F6]/40 resize-none mb-4"
              />
              <button className="w-full py-2.5 bg-[#1B2A4E] text-[#60A5FA] hover:bg-[#233561] rounded-xl text-sm font-medium transition-all">
                Save Notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
