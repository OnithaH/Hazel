import React from 'react';
import SectionWrapper from './SectionWrapper';
import { User } from 'lucide-react';

const ProfileSettings = () => {
    return (
        <SectionWrapper title="Profile Settings" icon={User}>
            <div className="space-y-4">
                <div className="group">
                    <label className="block text-xs text-gray-400 mb-1.5 ml-1">Full Name</label>
                    <input
                        type="text"
                        defaultValue="John Doe"
                        className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                </div>

                <div className="group">
                    <label className="block text-xs text-gray-400 mb-1.5 ml-1">Email</label>
                    <input
                        type="email"
                        defaultValue="john@example.com"
                        className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                </div>

                <div className="group">
                    <label className="block text-xs text-gray-400 mb-1.5 ml-1">Bio</label>
                    <textarea
                        rows={3}
                        placeholder="Tell us about yourself..."
                        className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                    />
                </div>
            </div>
        </SectionWrapper>
    );
};

export default ProfileSettings;
