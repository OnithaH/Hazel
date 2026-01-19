import React from 'react';
import SectionWrapper from './SectionWrapper';
import { Shield } from 'lucide-react';

const PrivacyToggle = ({ label }: { label: string }) => (
    <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
        <span className="text-sm text-gray-300">{label}</span>
        <div className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
        </div>
    </div>
);

const PrivacySecuritySettings = () => {
    return (
        <SectionWrapper title="Privacy & Security" icon={Shield}>
            <div className="space-y-3">
                <PrivacyToggle label="Save Study History" />
                <PrivacyToggle label="Allow Camera Access" />
                <PrivacyToggle label="Allow Microphone Access" />

                <button className="w-full mt-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl p-3 text-sm font-medium transition-colors">
                    Clear All Data
                </button>
            </div>
        </SectionWrapper>
    );
};

export default PrivacySecuritySettings;
