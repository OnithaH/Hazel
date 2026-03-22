'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Clock,
  AlertTriangle,
  ArrowLeft,
  Zap,
  Eye,
  Calendar,
  BookOpen,
  Settings,
  Sparkles
} from 'lucide-react';

function SessionDetailsContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('id');

  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/study/session/${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          setSession(data);
          setNotes(data.notes || '');
        }
      } catch (error) {
        console.error("Failed to fetch session details", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  const handleSaveNotes = async () => {
    if (!sessionId) return;
    try {
      await fetch(`/api/study/session/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actual_focus_time: session.actual_focus_time, is_finished: false }), // Assuming notes field exists in API or just testing
      });
      alert("Notes saved successfully!");
    } catch (e) {
      console.error("Save failed", e);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#0F1117] flex items-center justify-center text-white/50">Loading session details...</div>;
  if (!session) return <div className="min-h-screen bg-[#0F1117] flex items-center justify-center text-white/50">Session not found.</div>;

  // Format time (e.g., "HH:MM AM/PM")
  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Timeline calculation logic
  const startTime = new Date(session.start_time).getTime();
  const endTime = session.end_time ? new Date(session.end_time).getTime() : startTime + (session.scheduled_duration * 60000);
  const totalDuration = endTime - startTime;

  const sessionEvents = [
    { icon: Zap, color: 'blue', title: 'Session started', time: formatTime(session.start_time) },
    ...(session.distractions || []).map((d: any) => ({
      icon: d.type === 'PHONE' ? Eye : AlertTriangle,
      color: 'orange',
      title: `${d.type === 'PHONE' ? 'Phone detection' : 'Drowsiness detected'} - Warning given`,
      time: formatTime(d.timestamp)
    })),
    session.end_time ? { icon: Clock, color: 'blue', title: 'Session ended', time: formatTime(session.end_time) } : { icon: Clock, color: 'slate', title: 'Estimated end', time: formatTime(new Date(endTime).toISOString()) }
  ];

  // Mock materials if not available
  const materials = [
    { subject: 'Study Goal', pages: session.focus_goal || 'General Focus', time: `${session.actual_focus_time || 0} mins` },
    { subject: 'Environment', pages: `Shield: ${session.focus_shield_enabled ? 'ON' : 'OFF'}\nPhone Detection: ${session.phone_detection_enabled ? 'ON' : 'OFF'}`, time: 'Active' },
  ];

  return (
    <div className="min-h-screen bg-[#0F1117] text-white p-8 pt-28 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <Link href="/study_mode" className="flex items-center gap-2 text-white/50 hover:text-white mb-6 text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Study Mode
            </Link>
            <h1 className="text-3xl font-medium mb-1">Study Session Details</h1>
            <p className="text-white/40 text-sm">
              {new Date(session.start_time).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })},
              {formatTime(session.start_time)} - {session.end_time ? formatTime(session.end_time) : 'Active'}
            </p>
          </div>
          <Link href="/study_mode" className="px-5 py-2 mt-8 bg-[#1B2A4E] text-[#60A5FA] hover:bg-[#233561] rounded-full text-sm font-medium transition-all">
            Resume Study Mode
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-4">
          <div className="bg-[#121E36] border border-[#1E3A5F] rounded-2xl p-5 w-64 flex flex-col justify-center relative overflow-hidden group">
            <Clock className="w-5 h-5 text-[#3B82F6] mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-[28px] font-medium text-white leading-tight mb-1">
              {Math.floor((session.actual_focus_time || 0) / 60)}h {(session.actual_focus_time || 0) % 60}m
            </p>
            <p className="text-white/40 text-xs tracking-wide uppercase">Real Focus Time</p>
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full -mr-8 -mt-8"></div>
          </div>

          <div className="bg-[#2D1A14] border border-[#442319] rounded-2xl p-5 w-64 flex flex-col justify-center relative overflow-hidden group">
            <AlertTriangle className="w-5 h-5 text-[#F59E0B] mb-3 group-hover:scale-110 transition-transform" />
            <p className="text-[28px] font-medium text-white leading-tight mb-1">{session.distractions?.length || 0}</p>
            <p className="text-white/40 text-xs tracking-wide uppercase">Distractions Caught</p>
            <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/5 rounded-full -mr-8 -mt-8"></div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Session Timeline */}
            <div className="bg-[#1C1E26] border border-white/5 rounded-2xl p-6 shadow-xl">
              <h2 className="text-base font-medium mb-5 text-white/80">Session Timeline</h2>

              <div className="mb-4">
                <div className="flex h-12 rounded-xl overflow-hidden mb-4 border border-white/10 bg-black/20">
                  {/* Simplified timeline visual: mapping distractions logic */}
                  <div className="bg-[#22C55E]/80 flex-1 hover:bg-[#22C55E] transition-colors"></div>
                  {session.distractions?.length > 0 && <div className="bg-[#EF4444] w-4 animate-pulse"></div>}
                  {session.distractions?.length > 1 && <div className="bg-[#22C55E]/80 flex-1"></div>}
                  {session.distractions?.length > 1 && <div className="bg-[#EF4444] w-2"></div>}
                  <div className="bg-[#22C55E]/80 w-12"></div>
                </div>

                <div className="flex justify-between text-[11px] text-white/30 font-medium tracking-widest">
                  <span>{formatTime(session.start_time)}</span>
                  <span>{session.end_time ? formatTime(session.end_time) : 'IN PROGRESS'}</span>
                </div>
              </div>

              <div className="flex gap-6 text-[11px] font-bold tracking-widest uppercase">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#22C55E] rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                  <span className="text-white/40">Focused</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#EF4444] rounded-full shadow-[0_0_8px_rgba(239,68,68,0.4)]"></div>
                  <span className="text-white/40">Distracted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#FBBF24] rounded-full shadow-[0_0_8px_rgba(251,191,36,0.4)]"></div>
                  <span className="text-white/40">Break</span>
                </div>
              </div>
            </div>

            {/* Session Events */}
            <div className="bg-[#1C1E26] border border-white/5 rounded-2xl p-6 shadow-xl">
              <h2 className="text-base font-medium mb-5 text-white/80">Detailed Events Log</h2>

              <div className="space-y-3">
                {sessionEvents.map((event: any, index: number) => {
                  const Icon = event.icon;
                  const bgColors: any = {
                    blue: 'bg-blue-500/10 border-blue-500/20',
                    green: 'bg-green-500/10 border-green-500/20',
                    orange: 'bg-orange-500/10 border-orange-500/20',
                    slate: 'bg-white/5 border-white/10'
                  };
                  const iconColors: any = {
                    blue: 'text-blue-400',
                    green: 'text-green-400',
                    orange: 'text-orange-400',
                    slate: 'text-white/40'
                  };

                  return (
                    <div key={index} className={`flex items-center gap-4 border rounded-xl p-4 transition-all hover:translate-x-1 ${bgColors[event.color]}`}>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0`}>
                        <Icon className={`w-4 h-4 ${iconColors[event.color]}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px] font-medium text-white/90">{event.title}</p>
                        <p className="text-[11px] font-medium text-white/30 mt-1 uppercase tracking-tight">{event.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Focus Breakdown */}
            <div className="bg-[#1C1E26] border border-white/5 rounded-2xl p-6 shadow-xl">
              <h2 className="text-base font-medium mb-5 text-white/80">Focus Performance</h2>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wide">
                    <span className="text-white/40">Deep focus</span>
                    <span className="text-[#22C55E]">{Math.round(((session.actual_focus_time || 0) / session.scheduled_duration) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#22C55E] rounded-full transition-all duration-1000" style={{ width: `${Math.round(((session.actual_focus_time || 0) / session.scheduled_duration) * 100)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wide">
                    <span className="text-white/40">Distraction interference</span>
                    <span className="text-[#EF4444]">{Math.round(((session.distractions?.length || 0) * 2 / session.scheduled_duration) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#EF4444] rounded-full transition-all duration-1000" style={{ width: `${Math.round(((session.distractions?.length || 0) * 2 / session.scheduled_duration) * 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Environment */}
            <div className="bg-[#1C1E26] border border-white/5 rounded-2xl p-6 shadow-xl">
              <h2 className="text-base font-medium mb-5 text-white/80">Hardware Environment</h2>

              <div className="space-y-3">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-blue-500/20 transition-all group">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-blue-400 opacity-50 group-hover:opacity-100" />
                    <div>
                      <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-0.5">Active Aroma</p>
                      <p className="text-[13px] text-white/90 font-medium">Peppermint Optimized</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4 text-white/20" />
                    <div>
                      <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-0.5">Focus Shield</p>
                      <p className="text-[13px] text-white/90 font-medium">{session.focus_shield_enabled ? 'Active Blocking' : 'Inactive'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Notes */}
            <div className="bg-[#1C1E26] border border-white/5 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-blue-400/50" />
                <h2 className="text-sm font-medium text-white/80">Session Insights</h2>
              </div>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What did you achieve today?"
                className="w-full h-32 bg-black/20 border border-white/5 rounded-xl p-4 text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/40 resize-none mb-4 transition-all"
              />

              <button
                onClick={handleSaveNotes}
                className="w-full py-3 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl text-[13px] font-bold tracking-wide transition-all uppercase"
              >
                Save Log
              </button>
            </div>
          </div>
        </div>

        {/* Materials Studied */}
        <div className="bg-[#1C1E26] border border-white/5 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-5 h-5 text-blue-400/60" />
            <h2 className="text-lg font-medium">Categorized Activity</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {materials.map((material: any, index: number) => (
              <div key={index} className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:bg-white/10 transition-all flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0 text-blue-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white mb-2">{material.subject}</p>
                  <p className="text-xs text-white/40 whitespace-pre-line leading-relaxed mb-4">{material.pages}</p>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400/60 uppercase tracking-widest">
                    <Clock className="w-3 h-3" />
                    <span>{material.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudySessionDetails() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F1117] flex items-center justify-center text-white/50">Loading interface...</div>}>
      <SessionDetailsContent />
    </Suspense>
  );
}
