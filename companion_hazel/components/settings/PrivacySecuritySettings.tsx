"use client";

import React from 'react';
import SectionWrapper from './SectionWrapper';
import { Shield } from 'lucide-react';

const PrivacyToggle = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) => (
    <div
        className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 cursor-pointer"
        onClick={onChange}
    >
        <span className="text-sm text-gray-300">{label}</span>
        <div className="relative inline-flex items-center cursor-pointer pointer-events-none">
            <input type="checkbox" className="sr-only peer" checked={checked} readOnly />
            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
        </div>
    </div>
);

interface PrivacySecuritySettingsProps {
    settings: {
        privacyTurn: boolean;
        cameraAccess: boolean;
        microphoneAccess: boolean;
    };
    onChange: (key: string, value: boolean) => void;
}

const PrivacySecuritySettings = ({ settings, onChange }: PrivacySecuritySettingsProps) => {
    return (
        <SectionWrapper title="Privacy & Security" icon={Shield}>
            <div className="space-y-3">
                <PrivacyToggle
                    label="Privacy Turn"
                    checked={settings.privacyTurn}
                    onChange={() => onChange('privacyTurn', !settings.privacyTurn)}
                />
                <PrivacyToggle
                    label="Allow Camera Access"
                    checked={settings.cameraAccess}
                    onChange={() => onChange('cameraAccess', !settings.cameraAccess)}
                />
                <PrivacyToggle
                    label="Allow Microphone Access"
                    checked={settings.microphoneAccess}
                    onChange={() => onChange('microphoneAccess', !settings.microphoneAccess)}
                />
            </div>
        </SectionWrapper>
    );
};

export default PrivacySecuritySettings;
