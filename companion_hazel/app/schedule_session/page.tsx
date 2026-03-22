'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ScheduleSessionPage() {
  const router = useRouter();
  const [selectedDuration, setSelectedDuration] = useState('2h');
  const [focusGoal, setFocusGoal] = useState('');
  const [focusShield, setFocusShield] = useState(true); // Default to true for better focus
  const [focusTracking, setFocusTracking] = useState(true);
  const [needPhone, setNeedPhone] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState("14:34");
  const [isScheduling, setIsScheduling] = useState(false);
  const [breakActivity, setBreakActivity] = useState<'GAME' | 'BREATHE'>('GAME');

  const durations = ['30m', '1h', '1h 30m', '2h', '3h'];

  const parseDuration = (dur: string) => {
    if (dur === '30m') return 30;
    if (dur === '1h') return 60;
    if (dur === '1h 30m') return 90;
    if (dur === '2h') return 120;
    if (dur === '3h') return 180;
    return 60;
  };

  const handleSchedule = async () => {
    setIsScheduling(true);
    try {
      const startDateTime = new Date(`${date}T${startTime}`);
      
      // 1. Create the study session
      const sessionRes = await fetch('/api/study/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration: parseDuration(selectedDuration),
          break_activity: breakActivity,
          phone_detection_enabled: !needPhone, // Mapping needPhone inversely to detection
          focus_shield_enabled: focusShield,
          focus_goal: focusGoal,
          start_time: startDateTime.toISOString(),
        }),
      });

      if (!sessionRes.ok) {
        const errorText = await sessionRes.text();
        throw new Error(errorText || "Failed to create session");
      }

      // 2. Set robot mode to STUDY
      try {
        await fetch('/api/robot/mode', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'STUDY' }),
        });
      } catch (e) {
        console.warn("Failed to update robot mode, but session was created:", e);
      }

      // 3. Success! Redirect to study mode
      router.push('/study_mode');
    } catch (error: any) {
      console.error("Schedule error:", error);
      alert(`Failed to schedule session: ${error.message}`);
    } finally {
      setIsScheduling(false);
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
              <h1 className="text-[36px] leading-[40px] font-normal">Schedule Session</h1>
              <p className="text-white/60 text-[16px] leading-[24px]">Plan your study time with Hazel</p>
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div className="bg-white/5 border-[0.8px] border-white/10 rounded-[16px] p-[24.8px] flex flex-col gap-[16px]">
          <h2 className="text-[20px] leading-[28px]">Date & Time</h2>
          
          <div className="flex gap-[24px]">
            <div className="flex flex-col gap-[12px] flex-1">
              <label className="text-white/60 text-[16px] leading-[24px]">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-[61.6px] bg-white/5 border-[0.8px] border-white/10 rounded-[14px] px-5 text-white focus:outline-none focus:border-[#2B7FFF]/40 transition-colors"
              />
            </div>
            
            <div className="flex flex-col gap-[12px] flex-1">
              <label className="text-white/60 text-[16px] leading-[24px]">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full h-[61.6px] bg-white/5 border-[0.8px] border-white/10 rounded-[14px] px-5 text-white focus:outline-none focus:border-[#2B7FFF]/40 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="bg-white/5 border-[0.8px] border-white/10 rounded-[16px] p-[24.8px] flex flex-col gap-[16px]">
          <h2 className="text-[20px] leading-[28px]">Duration</h2>
          
          <div className="flex gap-[16px] flex-wrap">
            {durations.map((duration) => (
              <button
                key={duration}
                onClick={() => setSelectedDuration(duration)}
                className={`flex-1 min-w-[100px] h-[61.6px] rounded-[14px] text-[18px] transition-all flex items-center justify-center ${
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
        <div className="bg-white/5 border-[0.8px] border-white/10 rounded-[16px] p-[24.8px] flex flex-col gap-[16px]">
          <div className="flex items-center gap-[8px]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#51A2FF" strokeWidth="2"/>
              <circle cx="12" cy="12" r="6" stroke="#51A2FF" strokeWidth="2"/>
              <circle cx="12" cy="12" r="2" stroke="#51A2FF" strokeWidth="2"/>
            </svg>
            <h2 className="text-[20px] leading-[28px]">Focus Goal</h2>
          </div>
          
          <textarea
            value={focusGoal}
            onChange={(e) => setFocusGoal(e.target.value)}
            placeholder="What do you want to accomplish in this session?"
            className="w-full h-[145.6px] bg-white/5 border-[0.8px] border-white/10 rounded-[14px] p-[16px] px-[20px] text-[18px] text-white placeholder:text-white/40 focus:outline-none focus:border-[#2B7FFF]/40 resize-none transition-colors"
          />
        </div>

        {/* Environment Preferences */}
        <div className="bg-white/5 border-[0.8px] border-white/10 rounded-[16px] p-[24.8px] flex flex-col gap-[16px]">
          <h2 className="text-[20px] leading-[28px]">Environment Preferences</h2>
          
          <div className="bg-white/5 border-[0.8px] border-white/10 rounded-[14px] p-[20.8px] flex flex-col gap-[16px]">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[8px]">
                 <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 2.5L2.5 5.83333V9.16667C2.5 13.7917 5.70833 18.0667 10 19.1667C14.2917 18.0667 17.5 13.7917 17.5 9.16667V5.83333L10 2.5Z" stroke="#51A2FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
                 <span className="text-[18px] text-white">Focus Shield</span>
              </div>
              <input 
                type="checkbox" 
                checked={focusShield} 
                onChange={(e) => setFocusShield(e.target.checked)}
                className="w-5 h-5 accent-[#2B7FFF]"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[8px]">
                 <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="7" stroke="#51A2FF" strokeWidth="2"/>
                    <circle cx="10" cy="10" r="2" fill="#51A2FF"/>
                 </svg>
                 <span className="text-[18px] text-white">Focus Tracking</span>
              </div>
              <input 
                type="checkbox" 
                checked={focusTracking} 
                onChange={(e) => setFocusTracking(e.target.checked)}
                className="w-5 h-5 accent-[#2B7FFF]"
              />
            </div>
            
          </div>
        </div>

        {/* Break Preferences */}
        <div className="bg-white/5 border-[0.8px] border-white/10 rounded-[16px] p-[24.8px] flex flex-col gap-[16px]">
          <div className="flex items-center gap-[8px]">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#FDC700" strokeWidth="2"/>
                <path d="M12 6V12L16 14" stroke="#FDC700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
            <h2 className="text-[20px] leading-[28px]">Break Preferences</h2>
          </div>
          
          <div className="flex gap-[24px]">
            <button 
              onClick={() => setBreakActivity('GAME')}
              className={`flex-1 h-[48.8px] border-[0.8px] rounded-[10px] transition-all flex items-center justify-center ${
                breakActivity === 'GAME' ? 'bg-[#FDC700]/20 border-[#FDC700]/40 text-[#FDC700]' : 'bg-white/5 border-white/10 text-white/60'
              }`}
            >
              Play Games
            </button>
            
            <button 
              onClick={() => setBreakActivity('BREATHE')}
              className={`flex-1 h-[48.8px] border-[0.8px] rounded-[10px] transition-all flex items-center justify-center ${
                breakActivity === 'BREATHE' ? 'bg-green-500/20 border-green-500/40 text-green-400' : 'bg-white/5 border-white/10 text-white/60'
              }`}
            >
              Breathing Exercises
            </button>
          </div>
        </div>
        
        {/* Mobile Phone check */}
        <div 
          onClick={() => setNeedPhone(!needPhone)}
          className="bg-white/5 border-[0.8px] border-white/10 rounded-[16px] p-[24.8px] flex items-center gap-[16px] cursor-pointer hover:bg-white/10 transition-colors"
        >
             <div 
                className={`w-[24px] h-[24px] flex items-center justify-center border transition-colors ${
                  needPhone ? 'bg-[#2B7FFF] border-[#2B7FFF]' : 'bg-white/10 border-white/20'
                }`}
              >
                  {needPhone && (
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                  )}
              </div>
            <span className="text-[18px] text-white">I need my mobile phone for this study session</span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center py-[24px]">
          <Link href="/study_mode" className="w-[112px] h-[57px] bg-white/5 border border-white/10 rounded-[14px] flex items-center justify-center hover:bg-white/10 transition-all">
            Cancel
          </Link>
          
          <button 
            onClick={handleSchedule}
            disabled={isScheduling}
            className="w-[185px] h-[57px] bg-gradient-to-r from-[#2B7FFF] to-[#AD46FF] rounded-[14px] text-white flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
          >
             {isScheduling ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Schedule Session'}
          </button>
        </div>
        
      </div>
    </div>
  );
}