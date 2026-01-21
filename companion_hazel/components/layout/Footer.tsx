import React from 'react';
import { Twitter, Linkedin, Github, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black/40 border-t border-black mt-12">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-4 gap-16 mb-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/images/logo%20(1).png"
                alt="Hazel logo"
                className="h-8 sm:h-10 w-auto"
              />
            </div>
            <p className="text-white/60 text-sm">Your intelligent companion robot for study, gaming, and everyday life.</p>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span>Made with</span>
              <span className="text-red-500">❤</span>
              <span>by the Hazel Team</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-normal mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition">Features</a></li>
              <li><a href="#" className="hover:text-white transition">Modes</a></li>
              <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition">API</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-normal mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
              <li><a href="#" className="hover:text-white transition">Press Kit</a></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-normal mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition">Community</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Social Bar */}
        <div className="flex justify-between items-center pt-8 border-t border-white/10">
          <p className="text-white/60 text-sm">© 2025 Hazel. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 transition">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 transition">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 transition">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 transition">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}