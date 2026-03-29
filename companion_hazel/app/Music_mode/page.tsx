"use client";

import { useState, useEffect, useRef } from "react";
import ModeActivationCard from "@/components/ModeActivationCard";

interface Song {
  title?: string;
  name?: string;
  videoId: string;
  artist?: string | { name: string };
  duration?: string | number | null;
  thumbnail?: string;
  thumbnails?: { url: string }[];
  currentTime?: number;
  totalTime?: number;
}

interface MusicState {
  nowPlaying: Song | null;
  queue: Song[];
  command: string | null;
  aromaChamber: string | null;
}

const genres = [
  { name: "Pop", scent: "Citrus", gradient: "linear-gradient(135deg, rgb(246, 51, 154) 0%, rgb(173, 70, 255) 50%, rgb(43, 127, 255) 100%)", c1: "246, 51, 154", c2: "173, 70, 255", c3: "43, 127, 255", light: "251, 100, 182" },
  { name: "Ballet", scent: "Lavender", gradient: "linear-gradient(135deg, rgb(253, 165, 213) 0%, rgb(218, 178, 255) 50%, rgb(142, 197, 255) 100%)", c1: "253, 165, 213", c2: "218, 178, 255", c3: "142, 197, 255", light: "255, 220, 240" },
  { name: "Rock", scent: "Peppermint", gradient: "linear-gradient(135deg, rgb(251, 44, 54) 0%, rgb(255, 105, 0) 50%, rgb(240, 177, 0) 100%)", c1: "251, 44, 54", c2: "255, 105, 0", c3: "240, 177, 0", light: "255, 150, 100" },
  { name: "Jazz", scent: "Vanilla", gradient: "linear-gradient(135deg, rgb(80, 20, 210) 0%, rgb(20, 150, 210) 50%, rgb(250, 180, 50) 100%)", c1: "80, 20, 210", c2: "20, 150, 210", c3: "250, 180, 50", light: "100, 200, 255" },
  { name: "Classical", scent: "Chamomile", gradient: "linear-gradient(135deg, rgb(163, 179, 255) 0%, rgb(142, 197, 255) 50%, rgb(83, 234, 253) 100%)", c1: "163, 179, 255", c2: "142, 197, 255", c3: "83, 234, 253", light: "200, 220, 255" },
];

const scentPairs = [
  { genre: "Pop", scent: "Citrus", dot: "rgb(246, 51, 154)", intensity: 100 },
  { genre: "Ballet", scent: "Lavender", dot: "rgb(253, 165, 213)", intensity: 62 },
  { genre: "Rock", scent: "Peppermint", dot: "rgb(251, 44, 54)", intensity: 48 },
  { genre: "Jazz", scent: "Vanilla", dot: "rgb(80, 20, 210)", intensity: 75 },
];

const upNextSongs = [
  { name: "Song Name 1", artist: "Artist 1", playlist: "Focus Beats", duration: "3:45" },
  { name: "Song Name 2", artist: "Artist 2", playlist: "Focus Beats", duration: "4:12" },
  { name: "Song Name 3", artist: "Artist 3", playlist: "Chill Vibes", duration: "3:23" },
  { name: "Song Name 4", artist: "Artist 4", playlist: "Study Sessions", duration: "4:01" },
];

const playlists = [
  { name: "Focus Beats", tracks: 45, iconBg: "rgba(var(--c3-rgb),0.2)", iconBorder: "rgba(var(--c3-rgb),0.4)", iconColor: "#51A2FF" },
  { name: "Chill Vibes", tracks: 32, iconBg: "rgba(var(--c2-rgb),0.2)", iconBorder: "rgba(var(--c2-rgb),0.4)", iconColor: "rgb(var(--c2-rgb))" },
  { name: "Study Sessions", tracks: 56, iconBg: "rgba(var(--c1-rgb),0.2)", iconBorder: "rgba(var(--c1-rgb),0.4)", iconColor: "rgb(var(--light-rgb))" },
  { name: "Workout Energy", tracks: 28, iconBg: "rgba(255,105,0,0.2)", iconBorder: "rgba(255,105,0,0.4)", iconColor: "#FF8904" },
];

