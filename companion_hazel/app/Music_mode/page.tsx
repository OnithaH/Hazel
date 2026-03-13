"use client";

import { useState, useEffect, useRef } from "react";

const genres = [
  { name: "Pop", scent: "Citrus", gradient: "linear-gradient(135deg, #F6339A 0%, #AD46FF 50%, #2B7FFF 100%)" },
  { name: "Ballet", scent: "Lavender", gradient: "linear-gradient(135deg, #FDA5D5 0%, #DAB2FF 50%, #8EC5FF 100%)" },
  { name: "Rock", scent: "Peppermint", gradient: "linear-gradient(135deg, #FB2C36 0%, #FF6900 50%, #F0B100 100%)" },
  { name: "Jazz", scent: "Vanilla", gradient: "linear-gradient(135deg, #2B7FFF 0%, #AD46FF 50%, #F6339A 100%)" },
  { name: "Classical", scent: "Chamomile", gradient: "linear-gradient(135deg, #A3B3FF 0%, #8EC5FF 50%, #53EAFD 100%)" },
];

const upNextSongs = [
  { name: "Song Name 1", artist: "Artist 1", playlist: "Focus Beats", duration: "3:45" },
  { name: "Song Name 2", artist: "Artist 2", playlist: "Focus Beats", duration: "4:12" },
  { name: "Song Name 3", artist: "Artist 3", playlist: "Chill Vibes", duration: "3:23" },
  { name: "Song Name 4", artist: "Artist 4", playlist: "Study Sessions", duration: "4:01" },
];

