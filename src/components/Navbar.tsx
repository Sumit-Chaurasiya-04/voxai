import React from 'react';
import { Mic2, LayoutDashboard, Database, BookOpen, Layers, ShieldCheck, Heart, User } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userStats: any;
}

export default function Navbar({ currentTab, setCurrentTab, userStats }: NavbarProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Layers },
    { id: 'tts', label: 'Studio TTS', icon: Mic2 },
    { id: 'library', label: 'Voice Library', icon: BookOpen },
    { id: 'dashboard', label: 'Creator Hub', icon: LayoutDashboard },
    { id: 'admin', label: 'Admin Panel', icon: ShieldCheck },
    { id: 'blog', label: 'Resources & Blog', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/5 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <button 
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90 animate-fade-in"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 p-1.5 shadow-lg shadow-violet-600/20">
            <Mic2 className="h-5 w-5 text-shadow text-white" />
            <div className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xl font-bold tracking-tight text-white leading-none">VoxAI</span>
            <span className="text-[9px] font-mono text-white/50 uppercase tracking-widest leading-none mt-1">SaaS TTS Engine</span>
          </div>
        </button>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls / Profile */}
        <div className="flex items-center gap-3">
          {/* Favorites shortcut */}
          <button
            onClick={() => setCurrentTab('dashboard')}
            className="relative p-2 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 text-white/70 hover:text-rose-400 transition-colors"
            title="Saved Voices"
          >
            <Heart className="h-4 w-4" />
            {userStats.savedVoices.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                {userStats.savedVoices.length}
              </span>
            )}
          </button>

          {/* User badge */}
          <div className="flex items-center gap-2 bg-white/5 p-1.5 pr-3.5 rounded-lg border border-white/10">
            <div className={`flex h-7 w-7 items-center justify-center rounded-md font-mono text-xs font-bold text-white bg-gradient-to-tr ${
              userStats.tier === 'Pro' ? 'from-amber-500 to-orange-600' : 'from-indigo-500 to-violet-600'
            }`}>
              {userStats.tier === 'Pro' ? 'P' : 'F'}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-semibold text-white leading-none">Creator Hub</span>
              <span className="text-[9px] font-mono text-emerald-400 leading-none mt-0.5">{userStats.tier} Tier</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
