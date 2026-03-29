"use client";

import React, { useState } from "react";
import { Power, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import useSWR, { mutate } from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface ModeActivationCardProps {
  targetMode: "GENERAL" | "STUDY" | "GAME" | "MUSIC";
  title: string;
  description: string;
  colorClass: string; // e.g., "green", "blue", "purple", "pink"
}

export default function ModeActivationCard({
  targetMode,
  title,
  description,
  colorClass,
}: ModeActivationCardProps) {
  const [isActivating, setIsActivating] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const { data: robot, error } = useSWR("/api/user/robot", fetcher);

  const currentMode = robot?.mode || "UNKNOWN";
  const isActive = currentMode.toUpperCase() === targetMode.toUpperCase();

  const handleActivate = async () => {
    setIsActivating(true);
    setStatus("idle");
    try {
      const response = await fetch("/api/robot/mode", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: targetMode }),
      });

      if (response.ok) {
        setStatus("success");
        mutate("/api/user/robot"); // Refresh robot state
        // Clear success message after 3s
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Activation failed:", err);
      setStatus("error");
    } finally {
      setIsActivating(false);
    }
  };

  const getThemeColors = () => {
    switch (colorClass) {
      case "green": return { bg: "bg-green-500/10", border: "border-green-500/20", text: "text-green-400", glow: "shadow-green-500/20", btn: "bg-green-500 hover:bg-green-400" };
      case "blue": return { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", glow: "shadow-blue-500/20", btn: "bg-blue-500 hover:bg-blue-400" };
      case "purple": return { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400", glow: "shadow-purple-500/20", btn: "bg-purple-500 hover:bg-purple-400" };
      case "pink": return { bg: "bg-pink-500/10", border: "border-pink-500/20", text: "text-pink-400", glow: "shadow-pink-500/20", btn: "bg-pink-500 hover:bg-pink-400" };
      default: return { bg: "bg-gray-500/10", border: "border-gray-500/20", text: "text-gray-400", glow: "shadow-gray-500/20", btn: "bg-gray-500 hover:bg-gray-400" };
    }
  };

  const theme = getThemeColors();

  return (
    <div className={`p-6 md:p-8 ${theme.bg} border ${theme.border} rounded-[40px] shadow-2xl backdrop-blur-xl relative overflow-hidden group animate-in fade-in slide-in-from-top-4 duration-700`}>
      {/* Decorative Glow */}
      <div className={`absolute -right-20 -top-20 w-64 h-64 ${theme.bg} blur-[100px] rounded-full transition-all duration-1000 group-hover:scale-125 opacity-50`} />
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
            <h2 className="text-3xl font-normal tracking-tight">{title}</h2>
            {isActive && (
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${theme.bg} ${theme.text} border ${theme.border} animate-pulse`}>
                Currently Active
              </span>
            )}
          </div>
          <p className="text-white/40 text-sm max-w-md">{description}</p>
        </div>

        <div className="flex flex-col items-center gap-4 w-full md:w-auto">
          <button
            onClick={handleActivate}
            disabled={isActivating || isActive}
            className={`w-full md:w-64 py-5 rounded-[28px] flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-sm transition-all shadow-xl ${
              isActive 
                ? "bg-white/5 border border-white/10 text-white/20 cursor-default" 
                : `${theme.btn} text-black active:scale-95 ${theme.glow}`
            }`}
          >
            {isActivating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Synchronizing...
              </>
            ) : isActive ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Mode Active
              </>
            ) : status === "success" ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Activated!
              </>
            ) : (
              <>
                <Power className="w-5 h-5" />
                Activate {targetMode}
              </>
            )}
          </button>
          
          {status === "error" && (
            <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 animate-in slide-in-from-top-2">
              <AlertCircle className="w-3 h-3" /> Connection error
            </p>
          )}
          
          <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">
            Hardware: {robot?.name || "Hazel"} • Mode: {currentMode}
          </p>
        </div>
      </div>
    </div>
  );
}
