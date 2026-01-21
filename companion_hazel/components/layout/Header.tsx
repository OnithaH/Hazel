import React from 'react';
import { BookOpen, Gamepad2, Music, MessageSquare, Settings } from 'lucide-react';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Header() {
  return (
    <nav className="border-b border-white/10 bg-black/40 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold">H</span>
            </div>
            <span className="text-lg font-semibold text-white">HAZEL</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">Dashboard</span>
            </Link>
            <Link href="/study_mode" className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">Study</span>
            </Link>
            <Link href="/Game_mode" className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition">
              <Gamepad2 className="w-4 h-4" />
              <span className="text-sm">Gaming</span>
            </Link>
            <Link href="#" className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition">
              <Music className="w-4 h-4" />
              <span className="text-sm">Music</span>
            </Link>
            <Link href="/General_mode" className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">General</span>
            </Link>
            <Link href="/setting" className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition">
              <Settings className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </Link>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm hover:bg-white/20 transition cursor-pointer">
                  Login
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 rounded-full bg-[#6c47ff] text-white text-sm hover:bg-[#5b3bdb] transition cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}
