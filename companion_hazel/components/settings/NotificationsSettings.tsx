import React from 'react';
import SectionWrapper from './SectionWrapper';
import { Bell } from 'lucide-react';

const ToggleItem = ({ label }: { label: string }) => (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{label}</span>
        {/* Custom Toggle Switch */}
        <div className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
        </div>
    </div>
);

const NotificationsSettings = () => {
    return (
        <SectionWrapper title="Notifications" icon={Bell}>
            <div className="space-y-1">
                <ToggleItem label="Focus Tracking Alerts" />
                <ToggleItem label="Study Session Reminders" />
                <ToggleItem label="Break Suggestions" />
                <ToggleItem label="Daily Progress Summary" />
                <ToggleItem label="Game Achievements" />
            </div>
        </SectionWrapper>
    );
};

export default NotificationsSettings;
