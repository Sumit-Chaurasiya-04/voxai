import React from 'react';
import { motion } from 'motion/react';
import { Coins, BarChart2, ArrowUpRight, Play, Trash2, ShieldCheck, Heart } from 'lucide-react';
import { Voice, UserStats, Generation } from '../types';

interface UserDashboardProps {
  voices: Voice[];
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
  generations: Generation[];
  onPlayVoice: (voice: Voice) => void;
  currentlySpeakingVoiceId: string | null;
  addLog: (action: string, details: string, type: 'synth' | 'auth' | 'admin' | 'download') => void;
  setCurrentTab: (tab: string) => void;
}

export default function UserDashboard({
  voices,
  userStats,
  setUserStats,
  generations,
  onPlayVoice,
  currentlySpeakingVoiceId,
  addLog,
  setCurrentTab
}: UserDashboardProps) {

  // Get favorite voices
  const savedList = voices.filter(v => userStats.savedVoices.includes(v.id));

  // Simulated week chart activity data (values of characters generated over last 7 days)
  const chartData = [1200, 3100, 2400, 4800, 3600, 6200, 5100];
  const maxChartVal = 7000;
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleRemoveFavorite = (voiceId: string) => {
    setUserStats(prev => ({
      ...prev,
      savedVoices: prev.savedVoices.filter(id => id !== voiceId)
    }));
    addLog('Voice Unfavorited', `Voice ID {${voiceId}} bookmarked out of Creator console.`, 'synth');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-white text-left">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
        <div>
          <span className="text-xs font-bold text-violet-400 font-mono uppercase tracking-widest leading-none">Creator Analytics</span>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-1 font-display">Creator Central Hub</h1>
          <p className="text-xs sm:text-sm text-white/50 leading-normal mt-0.5">Monitor system thresholds, credit ceilings, and manage favorite vocal characters with responsive feedback cascades.</p>
        </div>
        
        {userStats.tier === 'Free' && (
          <button
            onClick={() => setCurrentTab('home')}
            className="h-10 px-4 rounded-xl bg-violet-600 text-white text-xs font-bold transition-all hover:bg-violet-500 active:scale-95 shadow-md shadow-violet-600/20 flex items-center gap-1.5"
          >
            Upgrade Simulator Subscription <ArrowUpRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Tier Details Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col justify-between backdrop-blur-sm shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold font-mono text-white/40 uppercase tracking-widest">Subscription Membership</span>
            <ShieldCheck className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white">{userStats.tier} Sandbox</span>
            </div>
            <p className="text-[10px] text-white/40 mt-2">Commercial authorization active. All local outputs royalty-free.</p>
          </div>
        </div>

        {/* Characters Generated Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col justify-between backdrop-blur-sm shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold font-mono text-white/40 uppercase tracking-widest">Characters Spoken</span>
            <Coins className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-white">{userStats.charactersCount.toLocaleString()}</span>
            <p className="text-[10px] text-white/40 mt-2">Active character credit consumption during this session.</p>
          </div>
        </div>

        {/* Saved voices */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col justify-between backdrop-blur-sm shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold font-mono text-white/40 uppercase tracking-widest font-mono">Bookmarked Profiles</span>
            <Heart className="h-5 w-5 text-rose-500 fill-current animate-pulse" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-white">{userStats.savedVoices.length}</span>
            <p className="text-[10px] text-white/40 mt-2">Pinned voice profiles saved in sandbox memory caches.</p>
          </div>
        </div>

        {/* API Usage tracker */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col justify-between backdrop-blur-sm shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold font-mono text-white/40 uppercase tracking-widest">Active Credit Ceiling</span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full font-bold">100% Reliable</span>
          </div>
          <div>
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-bold text-white">Infinite local runs</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-3">
              <div className="bg-violet-500 h-full w-[15%]" />
            </div>
            <p className="text-[9px] text-white/30 mt-1.5">No hosting bills or REST API ceilings applied to direct client runs.</p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Weekly Character activity Chart (Col-8) */}
        <div className="lg:col-span-8 rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6 space-y-6 backdrop-blur-md shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <span className="text-xs font-bold text-white uppercase font-mono tracking-wide flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-violet-400" /> Weekly Synthesis Activity
            </span>
            <span className="text-[10px] text-white/30 font-mono">Measurement Unit: Character count</span>
          </div>

          {/* SVG Custom Responsive Chart */}
          <div className="w-full h-[180px] relative flex items-end">
            
            {/* Background dashed gridlines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="w-full border-t border-white/5" />
              <div className="w-full border-t border-white/5" />
              <div className="w-full border-t border-white/5" />
              <div className="w-full border-t border-white/5" />
              <div className="w-full border-t border-white/5" />
            </div>

            <div className="relative w-full h-[140px] flex items-end justify-between px-4 z-10">
              {chartData.map((val, i) => {
                const heightPercentage = (val / maxChartVal) * 100;
                return (
                  <div key={i} className="flex flex-col items-center flex-1 group">
                    {/* Val tooltip */}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 border border-white/10 text-[10px] font-bold text-white px-1.5 py-0.5 rounded-md -translate-y-1 mb-1 font-mono absolute top-0">
                      {val.toLocaleString()}
                    </span>

                    {/* Bar path */}
                    <div className="w-8 sm:w-12 bg-gradient-to-t from-violet-600/25 to-violet-500 hover:to-fuchsia-500 hover:scale-x-105 rounded-md transition-all duration-300 relative shadow-sm" style={{ height: `${heightPercentage}%` }}>
                      <div className="absolute top-0 inset-x-0 h-0.5 rounded bg-white/20" />
                    </div>

                    <span className="text-[10px] font-mono text-white/40 mt-3">{daysOfWeek[i]}</span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Favorite voices quick box (Col-4) */}
        <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4 backdrop-blur-md shadow-sm">
          <span className="text-xs font-bold text-white uppercase font-mono tracking-wider block border-b border-white/5 pb-3">
            Bookmarked Vocalists ({savedList.length})
          </span>

          {savedList.length === 0 ? (
            <div className="text-center py-10">
              <Heart className="h-6 w-6 text-white/20 mx-auto mb-2" />
              <p className="text-[11px] text-white/40 leading-normal">No bookmarked vocal profiles found. Browse our library to save some presets here!</p>
              <button 
                onClick={() => setCurrentTab('library')}
                className="text-xs font-bold text-violet-400 mt-3 hover:text-white transition-colors"
              >
                Launch Library
              </button>
            </div>
          ) : (
            <div className="space-y-3.5 max-h-[240px] overflow-y-auto pr-1">
              {savedList.map(voice => {
                const isSpeaking = currentlySpeakingVoiceId === voice.id;
                return (
                  <div 
                    key={voice.id}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 max-w-fit truncate">
                      <div className={`p-1 flex h-7 w-7 items-center justify-center rounded bg-gradient-to-tr ${voice.accentColor} text-white font-bold text-xs truncate shrink-0`}>
                        {voice.name[0]}
                      </div>
                      <div className="flex flex-col text-left truncate">
                        <span className="text-xs font-bold text-white leading-none tracking-tight block truncate">{voice.name}</span>
                        <span className="text-[8px] text-white/40 font-mono leading-none tracking-widest mt-1 block truncate capitalize">{voice.gender} · {voice.language.split(' ')[0]}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onPlayVoice(voice)}
                        className={`h-7 w-7 rounded flex items-center justify-center transition-colors ${
                          isSpeaking 
                            ? 'bg-rose-500/10 text-rose-300 border border-rose-500/15 animate-pulse' 
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        <Play className="h-3 w-3 fill-current" />
                      </button>
                      <button
                        onClick={() => handleRemoveFavorite(voice.id)}
                        className="h-7 w-7 rounded bg-white/10 hover:bg-rose-950 hover:text-rose-400 flex items-center justify-center transition-all border border-white/5"
                        title="Remove bookmark"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
