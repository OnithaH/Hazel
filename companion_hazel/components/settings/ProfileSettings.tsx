"use client";

import React from 'react';
import SectionWrapper from './SectionWrapper';
import { User } from 'lucide-react';

interface ProfileSettingsProps {
    profile: {
        fullName: string;
        email: string;
        bio: string;
    };
    onChange: (name: string, value: string) => void;
}

const ProfileSettings = ({ profile, onChange }: ProfileSettingsProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        onChange(name, value);
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
                        value={profile.email}
                        readOnly
                        className="w-full bg-black/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-white/50 cursor-not-allowed focus:outline-none transition-colors"
                    />
                    <p className="text-[10px] text-gray-500 mt-1 ml-1">Email is managed via Account Settings</p>
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
            </div>
        </SectionWrapper>
    );
};

export default ProfileSettings;
