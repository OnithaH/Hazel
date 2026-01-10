'use client';

import React, { useState } from 'react';
import { Play, Shield, Sparkles, AlertTriangle, Calendar, BookOpen, Camera, Eye } from 'lucide-react';

export default function StudyModePage() {
  const [selectedAroma, setSelectedAroma] = useState('Peppermint');
  const [isTracking, setIsTracking] = useState(false);

  const aromas = ['Peppermint', 'Lemon', 'Lavender'];

  const historyData = [
    { date: 'Today', time: '2h 34m', focus: '87%', distractions: '3 distractions' },
    { date: 'Yesterday', time: '3h 12m', focus: '92%', distractions: '2 distractions' },
    { date: 'Dec 19', time: '1h 45m', focus: '78%', distractions: '5 distractions' },
    { date: 'Dec 18', time: '2h 15m', focus: '85%', distractions: '4 distractions' },
  ];

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
            <div className="h-64 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden">
              <Eye className="w-16 h-16 text-blue-400/20" />
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
                <p className="text-white/60 text-sm">Focus Time</p>
                <p className="text-2xl">2h 34m</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
                <p className="text-white/60 text-sm">Focus Score</p>
                <p className="text-2xl">87%</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
                <p className="text-white/60 text-sm">Distractions</p>
                <p className="text-2xl">3</p>
              </div>
            </div>
          </div>

          {/* Right Sidebar Cards */}
          <div className="space-y-4">
            {/* Focus Shield */}
            <div className="bg-linear-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-purple-400" />
                <h3 className="text-base">Focus Shield</h3>
              </div>
              <p className="text-white/60 text-sm">Audio monitoring active</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="w-4/5 h-full bg-purple-500 opacity-85"></div>
                </div>
                <span className="text-purple-400 text-sm">Active</span>
              </div>
            </div>

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
                    className={`flex-1 py-2 rounded-lg text-xs transition-all ${
                      selectedAroma === aroma
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
                <button className="py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-all">
                  Game
                </button>
                <button className="py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-all">
                  Breathe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4">
          <button className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left hover:bg-white/10 transition-all group">
            <Calendar className="w-6 h-6 text-blue-400 mb-3" />
            <h3 className="text-base mb-1">Schedule Session</h3>
            <p className="text-white/60 text-sm">Plan your study time</p>
          </button>

          <button className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left hover:bg-white/10 transition-all group">
            <BookOpen className="w-6 h-6 text-purple-400 mb-3" />
            <h3 className="text-base mb-1">Revise Q&A</h3>
            <p className="text-white/60 text-sm">Upload & practice</p>
          </button>

          <button className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left hover:bg-white/10 transition-all group">
            <Camera className="w-6 h-6 text-pink-400 mb-3" />
            <h3 className="text-base mb-1">OCR Scanner</h3>
            <p className="text-white/60 text-sm">Scan textbooks</p>
          </button>
        </div>

        {/* Study History */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          <h2 className="text-2xl">Study History</h2>
          
          <div className="space-y-4">
            {historyData.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-base">{item.date}</p>
                    <p className="text-white/60 text-sm">{item.time}</p>
                  </div>
                  <div className="px-4 py-1.5 bg-blue-500/20 rounded-lg">
                    <span className="text-blue-400 text-sm">Focus: {item.focus}</span>
                  </div>
                  <p className="text-white/60 text-sm">{item.distractions}</p>
                </div>
                <button className="px-5 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-all">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}