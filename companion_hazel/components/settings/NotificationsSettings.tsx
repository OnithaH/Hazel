"use client";

import React from 'react';
import SectionWrapper from './SectionWrapper';
import { Bell } from 'lucide-react';

const ToggleItem = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) => (
    <div
        className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
        onClick={onChange}
    >
        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{label}</span>
        {/* Custom Toggle Switch */}
        <div className="relative inline-flex items-center cursor-pointer pointer-events-none">
            <input type="checkbox" className="sr-only peer" checked={checked} readOnly />
            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
        </div>
    </div>
);

const NotificationsSettings = () => {
    const [settings, setSettings] = React.useState({
        focusTracking: true,
        studyReminders: true,
        breakSuggestions: true,
        dailyProgress: false,
        gameAchievements: true,
    });

    const toggleSetting = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <SectionWrapper title="Notifications" icon={Bell}>
            <div className="space-y-1">
                <ToggleItem
                    label="Focus Tracking Alerts"
                    checked={settings.focusTracking}
                    onChange={() => toggleSetting('focusTracking')}
                />
                <ToggleItem
                    label="Study Session Reminders"
                    checked={settings.studyReminders}
                    onChange={() => toggleSetting('studyReminders')}
                />
                <ToggleItem
                    label="Break Suggestions"
                    checked={settings.breakSuggestions}
                    onChange={() => toggleSetting('breakSuggestions')}
                />
                <ToggleItem
                    label="Daily Progress Summary"
                    checked={settings.dailyProgress}
                    onChange={() => toggleSetting('dailyProgress')}
                />
                <ToggleItem
                    label="Game Achievements"
                    checked={settings.gameAchievements}
                    onChange={() => toggleSetting('gameAchievements')}
                />
            </div>
        </SectionWrapper>
    );
};

export default NotificationsSettings;
