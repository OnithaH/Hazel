"use client";

import React, { useState } from 'react';
import SectionWrapper from './SectionWrapper';
import { User } from 'lucide-react';

const ProfileSettings = () => {
    const [profile, setProfile] = useState({
        fullName: 'User',
        email: '',
        bio: '',
        weekly_study_goal: 15
    });
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/user/profile');
                if (res.ok) {
                    const data = await res.json();
                    setProfile(prev => ({
                        ...prev,
                        fullName: data.name || 'User',
                        email: data.email || '',
                        weekly_study_goal: data.weekly_study_goal || 15
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch profile settings", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    React.useEffect(() => {
        const handleSaveEvent = async () => {
            try {
                await fetch('/api/user/profile', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: profile.fullName,
                        weekly_study_goal: profile.weekly_study_goal,
                        email: profile.email || undefined,
                    })
                });
            } catch (error) {
                console.error("Failed to save profile settings", error);
            }
        };

        window.addEventListener('save-settings', handleSaveEvent);
        return () => window.removeEventListener('save-settings', handleSaveEvent);
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ 
            ...prev, 
            [name]: name === 'weekly_study_goal' ? parseInt(value) || 0 : value 
        }));
    };

    return (
        <SectionWrapper title="Profile Settings" icon={User}>
            <div className="space-y-4">
                <div className="group">
                    <label className="block text-xs text-gray-400 mb-1.5 ml-1">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={profile.fullName}
                        onChange={handleChange}
                        className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                </div>

                <div className="group">
                    <label className="block text-xs text-gray-400 mb-1.5 ml-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={profile.email}
                        onChange={handleChange}
                        className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                </div>

                <div className="group">
                    <label className="block text-xs text-gray-400 mb-1.5 ml-1">Bio</label>
                    <textarea
                        rows={3}
                        name="bio"
                        placeholder="Tell us about yourself..."
                        value={profile.bio}
                        onChange={handleChange}
                        className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                    />
                </div>

                <div className="group">
                    <label className="block text-xs text-gray-400 mb-1.5 ml-1">Weekly Study Goal (Hours)</label>
                    <input
                        type="number"
                        name="weekly_study_goal"
                        value={profile.weekly_study_goal}
                        onChange={handleChange}
                        className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                </div>
            </div>
        </SectionWrapper>
    );
};

export default ProfileSettings;
