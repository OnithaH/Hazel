"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Activity,
  Clock,
  Heart,
  Twitter,
  Github,
  Linkedin,
  Mail
} from 'lucide-react';

export default function DashboardPage() {
  const [timer, setTimer] = useState(9255); // Starting around 2:34:15
  const [userProfile, setUserProfile] = useState<{ name: string | null; weekly_study_goal: number } | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([
          fetch('/api/user/profile'),
          fetch('/api/user/stats/mode-usage')
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setUserProfile(profileData);
        }
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Derive activities from stats
  const activities = React.useMemo(() => {
    if (!stats) return [
      { label: 'Study', percent: 0, colorClass: 'bg-blue-500', width: '0%' },
      { label: 'Gaming', percent: 0, colorClass: 'bg-purple-500', width: '0%' },
      { label: 'Music', percent: 0, colorClass: 'bg-pink-500', width: '0%' },
      { label: 'General', percent: 0, colorClass: 'bg-green-500', width: '0%' },
    ];

    const modeTotals: Record<string, number> = { Study: 0, Gaming: 0, Music: 0, General: 0 };
    let grandTotal = 0;

    stats.weeklyAnalysis.forEach((day: any) => {
      day.segments.forEach((seg: any) => {
        if (modeTotals[seg.label] !== undefined) {
          modeTotals[seg.label] += seg.value;
          grandTotal += seg.value;
        }
      });
    });

    return Object.entries(modeTotals).map(([label, value]) => {
      const colors: Record<string, string> = {
        Study: 'bg-blue-500',
        Gaming: 'bg-purple-500',
        Music: 'bg-pink-500',
        General: 'bg-green-500'
      };
      const percent = grandTotal > 0 ? Math.round((value / grandTotal) * 100) : 0;
      return {
        label,
        percent,
        colorClass: colors[label],
        width: `${percent}%`
      };
    });
  }, [stats]);

  // Derive weeklyData from stats
  const weeklyData = React.useMemo(() => {
    if (!stats) return [];

    return stats.weeklyAnalysis.map((day: any) => {
      const totalMins = day.segments.reduce((acc: number, s: any) => acc + s.value, 0);
      return {
        day: day.day,
        total: day.total,
        segments: day.segments.map((s: any) => ({
          color: s.color,
          w: totalMins > 0 ? (s.value / totalMins) * 100 : 0
        }))
      };
    });
  }, [stats]);

  return (
    <div className="min-h-screen bg-[#07080A] text-white font-sans selection:bg-blue-500/30">

      <main className="max-w-[1240px] mx-auto mt-10 px-8">
        {/* Header */}
        <div className="mb-8 pl-1">
          <h1 className="text-3xl font-medium mb-3">Welcome Back, {userProfile?.name || "User"}</h1>
          <p className="text-white/40 text-sm">Here's what's happening with Hazel today</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column (Wider) */}
          <div className="lg:col-span-2 bg-[#12141C] border border-white/5 rounded-2xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-medium">Today's Session Breakdown</h2>
              <span className="px-4 py-1.5 bg-[#1e293b]/50 text-blue-400 text-xs font-medium rounded-full">In Progress</span>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center py-16 relative bg-[#1A1D27] rounded-xl mb-10 overflow-hidden">
              <div className="text-6xl font-light tracking-wider mb-2">{formatTime(timer)}</div>
              <div className="text-white/40 text-xs">Time Elapsed</div>
              <div className="absolute w-full bottom-0 left-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            </div>

            <div>
              <h3 className="text-xs font-medium text-white/80 mb-5">Today's Activity Breakdown</h3>
              <div className="space-y-4">
                {activities.map((act) => (
                  <div className="flex items-center gap-4 text-sm" key={act.label}>
                    <div className="flex-1 h-7 bg-[#1A1D27] rounded-md overflow-hidden">
                      <div className={`h-full ${act.colorClass} opacity-90`} style={{ width: act.width }}></div>
                    </div>
                    <div className="w-24 text-white/40 text-[11px] leading-tight flex flex-col justify-center">
                      <span>{act.label} {act.percent}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Weekly Goal */}
            <div className="bg-[#12141D] border border-orange-500/10 rounded-2xl p-6 relative overflow-hidden flex-[1] flex flex-col min-h-[160px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="text-orange-400" size={16} />
                  <span className="text-xs font-medium text-white/80">Weekly Goal</span>
                </div>
                <div className="text-[28px] font-medium mb-1">
                  {stats?.totals?.study?.split('h')[0] || 0}/{userProfile?.weekly_study_goal || 30}
                </div>
                <div className="text-xs text-white/40 mb-5">Hours completed</div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mt-6">
                  <div className="h-full bg-orange-500 w-[80%] rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                </div>
              </div>
            </div>

            {/* Environment */}
            <div className="bg-[#12141D] border border-cyan-500/10 rounded-2xl p-6 relative overflow-hidden flex-[1.2]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
              <div className="relative h-full flex flex-col">
                <div className="flex items-center gap-2 mb-5">
                  <Activity className="text-cyan-400" size={16} />
                  <span className="text-xs font-medium text-white/80">Environment</span>
                </div>
                <div className="space-y-2 mt-auto">
                  <div className="flex justify-between items-center text-xs bg-[#1A1D27] px-4 py-2.5 rounded flex-1">
                    <span className="text-white/40">Lighting</span>
                    <span className="text-cyan-400 font-medium tracking-wide">Optimal</span>
                  </div>
                  <div className="flex justify-between items-center text-xs bg-[#1A1D27] px-4 py-2.5 rounded flex-1">
                    <span className="text-white/40">Aroma</span>
                    <span className="text-cyan-400 font-medium tracking-wide">Peppermint</span>
                  </div>
                  <div className="flex justify-between items-center text-xs bg-[#1A1D27] px-4 py-2.5 rounded flex-1">
                    <span className="text-white/40">Audio</span>
                    <span className="text-cyan-400 font-medium tracking-wide">Shield On</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Focus Time */}
            <div className="bg-[#12141D] border border-blue-500/10 rounded-2xl p-6 relative overflow-hidden flex-[0.8] flex flex-col justify-between min-h-[140px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
              <div className="relative flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="text-blue-400" size={16} />
                </div>
                <span className="text-xs text-blue-400 font-medium">Today</span>
              </div>
              <div className="relative mt-auto">
                <div className="text-[28px] font-medium mb-1">{stats?.totals?.study || '0h 0m'}</div>
                <div className="text-xs text-white/40">Focus Time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Overview */}
        <div className="bg-[#12141C] border border-white/5 rounded-2xl p-8 mb-16">
          <h2 className="text-base font-medium mb-8">Weekly Overview</h2>
          <div className="space-y-4">
            {weeklyData.map((data: any) => (
              <div key={data.day} className="flex items-center gap-6 text-xs">
                <div className="w-8 text-white/40 font-medium">{data.day}</div>
                <div className="flex-1 h-8 bg-[#1A1D27] rounded-md overflow-hidden flex">
                  {data.segments.map((seg: any, idx: number) => (
                    <div key={idx} className={`h-full ${seg.color} opacity-90`} style={{ width: `${seg.w}%` }}></div>
                  ))}
                </div>
                <div className="w-8 text-right text-white/40 font-medium">{data.total}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-8 mt-10">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
              <span className="text-xs text-white/40">Study</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
              <span className="text-xs text-white/40">Gaming</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-pink-500"></div>
              <span className="text-xs text-white/40">Music</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              <span className="text-xs text-white/40">General</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0A0C10] pt-16 pb-8 mt-auto">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#A855F7] flex items-center justify-center text-white text-sm font-bold">H</div>
                <span className="text-white font-semibold tracking-widest text-sm">Hazel</span>
              </div>
              <p className="text-white/40 text-[11px] leading-relaxed pr-4 mb-4">
                Your intelligent companion robot for study, gaming, music, and everyday life.
              </p>
              <p className="text-white/40 text-[11px] flex items-center gap-1.5">
                Made with <Heart size={10} className="text-red-500" fill="currentColor" /> by the Hazel Team
              </p>
            </div>

            <div className="pl-4">
              <h4 className="text-white/80 font-medium mb-6 text-[13px]">Product</h4>
              <ul className="space-y-4 text-white/40 text-[11px]">
                <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Modes</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>

            <div className="pl-4">
              <h4 className="text-white/80 font-medium mb-6 text-[13px]">Company</h4>
              <ul className="space-y-4 text-white/40 text-[11px]">
                <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Press Kit</Link></li>
              </ul>
            </div>

            <div className="pl-4">
              <h4 className="text-white/80 font-medium mb-6 text-[13px]">Support</h4>
              <ul className="space-y-4 text-white/40 text-[11px]">
                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Community</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-[10px] text-white/20 pt-8 border-t border-white/5 gap-4">
            <div>© 2025 Hazel. All rights reserved.</div>
            <div className="flex gap-6">
              <Twitter size={14} className="hover:text-white transition-colors cursor-pointer" />
              <Github size={14} className="hover:text-white transition-colors cursor-pointer" />
              <Linkedin size={14} className="hover:text-white transition-colors cursor-pointer" />
              <Mail size={14} className="hover:text-white transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}