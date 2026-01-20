"use client";

import React, { useState } from 'react';
import SectionWrapper from './SectionWrapper';
import { Palette, Moon, Sun, Smartphone } from 'lucide-react';

const AppearanceSettings = () => {
    const [activeTheme, setActiveTheme] = useState('dark');
    const [brightness, setBrightness] = useState(80);

    const themes = [
        { id: 'dark', label: 'Dark', icon: Moon },
        { id: 'light', label: 'Light', icon: Sun },
        { id: 'auto', label: 'Auto', icon: Smartphone },
    ];

    return (
        <SectionWrapper title="Appearance" icon={Palette}>
            <div className="space-y-6">
                <div>
                    <label className="block text-xs text-gray-400 mb-3 ml-1">Theme</label>
                    <div className="grid grid-cols-3 gap-3">
                        {themes.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTheme(id)}
                                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${activeTheme === id
                                    ? 'bg-purple-600/20 border-purple-500 text-purple-200'
                                    : 'bg-black/20 border-white/5 text-gray-400 hover:bg-white/5'
                                    }`}
                            >
                                <Icon size={16} />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-xs text-gray-400 mb-3 ml-1">App Brightness: {brightness}%</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                </div>
            </div>
        </SectionWrapper>
    );
};

export default AppearanceSettings;
