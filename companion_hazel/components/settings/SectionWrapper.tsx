import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionWrapperProps {
    title: string;
    icon?: LucideIcon;
    children: React.ReactNode;
    className?: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ title, icon: Icon, children, className = '' }) => {
    return (
        <div className={`p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md ${className}`}>
            <div className="flex items-center gap-3 mb-6">
                {Icon && <Icon className="w-5 h-5 text-purple-400" />}
                <h2 className="text-xl font-semibold text-white">{title}</h2>
            </div>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
};

export default SectionWrapper;
