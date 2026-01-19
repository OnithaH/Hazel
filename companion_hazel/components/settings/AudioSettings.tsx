import React from 'react';
import SectionWrapper from './SectionWrapper';
import { Volume2 } from 'lucide-react';

const AudioSettings = () => {
    return (
        <SectionWrapper title="Audio Settings" icon={Volume2}>
            <div className="space-y-6">
                <div>
                    <label className="block text-xs text-gray-400 mb-3 ml-1">System Volume</label>
                    <input
                        type="range"
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                </div>

                <div>
                    <label className="block text-xs text-gray-400 mb-3 ml-1">Voice Feedback</label>
                    <div className="grid grid-cols-3 gap-3">
                        {['On', 'Off', 'Minimal'].map((option) => (
                            <button
                                key={option}
                                className="p-3 rounded-xl bg-black/20 border border-white/5 text-sm text-gray-400 hover:bg-white/5 transition-colors first:bg-purple-600/20 first:border-purple-500 first:text-purple-200"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                    <span className="text-sm text-gray-300">Proactive Focus Shield</span>
                    <div className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default AudioSettings;
