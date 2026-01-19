"use client";

import React, { useState } from 'react';
import SectionWrapper from './SectionWrapper';
import { BrainCircuit } from 'lucide-react';

const FocusTrackingSettings = () => {
    const [sensitivity, setSensitivity] = useState('Medium');

    return (
        <SectionWrapper title="Focus Tracking" icon={BrainCircuit}>
            <div className="space-y-6">
                <div>
                    <label className="block text-xs text-gray-400 mb-3 ml-1">Sensitivity Level</label>
                    <div className="grid grid-cols-3 gap-3">
                        {['Low', 'Medium', 'High'].map((level) => (
                            <button
                                key={level}
                                onClick={() => setSensitivity(level)}
                                className={`p-3 rounded-xl border text-sm font-medium transition-all ${sensitivity === level
                                    ? 'bg-purple-600/20 border-purple-500 text-purple-200'
                                    : 'bg-black/20 border-white/5 text-gray-400 hover:bg-white/5'
                                    }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-xs text-gray-400 mb-3 ml-1">Break Interval (minutes)</label>
                    <div className="bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-sm text-gray-300">
                        25
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                    <span className="text-sm text-gray-300">Auto-suggest breaks</span>
                    <div className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default FocusTrackingSettings;
