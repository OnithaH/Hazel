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
    setBars(Array.from({ length: 28 }, () => Math.random() * 60 + 10));
  }, []);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setBars(Array.from({ length: 28 }, () => Math.random() * 60 + 10));
      }, 180);
      progressRef.current = setInterval(() => {
        setProgress((p) => (p >= 100 ? 0 : p + 0.15));
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
    <div style={{ background: "linear-gradient(135deg, #000000 0%, #0d1b2a 50%, #000000 100%)", minHeight: "100vh", fontFamily: "'Arimo', sans-serif", color: "#fff", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Arimo:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(246,51,154,0.6); }
          50%       { box-shadow: 0 0 0 6px rgba(246,51,154,0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes bar-grow {
          from { transform: scaleY(0.2); }
          to   { transform: scaleY(1); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.12; }
          50%       { opacity: 0.22; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }

        .page-enter { animation: fadeUp 0.6s ease both; }
        .fade-in    { animation: fadeIn 0.5s ease both; }

        .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }

        .glow-bg { animation: glow-pulse 3s ease-in-out infinite; }

        .music-icon { animation: float 3s ease-in-out infinite; }
        .music-icon.playing { animation: float 1.5s ease-in-out infinite; }

        .genre-btn {
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          cursor: pointer;
          background: none;
        }
        .genre-btn:hover { transform: translateY(-4px) scale(1.02); }
        .genre-btn:active { transform: scale(0.97); }

        .ctrl-btn {
          transition: all 0.18s ease;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ctrl-btn:hover  { transform: scale(1.1); opacity: 0.9; }
        .ctrl-btn:active { transform: scale(0.93); }

        .play-btn {
          transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
        }
        .play-btn:hover  { transform: scale(1.12); box-shadow: 0 0 28px rgba(246,51,154,0.55); }
        .play-btn:active { transform: scale(0.95); }

        .row-item {
          transition: background 0.15s ease, transform 0.15s ease;
          cursor: pointer;
        }
        .row-item:hover { background: rgba(255,255,255,0.08) !important; transform: translateX(2px); }

        .playlist-row {
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .playlist-row:hover { background: rgba(255,255,255,0.08) !important; transform: translateX(2px); }

        .progress-track { cursor: pointer; }
        .progress-thumb {
          width: 12px; height: 12px;
          border-radius: 50%;
          background: white;
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          transition: opacity 0.2s ease;
          box-shadow: 0 0 8px rgba(246,51,154,0.8);
        }
        .progress-track:hover .progress-thumb { opacity: 1; }

        .card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4);
        }

        .bar {
          border-radius: 3px 3px 0 0;
          transition: height 0.18s ease;
          transform-origin: bottom;
        }

        .shimmer-bar {
          background: linear-gradient(90deg, #F6339A 0%, #AD46FF 35%, #2B7FFF 65%, #F6339A 100%);
          background-size: 200% auto;
          animation: shimmer 2.5s linear infinite;
        }
      `}</style>

      <div style={{ maxWidth: "1088px", margin: "0 auto", padding: "64px 0 72px" }}>

        {/* ── Header ── */}
        <div className="page-enter" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "36px", animationDelay: "0ms" }}>
          <div>
            <h1 style={{ fontSize: "36px", fontWeight: 400, lineHeight: "44px", margin: "0 0 8px", letterSpacing: "-0.5px" }}>Music Mode</h1>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", margin: 0 }}>Gesture-controlled music with multi-sensory experience</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 22px", borderRadius: "100px", background: "rgba(246,51,154,0.15)", border: "0.8px solid rgba(246,51,154,0.35)", flexShrink: 0 }}>
            <div className="pulse-dot" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#F6339A" }} />
            <span style={{ fontSize: "14px" }}>Music Mode Active</span>
          </div>
        </div>

        {/* ── Player + Side ── */}
        <div className="page-enter" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px", marginBottom: "28px", animationDelay: "80ms" }}>

          {/* Player Card */}
          <div className="card-hover" style={{ background: "linear-gradient(135deg, rgba(246,51,154,0.09) 0%, rgba(173,70,255,0.05) 50%, rgba(43,127,255,0.05) 100%)", border: "0.8px solid rgba(246,51,154,0.2)", borderRadius: "24px", padding: "28px", display: "flex", flexDirection: "column", gap: "18px" }}>

            {/* Album area */}
            <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", height: "268px", background: "rgba(0,0,0,0.5)", border: "0.8px solid rgba(255,255,255,0.07)" }}>
              {/* Ambient glow — animates when playing */}
              <div className="glow-bg" style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #F6339A 0%, #AD46FF 50%, #2B7FFF 100%)", filter: "blur(60px)" }} />

              {/* Visualizer bars at bottom */}
              <div style={{ position: "absolute", bottom: "28px", left: 0, right: 0, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "3px", height: "48px", paddingInline: "20px" }}>
                {(mounted ? bars : Array(28).fill(20)).map((h, i) => (
                  <div
                    key={i}
                    className="bar"
                    style={{
                      flex: 1,
                      height: `${isPlaying ? h : 8}px`,
                      maxHeight: "48px",
                      background: `rgba(255,255,255,${isPlaying ? 0.25 : 0.12})`,
                      transition: `height ${0.15 + (i % 5) * 0.02}s ease`,
                    }}
                  />
                ))}
              </div>

              {/* Bottom chromatic bar */}
              <div className="shimmer-bar" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "5px" }} />

              {/* Center content */}
              <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "12px", paddingBottom: "32px" }}>
                <div className={isPlaying ? "music-icon playing" : "music-icon"}>
                  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                    <path d="M19 40V12l21-5v20" stroke="rgba(255,255,255,0.4)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="40" r="7" stroke="rgba(255,255,255,0.4)" strokeWidth="3.5" fill="none"/>
                    <circle cx="33" cy="27" r="7" stroke="rgba(255,255,255,0.4)" strokeWidth="3.5" fill="none"/>
                  </svg>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "21px", fontWeight: 400, marginBottom: "5px" }}>Currently Playing</div>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>Currently Playing Song · Artist Name</div>
                </div>
              </div>
            </div>

            {/* Time + progress */}
            <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", minWidth: "32px" }}>{timeStr}</span>
                <button className="ctrl-btn" style={{ width: "24px", height: "24px", borderRadius: "7px", background: "rgba(173,70,255,0.2)", border: "0.8px solid rgba(173,70,255,0.4)" }}>
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <line x1="1.5" y1="5.5" x2="9.5" y2="5.5" stroke="#C27AFF" strokeWidth="1.4" strokeLinecap="round"/>
                    <line x1="5.5" y1="1.5" x2="5.5" y2="9.5" stroke="#C27AFF" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                </button>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>3:45</span>
              </div>
              {/* Track bar */}
              <div
                className="progress-track"
                style={{ position: "relative", height: "6px", borderRadius: "100px", background: "rgba(255,255,255,0.1)" }}
                onClick={(e) => {
                  const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                  setProgress(((e.clientX - rect.left) / rect.width) * 100);
                }}
              >
                <div style={{ width: `${progress}%`, height: "100%", borderRadius: "100px", background: "linear-gradient(90deg, #F6339A 0%, #AD46FF 100%)", transition: "width 0.1s linear" }} />
                <div className="progress-thumb" style={{ left: `${progress}%` }} />
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
              <button className="ctrl-btn" style={{ width: "42px", height: "42px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "0.8px solid rgba(255,255,255,0.12)" }}>
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                  <path d="M12.5 3L5.5 8.5l7 5.5V3z" fill="white"/>
                  <rect x="2.5" y="3" width="2.5" height="11" rx="1" fill="white"/>
                </svg>
              </button>

              <button onClick={() => setIsPlaying(!isPlaying)} className="ctrl-btn play-btn" style={{ width: "56px", height: "56px", borderRadius: "50%", background: "linear-gradient(135deg, #F6339A 0%, #AD46FF 100%)", paddingLeft: isPlaying ? 0 : "3px", boxShadow: isPlaying ? "0 0 24px rgba(246,51,154,0.45)" : "0 0 16px rgba(246,51,154,0.25)" }}>
                {isPlaying
                  ? <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="4" y="3" width="4" height="14" rx="1.5" fill="white"/><rect x="12" y="3" width="4" height="14" rx="1.5" fill="white"/></svg>
                  : <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4.5 2.5l13 7.5-13 7.5V2.5z" fill="white"/></svg>
                }
              </button>

              <button className="ctrl-btn" style={{ width: "42px", height: "42px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "0.8px solid rgba(255,255,255,0.12)" }}>
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                  <path d="M4.5 3l7 5.5-7 5.5V3z" fill="white"/>
                  <rect x="12" y="3" width="2.5" height="11" rx="1" fill="white"/>
                </svg>
              </button>

              <button className="ctrl-btn" style={{ width: "42px", height: "42px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "0.8px solid rgba(255,255,255,0.12)" }}>
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                  <path d="M2 5.5h4l4-3.5v13l-4-3.5H2V5.5z" stroke="white" strokeWidth="1.4" strokeLinejoin="round" fill="none"/>
                  <path d="M13 4.5c1.3 1.1 1.8 2.6 1.8 4s-.5 2.9-1.8 4" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
                  <path d="M11.5 7c.6.6.9 1.4.9 2s-.3 1.4-.9 2" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Gesture Controls */}
            <div className="card-hover" style={{ background: "linear-gradient(135deg, rgba(173,70,255,0.1) 0%, rgba(173,70,255,0.04) 100%)", border: "0.8px solid rgba(173,70,255,0.22)", borderRadius: "16px", padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                  <path d="M8.5 2c0 0 0 2 0 5 0 0 1.5-3 4-3v6c0 2.5-2 4-4 4S4.5 12.5 4.5 10V5.5c0-1 .7-1.5 1.5-1.5S8.5 4.5 8.5 5.5" stroke="#C27AFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: "14px", color: "#fff", fontWeight: 400 }}>Gesture Controls</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {gestures.map((g, i) => (
                  <div
                    key={g.gesture}
                    className="row-item"
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.05)", borderRadius: "9px", padding: "9px 12px", animationDelay: `${i * 40}ms` }}
                  >
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>{g.gesture}</span>
                    <span style={{ fontSize: "13px", color: "#fff" }}>{g.action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Aroma Match */}
            <div className="card-hover" style={{ background: "linear-gradient(135deg, rgba(246,51,154,0.1) 0%, rgba(246,51,154,0.04) 100%)", border: "0.8px solid rgba(246,51,154,0.22)", borderRadius: "16px", padding: "20px", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                  <rect x="1.5" y="1.5" width="14" height="14" rx="2.5" stroke="#FB64B6" strokeWidth="1.4"/>
                  <path d="M14.5 1.5L17 0M12.5 3.5L14.5 1.5M1.5 14.5L0 16" stroke="#FB64B6" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: "14px", color: "#fff" }}>Aroma Match</span>
              </div>
              <div style={{ fontSize: "13px", marginBottom: "13px" }}>
                <span style={{ color: "rgba(255,255,255,0.5)" }}>Current scent: </span>
                <span style={{ color: "#fff", fontWeight: 500 }}>Citrus</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", border: "0.8px solid rgba(255,255,255,0.09)", borderRadius: "10px", padding: "13px" }}>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", margin: "0 0 10px" }}>Matches Pop genre</p>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ flex: 1, height: "6px", borderRadius: "100px", background: "rgba(255,255,255,0.1)" }}>
                    <div style={{ width: "100%", height: "100%", borderRadius: "100px", background: "linear-gradient(90deg, #F6339A, #FB64B6)", boxShadow: "0 0 8px rgba(246,51,154,0.5)" }} />
                  </div>
                  <span style={{ fontSize: "12px", color: "#FB64B6", flexShrink: 0, fontWeight: 500 }}>Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Genre & RGB Theme ── */}
        <div className="page-enter" style={{ marginBottom: "28px", animationDelay: "160ms" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 400, margin: "0 0 16px", letterSpacing: "-0.3px" }}>Genre &amp; RGB Theme</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px" }}>
            {genres.map((g, i) => (
              <button
                key={g.name}
                onClick={() => setActiveGenre(i)}
                className="genre-btn"
                style={{
                  background: activeGenre === i ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)",
                  border: activeGenre === i ? "0.8px solid rgba(255,255,255,0.3)" : "0.8px solid rgba(255,255,255,0.09)",
                  borderRadius: "16px",
                  padding: "18px 14px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                  color: "#fff",
                  boxShadow: activeGenre === i ? "0 8px 24px rgba(0,0,0,0.3)" : "none",
                }}
              >
                <div style={{ width: "100%", height: "64px", borderRadius: "11px", background: g.gradient, boxShadow: activeGenre === i ? "0 4px 16px rgba(0,0,0,0.4)" : "none", transition: "box-shadow 0.25s ease" }} />
                <span style={{ fontSize: "14px", fontWeight: activeGenre === i ? 500 : 400 }}>{g.name}</span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>{g.scent}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Up Next + Playlists ── */}
        <div className="page-enter" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", animationDelay: "240ms" }}>

          {/* Up Next */}
          <div className="card-hover" style={{ background: "rgba(255,255,255,0.04)", border: "0.8px solid rgba(255,255,255,0.09)", borderRadius: "16px", padding: "22px" }}>
            <h3 style={{ fontSize: "17px", fontWeight: 400, margin: "0 0 16px", letterSpacing: "-0.2px" }}>Up Next</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {upNextSongs.map((song, i) => (
                <div
                  key={song.name}
                  className="row-item"
                  style={{ background: "rgba(255,255,255,0.045)", borderRadius: "10px", padding: "10px 12px", display: "flex", alignItems: "center", gap: "11px" }}
                >
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #F6339A 0%, #AD46FF 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(246,51,154,0.3)" }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M5.5 12V3.5l7-1.8v7" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="3.5" cy="12" r="2" stroke="white" strokeWidth="1.3" fill="none"/>
                      <circle cx="10.5" cy="8.7" r="2" stroke="white" strokeWidth="1.3" fill="none"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", color: "#fff", marginBottom: "4px" }}>{song.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>{song.artist}</span>
                      <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "10px" }}>•</span>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "rgba(173,70,255,0.18)", border: "0.8px solid rgba(173,70,255,0.28)", borderRadius: "6px", padding: "1px 6px 1px 5px" }}>
                        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                          <line x1="1" y1="2" x2="8" y2="2" stroke="#C27AFF" strokeWidth="1" strokeLinecap="round"/>
                          <line x1="1" y1="4.5" x2="8" y2="4.5" stroke="#C27AFF" strokeWidth="1" strokeLinecap="round"/>
                          <line x1="1" y1="7" x2="5" y2="7" stroke="#C27AFF" strokeWidth="1" strokeLinecap="round"/>
                        </svg>
                        <span style={{ fontSize: "10px", color: "#C27AFF" }}>{song.playlist}</span>
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", flexShrink: 0 }}>{song.duration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Your Playlists */}
          <div className="card-hover" style={{ background: "rgba(255,255,255,0.04)", border: "0.8px solid rgba(255,255,255,0.09)", borderRadius: "16px", padding: "22px" }}>
            <h3 style={{ fontSize: "17px", fontWeight: 400, margin: "0 0 16px", letterSpacing: "-0.2px" }}>Your Playlists</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {playlists.map((pl) => (
                <div
                  key={pl.name}
                  className="playlist-row"
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.045)", borderRadius: "10px", padding: "10px 12px" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: pl.iconBg, border: `0.8px solid ${pl.iconBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <line x1="2" y1="3.5" x2="12" y2="3.5" stroke={pl.iconColor} strokeWidth="1.3" strokeLinecap="round"/>
                        <line x1="2" y1="7" x2="12" y2="7" stroke={pl.iconColor} strokeWidth="1.3" strokeLinecap="round"/>
                        <line x1="2" y1="10.5" x2="7.5" y2="10.5" stroke={pl.iconColor} strokeWidth="1.3" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: "13px", color: "#fff", marginBottom: "2px" }}>{pl.name}</div>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{pl.tracks} tracks</div>
                    </div>
                  </div>
                  <button className="ctrl-btn" style={{ width: "24px", height: "24px", borderRadius: "50%", background: "rgba(251,44,54,0.15)", border: "0.8px solid rgba(251,44,54,0.3)" }}>
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M1.5 2.5h8M3.5 2.5V2a.75.75 0 0 1 .75-.75h1.5A.75.75 0 0 1 6.5 2v.5M4 4.5v3.5M7 4.5v3.5M2 2.5l.5 6a.75.75 0 0 0 .75.75h4.5a.75.75 0 0 0 .75-.75L9 2.5" stroke="#FB2C36" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              ))}

              <button className="ctrl-btn" style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.03)", border: "0.8px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "12px", width: "100%", cursor: "pointer", marginTop: "2px" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <line x1="2" y1="7" x2="12" y2="7" stroke="rgba(255,255,255,0.4)" strokeWidth="1.3" strokeLinecap="round"/>
                  <line x1="7" y1="2" x2="7" y2="12" stroke="rgba(255,255,255,0.4)" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>Create Playlist</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}