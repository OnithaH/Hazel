'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ScheduleSessionPage() {
  const router = useRouter();
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const localDateStr = `${year}-${month}-${day}`;

  const [date, setDate] = useState(localDateStr);
  const [startTime, setStartTime] = useState(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }));
  const [selectedDuration, setSelectedDuration] = useState('2h');
  const [focusGoal, setFocusGoal] = useState('');
  const [focusShield, setFocusShield] = useState(false);
  const [focusTracking, setFocusTracking] = useState(true);
  const [needPhone, setNeedPhone] = useState(false);
  const [breakActivity, setBreakActivity] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const durations = ['5m', '10m', '30m', '1h', '1h 30m', '2h', '2h 30m', '3h'];

  const parseDuration = (durationStr: string): number => {
    if (durationStr.includes('h') && durationStr.includes('m')) {
      const [h, m] = durationStr.split('h').map(s => parseInt(s.trim()));
      return h * 60 + m;
    } else if (durationStr.includes('h')) {
      return parseInt(durationStr) * 60;
    } else {
      return parseInt(durationStr);
    }
  };

  const handleSchedule = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const duration = parseDuration(selectedDuration);
      const start_time = new Date(`${date}T${startTime}:00`).toISOString();
      
      const response = await fetch('/api/study/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          duration,
          break_activity: breakActivity,
          phone_detection_enabled: !needPhone,
          focus_shield_enabled: focusShield,
          focus_goal: focusGoal,
          start_time,
        }),
      });

      if (response.ok) {
        // Update robot mode
        await fetch('/api/robot/mode', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mode: 'STUDY' }),
        });
        
        setShowSuccess(true);
        setTimeout(() => {
          router.push('/study_mode');
        }, 2000);
      } else {
        console.error('Failed to schedule session');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error scheduling session:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#101828] to-black text-white p-8 pt-28 font-arimo">
      <div className="max-w-[1024px] mx-auto space-y-8 flex flex-col">
        {/* Header */}
        <div className="flex flex-col gap-[40px]">
          <Link href="/study_mode" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-[16px] leading-[24px]">
            <ChevronLeft className="w-5 h-5" />
            Back
          </Link>
          
          <div className="flex items-center gap-[16px]">
            <div className="w-[64px] h-[64px] bg-[#2B7FFF]/20 rounded-[16px] flex items-center justify-center shrink-0">
               <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M25.3333 5.33334H6.66667C5.19391 5.33334 4 6.52725 4 8.00001V26.6667C4 28.1394 5.19391 29.3333 6.66667 29.3333H25.3333C26.8061 29.3333 28 28.1394 28 26.6667V8.00001C28 6.52725 26.8061 5.33334 25.3333 5.33334Z" stroke="#51A2FF" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21.3333 2.66666V7.99999" stroke="#51A2FF" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.6667 2.66666V7.99999" stroke="#51A2FF" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 13.3333H28" stroke="#51A2FF" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
            </div>
            <div className="flex flex-col gap-[8px]">
              <h1 className="text-[36px] leading-[40px] font-normal translate-y-[-3px]">Schedule Session</h1>
              <p className="text-white/60 text-[16px] leading-[24px] translate-y-[-2.2px]">Plan your study time with Hazel</p>
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div className="bg-white/5 border-[0.8px] border-white/10 rounded-[16px] p-[24.8px] pb-[25.6px] flex flex-col gap-[16px]">
          <h2 className="text-[20px] leading-[28px] translate-y-[-2.2px]">Date & Time</h2>
          
          <div className="flex gap-[24px]">
            <div className="flex flex-col gap-[12px] flex-1">
              <label className="text-white/60 text-[16px] leading-[24px] translate-y-[-2.2px]">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-[61.6px] bg-white/5 border-[0.8px] border-white/10 rounded-[14px] px-5 text-white/60 focus:outline-none focus:border-[#2B7FFF]/40 transition-colors"
              />
            </div>
            
            <div className="flex flex-col gap-[12px] flex-1">
              <label className="text-white/60 text-[16px] leading-[24px] translate-y-[-2.2px]">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full h-[61.6px] bg-white/5 border-[0.8px] border-white/10 rounded-[14px] px-5 text-white/60 focus:outline-none focus:border-[#2B7FFF]/40 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="bg-white/5 border-[0.8px] border-white/10 rounded-[16px] p-[24.8px] pb-[25.6px] flex flex-col gap-[16px]">
          <h2 className="text-[20px] leading-[28px] translate-y-[-2.2px]">Duration</h2>
          
          <div className="flex flex-wrap gap-[16px]">
            {durations.map((duration) => (
              <button
                key={duration}
                onClick={() => setSelectedDuration(duration)}
                className={`flex-1 min-w-[100px] h-[61.6px] rounded-[14px] text-[18px] leading-[28px] transition-all flex items-center justify-center ${
                  selectedDuration === duration
                    ? 'bg-[#2B7FFF]/20 border-[0.8px] border-[#2B7FFF]/40 text-[#51A2FF]'
                    : 'bg-white/5 border-[0.8px] border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                {duration}
              </button>
            ))}
          </div>
        </div>

        {/* Focus Goal */}
        <div className="bg-white/5 border-[0.8px] border-white/10 rounded-[16px] p-[24.8px] pb-[25.6px] flex flex-col gap-[16px]">
          <div className="flex items-center gap-[8px]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#51A2FF" strokeWidth="2"/>
              <circle cx="12" cy="12" r="6" stroke="#51A2FF" strokeWidth="2"/>
              <circle cx="12" cy="12" r="2" stroke="#51A2FF" strokeWidth="2"/>
            </svg>
            <h2 className="text-[20px] leading-[28px] translate-y-[-2.2px]">Focus Goal</h2>
          </div>
          
          <textarea
            value={focusGoal}
            onChange={(e) => setFocusGoal(e.target.value)}
            placeholder="What do you want to accomplish in this session?"
            className="w-full h-[145.6px] bg-white/5 border-[0.8px] border-white/10 rounded-[14px] p-[16px] px-[20px] text-[18px] leading-[28px] text-white placeholder:text-white/40 focus:outline-none focus:border-[#2B7FFF]/40 resize-none transition-colors"
          />
        </div>

        {/* Environment Preferences */}
        <div className="bg-white/5 border-[0.8px] border-white/10 rounded-[16px] p-[24.8px] pb-[25.6px] flex flex-col gap-[16px]">
          <h2 className="text-[20px] leading-[28px] translate-y-[-2.2px]">Environment Preferences</h2>
          
          <div className="bg-white/5 border-[0.8px] border-white/10 rounded-[14px] p-[20.8px] pb-[21.6px] flex flex-col gap-[16px]">
            
            {/* Focus Shield Toggle */}
            <div className="flex items-center gap-[12px] cursor-pointer" onClick={() => setFocusShield(!focusShield)}>
               <div className={`w-[24px] h-[24px] flex items-center justify-center border transition-colors ${
                  focusShield ? 'bg-[#2B7FFF] border-[#2B7FFF]' : 'bg-transparent border-white/40 rounded-[4px]'
                }`}>
                  {focusShield && (
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                  )}
               </div>
               <span className="text-[18px] leading-[28px] text-white">Focus Shield</span>
            </div>

            {/* Focus Tracking Toggle */}
            <label className="flex items-center gap-[12px] cursor-pointer">
              <div 
                className={`w-[24px] h-[24px] flex items-center justify-center border transition-colors ${
                  focusTracking ? 'bg-[#2B7FFF] border-[#2B7FFF]' : 'bg-transparent border-white/40 rounded-[4px]'
                }`}
                onClick={() => setFocusTracking(!focusTracking)}
              >
                  {focusTracking && (
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                  )}
              </div>
              <span className="text-white/60 text-[16px] leading-[24px] translate-y-[-2.2px]">Focus Tracking</span>
            </label>
            
          </div>
        </div>

        {/* Break Preferences */}
        <div className="bg-white/5 border-[0.8px] border-white/10 rounded-[16px] p-[24.8px] pb-[25.6px] flex flex-col gap-[16px]">
          <div className="flex items-center gap-[8px]">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#FDC700" strokeWidth="2"/>
                <path d="M12 6V12L16 14" stroke="#FDC700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
            <h2 className="text-[20px] leading-[28px] translate-y-[-2.2px]">Break Preferences</h2>
          </div>
          
          <div className="flex gap-[24px]">
            <div className="flex flex-col gap-[12px] flex-1">
              <div 
                onClick={() => setBreakActivity('GAME')}
                className={`w-full h-[48.8px] border-[0.8px] rounded-[10px] flex items-center justify-center cursor-pointer transition-colors ${
                  breakActivity === 'GAME' ? 'bg-[#FDC700]/20 border-[#FDC700] text-[#FDC700]' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                  <span className="text-[20px] leading-[28px]">Play Games</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-[12px] flex-1">
              <div 
                onClick={() => setBreakActivity('BREATHING')}
                className={`w-full h-[48.8px] border-[0.8px] rounded-[10px] flex items-center justify-center cursor-pointer transition-colors ${
                  breakActivity === 'BREATHING' ? 'bg-[#FDC700]/20 border-[#FDC700] text-[#FDC700]' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                  <span className="text-[20px] leading-[28px]">Breathing Exercises</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Phone check */}
        <div className="bg-white/5 border-[0.8px] border-white/10 rounded-[16px] p-[24.8px] pb-[25.6px] flex items-center gap-[16px]">
             <div 
                className={`w-[25px] h-[24px] flex items-center justify-center border transition-colors cursor-pointer ${
                  needPhone ? 'bg-[#2B7FFF] border-[#2B7FFF]' : 'bg-[#D9D9D9]/30 border-transparent'
                }`}
                onClick={() => setNeedPhone(!needPhone)}
              >
                  {needPhone && (
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                  )}
              </div>
            <span className="text-[20px] leading-[28px] text-white">I need My mobile phone for this study session</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 py-[24px]">
          {showSuccess && (
            <div className="flex justify-center">
              <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-6 py-2 rounded-full text-[16px] animate-in fade-in slide-in-from-bottom-2 duration-300">
                Successfully scheduled
              </div>
            </div>
          )}
          <div className="flex justify-between items-center">
            <button 
              onClick={() => router.push('/study_mode')}
              className="w-[112.34px] h-[57.6px] bg-white/5 border-[0.8px] border-white/10 rounded-[14px] text-[16px] leading-[24px] text-white hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            
            <button 
              onClick={handleSchedule}
              disabled={isSubmitting}
              className={`w-[185.18px] h-[57.6px] bg-gradient-to-r from-[#2B7FFF] to-[#AD46FF] rounded-[14px] text-[16px] leading-[24px] text-white shadow-[0px_10px_15px_-3px_rgba(43,127,255,0.2),0px_4px_6px_-4px_rgba(43,127,255,0.2)] hover:opacity-90 transition-all flex items-center justify-center ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
               {isSubmitting ? (
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               ) : (
                 'Schedule Session'
               )}
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}