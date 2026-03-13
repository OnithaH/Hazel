"use client";

import React from 'react';
import SectionWrapper from './SectionWrapper';
import { Volume2 } from 'lucide-react';

const AudioSettings = () => {
    const [volume, setVolume] = React.useState(75);

    return (
        <SectionWrapper title="Audio Settings" icon={Volume2}>
            <div className="space-y-6">
                <div>
                    <label className="block text-xs text-gray-400 mb-3 ml-1">System Volume: {volume}%</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                </div>
            </div>
        </SectionWrapper>
    );
};

export default AudioSettings;
