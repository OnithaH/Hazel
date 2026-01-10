'use client';

import React, { useState } from 'react';
import { MessageSquare, Thermometer, Droplets, Lightbulb, Sparkles, Bell, Clock, X, Send, Plus } from 'lucide-react';

export default function Page() {
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showFragranceModal, setShowFragranceModal] = useState(false);
  const [selectedReminderType, setSelectedReminderType] = useState('Task');

  const fragrances = [
    {
      name: 'Citrus Blend',
      description: 'Fresh and energizing',
      intensity: 75,
      color: '#F0B100',
      colorName: 'yellow tone',
      active: true
    },
    {
      name: 'Lavender',
      description: 'Calming and relaxing',
      intensity: 60,
      color: '#AD46FF',
      colorName: 'purple tone'
    },
    {
      name: 'Peppermint',
      description: 'Sharp and refreshing',
      intensity: 80,
      color: '#00C950',
      colorName: 'green tone'
    },
    {
      name: 'Vanilla',
      description: 'Warm and comforting',
      intensity: 50,
      color: '#FF8904',
      colorName: 'orange tone'
    },
    {
      name: 'Eucalyptus',
      description: 'Clear and invigorating',
      intensity: 70,
      color: '#00D3F2',
      colorName: 'teal tone'
    },
    {
      name: 'Rose',
      description: 'Floral and elegant',
      intensity: 55,
      color: '#F6339A',
      colorName: 'pink tone'
    }
  ];

  const reminders = [
    {
      title: 'Team Meeting',
      time: 'Today, 4:00 PM',
      type: 'Meeting',
      color: 'bg-blue-500/20 text-blue-400'
    },
    {
      title: 'Submit Assignment',
      time: 'Tomorrow, 11:59 PM',
      type: 'Task',
      color: 'bg-purple-500/20 text-purple-400'
    },
    {
      title: 'Call Mom',
      time: 'Today, 7:00 PM',
      type: 'Personal',
      color: 'bg-pink-500/20 text-pink-400'
    }
  ];

  const quickActions = [
    { icon: <Bell className="w-4 h-4 text-green-400" />, label: 'Set Reminder' },
    { icon: <Clock className="w-4 h-4 text-blue-400" />, label: 'Check Schedule' },
    { icon: <Lightbulb className="w-4 h-4 text-yellow-400" />, label: 'Adjust Lighting' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-normal mb-2">General Mode</h1>
            <p className="text-white/60">Natural conversations and smart reminders</p>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-green-500/20 border border-green-500/40 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full opacity-70" />
            <span>Hazel Online</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center">
                  <Thermometer className="w-7 h-7 text-orange-400" />
                </div>
                <div>
                  <p className="text-white/60 mb-1">Temperature</p>
                  <p className="text-3xl">72°F</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-sm mb-1">Status</p>
                <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">Optimal</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-cyan-500/20 border border-cyan-500/30 rounded-2xl flex items-center justify-center">
                  <Droplets className="w-7 h-7 text-cyan-400" />
                </div>
                <div>
                  <p className="text-white/60 mb-1">Humidity</p>
                  <p className="text-3xl">45%</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-sm mb-1">Status</p>
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">Comfortable</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Chat Section */}
          <div className="col-span-2 p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-3xl">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl">Chat with Hazel</h2>
            </div>

            <div className="space-y-4 mb-6">
              {/* Hazel Message */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-base">H</span>
                </div>
                <div className="flex-1">
                  <p className="text-white/60 text-sm mb-1">Hazel</p>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl rounded-tl-none">
                    <p>Hello! I'm here to help you with anything you need. How can I assist you today?</p>
                  </div>
                </div>
              </div>

              {/* User Message */}
              <div className="flex items-start gap-3 justify-end">
                <div className="flex-1 text-right">
                  <p className="text-white/60 text-sm mb-1">You</p>
                  <div className="inline-block p-4 bg-gradient-to-br from-green-500/20 to-green-500/10 border border-green-500/20 rounded-2xl rounded-tr-none">
                    <p className="text-right">What's the weather like today?</p>
                  </div>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-base">U</span>
                </div>
              </div>

              {/* Hazel Response */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-base">H</span>
                </div>
                <div className="flex-1">
                  <p className="text-white/60 text-sm mb-1">Hazel</p>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl rounded-tl-none">
                    <p>It's a pleasant day! The temperature is 72°F with partly cloudy skies. I've adjusted the ambient lighting to match the mood. ☀️</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Type your message..."
                className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-green-500/50"
              />
              <button className="absolute right-2 top-2 w-10 h-10 bg-green-500/20 border border-green-500/40 rounded-lg flex items-center justify-center hover:bg-green-500/30 transition">
                <Send className="w-4 h-4 text-green-400" />
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Mood Lighting */}
            <div className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-5 h-5 text-blue-400" />
                <h3 className="text-base">Mood Lighting</h3>
              </div>
              <p className="text-white/60 text-sm mb-4">Adaptive circadian rhythm</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/60 text-sm">Time</span>
                  <span className="text-sm">2:30 PM</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white/60 text-sm">Weather</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">☁️ Cloudy</span>
                  </div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-white/60 text-sm mb-2">Current Theme</p>
                  <div className="h-8 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 rounded-lg" />
                </div>
              </div>
            </div>

            {/* Aroma Status */}
            <div className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="text-base">Aroma Status</h3>
              </div>
              <p className="text-white/60 text-sm mb-4">Environmental integration</p>
              
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <p className="text-white/60 text-sm mb-2">Active Scent</p>
                <p className="text-xl mb-3">Citrus Blend</p>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 opacity-70 rounded-full" style={{ width: '75%' }} />
                  </div>
                  <span className="text-purple-400 text-xs ml-2">Active</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <h3 className="text-base mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition text-left"
                  >
                    {action.icon}
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reminders Section */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl">Reminders</h2>
            <button
              onClick={() => setShowReminderModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/40 text-green-400 rounded-lg hover:bg-green-500/30 transition"
            >
              <Plus className="w-4 h-4" />
              Add Reminder
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {reminders.map((reminder, index) => (
              <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base">{reminder.title}</h3>
                  <Bell className="w-4 h-4 text-white/40" />
                </div>
                <p className="text-white/60 text-sm mb-3">{reminder.time}</p>
                <span className={`inline-block px-3 py-1 ${reminder.color} rounded-full text-xs`}>
                  {reminder.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Aroma Section */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl">Aroma</h2>
            </div>
            <button
              onClick={() => setShowFragranceModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/40 text-purple-400 rounded-lg hover:bg-purple-500/30 transition"
            >
              <Plus className="w-4 h-4" />
              Add Fragrance
            </button>
          </div>

          <p className="text-white/60 mb-6">Select and customize your environmental scents</p>

          <div className="grid grid-cols-3 gap-4">
            {fragrances.map((fragrance, index) => (
              <div
                key={index}
                className={`p-5 rounded-xl border ${
                  fragrance.active
                    ? 'bg-purple-500/20 border-purple-500/40'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-base mb-1">{fragrance.name}</h3>
                    <p className="text-sm text-white/60">{fragrance.description}</p>
                  </div>
                  {fragrance.active && (
                    <div className="w-3 h-3 bg-purple-500 rounded-full opacity-70" />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Intensity</span>
                    <span className="text-white/60">{fragrance.intensity}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{ width: `${fragrance.intensity}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: fragrance.color }}
                    />
                    <span className="text-xs text-white/60 capitalize">{fragrance.colorName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl p-6 relative">
            <button
              onClick={() => setShowReminderModal(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl mb-2">Add New Reminder</h2>
              <p className="text-white/60">Set up a reminder for Hazel to notify you</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-white/60 mb-2">Title *</label>
                <input
                  type="text"
                  placeholder="Enter reminder title"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-green-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Date *</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-green-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Time *</label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-green-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Type *</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Meeting', 'Task', 'Personal'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedReminderType(type)}
                      className={`py-3 rounded-xl border transition ${
                        selectedReminderType === type
                          ? 'bg-green-500/20 border-green-500/40 text-green-400'
                          : 'bg-white/5 border-white/10 text-white/60'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Description (Optional)</label>
                <textarea
                  placeholder="Add any additional details..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-green-500/50 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReminderModal(false)}
                className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 transition">
                Add Reminder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Fragrance Modal */}
      {showFragranceModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl p-6 relative">
            <button
              onClick={() => setShowFragranceModal(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl mb-2">Add New Fragrance</h2>
              <p className="text-white/60">Create a new scent for your environment</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-white/60 mb-2">Name *</label>
                <input
                  type="text"
                  placeholder="Enter fragrance name"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Description *</label>
                <input
                  type="text"
                  placeholder="Enter fragrance description"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Color *</label>
                <input
                  type="text"
                  placeholder="purple"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Intensity *</label>
                <input
                  type="number"
                  placeholder="70"
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFragranceModal(false)}
                className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 transition">
                Add Fragrance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}