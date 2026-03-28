'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Thermometer, Droplets, Lightbulb, Sparkles, Bell, Clock, X, Send, Plus, Loader2 } from 'lucide-react';
import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Page() {
  // --- State ---
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showFragranceModal, setShowFragranceModal] = useState(false);
  const [selectedReminderType, setSelectedReminderType] = useState('Task');
  
  // Chat State
  const [chatMessages, setChatMessages] = useState([
    { text: "Hello! I'm here to help you with anything you need. How can I assist you today?", hazel: true, timestamp: new Date().toISOString() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Form State
  const [reminderForm, setReminderForm] = useState({ title: '', date: '', time: '', description: '' });
  const [fragranceForm, setFragranceForm] = useState({ name: '', description: '', color: '', intensity: 75, chamber: 1 });

  // --- Data Fetching ---
  const { data: robot, error: robotError } = useSWR('/api/user/robot', fetcher);
  const robotId = robot?.id;

  const { data: envData } = useSWR(robotId ? `/api/environment/current?robotId=${robotId}` : null, fetcher, { refreshInterval: 5000 });
  const { data: remindersData } = useSWR(robotId ? `/api/reminders?robotId=${robotId}` : null, fetcher);
  const { data: aromaData } = useSWR(robotId ? `/api/aroma?robotId=${robotId}` : null, fetcher);

  // Sync Mode on Mount
  useEffect(() => {
    if (robotId) {
      fetch('/api/robot/mode', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'GENERAL' }),
      });
    }
  }, [robotId]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // --- Handlers ---
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = { text: inputMessage, hazel: false, timestamp: new Date().toISOString() };
    setChatMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/hazel-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputMessage }),
      });
      const data = await response.json();
      setChatMessages(prev => [...prev, { text: data.message, hazel: true, timestamp: data.timestamp }]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAddReminder = async () => {
    if (!reminderForm.title || !reminderForm.date) return;

    try {
      await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          robotId,
          title: reminderForm.title,
          date: reminderForm.date,
          time: reminderForm.time,
          type: selectedReminderType,
        }),
      });
      mutate(robotId ? `/api/reminders?robotId=${robotId}` : null);
      setShowReminderModal(false);
      setReminderForm({ title: '', date: '', time: '', description: '' });
    } catch (error) {
      console.error('Add reminder error:', error);
    }
  };

  const handleAddFragrance = async () => {
    if (!fragranceForm.name) return;

    try {
      await fetch('/api/aroma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          robotId,
          chamber_number: fragranceForm.chamber,
          scent_name: fragranceForm.name,
          intensity: fragranceForm.intensity,
          color_hex: fragranceForm.color || '#AD46FF',
        }),
      });
      mutate(robotId ? `/api/aroma?robotId=${robotId}` : null);
      setShowFragranceModal(false);
      setFragranceForm({ name: '', description: '', color: '', intensity: 75, chamber: 1 });
    } catch (error) {
      console.error('Add fragrance error:', error);
    }
  };

  const toggleAroma = async (id: string, active: boolean) => {
    try {
      await fetch(`/api/aroma/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !active }),
      });
      mutate(robotId ? `/api/aroma?robotId=${robotId}` : null);
    } catch (error) {
      console.error('Toggle aroma error:', error);
    }
  };

  if (!robot && !robotError) {
    return (
      <div className="min-h-screen bg-[#07080A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
          <p className="text-white/40 text-sm animate-pulse">Synchronizing with Hazel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07080A] via-[#0D0F1A] to-[#07080A] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div>
            <h1 className="text-4xl font-normal mb-2 tracking-tight">General Mode</h1>
            <p className="text-white/40">Natural conversations and smart environment control</p>
          </div>
          <div className={`flex items-center gap-3 px-6 py-3 ${robotId ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'} border rounded-full transition-all duration-500 shadow-lg shadow-black`}>
            <div className={`w-2 h-2 ${robotId ? 'bg-green-500 animate-pulse' : 'bg-red-500'} rounded-full`} />
            <span className="text-sm font-medium tracking-wide">{robot ? `${robot.name} Active` : 'Robot Offline'}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8 animate-in fade-in zoom-in-95 duration-700 delay-100">
          <div className="p-7 bg-[#12141C] border border-white/5 rounded-3xl relative overflow-hidden group hover:border-orange-500/30 transition-all duration-500 shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:bg-orange-500/10 transition-all" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Thermometer className="w-8 h-8 text-orange-400" />
                </div>
                <div>
                  <p className="text-white/40 text-sm mb-1 font-medium tracking-wide uppercase">Temperature</p>
                  <p className="text-4xl font-light">{envData?.temperature ? `${envData.temperature}°C` : '--°C'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mb-2">Environment</p>
                <span className={`px-4 py-1.5 ${envData?.temperature > 25 ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'} rounded-full text-xs font-bold uppercase tracking-wider border border-white/5`}>
                  {envData?.temperature > 25 ? 'Warm' : 'Optimal'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-7 bg-[#12141C] border border-white/5 rounded-3xl relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-500 shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:bg-cyan-500/10 transition-all" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Droplets className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                  <p className="text-white/40 text-sm mb-1 font-medium tracking-wide uppercase">Humidity</p>
                  <p className="text-4xl font-light">{envData?.humidity ? `${envData.humidity}%` : '--%'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mb-2">Saturation</p>
                <span className={`px-4 py-1.5 ${envData?.humidity > 60 ? 'bg-blue-500/20 text-blue-400' : 'bg-cyan-500/20 text-cyan-400'} rounded-full text-xs font-bold uppercase tracking-wider border border-white/5`}>
                  {envData?.humidity > 60 ? 'Humid' : 'Comfortable'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Chat Section */}
          <div className="col-span-2 p-8 bg-[#12141C] border border-white/5 rounded-[40px] flex flex-col h-[650px] shadow-2xl animate-in fade-in slide-in-from-left-4 duration-700 delay-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-green-500/5 to-transparent pointer-events-none" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-2xl border border-green-500/20">
                  <MessageSquare className="w-7 h-7 text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-normal tracking-tight">Chat with Hazel</h2>
                  <p className="text-white/30 text-xs">AI Assistant active</p>
                </div>
              </div>
              <div className="flex gap-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              </div>
            </div>

            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto space-y-6 mb-8 custom-scrollbar pr-2 relative z-10 scroll-smooth"
            >
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex items-start gap-4 ${msg.hazel ? '' : 'flex-row-reverse animate-in slide-in-from-right-2'}`}>
                  {msg.hazel && (
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/30 border border-green-500/30 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group">
                      <Loader2 className="w-6 h-6 text-green-400 opacity-0 group-hover:opacity-100 absolute animate-spin transition-opacity" />
                      <span className="text-lg font-light text-green-400 group-hover:opacity-0 transition-opacity">H</span>
                    </div>
                  )}
                  <div className={`max-w-[80%] ${msg.hazel ? '' : 'text-right'}`}>
                    <div className={`p-5 rounded-3xl backdrop-blur-md shadow-xl border ${
                      msg.hazel 
                        ? 'bg-white/5 border-white/10 rounded-tl-sm' 
                        : 'bg-green-500 border-green-400/30 rounded-tr-sm text-white'
                    }`}>
                      <p className="text-sm leading-relaxed font-light">{msg.text}</p>
                    </div>
                    <p className="mt-2 text-[10px] text-white/20 font-medium uppercase tracking-tighter">
                       {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {!msg.hazel && (
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-light text-white/40">U</span>
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start gap-4 animate-in fade-in duration-300">
                  <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse">
                    <span className="text-lg font-light text-green-400">H</span>
                  </div>
                  <div className="p-5 bg-white/5 border border-white/10 rounded-3xl rounded-tl-sm backdrop-blur-md">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-green-400/40 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-green-400/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-green-400/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Overlay */}
            <div className="relative z-10 p-1 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Message Hazel..."
                className="w-full px-8 py-5 bg-transparent text-white placeholder:text-white/20 focus:outline-none transition-all font-light"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="absolute right-3 top-2.5 w-11 h-11 bg-green-500 text-black rounded-[18px] flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-30 disabled:grayscale transition-all shadow-lg shadow-green-500/30"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
            {/* Mood Lighting */}
            <div className="p-8 bg-[#12141C] border border-white/5 rounded-[40px] shadow-2xl group hover:border-blue-500/20 transition-colors duration-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 group-hover:scale-110 transition-transform">
                  <Lightbulb className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-medium tracking-tight">Mood Lighting</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                  <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Local Time</span>
                  <span className="text-sm font-mono text-blue-400 font-bold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                  <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Atmosphere</span>
                  <span className="text-sm font-medium">☀️ Clear Sky</span>
                </div>
                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                  <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mb-3">Adaptive Theme</p>
                  <div className="h-10 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 rounded-xl shadow-inner group-hover:hue-rotate-15 transition-all duration-1000" />
                </div>
              </div>
            </div>

            {/* Aroma Pulse */}
            <div className="p-8 bg-[#12141C] border border-white/5 rounded-[40px] shadow-2xl relative overflow-hidden group hover:border-purple-500/20 transition-colors duration-500">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/5 blur-3xl rounded-full group-hover:bg-purple-500/10" />
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-medium tracking-tight">Active Scent</h3>
              </div>
              
              {aromaData && aromaData.length > 0 && aromaData.some((a:any) => a.isActive) ? (
                <div className="space-y-6 relative z-10">
                  {aromaData.filter((a: any) => a.isActive).slice(0, 1).map((a: any) => (
                    <div key={a.id}>
                      <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mb-2">Currently Diffusing</p>
                      <h4 className="text-3xl font-light mb-5 tracking-tight">{a.scent_name}</h4>
                      <div className="flex items-center justify-between mb-3 text-[10px] font-bold uppercase tracking-widest text-purple-400">
                        <span>Intensity Output</span>
                        <span>{a.intensity}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all duration-1000" style={{ width: `${a.intensity}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center bg-white/5 border border-dashed border-white/10 rounded-2xl relative z-10">
                   <p className="text-white/20 text-xs font-medium italic">Diffusion in Standby</p>
                </div>
              )}
            </div>

            {/* Control Pod */}
            <div className="p-8 bg-[#12141C] border border-white/5 rounded-[40px] shadow-2xl">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-white/30">System Controls</h3>
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => setShowReminderModal(true)}
                  className="w-full flex items-center justify-between p-5 bg-white/5 rounded-[24px] hover:bg-white/10 border border-white/5 transition-all text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-500/10 rounded-xl group-hover:bg-green-500/20 transition-colors">
                      <Bell className="w-5 h-4 text-green-400" />
                    </div>
                    <span className="text-sm font-medium">Set Reminder</span>
                  </div>
                  <Plus className="w-4 h-4 text-white/10 group-hover:text-white/40 transition-colors" />
                </button>
                <button 
                   onClick={() => setShowFragranceModal(true)}
                  className="w-full flex items-center justify-between p-5 bg-white/5 rounded-[24px] hover:bg-white/10 border border-white/5 transition-all text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                      <Sparkles className="w-5 h-4 text-purple-400" />
                    </div>
                    <span className="text-sm font-medium">Add Fragrance</span>
                  </div>
                  <Plus className="w-4 h-4 text-white/10 group-hover:text-white/40 transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Lists Sections */}
        <div className="grid grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-700 delay-500 mb-16">
          {/* Reminders Grid */}
          <div className="col-span-2 p-10 bg-[#12141C] border border-white/5 rounded-[48px] shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-green-500/5 blur-[100px] rounded-full group-hover:bg-green-500/10 transition-all pointer-events-none" />
            
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-green-500/10 rounded-[20px] border border-green-500/20">
                  <Bell className="w-7 h-7 text-green-400" />
                </div>
                <div>
                   <h2 className="text-3xl font-normal tracking-tight">Active Reminders</h2>
                   <p className="text-white/30 text-xs font-medium uppercase tracking-widest mt-1">Notification Queue</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
              {remindersData?.map((reminder: any) => (
                <div key={reminder.id} className="p-7 bg-[#1A1D27] border border-white/5 rounded-3xl hover:border-green-500/20 transition-all duration-500 group/item hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-medium mb-1">{reminder.title}</h3>
                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider">{reminder.type}</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${
                      reminder.type === 'Meeting' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                      reminder.type === 'Task' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                      'bg-pink-500/10 text-pink-400 border-pink-500/20'
                    }`}>
                      {reminder.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-white/40 text-[11px] font-medium p-3 bg-black/20 rounded-xl">
                    <Clock className="w-3.5 h-3.5 opacity-50" />
                    <span>{new Date(reminder.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at {reminder.time}</span>
                  </div>
                </div>
              ))}
              {(!remindersData || remindersData.length === 0) && (
                <div className="col-span-2 py-20 flex flex-col items-center justify-center bg-white/5 border-2 border-dashed border-white/5 rounded-[32px] transition-colors group/empty">
                  <div className="p-5 bg-white/5 rounded-full mb-6 group-hover/empty:scale-110 transition-transform">
                    <Bell className="w-10 h-10 text-white/10" />
                  </div>
                  <p className="text-white/20 text-sm font-medium tracking-wide">No active reminders in queue</p>
                </div>
              )}
            </div>
          </div>

          {/* Aroma Collection */}
          <div className="p-10 bg-[#12141C] border border-white/5 rounded-[48px] shadow-2xl relative overflow-hidden group">
             <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/5 blur-[100px] rounded-full group-hover:bg-purple-500/10 transition-all pointer-events-none" />
             
             <div className="flex flex-col mb-10 relative z-10">
                <div className="p-4 bg-purple-500/10 rounded-[20px] border border-purple-500/20 w-fit mb-5">
                  <Sparkles className="w-7 h-7 text-purple-400" />
                </div>
                <h2 className="text-3xl font-normal tracking-tight">Collection</h2>
                <p className="text-white/30 text-xs font-medium uppercase tracking-widest mt-1">Multi-Scent Engine</p>
             </div>

             <div className="space-y-4 relative z-10">
                {aromaData?.map((fragrance: any) => (
                  <button
                    key={fragrance.id}
                    onClick={() => toggleAroma(fragrance.id, fragrance.isActive)}
                    className={`w-full p-6 space-y-5 rounded-[32px] border transition-all duration-500 text-left group/aroma ${
                      fragrance.isActive
                        ? 'bg-purple-500/10 border-purple-500/30 shadow-[0_10px_30px_rgba(168,85,247,0.1)]'
                        : 'bg-white/5 border-white/5 grayscale opacity-60 hover:opacity-100 hover:grayscale-0'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                       <h3 className="text-lg font-medium">{fragrance.scent_name}</h3>
                       <div className={`w-3 h-3 rounded-full ${fragrance.isActive ? 'bg-purple-400 animate-pulse' : 'bg-white/10'}`} />
                    </div>
                    
                    <div className="flex items-center gap-3">
                       <div className="h-1 flex-1 bg-black/20 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-1000 ${fragrance.isActive ? 'bg-purple-500' : 'bg-white/20'}`} style={{ width: `${fragrance.intensity}%` }} />
                       </div>
                       <span className={`text-[10px] font-bold ${fragrance.isActive ? 'text-purple-400' : 'text-white/20'}`}>{fragrance.intensity}%</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-[10px] text-white/30 font-bold uppercase tracking-widest">
                       <span>Chamber {fragrance.chamber_number}</span>
                       <div className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: fragrance.color_hex }} />
                    </div>
                  </button>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* --- Modals (Keep them unchanged but apply 2026 aesthetics) --- */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-xl bg-[#12141C] border border-white/10 rounded-[48px] p-10 relative shadow-[0_0_100px_rgba(34,197,94,0.1)] overflow-hidden">
            <button onClick={() => setShowReminderModal(false)} className="absolute top-8 right-8 p-3 bg-white/5 rounded-2xl hover:bg-white/10 border border-white/5 transition-all text-white/40">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-4xl font-light mb-2 tracking-tight">New Reminder</h2>
            <p className="text-white/30 text-sm mb-10">Define a new task for Hazel to monitor</p>

            <div className="space-y-8">
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-2">Objective</label>
                  <input type="text" value={reminderForm.title} onChange={(e) => setReminderForm({ ...reminderForm, title: e.target.value })} placeholder="Title of your reminder" 
                  className="w-full px-8 py-5 bg-[#0A0B10] border border-white/5 rounded-[24px] text-white placeholder:text-white/10 focus:outline-none focus:border-green-500/30 transition-all font-light" />
               </div>
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-2">Date</label>
                    <input type="date" value={reminderForm.date} onChange={(e) => setReminderForm({ ...reminderForm, date: e.target.value })} 
                    className="w-full px-8 py-5 bg-[#0A0B10] border border-white/5 rounded-[24px] text-white focus:outline-none focus:border-green-500/30 transition-all font-light invert-calendar-icon" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-2">Time</label>
                    <input type="time" value={reminderForm.time} onChange={(e) => setReminderForm({ ...reminderForm, time: e.target.value })} 
                    className="w-full px-8 py-5 bg-[#0A0B10] border border-white/5 rounded-[24px] text-white focus:outline-none focus:border-green-500/30 transition-all font-light invert-calendar-icon" />
                  </div>
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-2">Classification</label>
                  <div className="flex gap-3">
                    {['Meeting', 'Task', 'Personal'].map(type => (
                      <button key={type} onClick={() => setSelectedReminderType(type)} 
                      className={`flex-1 py-4 rounded-2xl border text-xs font-bold uppercase tracking-[0.2em] transition-all ${selectedReminderType === type ? 'bg-green-500 text-black border-green-400' : 'bg-white/5 border-white/5 text-white/20 hover:bg-white/10'}`}>
                        {type}
                      </button>
                    ))}
                  </div>
               </div>
            </div>
            
            <button onClick={handleAddReminder} disabled={!reminderForm.title || !reminderForm.date}
            className="w-full mt-12 py-6 bg-green-500 text-black rounded-[28px] font-black uppercase tracking-[0.3em] text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-20 shadow-2xl shadow-green-500/20">
              Finalize Reminder
            </button>
          </div>
        </div>
      )}

      {showFragranceModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
           <div className="w-full max-w-xl bg-[#12141C] border border-white/10 rounded-[48px] p-10 relative shadow-[0_0_100px_rgba(168,85,247,0.1)] overflow-hidden">
             <button onClick={() => setShowFragranceModal(false)} className="absolute top-8 right-8 p-3 bg-white/5 rounded-2xl hover:bg-white/10 border border-white/5 transition-all text-white/40">
                <X className="w-6 h-6" />
             </button>
             <h2 className="text-4xl font-light mb-2 tracking-tight">Fragrance Engine</h2>
             <p className="text-white/30 text-sm mb-10">Calibrate a new olfactory profile</p>

             <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-2">Scent Name</label>
                      <input type="text" value={fragranceForm.name} onChange={(e) => setFragranceForm({...fragranceForm, name: e.target.value})} placeholder="Peppermint" 
                      className="w-full px-8 py-5 bg-[#0A0B10] border border-white/5 rounded-[24px] text-white placeholder:text-white/10 focus:outline-none focus:border-purple-500/30 transition-all font-light" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-2">Diffuser Port</label>
                      <select value={fragranceForm.chamber} onChange={(e) => setFragranceForm({...fragranceForm, chamber: parseInt(e.target.value)})} 
                      className="w-full px-8 py-[22px] bg-[#0A0B10] border border-white/5 rounded-[24px] text-white focus:outline-none focus:border-purple-500/30 transition-all appearance-none font-light">
                        {[1,2,3,4].map(num => <option key={num} value={num}>Port Alpha-{num}</option>)}
                      </select>
                   </div>
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-2">Visual Mapping</label>
                   <div className="flex gap-4">
                      <input type="text" value={fragranceForm.color} onChange={(e) => setFragranceForm({...fragranceForm, color: e.target.value})} placeholder="#AD46FF" 
                      className="flex-1 px-8 py-5 bg-[#0A0B10] border border-white/5 rounded-[24px] text-white placeholder:text-white/10 focus:outline-none focus:border-purple-500/30 transition-all font-light" />
                      <div className="w-16 h-16 rounded-3xl border border-white/10 shadow-lg" style={{ backgroundColor: fragranceForm.color || '#AD46FF' }} />
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center ml-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Aromatic Intensity</label>
                       <span className="text-purple-400 font-bold text-sm">{fragranceForm.intensity}%</span>
                   </div>
                   <input type="range" min="0" max="100" value={fragranceForm.intensity} onChange={(e) => setFragranceForm({...fragranceForm, intensity: parseInt(e.target.value)})} 
                   className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-purple-500" />
                </div>
             </div>

             <button onClick={handleAddFragrance} disabled={!fragranceForm.name}
             className="w-full mt-12 py-6 bg-purple-500 text-black rounded-[28px] font-black uppercase tracking-[0.3em] text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-20 shadow-2xl shadow-purple-500/20">
               Initialize Synthesis
             </button>
           </div>
        </div>
      )}
    </div>
  );
}