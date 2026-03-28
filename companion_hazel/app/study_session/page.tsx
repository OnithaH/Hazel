'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  AlertTriangle,
  ArrowLeft,
  Zap,
  Eye,
  Calendar,
  BookOpen
} from 'lucide-react';

export default function StudySessionDetails() {
  const [notes, setNotes] = useState('');

  type SessionEvent = {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: 'blue' | 'green' | 'orange' | 'slate';
    title: string;
    time: string;
  };

  const sessionEvents: SessionEvent[] = [
    { icon: Zap, color: 'blue', title: 'Session started', time: '2:34 PM' },
    { icon: Eye, color: 'green', title: 'High focus detected - Peppermint aroma activated', time: '2:45 PM' },
    { icon: AlertTriangle, color: 'orange', title: 'Distraction detected - Door slam covered with white noise', time: '3:12 PM' },
    { icon: Eye, color: 'green', title: 'Focus restored automatically', time: '3:15 PM' },
    { icon: Calendar, color: 'slate', title: 'Break suggestion accepted - Gaming mode for 15 mins', time: '3:45 PM' },
    { icon: BookOpen, color: 'green', title: 'Returned to study mode', time: '4:00 PM' },
    { icon: Clock, color: 'blue', title: 'Session ended', time: '4:34 PM' },
  ];


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
            <p className="text-white/40 text-sm">Today, 2:34 PM - 4:34 PM</p>
          </div>
          <button className="px-5 py-2 mt-8 bg-[#1B2A4E] text-[#60A5FA] hover:bg-[#233561] rounded-full text-sm font-medium transition-all">
            Study Mode
          </button>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-4">
          <div className="bg-[#121E36] border border-[#1E3A5F] rounded-2xl p-5 w-56 flex flex-col justify-center">
            <Clock className="w-5 h-5 text-[#3B82F6] mb-3" />
            <p className="text-[28px] font-medium text-white leading-tight mb-1">2h 34m</p>
            <p className="text-white/40 text-xs">Total Duration</p>
          </div>

          <div className="bg-[#2D1A14] border border-[#442319] rounded-2xl p-5 w-56 flex flex-col justify-center">
            <AlertTriangle className="w-5 h-5 text-[#F59E0B] mb-3" />
            <p className="text-[28px] font-medium text-white leading-tight mb-1">3</p>
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
                  <div className="bg-[#22C55E]" style={{ width: '45%' }}></div>
                  <div className="bg-[#EF4444]" style={{ width: '5%' }}></div>
                  <div className="bg-[#22C55E]" style={{ width: '35%' }}></div>
                  <div className="bg-[#FBBF24]" style={{ width: '10%' }}></div>
                  <div className="bg-[#22C55E]" style={{ width: '5%' }}></div>
                </div>

                {/* Time Labels */}
                <div className="flex justify-between text-[11px] text-white/40 font-medium tracking-wide">
                  <span>2:35 PM</span>
                  <span>3:05 PM</span>
                  <span>3:35 PM</span>
                  <span>4:05 PM</span>
                  <span>4:35 PM</span>
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
                {sessionEvents.map((event, index) => {
                  const Icon = event.icon;
                  const bgColors = {
                    blue: 'bg-[#1D2B4D]',
                    green: 'bg-[#143128]',
                    orange: 'bg-[#332219]',
                    slate: 'bg-[#2A2D3A]'
                  };
                  const iconColors = {
                    blue: 'text-[#60A5FA]',
                    green: 'text-[#34D399]',
                    orange: 'text-[#F59E0B]',
                    slate: 'text-[#94A3B8]'
                  };

                  return (
                    <div key={index} className="flex items-center gap-4 bg-[#262833] rounded-xl p-4">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${bgColors[event.color]}`}>
                        <Icon className={`w-4 h-4 ${iconColors[event.color]}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px] font-medium text-white/90">{event.title}</p>
                        <p className="text-[11px] text-white/40 mt-1">{event.time}</p>
                      </div>
                    </div>
                  );
                })}
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
                    <span className="text-white/60">Deep Focus</span>
                    <span className="text-[#22C55E]">72%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#22C55E]" style={{ width: '72%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-2">
                    <span className="text-white/60">Breaks</span>
                    <span className="text-[#FBBF24]">10%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#FBBF24]" style={{ width: '10%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-2">
                    <span className="text-white/60">Distracted</span>
                    <span className="text-[#EF4444]">3%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#EF4444]" style={{ width: '3%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Environment */}
            <div className="bg-[#1C1E26] border border-white/5 rounded-2xl p-6">
              <h2 className="text-base font-medium mb-5">Environment</h2>

              <div className="space-y-3">
                <div className="bg-[#262833] rounded-xl p-4">
                  <p className="text-white/40 text-[11px] font-medium mb-1">Aroma</p>
                  <p className="text-[13px] text-white/90 font-medium">Peppermint (Focus)</p>
                </div>

                <div className="bg-[#262833] rounded-xl p-4">
                  <p className="text-white/40 text-[11px] font-medium mb-1">RGB Theme</p>
                  <p className="text-[13px] text-white/90 font-medium">Cool Blue - High Focus</p>
                </div>

                <div className="bg-[#262833] rounded-xl p-4">
                  <p className="text-white/40 text-[11px] font-medium mb-1">Lighting</p>
                  <p className="text-[13px] text-white/90 font-medium">Daylight Mode</p>
                </div>
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