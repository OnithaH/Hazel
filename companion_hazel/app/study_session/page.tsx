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
  ChevronLeft
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
    { icon: RotateCcw, color: 'green', title: 'Returned to study mode', time: '4:00 PM' },
    { icon: Circle, color: 'blue', title: 'Session ended', time: '4:34 PM' },
  ];

  const materials = [
    { subject: 'Mathematics - Chapter 5', pages: 'Pages 45-67', time: '45 mins', icon: '📐' },
    { subject: 'Physics - Thermodynamics', pages: 'Pages 120-145', time: '50 mins', icon: '⚡' },
    { subject: 'Chemistry - Organic Compounds', pages: 'Pages 89-102', time: '39 mins', icon: '🧪' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#101828] to-black text-white p-8 pt-28 font-arimo">
      <div className="max-w-[1088px] mx-auto space-y-8 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center h-[72px]">
          <div className="flex flex-col gap-2 w-[345px]">
            <h1 className="text-[36px] leading-[40px] font-normal translate-y-[-3px]">Study Session Details</h1>
            <p className="text-white/60 text-[16px] leading-[24px]">Today, 2:34 PM - 4:34 PM</p>
          </div>
          
          <div className="flex flex-col items-start px-[24.8px] py-[13.6px] bg-[#2B7FFF]/20 border-[0.8px] border-[#2B7FFF]/40 rounded-full shrink-0">
             <span className="text-[#51A2FF] text-[16px] leading-[24px]">Study Mode</span>
          </div>
        </div>

        {/* Stats Grid - 2 Cards */}
        <div className="flex gap-[24px] h-[142px]">
          <div className="relative w-[232.75px] h-[141.6px] bg-gradient-to-br from-[#2b7fff]/20 to-[#2b7fff]/5 border-[0.8px] border-[#2b7fff]/20 rounded-[16px]">
            <Clock className="absolute left-[24.8px] top-[24.8px] w-5 h-5 text-[#51A2FF]" />
            <div className="absolute left-[24.8px] top-[52.8px] w-[204.4px] h-[36px]">
               <p className="text-[30px] leading-[36px] translate-y-[-2.6px]">2h 34m</p>
            </div>
            <div className="absolute left-[24.8px] top-[92.8px] w-[204.4px] h-[24px]">
               <p className="text-white/60 text-[16px] leading-[24px] translate-y-[-2.2px]">Total Duration</p>
            </div>
          </div>

          <div className="relative w-[232.75px] h-[141.6px] bg-gradient-to-br from-[#ff6900]/20 to-[#ff6900]/5 border-[0.8px] border-[#ff6900]/20 rounded-[16px]">
            <AlertTriangle className="absolute left-[24.8px] top-[24.8px] w-5 h-5 text-[#FF8904]" />
            <div className="absolute left-[24.8px] top-[52.8px] w-[204.4px] h-[36px]">
               <p className="text-[30px] leading-[36px] translate-y-[-2.6px]">3</p>
            </div>
            <div className="absolute left-[24.8px] top-[92.8px] w-[204.4px] h-[24px]">
               <p className="text-white/60 text-[16px] leading-[24px] translate-y-[-2.2px]">Distractions</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex gap-[24px]">
          {/* Left Column - Timeline & Events */}
          <div className="relative w-[717.33px] bg-white/5 border-[0.8px] border-white/10 rounded-[24px] p-[24.8px] min-h-[1057px]">
            
            <h2 className="text-[24px] leading-[32px] mb-[164px]">Session Timeline</h2>
            
            {/* Timeline Segment */}
            <div className="absolute left-[24.8px] top-[80.79px] w-[667.73px] flex flex-col gap-[8px]">
                <div className="relative w-full h-[80px] bg-white/5 rounded-[14px] overflow-hidden flex">
                    <div className="w-[40%] bg-gradient-to-r from-[#00C950] to-[#05DF72]"></div>
                    <div className="w-[5%] bg-gradient-to-r from-[#FB2C36] to-[#FF6467]"></div>
                    <div className="w-[30%] bg-gradient-to-r from-[#00C950] to-[#05DF72]"></div>
                    <div className="w-[10%] bg-gradient-to-r from-[#F0B100] to-[#FDC700]"></div>
                    <div className="w-[15%] bg-gradient-to-r from-[#00C950] to-[#05DF72]"></div>
                </div>
                {/* Timeline Labels */}
                <div className="relative w-full h-[20px] text-[14px] leading-[20px] text-white/60">
                    <span className="absolute left-0">2:34 PM</span>
                    <span className="absolute left-[23%]">3:04 PM</span>
                    <span className="absolute left-[46%]">3:34 PM</span>
                    <span className="absolute left-[69%]">4:04 PM</span>
                    <span className="absolute right-0">4:34 PM</span>
                </div>
            </div>

            {/* Legend */}
            <div className="absolute left-[24.8px] top-[220.79px] flex gap-[24px]">
              <div className="flex items-center gap-[8px]">
                <div className="w-3 h-3 bg-[#00C950] rounded-full shrink-0"></div>
                <span className="text-white/60 text-[16px] leading-[24px]">Focused</span>
              </div>
              <div className="flex items-center gap-[8px]">
                <div className="w-3 h-3 bg-[#FB2C36] rounded-full shrink-0"></div>
                <span className="text-white/60 text-[16px] leading-[24px]">Distracted</span>
              </div>
              <div className="flex items-center gap-[8px]">
                <div className="w-3 h-3 bg-[#F0B100] rounded-full shrink-0"></div>
                <span className="text-white/60 text-[16px] leading-[24px]">Break</span>
              </div>
            </div>

            <h2 className="absolute left-[24.8px] top-[276.79px] text-[20px] leading-[28px]">Session Events</h2>
            
            {/* Session Events List */}
            <div className="absolute left-[24.8px] top-[320.79px] w-[667.73px] flex flex-col gap-[12px]">
              {sessionEvents.map((event, index) => {
                const Icon = event.icon;
                const colorClasses = {
                  blue: 'bg-[#2B7FFF]/20 text-[#51A2FF]',
                  green: 'bg-[#00C950]/20 text-[#05DF72]',
                  orange: 'bg-[#FF6900]/20 text-[#FF8904]',
                };
                
                return (
                  <div key={index} className="flex p-[16px] gap-[16px] bg-white/5 rounded-[14px]">
                    <div className={`w-[40px] h-[40px] rounded-[10px] flex items-center justify-center shrink-0 ${colorClasses[event.color]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col gap-[4px] h-[48px] justify-center">
                      <p className="text-[16px] leading-[24px]">{event.title}</p>
                      <p className="text-[14px] leading-[20px] text-white/60">{event.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Focus Breakdown, Environment, Notes */}
          <div className="w-[346.68px] flex flex-col gap-[24px]">
            {/* Focus Breakdown */}
            <div className="p-[24.8px] bg-white/5 border-[0.8px] border-white/10 rounded-[16px] flex flex-col gap-[16px]">
              <h3 className="text-[20px] leading-[28px]">Focus Breakdown</h3>
              
              <div className="flex flex-col gap-[8px]">
                  {/* Deep Focus */}
                  <div className="flex flex-col gap-[8px]">
                      <div className="flex justify-between items-center text-[16px] leading-[24px]">
                          <span className="text-white/60">Deep Focus</span>
                          <span className="text-[#05DF72]">72%</span>
                      </div>
                      <div className="w-full h-[8px] bg-white/10 rounded-full">
                          <div className="h-full w-[72%] bg-gradient-to-r from-[#00C950] to-[#05DF72] rounded-full"></div>
                      </div>
                  </div>

                  {/* Breaks */}
                  <div className="flex flex-col gap-[8px] mt-[8px]">
                      <div className="flex justify-between items-center text-[16px] leading-[24px]">
                          <span className="text-white/60">Breaks</span>
                          <span className="text-[#FDC700]">10%</span>
                      </div>
                      <div className="w-full h-[8px] bg-white/10 rounded-full">
                          <div className="h-full w-[10%] bg-gradient-to-r from-[#F0B100] to-[#FDC700] rounded-full"></div>
                      </div>
                  </div>

                  {/* Distracted */}
                  <div className="flex flex-col gap-[8px] mt-[8px]">
                      <div className="flex justify-between items-center text-[16px] leading-[24px]">
                          <span className="text-white/60">Distracted</span>
                          <span className="text-[#FF6467]">3%</span>
                      </div>
                      <div className="w-full h-[8px] bg-white/10 rounded-full">
                          <div className="h-full w-[3%] bg-gradient-to-r from-[#FB2C36] to-[#FF6467] rounded-full"></div>
                      </div>
                  </div>
              </div>
            </div>

            {/* Environment */}
            <div className="p-[24.8px] bg-white/5 border-[0.8px] border-white/10 rounded-[16px] flex flex-col gap-[16px]">
              <h3 className="text-[20px] leading-[28px]">Environment</h3>
              
              <div className="flex flex-col gap-[12px]">
                <div className="bg-white/5 p-[12px] pb-[16px] rounded-[10px] flex flex-col gap-[4px] h-[76px] justify-center">
                  <p className="text-[16px] leading-[24px] text-white/60">Aroma</p>
                  <p className="text-[16px] leading-[24px]">Peppermint (Focus)</p>
                </div>
                
                <div className="bg-white/5 p-[12px] pb-[16px] rounded-[10px] flex flex-col gap-[4px] h-[76px] justify-center">
                  <p className="text-[16px] leading-[24px] text-white/60">RGB Theme</p>
                  <p className="text-[16px] leading-[24px]">Cool Blue - High Focus</p>
                </div>
                
                <div className="bg-white/5 p-[12px] pb-[16px] rounded-[10px] flex flex-col gap-[4px] h-[76px] justify-center">
                  <p className="text-[16px] leading-[24px] text-white/60">Lighting</p>
                  <p className="text-[16px] leading-[24px]">Daylight Mode</p>
                </div>
              </div>
            </div>

            {/* Session Notes */}
            <div className="p-[24.8px] bg-white/5 border-[0.8px] border-white/10 rounded-[16px] flex flex-col gap-[16px]">
              <h3 className="text-[20px] leading-[28px]">Session Notes</h3>
              
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this session..."
                className="w-full h-[121.6px] bg-white/5 border-[0.8px] border-white/10 rounded-[14px] p-4 text-[16px] leading-[24px] text-white placeholder:text-white/50 focus:outline-none focus:border-[#2B7FFF]/40 resize-none"
              />
              
              <button className="w-full h-[41.6px] bg-[#2B7FFF]/20 border-[0.8px] border-[#2B7FFF]/40 rounded-[10px] text-[#51A2FF] text-[16px] leading-[24px] hover:bg-[#2B7FFF]/30 transition-all font-arimo">
                Save Notes
              </button>
            </div>
          </div>
        </div>

        {/* Materials Studied */}
        <div className="p-[24.8px] bg-white/5 border-[0.8px] border-white/10 rounded-[16px] flex flex-col gap-[24px]">
          <h2 className="text-[24px] leading-[32px]">Materials Studied</h2>
          
          <div className="flex gap-[16px]">
            {materials.map((material, index) => (
              <div key={index} className="flex-1 bg-white/5 border-[0.8px] border-white/10 rounded-[14px] p-[16.8px] flex flex-col gap-[12px]">
                <div className="flex items-center gap-[12px] h-[48px]">
                  <div className="w-[40px] h-[40px] bg-[#2B7FFF]/20 rounded-[10px] flex items-center justify-center shrink-0">
                      <span className="text-[20px]">{material.icon}</span>
                  </div>
                  <div className="flex flex-col h-[44px] justify-center">
                    <p className="text-[16px] leading-[24px]">{material.subject}</p>
                    <p className="text-[14px] leading-[20px] text-white/60">{material.pages}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[14px] leading-[20px]">
                  <span className="text-white/60">Study Time</span>
                  <span className="text-[#51A2FF]">{material.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}