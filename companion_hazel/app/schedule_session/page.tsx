'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar, 
  Target, 
  Sparkles, 
  Lightbulb, 
  Shield, 
  Eye,
  Bell,
  Coffee
} from 'lucide-react';

export default function ScheduleSessionPage() {
  const [selectedDuration, setSelectedDuration] = useState('2h');
  const [selectedRepeat, setSelectedRepeat] = useState('None');
  const [focusGoal, setFocusGoal] = useState('');
  const [focusShield, setFocusShield] = useState(true);
  const [eyeTracking, setEyeTracking] = useState(true);
  const [reminder15min, setReminder15min] = useState(true);
  const [reminder5min, setReminder5min] = useState(false);

  const durations = ['30m', '1h', '1h 30m', '2h', '3h'];
  const repeats = ['None', 'Daily', 'Weekly', 'Custom'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-16 pt-28">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <Link href="/study_mode" className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center">
              <Calendar className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-4xl font-normal mb-2">Schedule Session</h1>
              <p className="text-white/60">Plan your study time with Hazel</p>
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl">Date & Time</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-white/60 text-sm">Date</label>
              <input
                type="date"
                className="w-full h-[62px] bg-white/5 border border-white/10 rounded-2xl px-5 text-white focus:outline-none focus:border-blue-500/40 transition-colors"
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-white/60 text-sm">Start Time</label>
              <input
                type="time"
                className="w-full h-[62px] bg-white/5 border border-white/10 rounded-2xl px-5 text-white focus:outline-none focus:border-blue-500/40 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl">Duration</h2>
          
          <div className="grid grid-cols-5 gap-4">
            {durations.map((duration) => (
              <button
                key={duration}
                onClick={() => setSelectedDuration(duration)}
                className={`h-[62px] rounded-2xl text-lg transition-all ${
                  selectedDuration === duration
                    ? 'bg-blue-500/20 border border-blue-500/40 text-blue-400'
                    : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                {duration}
              </button>
            ))}
          </div>
        </div>

        {/* Focus Goal */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl">Focus Goal</h2>
          </div>
          
          <textarea
            value={focusGoal}
            onChange={(e) => setFocusGoal(e.target.value)}
            placeholder="What do you want to accomplish in this session?"
            className="w-full h-36 bg-white/5 border border-white/10 rounded-2xl p-5 text-lg text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500/40 resize-none transition-colors"
          />
        </div>

        {/* Environment Preferences */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          <h2 className="text-xl">Environment Preferences</h2>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Aroma */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-400" />
                <h3 className="text-lg">Aroma</h3>
              </div>
              <select className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-pink-500/40 transition-colors">
                <option>Peppermint (Focus)</option>
                <option>Lavender (Calm)</option>
                <option>Lemon (Energy)</option>
                <option>None</option>
              </select>
            </div>

            {/* RGB Theme */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg">RGB Theme</h3>
              </div>
              <select className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-purple-500/40 transition-colors">
                <option>Cool Blue - High Focus</option>
                <option>Warm Orange - Creativity</option>
                <option>Green - Relaxation</option>
                <option>None</option>
              </select>
            </div>

            {/* Focus Shield */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg">Focus Shield</h3>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={focusShield}
                  onChange={(e) => setFocusShield(e.target.checked)}
                  className="w-6 h-6 rounded bg-blue-500 border-0 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-white/60">Enable audio monitoring</span>
              </label>
            </div>

            {/* Eye Tracking */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-green-400" />
                <h3 className="text-lg">Eye Tracking</h3>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={eyeTracking}
                  onChange={(e) => setEyeTracking(e.target.checked)}
                  className="w-6 h-6 rounded bg-green-500 border-0 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-white/60">Track focus levels</span>
              </label>
            </div>
          </div>
        </div>

        {/* Reminders */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-orange-400" />
            <h2 className="text-xl">Reminders</h2>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3 h-[60px] px-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
              <input
                type="checkbox"
                checked={reminder15min}
                onChange={(e) => setReminder15min(e.target.checked)}
                className="w-6 h-6 rounded bg-orange-500 border-0 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-lg">15 minutes before session</span>
            </label>
            
            <label className="flex items-center gap-3 h-[60px] px-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
              <input
                type="checkbox"
                checked={reminder5min}
                onChange={(e) => setReminder5min(e.target.checked)}
                className="w-6 h-6 rounded bg-white/5 border border-white/20 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-lg">5 minutes before session</span>
            </label>
          </div>
        </div>

        {/* Break Preferences */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Coffee className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl">Break Preferences</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-white/60 text-sm">Break interval</label>
              <select className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-yellow-500/40 transition-colors">
                <option>Every 25 minutes</option>
                <option>Every 45 minutes</option>
                <option>Every 60 minutes</option>
                <option>Custom</option>
              </select>
            </div>
            
            <div className="space-y-3">
              <label className="text-white/60 text-sm">Break duration</label>
              <select className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-yellow-500/40 transition-colors">
                <option>5 minutes</option>
                <option>10 minutes</option>
                <option>15 minutes</option>
                <option>Custom</option>
              </select>
            </div>
          </div>
        </div>

        {/* Repeat */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl">Repeat</h2>
          
          <div className="grid grid-cols-4 gap-4">
            {repeats.map((repeat) => (
              <button
                key={repeat}
                onClick={() => setSelectedRepeat(repeat)}
                className={`h-[62px] rounded-2xl text-lg transition-all ${
                  selectedRepeat === repeat
                    ? 'bg-blue-500/20 border border-blue-500/40 text-blue-400'
                    : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                {repeat}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4">
          <button className="px-8 h-14 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
            Cancel
          </button>
          
          <div className="flex gap-4">
            <button className="px-8 h-14 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
              Save as Draft
            </button>
            <button className="px-8 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all">
              Schedule Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}