"use client";

import React from 'react';
import SectionWrapper from './SectionWrapper';
import { Wind, Edit2 } from 'lucide-react';

const AromaItem = ({ label, scent, onScentChange }: { label: string, scent: string, onScentChange: (newScent: string) => void }) => {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group">
            <span className="text-sm text-gray-400">{label}</span>
            <div className="flex items-center gap-2 w-1/2 justify-end">
                <input
                    type="text"
                    value={scent}
                    onChange={(e) => onScentChange(e.target.value)}
                    placeholder="Enter fragrance"
                    className="text-sm text-white font-medium bg-transparent border-none outline-none text-right w-full focus:ring-1 focus:ring-purple-500/50 rounded px-2"
                />
                <Edit2 className="w-3.5 h-3.5 text-gray-500" />
            </div>
        </div>
    );
};

const AromaPillarsSettings = () => {
    const [aromaEnabled, setAromaEnabled] = React.useState(false);
    const [freshScent, setFreshScent] = React.useState("Peppermint");
    const [calmingScent, setCalmingScent] = React.useState("Lavender");
    const [sharpScent, setSharpScent] = React.useState("Citrus");
    const [aromaConfigs, setAromaConfigs] = React.useState<any[]>([]);

    React.useEffect(() => {
        const fetchAromas = async () => {
            try {
                const res = await fetch('/api/aroma');
                if (res.ok) {
                    const data = await res.json();
                    setAromaConfigs(data);
                    const fresh = data.find((a: any) => a.chamber_id === 1) || data[0];
                    const calming = data.find((a: any) => a.chamber_id === 2) || data[1];
                    const sharp = data.find((a: any) => a.chamber_id === 3) || data[2];

                    if (fresh) setFreshScent(fresh.scent_name);
                    if (calming) setCalmingScent(calming.scent_name);
                    if (sharp) setSharpScent(sharp.scent_name);
                }
            } catch (error) {
                console.error("Failed to fetch aroma settings", error);
            }
        };
        fetchAromas();
    }, []);

    React.useEffect(() => {
        const handleSaveEvent = async () => {
            try {
                const updates = aromaConfigs.map(config => {
                    let newScent = config.scent_name;
                    if (config.chamber_id === 1) newScent = freshScent;
                    if (config.chamber_id === 2) newScent = calmingScent;
                    if (config.chamber_id === 3) newScent = sharpScent;

                    return fetch(`/api/aroma/${config.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ scent_name: newScent })
                    });
                });
                await Promise.all(updates);
            } catch (error) {
                console.error("Failed to save aroma settings", error);
            }
        };

        window.addEventListener('save-settings', handleSaveEvent);
        return () => window.removeEventListener('save-settings', handleSaveEvent);
    }, [freshScent, calmingScent, sharpScent, aromaConfigs]);

    return (
        <SectionWrapper title="Aroma Pillars" icon={Wind}>
            <div className="space-y-4">
                <div
                    className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 cursor-pointer"
                    onClick={() => setAromaEnabled(!aromaEnabled)}
                >
                    <span className="text-sm text-gray-300">Enable Aroma Diffusion</span>
                    <div className="relative inline-flex items-center cursor-pointer pointer-events-none">
                        <input type="checkbox" className="sr-only peer" checked={aromaEnabled} readOnly />
                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs text-gray-500 mb-2 ml-1 mt-4">Default Scents</label>
                    <div className="space-y-1 bg-black/20 border border-white/5 rounded-xl p-2">
                        <AromaItem label="Fresh and energizing" scent={freshScent} onScentChange={setFreshScent} />
                        <div className="h-px bg-white/5 mx-2" />
                        <AromaItem label="Calming and relaxing" scent={calmingScent} onScentChange={setCalmingScent} />
                        <div className="h-px bg-white/5 mx-2" />
                        <AromaItem label="Sharp and refreshing" scent={sharpScent} onScentChange={setSharpScent} />
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default AromaPillarsSettings;