const playlists = [
  { name: "Focus Beats", tracks: 45, iconBg: "rgba(43,127,255,0.2)", iconBorder: "rgba(43,127,255,0.4)", iconColor: "#51A2FF" },
  { name: "Chill Vibes", tracks: 32, iconBg: "rgba(173,70,255,0.2)", iconBorder: "rgba(173,70,255,0.4)", iconColor: "#C27AFF" },
  { name: "Study Sessions", tracks: 56, iconBg: "rgba(246,51,154,0.2)", iconBorder: "rgba(246,51,154,0.4)", iconColor: "#FB64B6" },
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
  const [progress, setProgress] = useState(33);
  const [mounted, setMounted] = useState(false);
  const [bars, setBars] = useState<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setMounted(true);
    setBars(Array.from({ length: 32 }, () => Math.random() * 60 + 10));
  }, []);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setBars(Array.from({ length: 32 }, () => Math.random() * 60 + 10));
      }, 160);
      progressRef.current = setInterval(() => {
        setProgress((p) => (p >= 100 ? 0 : p + 0.12));
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

  const totalSecs = 3 * 60 + 45;
  const elapsed = Math.floor((progress / 100) * totalSecs);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, "0")}`;

  return (
    <div style={{
      background: "linear-gradient(135deg, #000000 0%, #0d1b2a 50%, #000000 100%)",
      minHeight: "100vh",
      fontFamily: "'Arimo', sans-serif",
      color: "#fff",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Arimo:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(246,51,154,0.7); }
          50%       { box-shadow: 0 0 0 7px rgba(246,51,154,0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.13; }
          50%       { opacity: 0.24; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-7px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }

        .page-enter { animation: fadeUp 0.55s ease both; }

        .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }
        .glow-bg   { animation: glow-pulse 3s ease-in-out infinite; }

        .music-icon       { animation: float 3.2s ease-in-out infinite; }
        .music-icon.active { animation: float-fast 1.4s ease-in-out infinite; }

        .genre-btn {
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          cursor: pointer;
          background: none;
        }
        .genre-btn:hover  { transform: translateY(-5px) scale(1.02); }
        .genre-btn:active { transform: scale(0.97); }

        .ctrl-btn {
          transition: all 0.18s ease;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .ctrl-btn:hover  { transform: scale(1.12); opacity: 0.9; }
        .ctrl-btn:active { transform: scale(0.92); }

        .play-btn { transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1); }
        .play-btn:hover  { transform: scale(1.13); box-shadow: 0 0 32px rgba(246,51,154,0.6) !important; }
        .play-btn:active { transform: scale(0.94); }

        .row-item {
          transition: background 0.15s ease, transform 0.15s ease;
          cursor: pointer;
        }
        .row-item:hover { background: rgba(255,255,255,0.085) !important; transform: translateX(3px); }

        .card-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.45);
        }

        .shimmer-bar {
          background: linear-gradient(90deg, #F6339A 0%, #AD46FF 35%, #2B7FFF 65%, #F6339A 100%);
          background-size: 200% auto;
          animation: shimmer 2.5s linear infinite;
        }

        .progress-track { cursor: pointer; position: relative; }
        .progress-thumb {
          width: 13px; height: 13px;
          border-radius: 50%;
          background: white;
          position: absolute;
          top: 50%; transform: translate(-50%, -50%);
          opacity: 0;
          transition: opacity 0.2s ease;
          box-shadow: 0 0 10px rgba(246,51,154,0.9);
          pointer-events: none;
        }
        .progress-track:hover .progress-thumb { opacity: 1; }
      `}</style>

      {/* Full-bleed wrapper — no horizontal padding, no max-width cap */}
      <div style={{ padding: "56px 40px 72px" }}>

        {/* ── Header ── */}
        <div className="page-enter" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
          <div>
            <h1 style={{ fontSize: "40px", fontWeight: 400, lineHeight: "48px", margin: "0 0 10px", letterSpacing: "-0.5px" }}>Music Mode</h1>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)", margin: 0 }}>Gesture-controlled music with multi-sensory experience</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "13px 26px", borderRadius: "100px", background: "rgba(246,51,154,0.15)", border: "0.8px solid rgba(246,51,154,0.35)", flexShrink: 0 }}>
            <div className="pulse-dot" style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#F6339A" }} />
            <span style={{ fontSize: "15px" }}>Music Mode Active</span>
          </div>
        </div>

        {/* ── Player Row ── */}
        <div className="page-enter" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "24px", marginBottom: "32px", animationDelay: "80ms" }}>

          {/* Player Card */}
          <div className="card-lift" style={{ background: "linear-gradient(135deg, rgba(246,51,154,0.09) 0%, rgba(173,70,255,0.05) 50%, rgba(43,127,255,0.05) 100%)", border: "0.8px solid rgba(246,51,154,0.2)", borderRadius: "28px", padding: "32px", display: "flex", flexDirection: "column", gap: "22px" }}>

            {/* Album area */}
            <div style={{ position: "relative", borderRadius: "18px", overflow: "hidden", height: "300px", background: "rgba(0,0,0,0.5)", border: "0.8px solid rgba(255,255,255,0.07)" }}>
              <div className="glow-bg" style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #F6339A 0%, #AD46FF 50%, #2B7FFF 100%)", filter: "blur(64px)" }} />

              {/* Visualizer */}
              <div style={{ position: "absolute", bottom: "30px", left: 0, right: 0, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "3px", height: "56px", paddingInline: "24px" }}>
                {(mounted ? bars : Array(32).fill(10)).map((h, i) => (
                  <div key={i} style={{
                    flex: 1, maxHeight: "56px",
                    height: `${isPlaying ? h : 8}px`,
                    background: `rgba(255,255,255,${isPlaying ? 0.28 : 0.12})`,
                    borderRadius: "3px 3px 0 0",
                    transition: `height ${0.14 + (i % 5) * 0.025}s ease`,
                  }} />
                ))}
              </div>

              {/* Chromatic bar */}
              <div className="shimmer-bar" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "6px" }} />

              {/* Center */}
              <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "14px", paddingBottom: "36px" }}>
                <div className={isPlaying ? "music-icon active" : "music-icon"}>
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                    <path d="M22 46V14l24-6v23" stroke="rgba(255,255,255,0.38)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="14" cy="46" r="8" stroke="rgba(255,255,255,0.38)" strokeWidth="4" fill="none"/>
                    <circle cx="38" cy="31" r="8" stroke="rgba(255,255,255,0.38)" strokeWidth="4" fill="none"/>
                  </svg>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: 400, marginBottom: "6px" }}>Currently Playing</div>
                  <div style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)" }}>Currently Playing Song · Artist Name</div>
                </div>
              </div>
            </div>

            {/* Time + progress */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", minWidth: "34px" }}>{timeStr}</span>
                <button className="ctrl-btn" style={{ width: "26px", height: "26px", borderRadius: "8px", background: "rgba(173,70,255,0.2)", border: "0.8px solid rgba(173,70,255,0.4)" }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <line x1="2" y1="6" x2="10" y2="6" stroke="#C27AFF" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="6" y1="2" x2="6" y2="10" stroke="#C27AFF" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)" }}>3:45</span>
              </div>
              <div className="progress-track" style={{ height: "7px", borderRadius: "100px", background: "rgba(255,255,255,0.1)" }}
                onClick={(e) => {
                  const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                  setProgress(((e.clientX - rect.left) / rect.width) * 100);
                }}>
                <div style={{ width: `${progress}%`, height: "100%", borderRadius: "100px", background: "linear-gradient(90deg, #F6339A 0%, #AD46FF 100%)", transition: "width 0.1s linear" }} />
                <div className="progress-thumb" style={{ left: `${progress}%` }} />
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" }}>
              <button className="ctrl-btn" style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "0.8px solid rgba(255,255,255,0.12)" }}>
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
                  <path d="M14 3.5L7 9.5l7 6V3.5z" fill="white"/>
                  <rect x="2.5" y="3.5" width="3" height="12" rx="1.2" fill="white"/>
                </svg>
              </button>

              <button onClick={() => setIsPlaying(!isPlaying)} className="ctrl-btn play-btn" style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, #F6339A 0%, #AD46FF 100%)", paddingLeft: isPlaying ? 0 : "4px", boxShadow: isPlaying ? "0 0 28px rgba(246,51,154,0.5)" : "0 0 18px rgba(246,51,154,0.3)" }}>
                {isPlaying
                  ? <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="4" y="3" width="4.5" height="16" rx="1.5" fill="white"/><rect x="13.5" y="3" width="4.5" height="16" rx="1.5" fill="white"/></svg>
                  : <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M5 3l14 8.5L5 20V3z" fill="white"/></svg>
                }
              </button>

              <button className="ctrl-btn" style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "0.8px solid rgba(255,255,255,0.12)" }}>
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
                  <path d="M5 3.5l7 6-7 6V3.5z" fill="white"/>
                  <rect x="13.5" y="3.5" width="3" height="12" rx="1.2" fill="white"/>
                </svg>
              </button>

              <button className="ctrl-btn" style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "0.8px solid rgba(255,255,255,0.12)" }}>
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
                  <path d="M2 6.5h4.5l4-4v14l-4-4H2V6.5z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                  <path d="M14.5 5c1.4 1.3 2 3 2 4.5s-.6 3.2-2 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M12.5 7.5c.7.7 1 1.7 1 2.5s-.3 1.8-1 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Gesture Controls */}
            <div className="card-lift" style={{ background: "linear-gradient(135deg, rgba(173,70,255,0.1) 0%, rgba(173,70,255,0.04) 100%)", border: "0.8px solid rgba(173,70,255,0.22)", borderRadius: "20px", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2c0 0 0 2.2 0 5.5 0 0 1.6-3.2 4.2-3.2v6.4c0 2.7-2.1 4.3-4.2 4.3S4.8 13.4 4.8 10.7V5.8c0-1.1.7-1.8 1.6-1.8S9 4.7 9 5.8" stroke="#C27AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: "15px", color: "#fff" }}>Gesture Controls</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {gestures.map((g) => (
                  <div key={g.gesture} className="row-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "11px 14px" }}>
                    <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>{g.gesture}</span>
                    <span style={{ fontSize: "14px", color: "#fff" }}>{g.action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Aroma Match */}
            <div className="card-lift" style={{ background: "linear-gradient(135deg, rgba(246,51,154,0.1) 0%, rgba(246,51,154,0.04) 100%)", border: "0.8px solid rgba(246,51,154,0.22)", borderRadius: "20px", padding: "24px", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="1.5" y="1.5" width="15" height="15" rx="2.5" stroke="#FB64B6" strokeWidth="1.5"/>
                  <path d="M15 1.5L18 0M13 3.5L15 1.5M1.5 15L0 16.5" stroke="#FB64B6" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: "15px", color: "#fff" }}>Aroma Match</span>
              </div>
              <div style={{ fontSize: "14px", marginBottom: "16px" }}>
                <span style={{ color: "rgba(255,255,255,0.5)" }}>Current scent: </span>
                <span style={{ color: "#fff", fontWeight: 500 }}>Citrus</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", border: "0.8px solid rgba(255,255,255,0.09)", borderRadius: "12px", padding: "16px" }}>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", margin: "0 0 12px" }}>Matches Pop genre</p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ flex: 1, height: "7px", borderRadius: "100px", background: "rgba(255,255,255,0.1)" }}>
                    <div style={{ width: "100%", height: "100%", borderRadius: "100px", background: "linear-gradient(90deg, #F6339A, #FB64B6)", boxShadow: "0 0 10px rgba(246,51,154,0.5)" }} />
                  </div>
                  <span style={{ fontSize: "13px", color: "#FB64B6", flexShrink: 0, fontWeight: 500 }}>Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Genre & RGB Theme ── */}
        <div className="page-enter" style={{ marginBottom: "32px", animationDelay: "160ms" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 400, margin: "0 0 18px", letterSpacing: "-0.3px" }}>Genre &amp; RGB Theme</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "14px" }}>
            {genres.map((g, i) => (
              <button key={g.name} onClick={() => setActiveGenre(i)} className="genre-btn"
                style={{
                  background: activeGenre === i ? "rgba(255,255,255,0.11)" : "rgba(255,255,255,0.04)",
                  border: activeGenre === i ? "0.8px solid rgba(255,255,255,0.3)" : "0.8px solid rgba(255,255,255,0.09)",
                  borderRadius: "18px",
                  padding: "22px 18px",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "14px",
                  color: "#fff",
                  boxShadow: activeGenre === i ? "0 10px 30px rgba(0,0,0,0.35)" : "none",
                }}>
                <div style={{ width: "100%", height: "80px", borderRadius: "13px", background: g.gradient, boxShadow: activeGenre === i ? "0 6px 20px rgba(0,0,0,0.45)" : "none", transition: "box-shadow 0.25s ease" }} />
                <span style={{ fontSize: "15px", fontWeight: activeGenre === i ? 500 : 400 }}>{g.name}</span>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{g.scent}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Up Next + Playlists ── */}
        <div className="page-enter" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", animationDelay: "240ms" }}>

          {/* Up Next */}
          <div className="card-lift" style={{ background: "rgba(255,255,255,0.04)", border: "0.8px solid rgba(255,255,255,0.09)", borderRadius: "20px", padding: "26px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 400, margin: "0 0 18px", letterSpacing: "-0.2px" }}>Up Next</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {upNextSongs.map((song) => (
                <div key={song.name} className="row-item" style={{ background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "13px 14px", display: "flex", alignItems: "center", gap: "13px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "11px", background: "linear-gradient(135deg, #F6339A 0%, #AD46FF 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 14px rgba(246,51,154,0.32)" }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 13.5V4l8-2v8.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="4" cy="13.5" r="2.2" stroke="white" strokeWidth="1.4" fill="none"/>
                      <circle cx="12" cy="10.5" r="2.2" stroke="white" strokeWidth="1.4" fill="none"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "14px", color: "#fff", marginBottom: "5px" }}>{song.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{song.artist}</span>
                      <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px" }}>•</span>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "rgba(173,70,255,0.18)", border: "0.8px solid rgba(173,70,255,0.28)", borderRadius: "7px", padding: "2px 8px 2px 6px" }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <line x1="1" y1="2.5" x2="9" y2="2.5" stroke="#C27AFF" strokeWidth="1.1" strokeLinecap="round"/>
                          <line x1="1" y1="5" x2="9" y2="5" stroke="#C27AFF" strokeWidth="1.1" strokeLinecap="round"/>
                          <line x1="1" y1="7.5" x2="5.5" y2="7.5" stroke="#C27AFF" strokeWidth="1.1" strokeLinecap="round"/>
                        </svg>
                        <span style={{ fontSize: "11px", color: "#C27AFF" }}>{song.playlist}</span>
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)", flexShrink: 0 }}>{song.duration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Playlists */}
          <div className="card-lift" style={{ background: "rgba(255,255,255,0.04)", border: "0.8px solid rgba(255,255,255,0.09)", borderRadius: "20px", padding: "26px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 400, margin: "0 0 18px", letterSpacing: "-0.2px" }}>Your Playlists</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {playlists.map((pl) => (
                <div key={pl.name} className="row-item" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "13px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "13px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "11px", background: pl.iconBg, border: `0.8px solid ${pl.iconBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <line x1="2" y1="4" x2="14" y2="4" stroke={pl.iconColor} strokeWidth="1.4" strokeLinecap="round"/>
                        <line x1="2" y1="8" x2="14" y2="8" stroke={pl.iconColor} strokeWidth="1.4" strokeLinecap="round"/>
                        <line x1="2" y1="12" x2="9" y2="12" stroke={pl.iconColor} strokeWidth="1.4" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", color: "#fff", marginBottom: "3px" }}>{pl.name}</div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.42)" }}>{pl.tracks} tracks</div>
                    </div>
                  </div>
                  <button className="ctrl-btn" style={{ width: "26px", height: "26px", borderRadius: "50%", background: "rgba(251,44,54,0.15)", border: "0.8px solid rgba(251,44,54,0.3)" }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M1.5 2.5h9M4 2.5V2a.8.8 0 0 1 .8-.8h2.4a.8.8 0 0 1 .8.8v.5M4.5 5v4M7.5 5v4M2 2.5l.6 6.7A.8.8 0 0 0 3.4 10h5.2a.8.8 0 0 0 .8-.8L10 2.5" stroke="#FB2C36" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              ))}
              <button className="ctrl-btn" style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.03)", border: "0.8px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "14px", width: "100%", cursor: "pointer", marginTop: "2px" }}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <line x1="2" y1="7.5" x2="13" y2="7.5" stroke="rgba(255,255,255,0.42)" strokeWidth="1.4" strokeLinecap="round"/>
                  <line x1="7.5" y1="2" x2="7.5" y2="13" stroke="rgba(255,255,255,0.42)" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.42)" }}>Create Playlist</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}