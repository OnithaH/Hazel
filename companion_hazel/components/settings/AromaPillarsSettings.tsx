import React from 'react';
import SectionWrapper from './SectionWrapper';
import { Wind } from 'lucide-react';

const AromaItem = ({ label, scent }: { label: string, scent: string }) => (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-sm text-white font-medium">{scent}</span>
    </div>
);

const AromaPillarsSettings = () => {
    return (
        <SectionWrapper title="Aroma Pillars" icon={Wind}>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                    <span className="text-sm text-gray-300">Enable Aroma Diffusion</span>
                    <div className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs text-gray-500 mb-2 ml-1 mt-4">Default Scents</label>
                    <div className="space-y-1 bg-black/20 border border-white/5 rounded-xl p-2">
                        <AromaItem label="Study Mode" scent="Peppermint" />
                        <div className="h-px bg-white/5 mx-2" />
                        <AromaItem label="Music Mode" scent="Lavender" />
                        <div className="h-px bg-white/5 mx-2" />
                        <AromaItem label="General Mode" scent="Citrus" />
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default AromaPillarsSettings;
