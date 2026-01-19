import React from 'react';
import SectionWrapper from './SectionWrapper';
import { Info } from 'lucide-react';

const InfoItem = ({ label, value }: { label: string, value: string }) => (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-sm text-white font-medium">{value}</span>
    </div>
);

const AboutSection = () => {
    return (
        <SectionWrapper title="About" icon={Info}>
            <div className="space-y-1 bg-black/20 border border-white/5 rounded-xl p-2">
                <InfoItem label="Version" value="1.0.0" />
                <div className="h-px bg-white/5 mx-2" />
                <InfoItem label="Robot ID" value="HAZEL-2026" />
                <div className="h-px bg-white/5 mx-2" />
                <InfoItem label="Firmware" value="v2.1.3" />
            </div>
        </SectionWrapper>
    );
};

export default AboutSection;
