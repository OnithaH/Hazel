"use client";

import React, { useState } from 'react';
import ProfileSettings from '@/components/settings/ProfileSettings';
import NotificationsSettings from '@/components/settings/NotificationsSettings';
import AppearanceSettings from '@/components/settings/AppearanceSettings';
import AudioSettings from '@/components/settings/AudioSettings';
import FocusTrackingSettings from '@/components/settings/FocusTrackingSettings';
import AromaPillarsSettings from '@/components/settings/AromaPillarsSettings';
import PrivacySecuritySettings from '@/components/settings/PrivacySecuritySettings';
import AboutSection from '@/components/settings/AboutSection';
import { Settings, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    const handleSave = () => {
        setSaveStatus('saving');

        // Simulate API save delay
        setTimeout(() => {
            setSaveStatus('saved');

            // Reset status after a few seconds
            setTimeout(() => {
                setSaveStatus('idle');
            }, 3000);
        }, 1500);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-purple-600/20 rounded-2xl border border-purple-500/30">
                    <Settings className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
                    <p className="text-gray-400 mt-1">Customize your Hazel experience</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
                {/* Left Column */}
                <div className="space-y-6">
                    <ProfileSettings />
                    <NotificationsSettings />
                    <AppearanceSettings />
                    <AudioSettings />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <FocusTrackingSettings />
                    <AromaPillarsSettings />
                    <PrivacySecuritySettings />
                    <AboutSection />
                </div>
            </div>

            {/* Save Button (Fixed or Sticky at bottom for easy access) */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-xl border-t border-white/10 flex justify-center z-50">
                <button
                    onClick={handleSave}
                    disabled={saveStatus === 'saving'}
                    className={`
                        w-full max-w-md flex items-center justify-center gap-2 font-semibold py-3 px-8 rounded-xl shadow-lg transition-all transform active:scale-[0.98]
                        ${saveStatus === 'saved'
                            ? 'bg-green-500 text-white hover:bg-green-600 shadow-green-500/20'
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-500/20 hover:scale-[1.02]'
                        }
                    `}
                >
                    {saveStatus === 'saving' ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Saving...</span>
                        </>
                    ) : saveStatus === 'saved' ? (
                        <>
                            <CheckCircle2 className="w-5 h-5" />
                            <span>Changes Saved</span>
                        </>
                    ) : (
                        <>
                            <span>Save Changes</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
