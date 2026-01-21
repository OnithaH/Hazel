'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  Target,
  AlertTriangle,
  TrendingUp,
  Circle,
  AlertCircle,
  Coffee,
  RotateCcw,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';

export default function StudySessionDetails() {
  const [notes, setNotes] = useState('');

  type SessionEvent = {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: 'blue' | 'green' | 'orange';
    title: string;
    time: string;
  };

  const sessionEvents: SessionEvent[] = [
    { icon: Circle, color: 'blue', title: 'Session started', time: '2:34 PM' },
    { icon: CheckCircle2, color: 'green', title: 'High focus detected - Peppermint aroma activated', time: '2:45 PM' },
    { icon: AlertCircle, color: 'orange', title: 'Distraction detected - Door slam covered with white noise', time: '3:12 PM' },
    { icon: CheckCircle2, color: 'green', title: 'Focus restored automatically', time: '3:15 PM' },
    { icon: Coffee, color: 'blue', title: 'Break suggestion accepted - Gaming mode for 15 mins', time: '3:45 PM' },
    { icon: RotateCcw, color: 'blue', title: 'Returned to study mode', time: '4:00 PM' },
    { icon: Circle, color: 'blue', title: 'Session ended', time: '4:34 PM' },
  ];

  const materials = [
    { subject: 'Mathematics - Chapter 5', pages: 'Pages 45-67', time: '45 mins', icon: '📐' },
    { subject: 'Physics - Thermodynamics', pages: 'Pages 120-145', time: '50 mins', icon: '⚡' },
    { subject: 'Chemistry - Organic Compounds', pages: 'Pages 89-102', time: '39 mins', icon: '🧪' },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white p-8 pt-28">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <Link href="/study_mode" className="flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <h1 className="text-3xl font-normal mb-2">Study Session Details</h1>
            <p className="text-white/60">Today, 2:34 PM - 4:34 PM</p>
          </div>
          <button className="px-6 py-2.5 bg-blue-500/20 border border-blue-500/40 rounded-xl text-blue-400 hover:bg-blue-500/30 transition-all">
            Study Mode
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-linear-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-2xl p-6">
            <Clock className="w-5 h-5 text-blue-400 mb-3" />
            <p className="text-3xl font-normal mb-1">2h 34m</p>
            <p className="text-white/60 text-sm">Total Duration</p>
          </div>

          <div className="bg-linear-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-2xl p-6">
            <Target className="w-5 h-5 text-green-400 mb-3" />
            <p className="text-3xl font-normal mb-1">87%</p>
            <p className="text-white/60 text-sm">Focus Score</p>
          </div>

          <div className="bg-linear-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-2xl p-6">
            <AlertTriangle className="w-5 h-5 text-orange-400 mb-3" />
            <p className="text-3xl font-normal mb-1">3</p>
            <p className="text-white/60 text-sm">Distractions</p>
          </div>

          <div className="bg-linear-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-2xl p-6">
            <TrendingUp className="w-5 h-5 text-purple-400 mb-3" />
            <p className="text-3xl font-normal mb-1">+12%</p>
            <p className="text-white/60 text-sm">vs. Average</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Timeline & Events */}
          <div className="col-span-2 space-y-6">
            {/* Session Timeline */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl mb-4">Session Timeline</h2>
              
              {/* Timeline Bar */}
              <div className="mb-6">
                <div className="flex h-12 rounded-lg overflow-hidden mb-2">
                  <div className="bg-green-500" style={{ width: '45%' }}></div>
                  <div className="bg-red-500" style={{ width: '10%' }}></div>
                  <div className="bg-green-500" style={{ width: '25%' }}></div>
                  <div className="bg-orange-500" style={{ width: '15%' }}></div>
                  <div className="bg-green-500" style={{ width: '5%' }}></div>
                </div>
                
                {/* Time Labels */}
                <div className="flex justify-between text-xs text-white/40">
                  <span>2:34 PM</span>
                  <span>3:04 PM</span>
                  <span>3:34 PM</span>
                  <span>4:04 PM</span>
                  <span>4:34 PM</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-white/60">Focused</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-white/60">Distracted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-white/60">Break</span>
                </div>
              </div>
            </div>

            {/* Session Events */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl mb-4">Session Events</h2>
              
              <div className="space-y-3">
                {sessionEvents.map((event, index) => {
                  const Icon = event.icon;
                  const colorClasses = {
                    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
                    green: 'bg-green-500/10 border-green-500/20 text-green-400',
                    orange: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
                  };
                  
                  return (
                    <div key={index} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${colorClasses[event.color]}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{event.title}</p>
                        <p className="text-xs text-white/40 mt-1">{event.time}</p>
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
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl mb-4">Focus Breakdown</h2>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Deep Focus</span>
                    <span className="text-green-400">72%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '72%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Light Focus</span>
                    <span className="text-blue-400">15%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '15%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Breaks</span>
                    <span className="text-orange-400">10%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: '10%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Distracted</span>
                    <span className="text-red-400">3%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: '3%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Environment */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl mb-4">Environment</h2>
              
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-white/60 mb-1">Aroma</p>
                  <p>Peppermint (Focus)</p>
                </div>
                
                <div>
                  <p className="text-white/60 mb-1">RGB Theme</p>
                  <p>Cool Blue - High Focus</p>
                </div>
                
                <div>
                  <p className="text-white/60 mb-1">Audio Shield</p>
                  <p>Active (2 interventions)</p>
                </div>
                
                <div>
                  <p className="text-white/60 mb-1">Lighting</p>
                  <p>Daylight Mode</p>
                </div>
              </div>
            </div>

            {/* Session Notes */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl mb-4">Session Notes</h2>
              
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this session..."
                className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500/40 resize-none"
              />
              
              <button className="w-full mt-3 py-2.5 bg-blue-500/20 border border-blue-500/40 rounded-xl text-blue-400 hover:bg-blue-500/30 transition-all">
                Save Notes
              </button>
            </div>
          </div>
        </div>

        {/* Materials Studied */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl mb-4">Materials Studied</h2>
          
          <div className="grid grid-cols-3 gap-4">
            {materials.map((material, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500/20 border border-blue-500/40 rounded-lg flex items-center justify-center text-xl shrink-0">
                    {material.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium mb-1">{material.subject}</p>
                    <p className="text-xs text-white/60">{material.pages}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-xs text-white/60">Study Time</span>
                  <span className="text-sm text-blue-400">{material.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}