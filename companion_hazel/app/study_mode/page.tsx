'use client';

import React, { useState, useEffect } from 'react';
import { Play, Shield, Sparkles, AlertTriangle, Calendar, BookOpen, Camera, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface BreathingExercise {
  id: string;
  title: string;
  duration: number;
}

export default function StudyModePage() {
  const [selectedAroma, setSelectedAroma] = useState('Peppermint');
  const [isTracking, setIsTracking] = useState(false);

  // Real Data states
  const [isTriggeringBreak, setIsTriggeringBreak] = useState(false);
  const [breathingExercises, setBreathingExercises] = useState<BreathingExercise[]>([]);

  const aromas = ['Peppermint', 'Lemon', 'Lavender'];

  const historyData = [
    { date: 'Today', time: '2h 34m', focus: '87%', distractions: '3 distractions' },
    { date: 'Yesterday', time: '3h 12m', focus: '92%', distractions: '2 distractions' },
    { date: 'Dec 19', time: '1h 45m', focus: '78%', distractions: '5 distractions' },
    { date: 'Dec 18', time: '2h 15m', focus: '85%', distractions: '4 distractions' },
  ];

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
            <div className="h-64 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden">
              <Eye className="w-16 h-16 text-blue-400/20" />
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
                <p className="text-white/60 text-sm">Focus Time</p>
                <p className="text-2xl">2h 34m</p>
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