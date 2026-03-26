"use client";

import React, { useState, useEffect } from 'react';
import SectionWrapper from './SectionWrapper';
import { User } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

interface ProfileSettingsProps {
    fullName: string;
    onFullNameChange: (value: string) => void;
    bio: string;
    onBioChange: (value: string) => void;
}

const ProfileSettings = ({ fullName, onFullNameChange, bio, onBioChange }: ProfileSettingsProps) => {
    const { user, isLoaded } = useUser();
    const [profile, setProfile] = useState({
        email: 'john@example.com'
    });

    useEffect(() => {
        if (isLoaded && user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setProfile(prev => ({
                ...prev,
                email: user.primaryEmailAddress?.emailAddress || ''
            }));
        }
    }, [isLoaded, user, user?.primaryEmailAddress?.emailAddress]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'fullName') {
            onFullNameChange(value);
        } else if (name === 'bio') {
            onBioChange(value);
        } else {
            setProfile(prev => ({ ...prev, [name]: value }));
        }
    };

    return (
        <SectionWrapper title="Profile Settings" icon={User}>
            <div className="space-y-4">
                <div className="group">
                    <label className="block text-xs text-gray-400 mb-1.5 ml-1">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={fullName}
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
                        value={bio}
                        onChange={handleChange}
                        className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                    />
                </div>
            </div>
        </SectionWrapper>
    );
};

export default ProfileSettings;
