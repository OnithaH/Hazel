"use client";

import React, { useState, useEffect } from 'react';
import ProfileSettings from '@/components/settings/ProfileSettings';
import NotificationsSettings from '@/components/settings/NotificationsSettings';
import AppearanceSettings from '@/components/settings/AppearanceSettings';
import AudioSettings from '@/components/settings/AudioSettings';
import AromaPillarsSettings from '@/components/settings/AromaPillarsSettings';
import PrivacySecuritySettings from '@/components/settings/PrivacySecuritySettings';
import AboutSection from '@/components/settings/AboutSection';
import { Settings, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [profile, setProfile] = useState({
        fullName: 'John Doe',
        email: 'john@example.com',
        bio: ''
    });

    const [privacySettings, setPrivacySettings] = useState({
        privacyTurn: false,
        cameraAccess: true,
        microphoneAccess: false,
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/user/profile');
                if (res.ok) {
                    const data = await res.json();
                    setProfile({
                        fullName: data.name || 'User',
                        email: data.email || '',
                        bio: '' // Bio not yet in DB, but keeping for UI
                    });
                    setPrivacySettings(prev => ({
                        ...prev,
                        privacyTurn: !!data.privacy_mode_enabled
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            }
        };

        // Load camera/mic from local storage since they aren't in DB yet
        const savedPrivacy = localStorage.getItem('hazel_privacy_settings');
        if (savedPrivacy) {
            try {
                const parsed = JSON.parse(savedPrivacy);
                setPrivacySettings(prev => ({
                    ...prev,
                    cameraAccess: parsed.cameraAccess ?? true,
                    microphoneAccess: parsed.microphoneAccess ?? false
                }));
            } catch (e) {}
        }

        fetchProfile();
    }, []);

    const handleProfileChange = (name: string, value: string) => {
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handlePrivacyChange = (key: string, value: boolean) => {
        setPrivacySettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setSaveStatus('saving');

        try {
            // 1. Save Profile & Privacy Turn to DB
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: profile.fullName,
                    privacy_mode_enabled: privacySettings.privacyTurn
                })
            });

            // 2. Save Camera/Mic to Local Storage (since schema can't be touched)
            localStorage.setItem('hazel_privacy_settings', JSON.stringify({
                cameraAccess: privacySettings.cameraAccess,
                microphoneAccess: privacySettings.microphoneAccess
            }));

            if (res.ok) {
                setSaveStatus('saved');
                setTimeout(() => setSaveStatus('idle'), 3000);
            } else {
                setSaveStatus('idle');
                alert("Failed to save profile changes.");
            }
        } catch (error) {
            console.error("Save failed", error);
            setSaveStatus('idle');
        }
    };

    return (
        <div className="min-h-screen pt-12 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-purple-600/20 rounded-2xl border border-purple-500/30">
                    <Settings className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
                    <p className="text-gray-400 mt-1">Customize your Hazel experience</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    <ProfileSettings profile={profile} onChange={handleProfileChange} />
                    <NotificationsSettings />
                    <AppearanceSettings />
                    <AudioSettings />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <AromaPillarsSettings />
                    <PrivacySecuritySettings settings={privacySettings} onChange={handlePrivacyChange} />
                    <AboutSection />
                </div>
            </div>

            {/* Save Button */}
            <div className="mt-8 pt-8 border-t border-white/10 flex justify-center">
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
