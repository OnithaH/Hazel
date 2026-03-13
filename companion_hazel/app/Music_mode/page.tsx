"use client";

import { useState } from "react";

const genres = [
  {
    name: "Pop",
    scent: "Citrus",
    gradient: "from-[#F6339A] via-[#AD46FF] to-[#2B7FFF]",
    active: true,
  },
  {
    name: "Ballet",
    scent: "Lavender",
    gradient: "from-[#FDA5D5] via-[#DAB2FF] to-[#8EC5FF]",
    active: false,
  },
  {
    name: "Rock",
    scent: "Peppermint",
    gradient: "from-[#FB2C36] via-[#FF6900] to-[#F0B100]",
    active: false,
  },
  {
    name: "Jazz",
    scent: "Vanilla",
    gradient: "from-[#2B7FFF] via-[#AD46FF] to-[#F6339A]",
    active: false,
  },
  {
    name: "Classical",
    scent: "Chamomile",
    gradient: "from-[#A3B3FF] via-[#8EC5FF] to-[#53EAFD]",
    active: false,
  },
];

const upNextSongs = [
  { name: "Song Name 1", artist: "Artist 1", playlist: "Focus Beats", duration: "3:45" },
  { name: "Song Name 2", artist: "Artist 2", playlist: "Focus Beats", duration: "4:12" },
  { name: "Song Name 3", artist: "Artist 3", playlist: "Chill Vibes", duration: "3:23" },
  { name: "Song Name 4", artist: "Artist 4", playlist: "Study Sessions", duration: "4:01" },
];

const playlists = [
  { name: "Focus Beats", tracks: 45, color: "blue", iconColor: "rgba(43,127,255,0.2)", border: "rgba(43,127,255,0.4)", iconStroke: "#51A2FF" },
  { name: "Chill Vibes", tracks: 32, color: "purple", iconColor: "rgba(173,70,255,0.2)", border: "rgba(173,70,255,0.4)", iconStroke: "#C27AFF" },
  { name: "Study Sessions", tracks: 56, color: "pink", iconColor: "rgba(246,51,154,0.2)", border: "rgba(246,51,154,0.4)", iconStroke: "#FB64B6" },
  { name: "Workout Energy", tracks: 28, color: "orange", iconColor: "rgba(255,105,0,0.2)", border: "rgba(255,105,0,0.4)", iconStroke: "#FF8904" },
];

const gestures = [
  { gesture: "👈 Left", action: "Previous" },
  { gesture: "👉 Right", action: "Next" },
  { gesture: "👆 Up", action: "Volume +" },
  { gesture: "👇 Down", action: "Volume -" },
  { gesture: "✋ Palm", action: "Play/Pause" },
];

function MusicNoteIcon({ size = 64, strokeWidth = 5.33, opacity = 0.4 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <line x1="24" y1="8" x2="48" y2="8" stroke={`rgba(255,255,255,${opacity})`} strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="24" y1="8" x2="24" y2="48" stroke={`rgba(255,255,255,${opacity})`} strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="48" y1="8" x2="48" y2="35" stroke={`rgba(255,255,255,${opacity})`} strokeWidth={strokeWidth} strokeLinecap="round" />
      <circle cx="16" cy="48" r="8" stroke={`rgba(255,255,255,${opacity})`} strokeWidth={strokeWidth} fill="none" />
      <circle cx="40" cy="35" r="8" stroke={`rgba(255,255,255,${opacity})`} strokeWidth={strokeWidth} fill="none" />
    </svg>
  );
}

function PlaylistIcon({ stroke }: { stroke: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <line x1="2" y1="4" x2="14" y2="4" stroke={stroke} strokeWidth="1.33" strokeLinecap="round" />
      <line x1="2" y1="8" x2="14" y2="8" stroke={stroke} strokeWidth="1.33" strokeLinecap="round" />
      <line x1="2" y1="12" x2="9" y2="12" stroke={stroke} strokeWidth="1.33" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M1.5 3h9M4.5 3V2.5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1V3M5 5v3.5M7 5v3.5M2 3l.5 6.5a1 1 0 0 0 1 .9h5a1 1 0 0 0 1-.9L10 3" stroke="#FB2C36" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SmallMusicIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <line x1="6" y1="2" x2="12" y2="2" stroke="white" strokeWidth="1.33" strokeLinecap="round" />
      <line x1="6" y1="2" x2="6" y2="12" stroke="white" strokeWidth="1.33" strokeLinecap="round" />
      <line x1="12" y1="2" x2="12" y2="9" stroke="white" strokeWidth="1.33" strokeLinecap="round" />
      <circle cx="4" cy="12" r="2" stroke="white" strokeWidth="1.33" fill="none" />
      <circle cx="10" cy="9" r="2" stroke="white" strokeWidth="1.33" fill="none" />
    </svg>
  );
}