const gestures = [
  { gesture: "👈 Left", action: "Previous" },
  { gesture: "👉 Right", action: "Next" },
  { gesture: "👆 Up", action: "Volume +" },
  { gesture: "👇 Down", action: "Volume -" },
  { gesture: "✋ Palm", action: "Play/Pause" },
];

export default function MusicModePage() {
  const [activeGenre, setActiveGenre] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<Song | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [bars, setBars] = useState<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Use ref to hold current totalTime so setInterval closures get fresh values
  const totalTimeRef = useRef<number>(225);

  useEffect(() => {
    if (nowPlaying?.totalTime) {
      totalTimeRef.current = nowPlaying.totalTime;
    }
  }, [nowPlaying?.totalTime]);

  useEffect(() => {
    setMounted(true);
    setBars(Array.from({ length: 40 }, () => Math.random() * 56 + 8));

    // Poll the state API every 2 seconds
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/music/state");
        if (res.ok) {
          const data = await res.json();
          if (data.nowPlaying) {
             setNowPlaying(data.nowPlaying);
             if (data.nowPlaying.currentTime !== undefined && data.nowPlaying.totalTime) {
                setProgress((data.nowPlaying.currentTime / data.nowPlaying.totalTime) * 100);
             }
          }
          if (data.queue) setQueue(data.queue);
          if (data.genre) {
            const index = genres.findIndex(g => g.name === data.genre);
            if (index !== -1) setActiveGenre(index);
          }
        }
      } catch (err) {
        console.error("Failed to fetch music state", err);
      }
    }, 2000);

    const currGenre = genres[activeGenre] || genres[0];
  const rgbTheme = {
    "--c1-rgb": currGenre.c1,
    "--c2-rgb": currGenre.c2,
    "--c3-rgb": currGenre.c3,
    "--light-rgb": currGenre.light,
  } as React.CSSProperties;

  return () => clearInterval(interval);
  }, []);

  const sendCommand = async (cmd: string) => {
    if (cmd === "play_pause") setIsPlaying(!isPlaying);
    try {
      await fetch("/api/music/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: cmd }),
      });
    } catch (err) { }
  };

  const searchMusic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`/api/music/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) { }
    setIsSearching(false);
  };

  const removeSongFromQueue = async (indexToRemove: number) => {
    const updatedQueue = queue.filter((_, idx) => idx !== indexToRemove);
    setQueue(updatedQueue); // Optimistic UI update
    
    try {
      await fetch("/api/music/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queue: updatedQueue }),
      });
    } catch (err) {
      console.error("Failed to remove song", err);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setBars(Array.from({ length: 40 }, () => Math.random() * 56 + 8));
      }, 160);
      progressRef.current = setInterval(() => {
        setProgress((p) => {
           let step = (100 / totalTimeRef.current) * 0.1; // Smooth interpolate based on 100ms
           return p >= 100 ? 0 : p + step;
        });
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [isPlaying]);

  const totalSecs = totalTimeRef.current;
  const elapsed = nowPlaying?.currentTime !== undefined ? nowPlaying.currentTime : Math.floor((progress / 100) * totalSecs);
  const mins = Math.floor(elapsed / 60);
  const secs = Math.floor(elapsed % 60);
  const timeStr = `${mins}:${secs.toString().padStart(2, "0")}`;
  const totalMins = Math.floor(totalSecs / 60);
  const totalSecsRem = Math.floor(totalSecs % 60);
  const durationStr = `${totalMins}:${totalSecsRem.toString().padStart(2, "0")}`;

  const currGenre = genres[activeGenre] || genres[0];
  const rgbTheme = {
    "--c1-rgb": currGenre.c1,
    "--c2-rgb": currGenre.c2,
    "--c3-rgb": currGenre.c3,
    "--light-rgb": currGenre.light,
  } as React.CSSProperties;

  return (
    <div style={{ ...rgbTheme, background: "linear-gradient(135deg, #000000 0%, #0d1b2a 50%, #000000 100%)", minHeight: "100vh", fontFamily: "'Arimo', sans-serif", color: "#fff", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Arimo:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(var(--c1-rgb),0.7); }
          50%       { box-shadow: 0 0 0 7px rgba(var(--c1-rgb),0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.13; }
          50%       { opacity: 0.26; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }
        @keyframes scent-drift {
          0%   { transform: translateY(0px) scale(1);   opacity: 0.5; }
          50%  { transform: translateY(-12px) scale(1.08); opacity: 0.8; }
          100% { transform: translateY(0px) scale(1);   opacity: 0.5; }
        }
        @keyframes scent-drift2 {
          0%   { transform: translateY(0px) scale(1);   opacity: 0.4; }
          50%  { transform: translateY(-9px) scale(1.06); opacity: 0.7; }
          100% { transform: translateY(0px) scale(1);   opacity: 0.4; }
        }
        @keyframes bar-fill {
          from { width: 0%; }
          to   { width: var(--target-width); }
        }

        .page-enter { animation: fadeUp 0.55s ease both; }
        .pulse-dot  { animation: pulse-dot 2s ease-in-out infinite; }
        .glow-bg    { animation: glow-pulse 3s ease-in-out infinite; }
        .music-icon        { animation: float 3.2s ease-in-out infinite; }
        .music-icon.active { animation: float-fast 1.4s ease-in-out infinite; }

        .scent-orb-1 { animation: scent-drift  4s ease-in-out infinite; }
        .scent-orb-2 { animation: scent-drift2 5.5s ease-in-out infinite; }
        .scent-orb-3 { animation: scent-drift  3.2s ease-in-out infinite 0.8s; }

        .genre-btn {
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          cursor: pointer; background: none;
        }
        .genre-btn:hover  { transform: translateY(-5px) scale(1.02); }
        .genre-btn:active { transform: scale(0.97); }

        .ctrl-btn {
          transition: all 0.18s ease;
          cursor: pointer; background: none; border: none; padding: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .ctrl-btn:hover  { transform: scale(1.12); opacity: 0.9; }
        .ctrl-btn:active { transform: scale(0.92); }

        .play-btn { transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1); }
        .play-btn:hover  { transform: scale(1.13); }
        .play-btn:active { transform: scale(0.94); }

        .row-item {
          transition: background 0.15s ease, transform 0.15s ease;
          cursor: pointer;
        }
        .row-item:hover { background: rgba(255,255,255,0.085) !important; transform: translateX(3px); }

        .card-lift { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card-lift:hover { transform: translateY(-2px); box-shadow: 0 16px 48px rgba(0,0,0,0.45); }

        .shimmer-bar {
          background: linear-gradient(90deg, rgb(var(--c1-rgb)) 0%, rgb(var(--c2-rgb)) 35%, rgb(var(--c3-rgb)) 65%, rgb(var(--c1-rgb)) 100%);
          background-size: 200% auto;
          animation: shimmer 2.5s linear infinite;
        }

        .progress-track { cursor: pointer; position: relative; }
        .progress-thumb {
          width: 14px; height: 14px; border-radius: 50%; background: white;
          position: absolute; top: 50%; transform: translate(-50%, -50%);
          opacity: 0; transition: opacity 0.2s ease;
          box-shadow: 0 0 10px rgba(var(--c1-rgb),0.9); pointer-events: none;
        }
        .progress-track:hover .progress-thumb { opacity: 1; }

        .intensity-bar {
          height: 100%;
          border-radius: 100px;
          transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* Responsive Overrides */
        @media (max-width: 1024px) {
          .responsive-padding { padding: 32px 24px 56px !important; }
          .header-row { flex-direction: column !important; gap: 16px; align-items: stretch !important; }
          .player-grid { grid-template-columns: 1fr !important; }
          .genres-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .bottom-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .genres-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .player-controls { gap: 12px !important; }
        }
      `}</style>

      <div className="responsive-padding" style={{ padding: "52px 40px 72px" }}>

        {/* --- MANUAL MODE ACTIVATION --- */}
        <div style={{ marginBottom: "32px" }}>
          <ModeActivationCard 
            targetMode="MUSIC"
            title="Music Mode"
            description="Sync Hazel with your rhythm. Activate Music Mode to enable gesture controls and immersive lighting."
            colorClass="pink"
          />
        </div>

        {/* ── Header ── */}
        <div className="page-enter header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "36px" }}>
          <div>
            <h1 style={{ fontSize: "40px", fontWeight: 400, lineHeight: "48px", margin: "0 0 10px", letterSpacing: "-0.5px" }}>Music Mode</h1>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)", margin: 0 }}>Gesture-controlled music with multi-sensory experience</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "13px 26px", borderRadius: "100px", background: "rgba(var(--c1-rgb),0.15)", border: "0.8px solid rgba(var(--c1-rgb),0.35)", flexShrink: 0 }}>
            <div className="pulse-dot" style={{ width: "9px", height: "9px", borderRadius: "50%", background: "rgb(var(--c1-rgb))" }} />
            <span style={{ fontSize: "15px" }}>Music Mode Active</span>
          </div>
        </div>

        {/* ── Player Row ── */}
        <div className="page-enter player-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", marginBottom: "32px", animationDelay: "80ms" }}>

          {/* Player Card */}
          <div className="card-lift" style={{ background: "linear-gradient(135deg, rgba(var(--c1-rgb),0.09) 0%, rgba(var(--c2-rgb),0.05) 50%, rgba(var(--c3-rgb),0.05) 100%)", border: "0.8px solid rgba(var(--c1-rgb),0.2)", borderRadius: "24px", padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Album area */}
            <div style={{ position: "relative", borderRadius: "18px", overflow: "hidden", flexGrow: 1, minHeight: "340px", background: "rgba(0,0,0,0.5)", border: "0.8px solid rgba(255,255,255,0.07)" }}>
              <div className="glow-bg" style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgb(var(--c1-rgb)) 0%, rgb(var(--c2-rgb)) 50%, rgb(var(--c3-rgb)) 100%)", filter: "blur(70px)" }} />
              <div style={{ position: "absolute", bottom: "32px", left: 0, right: 0, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "2.5px", height: "64px", paddingInline: "28px" }}>
                {(mounted ? bars : Array(40).fill(8)).map((h, i) => (
                  <div key={i} style={{ flex: 1, maxHeight: "64px", height: `${isPlaying ? h : 7}px`, background: `rgba(255,255,255,${isPlaying ? 0.28 : 0.11})`, borderRadius: "3px 3px 0 0", transition: `height ${0.13 + (i % 6) * 0.022}s ease` }} />
                ))}
              </div>
              <div className="shimmer-bar" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "7px" }} />
              <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "16px", paddingBottom: "48px" }}>
                <div className={isPlaying ? "music-icon active" : "music-icon"} style={{ borderRadius: nowPlaying?.thumbnail ? '50%' : '0', overflow: 'hidden', width: nowPlaying?.thumbnail ? '140px' : 'auto', height: nowPlaying?.thumbnail ? '140px' : 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {nowPlaying?.thumbnail ? (
                    <img src={nowPlaying.thumbnail} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", boxShadow: "0 0 30px rgba(0,0,0,0.4)" }} alt="Cover" />
                  ) : (
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                      <path d="M24 50V15l26-6v24" stroke="rgba(255,255,255,0.38)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="15" cy="50" r="9" stroke="rgba(255,255,255,0.38)" strokeWidth="4.5" fill="none"/>
                      <circle cx="41" cy="33" r="9" stroke="rgba(255,255,255,0.38)" strokeWidth="4.5" fill="none"/>
                    </svg>
                  )}
                </div>
                <div style={{ textAlign: "center", marginTop: "10px" }}>
                  <div style={{ fontSize: "26px", fontWeight: 400, marginBottom: "8px" }}>
                    {nowPlaying?.name || nowPlaying?.title || "No song playing"}
                  </div>
                  <div style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)" }}>
                    {typeof nowPlaying?.artist === 'string' ? nowPlaying.artist : nowPlaying?.artist?.name || "YouTube Music"}
                  </div>
                </div>
              </div>
            </div>

            {/* Time + progress */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", minWidth: "34px" }}>{timeStr}</span>
                <button className="ctrl-btn" style={{ width: "26px", height: "26px", borderRadius: "8px", background: "rgba(var(--c2-rgb),0.2)", border: "0.8px solid rgba(var(--c2-rgb),0.4)" }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <line x1="2" y1="6" x2="10" y2="6" stroke="rgb(var(--c2-rgb))" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="6" y1="2" x2="6" y2="10" stroke="rgb(var(--c2-rgb))" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)" }}>{durationStr}</span>
              </div>
              <div className="progress-track" style={{ height: "7px", borderRadius: "100px", background: "rgba(255,255,255,0.1)" }}
                onClick={(e) => {
                  const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                  setProgress(((e.clientX - rect.left) / rect.width) * 100);
                }}>
                <div style={{ width: `${progress}%`, height: "100%", borderRadius: "100px", background: "linear-gradient(90deg, rgb(var(--c1-rgb)) 0%, rgb(var(--c2-rgb)) 100%)", transition: "width 0.1s linear" }} />
                <div className="progress-thumb" style={{ left: `${progress}%` }} />
              </div>
            </div>

            {/* Controls */}
            <div className="player-controls" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" }}>
              <button className="ctrl-btn" style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "0.8px solid rgba(255,255,255,0.12)" }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M14.5 3.5L7.5 10l7 6.5V3.5z" fill="white"/>
                  <rect x="2.5" y="3.5" width="3" height="13" rx="1.2" fill="white"/>
                </svg>
              </button>
              <button onClick={() => sendCommand("previous")} className="ctrl-btn" style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "0.8px solid rgba(255,255,255,0.12)" }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M14.5 3.5L7.5 10l7 6.5V3.5z" fill="white"/>
                  <rect x="2.5" y="3.5" width="3" height="13" rx="1.2" fill="white"/>
                </svg>
              </button>
              <button onClick={() => sendCommand("play_pause")} className="ctrl-btn play-btn"
                style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, rgb(var(--c1-rgb)) 0%, rgb(var(--c2-rgb)) 100%)", paddingLeft: isPlaying ? 0 : "4px", boxShadow: isPlaying ? "0 0 30px rgba(var(--c1-rgb),0.55)" : "0 0 18px rgba(var(--c1-rgb),0.3)" }}>
                {isPlaying
                  ? <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="4" y="3" width="4.5" height="16" rx="1.5" fill="white"/><rect x="13.5" y="3" width="4.5" height="16" rx="1.5" fill="white"/></svg>
                  : <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M5 3l14 8.5L5 20V3z" fill="white"/></svg>
                }
              </button>
              <button onClick={() => sendCommand("next")} className="ctrl-btn" style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "0.8px solid rgba(255,255,255,0.12)" }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5.5 3.5l7 6.5-7 6.5V3.5z" fill="white"/>
                  <rect x="14.5" y="3.5" width="3" height="13" rx="1.2" fill="white"/>
                </svg>
              </button>
              <button className="ctrl-btn" style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "0.8px solid rgba(255,255,255,0.12)" }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M2 7h5l4-4.5v15L7 13H2V7z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                  <path d="M15 5.5c1.5 1.3 2.2 3 2.2 4.5s-.7 3.2-2.2 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M13 8c.8.7 1.2 1.8 1.2 2.5S13.8 12.3 13 13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* ── Right column ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Gesture Controls */}
            <div className="card-lift" style={{ background: "linear-gradient(135deg, rgba(var(--c2-rgb),0.1) 0%, rgba(var(--c2-rgb),0.04) 100%)", border: "0.8px solid rgba(var(--c2-rgb),0.22)", borderRadius: "20px", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2c0 0 0 2.2 0 5.5 0 0 1.6-3.2 4.2-3.2v6.4c0 2.7-2.1 4.3-4.2 4.3S4.8 13.4 4.8 10.7V5.8c0-1.1.7-1.8 1.6-1.8S9 4.7 9 5.8" stroke="rgb(var(--c2-rgb))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: "15px", color: "#fff" }}>Gesture Controls</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {gestures.map((g) => (
                  <div key={g.gesture} className="row-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "12px 14px" }}>
                    <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>{g.gesture}</span>
                    <span style={{ fontSize: "14px", color: "#fff" }}>{g.action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Aroma Match — rich, fills remaining height ── */}
            <div className="card-lift" style={{ background: "linear-gradient(135deg, rgba(var(--c1-rgb),0.1) 0%, rgba(var(--c1-rgb),0.04) 100%)", border: "0.8px solid rgba(var(--c1-rgb),0.22)", borderRadius: "20px", padding: "24px", flexGrow: 1, display: "flex", flexDirection: "column", gap: "18px", overflow: "hidden", position: "relative" }}>

              {/* Floating scent orbs */}
              <div style={{ position: "absolute", top: "16px", right: "16px", pointerEvents: "none" }}>
                <div className="scent-orb-1" style={{ width: "56px", height: "56px", borderRadius: "50%", background: "radial-gradient(circle, rgba(var(--c1-rgb),0.35) 0%, rgba(var(--c1-rgb),0) 70%)", filter: "blur(8px)" }} />
              </div>
              <div style={{ position: "absolute", top: "40px", right: "44px", pointerEvents: "none" }}>
                <div className="scent-orb-2" style={{ width: "36px", height: "36px", borderRadius: "50%", background: "radial-gradient(circle, rgba(var(--c2-rgb),0.3) 0%, rgba(var(--c2-rgb),0) 70%)", filter: "blur(6px)" }} />
              </div>
              <div style={{ position: "absolute", top: "28px", right: "68px", pointerEvents: "none" }}>
                <div className="scent-orb-3" style={{ width: "24px", height: "24px", borderRadius: "50%", background: "radial-gradient(circle, rgba(var(--light-rgb),0.25) 0%, rgba(var(--light-rgb),0) 70%)", filter: "blur(4px)" }} />
              </div>

              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "rgba(var(--c1-rgb),0.2)", border: "0.8px solid rgba(var(--c1-rgb),0.35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1C4.13 1 1 4.13 1 8s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7z" stroke="rgb(var(--light-rgb))" strokeWidth="1.3"/>
                    <path d="M8 4v4l2.5 2.5" stroke="rgb(var(--light-rgb))" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: "15px", color: "#fff", fontWeight: 500 }}>Aroma Match</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "1px" }}>Synced with current genre</div>
                </div>
              </div>

              {/* Active scent hero */}
              <div style={{ background: "rgba(var(--c1-rgb),0.1)", border: "0.8px solid rgba(var(--c1-rgb),0.25)", borderRadius: "14px", padding: "16px", display: "flex", alignItems: "center", gap: "14px" }}>
                {/* Scent icon */}
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "linear-gradient(135deg, rgba(var(--c1-rgb),0.4) 0%, rgba(var(--c2-rgb),0.3) 100%)", border: "0.8px solid rgba(var(--c1-rgb),0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 60%)" }} />
                  <span style={{ fontSize: "22px" }}>{genres[activeGenre]?.scent === "Citrus" ? "🍊" : genres[activeGenre]?.scent === "Lavender" ? "🪴" : genres[activeGenre]?.scent === "Peppermint" ? "🌿" : "✨"}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "17px", color: "#fff", fontWeight: 500 }}>{genres[activeGenre]?.scent || "Citrus"}</span>
                    <span style={{ fontSize: "10px", color: "rgb(var(--light-rgb))", background: "rgba(var(--c1-rgb),0.15)", border: "0.8px solid rgba(var(--c1-rgb),0.3)", borderRadius: "100px", padding: "2px 8px", fontWeight: 500 }}>ACTIVE</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>Matched to {genres[activeGenre]?.name || "Pop"} genre</div>
                </div>
              </div>

              {/* Intensity bar */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>Diffusion Intensity</span>
                  <span style={{ fontSize: "12px", color: "rgb(var(--light-rgb))", fontWeight: 500 }}>100%</span>
                </div>
                <div style={{ height: "7px", borderRadius: "100px", background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                  <div style={{ width: "100%", height: "100%", borderRadius: "100px", background: "linear-gradient(90deg, rgb(var(--c1-rgb)), rgb(var(--light-rgb)))", boxShadow: "0 0 10px rgba(var(--c1-rgb),0.5)" }} />
                </div>
              </div>

              {/* Genre → Scent pairings */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Scent Pairings</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {scentPairs.map((pair, i) => (
                    <div key={pair.genre} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: pair.dot, flexShrink: 0, boxShadow: `0 0 5px ${pair.dot}` }} />
                      <span style={{ fontSize: "12px", color: i === 0 ? "#fff" : "rgba(255,255,255,0.5)", width: "58px", flexShrink: 0 }}>{pair.genre}</span>
                      <div style={{ flex: 1, height: "4px", borderRadius: "100px", background: "rgba(255,255,255,0.08)" }}>
                        <div style={{ width: `${pair.intensity}%`, height: "100%", borderRadius: "100px", background: i === 0 ? `linear-gradient(90deg, ${pair.dot}, rgb(var(--light-rgb)))` : pair.dot, opacity: i === 0 ? 1 : 0.5, transition: "width 0.8s ease" }} />
                      </div>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", width: "28px", textAlign: "right", flexShrink: 0 }}>{pair.scent.slice(0, 3)}</span>
                    </div>
                  ))}
                </div>
              </div>


            </div>
          </div>
        </div>

        {/* ── Genre & RGB Theme ── */}
        <div className="page-enter" style={{ marginBottom: "32px", animationDelay: "160ms" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 400, margin: "0 0 18px", letterSpacing: "-0.3px" }}>Genre &amp; RGB Theme</h2>
          <div className="genres-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "14px" }}>
            {genres.map((g, i) => (
              <button key={g.name} onClick={() => setActiveGenre(i)} className="genre-btn"
                style={{ background: activeGenre === i ? "rgba(255,255,255,0.11)" : "rgba(255,255,255,0.04)", border: activeGenre === i ? "0.8px solid rgba(255,255,255,0.3)" : "0.8px solid rgba(255,255,255,0.09)", borderRadius: "18px", padding: "22px 18px", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", color: "#fff", boxShadow: activeGenre === i ? "0 10px 30px rgba(0,0,0,0.35)" : "none" }}>
                <div style={{ width: "100%", height: "80px", borderRadius: "13px", background: g.gradient, boxShadow: activeGenre === i ? "0 6px 20px rgba(0,0,0,0.45)" : "none", transition: "box-shadow 0.25s ease" }} />
                <span style={{ fontSize: "15px", fontWeight: activeGenre === i ? 500 : 400 }}>{g.name}</span>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{g.scent}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Up Next + Playlists ── */}
        <div className="page-enter bottom-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", animationDelay: "240ms" }}>

          {/* Up Next */}
          <div className="card-lift" style={{ background: "rgba(255,255,255,0.04)", border: "0.8px solid rgba(255,255,255,0.09)", borderRadius: "20px", padding: "26px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 400, margin: "0 0 18px", letterSpacing: "-0.2px" }}>Up Next</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {queue.length > 0 ? queue.slice(0, 4).map((song, idx) => (
                <div key={idx} className="row-item" style={{ background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "13px 14px", display: "flex", alignItems: "center", gap: "13px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "11px", background: "linear-gradient(135deg, rgb(var(--c1-rgb)) 0%, rgb(var(--c2-rgb)) 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 14px rgba(var(--c1-rgb),0.32)" }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 13.5V4l8-2v8.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="4" cy="13.5" r="2.2" stroke="white" strokeWidth="1.4" fill="none"/>
                      <circle cx="12" cy="10.5" r="2.2" stroke="white" strokeWidth="1.4" fill="none"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "14px", color: "#fff", marginBottom: "5px" }}>{song.title || song.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{typeof song.artist === 'string' ? song.artist : song.artist?.name || "Unknown Artist"}</span>
                      <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px" }}>•</span>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "rgba(var(--c2-rgb),0.18)", border: "0.8px solid rgba(var(--c2-rgb),0.28)", borderRadius: "7px", padding: "2px 8px 2px 6px" }}>
                        <span style={{ fontSize: "11px", color: "rgb(var(--c2-rgb))" }}>Hazel Queue</span>
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)", flexShrink: 0, marginRight: "8px" }}>{song.duration || "--:--"}</span>
                  <button onClick={(e) => { e.stopPropagation(); removeSongFromQueue(idx); }} className="ctrl-btn" style={{ width: "26px", height: "26px", borderRadius: "50%", background: "rgba(255,50,50,0.15)", border: "0.8px solid rgba(255,50,50,0.3)" }}>
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ff5555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              )) : (
                <div style={{ padding: "20px", textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>No songs in queue</div>
              )}
            </div>
          </div>

          {/* Playlists & Search */}
          <div className="card-lift" style={{ background: "rgba(255,255,255,0.04)", border: "0.8px solid rgba(255,255,255,0.09)", borderRadius: "20px", padding: "26px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 400, margin: "0 0 18px", letterSpacing: "-0.2px" }}>Search YouTube Music</h3>
            
            <form onSubmit={searchMusic} style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search songs..."
                style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "0.8px solid rgba(255,255,255,0.15)", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "14px", outline: "none" }}
              />
              <button type="submit" className="ctrl-btn" style={{ background: "rgba(var(--c1-rgb),0.15)", border: "0.8px solid rgba(var(--c1-rgb),0.3)", borderRadius: "8px", padding: "0 16px", color: "rgb(var(--c1-rgb))", fontSize: "14px" }}>
                {isSearching ? "Searching..." : "Search"}
              </button>
            </form>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {searchResults.length > 0 ? searchResults.map((result: Song, idx: number) => (
                <div key={idx} className="row-item" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "13px 14px", cursor: "pointer" }}
                  onClick={async () => {
                    // Send an enqueue_song command with the song payload
                    const artistName = typeof result.artist === 'string' ? result.artist : result.artist?.name;
                    const newSong = { title: result.name, videoId: result.videoId, artist: artistName, thumbnail: result.thumbnails?.[0]?.url };
                    await fetch("/api/music/state", { method: "POST", headers: { "Content-Type": "application/json"}, body: JSON.stringify({ command: "enqueue_song", song: newSong }) });
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "13px" }}>
                    {result.thumbnails?.[0]?.url ? (
                      <img src={result.thumbnails[0].url} style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover" }} alt={result.name} />
                    ) : (
                      <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(var(--c3-rgb),0.2)", border: "0.8px solid rgba(var(--c3-rgb),0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{color: "#51A2FF"}}>🎵</span></div>
                    )}
                    <div>
                      <div style={{ fontSize: "14px", color: "#fff", marginBottom: "3px" }}>{result.name}</div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.42)" }}>{typeof result.artist === 'string' ? result.artist : result.artist?.name || "Unknown"}</div>
                    </div>
                  </div>
                  <button className="ctrl-btn" style={{ width: "26px", height: "26px", borderRadius: "50%", background: "rgba(var(--c3-rgb),0.15)", border: "0.8px solid rgba(var(--c3-rgb),0.3)" }}>
                     <span style={{ fontSize: "14px", color: "#51A2FF", lineHeight: 1 }}>+</span>
                  </button>
                </div>
              )) : (
                <div style={{ padding: "10px", textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Search for a song to play or add to queue via Next.js api</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}