"use client";

import React, { useState } from 'react';
import { BookOpen, Gamepad2, Music, MessageSquare, Settings, Menu, X } from 'lucide-react';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="border-b border-white/10 bg-black/40 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/images/logo%20(1).png"
              alt="Hazel logo"
              className="h-10 sm:h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
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
            <Link href="/Music_mode" className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition">
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

          {/* User Profile and Mobile Toggle */}
          <div className="flex items-center gap-3" suppressHydrationWarning>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm hover:bg-white/20 transition cursor-pointer hidden sm:block">
                  Login
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 rounded-full bg-[#00f2c6] text-black text-sm hover:bg-[#00d9ad] transition cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-white/70 hover:text-white transition"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-t border-white/10 py-4 px-4 flex flex-col gap-2 shadow-2xl transition-all duration-300 ease-in-out origin-top ${
          isMobileMenuOpen ? "opacity-100 scale-y-100 translate-y-0 visible" : "opacity-0 scale-y-95 -translate-y-2 invisible pointer-events-none"
        }`}
      >
        <Link href="/" onClick={handleLinkClick} className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition">
          <BookOpen className="w-5 h-5" />
          <span className="text-base font-medium">Dashboard</span>
        </Link>
        <Link href="/study_mode" onClick={handleLinkClick} className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition">
          <BookOpen className="w-5 h-5" />
          <span className="text-base font-medium">Study</span>
        </Link>
        <Link href="/Game_mode" onClick={handleLinkClick} className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition">
          <Gamepad2 className="w-5 h-5" />
          <span className="text-base font-medium">Gaming</span>
        </Link>
        <Link href="/Music_mode" onClick={handleLinkClick} className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition">
          <Music className="w-5 h-5" />
          <span className="text-base font-medium">Music</span>
        </Link>
        <Link href="/General_mode" onClick={handleLinkClick} className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition">
          <MessageSquare className="w-5 h-5" />
          <span className="text-base font-medium">General</span>
        </Link>
        <Link href="/setting" onClick={handleLinkClick} className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition">
          <Settings className="w-5 h-5" />
          <span className="text-base font-medium">Settings</span>
        </Link>
        
        <SignedOut>
          <div className="mt-2 pt-4 border-t border-white/10 sm:hidden">
             <SignInButton mode="modal">
               <button className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-sm hover:bg-white/20 transition cursor-pointer text-center text-white font-medium">
                 Login
               </button>
             </SignInButton>
          </div>
        </SignedOut>
      </div>
    </nav>
  );
}