function QueueIcon({ stroke }: { stroke: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <line x1="1.5" y1="2.5" x2="2.5" y2="2.5" stroke={stroke} strokeWidth="1" />
      <line x1="1.5" y1="6" x2="2.5" y2="6" stroke={stroke} strokeWidth="1" />
      <line x1="1.5" y1="9.5" x2="2.5" y2="9.5" stroke={stroke} strokeWidth="1" />
      <line x1="4" y1="2.5" x2="10.5" y2="2.5" stroke={stroke} strokeWidth="1" />
      <line x1="4" y1="6" x2="10.5" y2="6" stroke={stroke} strokeWidth="1" />
      <line x1="4" y1="9.5" x2="10.5" y2="9.5" stroke={stroke} strokeWidth="1" />
    </svg>
  );
}

export default function MusicModePage() {
  const [activeGenre, setActiveGenre] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress] = useState(33);

  return (
    <div
      className="min-h-screen w-full text-white"
      style={{
        background: "linear-gradient(135deg, #000000 0%, #101828 50%, #000000 100%)",
        fontFamily: "'Arimo', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Arimo:wght@400;500;600&display=swap');
        .progress-bar { transition: width 0.3s ease; }
        .genre-card { transition: all 0.2s ease; }
        .genre-card:hover { transform: translateY(-2px); }
        .btn-hover { transition: all 0.15s ease; }
        .btn-hover:hover { opacity: 0.8; }
      `}</style>

      <div className="px-8 pt-28 pb-0 flex flex-col gap-8 max-w-[1152px] mx-auto">

        {/* Header Row */}
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-normal leading-10">Music Mode</h1>
            <p className="text-base leading-6" style={{ color: "rgba(255,255,255,0.6)" }}>
              Gesture-controlled music with multi-sensory experience
            </p>
          </div>
          <div
            className="flex flex-row items-center gap-3 px-6 py-3 rounded-full"
            style={{
              background: "rgba(246,51,154,0.2)",
              border: "0.8px solid rgba(246,51,154,0.4)",
            }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: "#F6339A" }} />
            <span className="text-base text-white">Music Mode Active</span>
          </div>
        </div>

        {/* Player + Controls Row */}
        <div className="flex flex-row gap-6">
          {/* Player Card */}
          <div
            className="flex flex-col gap-6 p-8 rounded-3xl relative overflow-hidden"
            style={{
              flex: "1 1 0",
              background: "linear-gradient(135deg, rgba(246,51,154,0.1) 0%, rgba(246,51,154,0.05) 100%)",
              border: "0.8px solid rgba(246,51,154,0.2)",
            }}
          >
            {/* Waveform/Album Area */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: "rgba(0,0,0,0.4)",
                border: "0.8px solid rgba(255,255,255,0.1)",
                height: "320px",
              }}
            >
              {/* Gradient glow */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(135deg, #F6339A 0%, #AD46FF 50%, #2B7FFF 100%)",
                  opacity: 0.2,
                  filter: "blur(64px)",
                }}
              />
              {/* Bottom bar */}
              <div
                className="absolute bottom-0 left-0 right-0 h-8"
                style={{
                  background: "linear-gradient(90deg, #F6339A 0%, #AD46FF 50%, #2B7FFF 100%)",
                  opacity: 0.96,
                }}
              />
              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <MusicNoteIcon />
                <span className="text-2xl font-normal">Currently Playing</span>
                <span className="text-base text-center" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Currently Playing Song - Artist Name
                </span>
              </div>
            </div>

            {/* Progress Section */}
            <div className="flex flex-col gap-2">
              {/* Time row */}
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row items-center gap-4">
                  <span className="text-base" style={{ color: "rgba(255,255,255,0.6)" }}>1:23</span>
                  <button
                    className="w-7 h-7 flex items-center justify-center rounded-xl btn-hover"
                    style={{ background: "rgba(173,70,255,0.2)", border: "0.8px solid rgba(173,70,255,0.4)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <line x1="3" y1="7" x2="11" y2="7" stroke="#C27AFF" strokeWidth="1.17" strokeLinecap="round" />
                      <line x1="7" y1="3" x2="7" y2="11" stroke="#C27AFF" strokeWidth="1.17" strokeLinecap="round" />
                    </svg>
                  </button>
                  <span className="text-base" style={{ color: "rgba(255,255,255,0.6)" }}>3:45</span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="relative w-full h-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div
                  className="h-2 rounded-full progress-bar"
                  style={{ width: `${progress}%`, background: "linear-gradient(90deg, #F6339A 0%, #AD46FF 100%)" }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-row items-center justify-center gap-6">
              {/* Skip Back */}
              <button
                className="w-12 h-12 flex items-center justify-center rounded-full btn-hover"
                style={{ background: "rgba(255,255,255,0.05)", border: "0.8px solid rgba(255,255,255,0.1)" }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M14 4L7 10l7 6V4z" stroke="white" strokeWidth="1.67" strokeLinejoin="round" />
                  <line x1="4" y1="4" x2="4" y2="16" stroke="white" strokeWidth="1.67" strokeLinecap="round" />
                </svg>
              </button>
              {/* Play/Pause */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 flex items-center justify-center rounded-full btn-hover"
                style={{ background: "linear-gradient(90deg, #F6339A 0%, #AD46FF 100%)", paddingLeft: "4px" }}
              >
                {isPlaying ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="3" width="4" height="18" rx="1" fill="white" />
                    <rect x="15" y="3" width="4" height="18" rx="1" fill="white" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 3l14 9-14 9V3z" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="white" />
                  </svg>
                )}
              </button>
              {/* Skip Forward */}
              <button
                className="w-12 h-12 flex items-center justify-center rounded-full btn-hover"
                style={{ background: "rgba(255,255,255,0.05)", border: "0.8px solid rgba(255,255,255,0.1)" }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M6 4l7 6-7 6V4z" stroke="white" strokeWidth="1.67" strokeLinejoin="round" />
                  <line x1="16" y1="4" x2="16" y2="16" stroke="white" strokeWidth="1.67" strokeLinecap="round" />
                </svg>
              </button>
              {/* Volume */}
              <button
                className="w-12 h-12 flex items-center justify-center rounded-full btn-hover"
                style={{ background: "rgba(255,255,255,0.05)", border: "0.8px solid rgba(255,255,255,0.1)" }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M2 7h3l5-4v14l-5-4H2V7z" stroke="white" strokeWidth="1.67" strokeLinejoin="round" />
                  <path d="M15 5c1.5 1.5 2 3.5 2 5s-.5 3.5-2 5" stroke="white" strokeWidth="1.67" strokeLinecap="round" />
                  <path d="M12.5 7.5c.8.8 1 2 1 2.5s-.2 1.7-1 2.5" stroke="white" strokeWidth="1.67" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Side: Gesture Controls + Aroma Match */}
          <div className="flex flex-col gap-6" style={{ width: "346px" }}>
            {/* Gesture Controls */}
            <div
              className="flex flex-col gap-4 p-6 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(173,70,255,0.1) 0%, rgba(173,70,255,0.05) 100%)",
                border: "0.8px solid rgba(173,70,255,0.2)",
              }}
            >
              <div className="flex flex-row items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M11.67 3.33L10 5M8.33 3.33L10 5M6.67 3.33L10 5M10 5v7" stroke="#C27AFF" strokeWidth="1.67" strokeLinecap="round" />
                  <path d="M2 12.5c0 4 2 6 8 6s8-2 8-6V8" stroke="#C27AFF" strokeWidth="1.67" strokeLinecap="round" />
                </svg>
                <span className="text-base text-white">Gesture Controls</span>
              </div>
              <div className="flex flex-col gap-3">
                {gestures.map((g) => (
                  <div
                    key={g.gesture}
                    className="flex flex-row justify-between items-center px-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.05)", height: "48px" }}
                  >
                    <span className="text-base" style={{ color: "rgba(255,255,255,0.6)" }}>{g.gesture}</span>
                    <span className="text-base text-white">{g.action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Aroma Match */}
            <div
              className="flex flex-col gap-4 p-6 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(246,51,154,0.1) 0%, rgba(246,51,154,0.05) 100%)",
                border: "0.8px solid rgba(246,51,154,0.2)",
              }}
            >
              <div className="flex flex-row items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="1.67" y="1.67" width="16.67" height="16.67" rx="2" stroke="#FB64B6" strokeWidth="1.67" />
                  <path d="M16.67 1.67L18.33 0" stroke="#FB64B6" strokeWidth="1.67" strokeLinecap="round" />
                  <path d="M15 3.33L16.67 1.67" stroke="#FB64B6" strokeWidth="1.67" strokeLinecap="round" />
                  <path d="M1.67 15L0 16.67" stroke="#FB64B6" strokeWidth="1.67" strokeLinecap="round" />
                </svg>
                <span className="text-base text-white">Aroma Match</span>
              </div>
              <div className="flex flex-row items-center">
                <span className="text-base" style={{ color: "rgba(255,255,255,0.6)" }}>Current scent:&nbsp;</span>
                <span className="text-base text-white">Citrus</span>
              </div>
              <div
                className="flex flex-col gap-2 p-4 rounded-xl"
                style={{ background: "rgba(255,255,255,0.05)", border: "0.8px solid rgba(255,255,255,0.1)" }}
              >
                <span className="text-base" style={{ color: "rgba(255,255,255,0.6)" }}>Matches Pop genre</span>
                <div className="flex flex-row items-center gap-2">
                  <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
                    <div className="h-2 rounded-full w-full" style={{ background: "#F6339A" }} />
                  </div>
                  <span className="text-base" style={{ color: "#FB64B6" }}>Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Genre & RGB Theme */}
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-normal text-white">Genre &amp; RGB Theme</h2>
          <div className="flex flex-row gap-5">
            {genres.map((g, i) => (
              <button
                key={g.name}
                onClick={() => setActiveGenre(i)}
                className="genre-card flex flex-col items-start gap-4 p-6 rounded-2xl flex-1"
                style={{
                  background: activeGenre === i ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)",
                  border: activeGenre === i ? "0.8px solid rgba(255,255,255,0.3)" : "0.8px solid rgba(255,255,255,0.1)",
                }}
              >
                <div className={`w-full h-20 rounded-2xl bg-gradient-to-r ${g.gradient}`} />
                <span className="text-base text-white text-center w-full">{g.name}</span>
                <span className="text-xs w-full text-center" style={{ color: "rgba(255,255,255,0.6)" }}>{g.scent}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Up Next + Playlists */}
        <div className="flex flex-row gap-6 pb-0">
          {/* Up Next */}
          <div
            className="flex flex-col gap-4 p-6 rounded-2xl flex-1"
            style={{ background: "rgba(255,255,255,0.05)", border: "0.8px solid rgba(255,255,255,0.1)" }}
          >
            <h3 className="text-xl font-normal text-white">Up Next</h3>
            <div className="flex flex-col gap-3">
              {upNextSongs.map((song) => (
                <div
                  key={song.name}
                  className="relative flex flex-row items-center rounded-xl"
                  style={{ background: "rgba(255,255,255,0.05)", height: "72px" }}
                >
                  <div className="flex flex-row items-center gap-3 px-3 flex-1">
                    {/* Icon */}
                    <div
                      className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #F6339A 0%, #AD46FF 100%)" }}
                    >
                      <SmallMusicIcon />
                    </div>
                    {/* Info */}
                    <div className="flex flex-col gap-1 flex-1">
                      <span className="text-sm text-white">{song.name}</span>
                      <div className="flex flex-row items-center gap-2">
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>{song.artist}</span>
                        <span className="text-base" style={{ color: "rgba(255,255,255,0.4)" }}>•</span>
                        <div
                          className="flex flex-row items-center gap-1 px-2 py-0.5 rounded-lg"
                          style={{ background: "rgba(173,70,255,0.2)", border: "0.8px solid rgba(173,70,255,0.3)" }}
                        >
                          <QueueIcon stroke="#C27AFF" />
                          <span className="text-xs" style={{ color: "#C27AFF" }}>{song.playlist}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Duration */}
                  <span className="absolute right-3 bottom-3 text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                    {song.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Your Playlists */}
          <div
            className="flex flex-col gap-4 p-6 rounded-2xl flex-1"
            style={{ background: "rgba(255,255,255,0.05)", border: "0.8px solid rgba(255,255,255,0.1)" }}
          >
            <h3 className="text-xl font-normal text-white">Your Playlists</h3>
            <div className="flex flex-col gap-3">
              {playlists.map((pl) => (
                <div
                  key={pl.name}
                  className="flex flex-row justify-between items-center px-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.05)", height: "64px" }}
                >
                  <div className="flex flex-row items-center gap-3">
                    <div
                      className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
                      style={{ background: pl.iconColor, border: `0.8px solid ${pl.border}` }}
                    >
                      <PlaylistIcon stroke={pl.iconStroke} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-white">{pl.name}</span>
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>{pl.tracks} tracks</span>
                    </div>
                  </div>
                  <button
                    className="w-6 h-6 flex items-center justify-center rounded-full btn-hover"
                    style={{ background: "rgba(251,44,54,0.2)", border: "0.8px solid rgba(251,44,54,0.4)" }}
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
              {/* Create Playlist */}
              <button
                className="flex flex-row items-center gap-3 px-3 rounded-xl btn-hover"
                style={{ background: "rgba(255,255,255,0.05)", height: "48px" }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <line x1="3" y1="8" x2="13" y2="8" stroke="rgba(255,255,255,0.6)" strokeWidth="1.33" strokeLinecap="round" />
                  <line x1="8" y1="3" x2="8" y2="13" stroke="rgba(255,255,255,0.6)" strokeWidth="1.33" strokeLinecap="round" />
                </svg>
                <span className="text-base" style={{ color: "rgba(255,255,255,0.6)" }}>Create Playlist</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}