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
import { useUser } from '@clerk/nextjs';

export default function SettingsPage() {
    const { user, isLoaded } = useUser();
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');

    useEffect(() => {
        if (isLoaded && user) {
            setFullName(user.fullName || '');

            // Fetch additional profile data (bio, etc.) from our API
            const fetchProfile = async () => {
                try {
                    const response = await fetch('/api/user/profile');
                    if (response.ok) {
                        const data = await response.json();
                        if (data.bio) setBio(data.bio);
                    }
                } catch (error) {
                    console.error('Error fetching profile:', error);
                }
            };
            fetchProfile();
        }
    }, [isLoaded, user, user?.fullName]);

    const handleSave = async () => {
        if (!user) return;
        
        setSaveStatus('saving');

        try {
            // Split name into first and last name for Clerk
            const nameParts = fullName.trim().split(/\s+/);
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            await user.update({
                firstName,
                lastName
            });

            // 2. Update bio in our database
            const response = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bio })
            });

            if (!response.ok) throw new Error('Failed to update profile in database');

            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
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
                    <ProfileSettings 
                        fullName={fullName} 
                        onFullNameChange={setFullName}
                        bio={bio}
                        onBioChange={setBio}
                    />
                    <NotificationsSettings />
                    <AppearanceSettings />
                    <AudioSettings />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <AromaPillarsSettings />
                    <PrivacySecuritySettings />
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
                            : saveStatus === 'error'
                            ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/20'
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
                    ) : saveStatus === 'error' ? (
                        <>
                            <span>Error Saving</span>
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
