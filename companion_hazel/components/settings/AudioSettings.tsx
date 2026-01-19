"use client";

import React from 'react';
import SectionWrapper from './SectionWrapper';
import { Volume2 } from 'lucide-react';

const AudioSettings = () => {
    const [volume, setVolume] = React.useState(75);
    const [voiceFeedback, setVoiceFeedback] = React.useState('On');
    const [proactiveShield, setProactiveShield] = React.useState(false);

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

                <div>
                    <label className="block text-xs text-gray-400 mb-3 ml-1">Voice Feedback</label>
                    <div className="grid grid-cols-3 gap-3">
                        {['On', 'Off', 'Minimal'].map((option) => (
                            <button
                                key={option}
                                onClick={() => setVoiceFeedback(option)}
                                className={`p-3 rounded-xl border text-sm font-medium transition-colors ${voiceFeedback === option
                                    ? 'bg-purple-600/20 border-purple-500 text-purple-200'
                                    : 'bg-black/20 border-white/5 text-gray-400 hover:bg-white/5'
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                <div
                    className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 cursor-pointer"
                    onClick={() => setProactiveShield(!proactiveShield)}
                >
                    <span className="text-sm text-gray-300">Proactive Focus Shield</span>
                    <div className="relative inline-flex items-center cursor-pointer pointer-events-none">
                        <input type="checkbox" className="sr-only peer" checked={proactiveShield} readOnly />
                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default AudioSettings;
