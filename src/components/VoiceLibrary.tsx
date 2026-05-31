import React, { useState } from 'react';
import { Search, Globe, Heart, Play, Filter, Check, ArrowRight, Mic2 } from 'lucide-react';
import { Voice, UserStats } from '../types';

interface VoiceLibraryProps {
  voices: Voice[];
  onPlayVoice: (voice: Voice) => void;
  currentlySpeakingVoiceId: string | null;
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
  addLog: (action: string, details: string, type: 'synth' | 'auth' | 'admin' | 'download') => void;
  setSelectedVoiceId: (id: string) => void;
  setCurrentTab: (tab: string) => void;
}

export default function VoiceLibrary({
  voices,
  onPlayVoice,
  currentlySpeakingVoiceId,
  userStats,
  setUserStats,
  addLog,
  setSelectedVoiceId,
  setCurrentTab
}: VoiceLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [langFilter, setLangFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'useCount' | 'rating'>('useCount');

  // Available unique attributes for selectors
  const categories = ['all', 'narration', 'commercial', 'video-games', 'audiobooks', 'characters', 'professional'];
  const languages = ['all', 'English (US)', 'English (UK)', 'English (India)', 'Spanish', 'French', 'German', 'Japanese', 'Italian', 'Chinese'];

  const handleToggleFavorite = (voiceId: string) => {
    const isSaved = userStats.savedVoices.includes(voiceId);
    let updatedSaved: string[];
    
    if (isSaved) {
      updatedSaved = userStats.savedVoices.filter(id => id !== voiceId);
      addLog('Voice Unfavorited', `Voice profile ID {${voiceId}} removed from favorites collection.`, 'synth');
    } else {
      updatedSaved = [...userStats.savedVoices, voiceId];
      addLog('Voice Favorited', `Voice profile ID {${voiceId}} bookmarked into creator cluster.`, 'synth');
    }
    
    setUserStats(prev => ({
      ...prev,
      savedVoices: updatedSaved
    }));
  };

  const handleSelectVoiceForTTS = (voice: Voice) => {
    // If it's a premium voice and they are on the free tier, let's discourage them!
    if (voice.isPremium && userStats.tier === 'Free') {
      alert(`Simulation Access Note:\n\n"${voice.name}" is a Premium Voice. To use it, please simulate a "Pro" subscription on our Home page pricing matrix first!`);
      return;
    }

    setSelectedVoiceId(voice.id);
    addLog('Voice Active Load', `Voice speaker "${voice.name}" assigned as operational target in active buffers.`, 'synth');
    setCurrentTab('tts');
  };

  // Processing search and filters
  const filteredVoices = voices
    .filter(voice => {
      const matchSearch = 
        voice.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        voice.accent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voice.language.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = categoryFilter === 'all' || voice.category === categoryFilter;
      const matchLang = langFilter === 'all' || voice.language === langFilter;
      const matchGender = genderFilter === 'all' || voice.gender === genderFilter;
      const matchTier = 
        tierFilter === 'all' || 
        (tierFilter === 'premium' && voice.isPremium) || 
        (tierFilter === 'free' && !voice.isPremium);
      
      return matchSearch && matchCategory && matchLang && matchGender && matchTier;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.useCount - a.useCount;
    });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-white">
      
      {/* Search Header Banner */}
      <div className="relative rounded-2xl border border-white/10 bg-white/5 px-6 py-10 md:p-12 overflow-hidden mb-10 text-left backdrop-blur-xl shadow-md">
        <div className="absolute top-0 right-0 h-[250px] w-[250px] rounded-full bg-violet-600/10 blur-3xl z-0 animate-pulse" />
        
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-semibold text-violet-400 font-mono uppercase tracking-widest">Acoustic Search</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-1 mb-3 font-display">Explore Neural Voice Masters</h1>
          <p className="text-white/50 text-sm leading-relaxed mb-6">
            Search our extensive indexed voice library to find the exact pitch, accent structure, and gender profile needed for your digital production project.
          </p>

          <div className="relative flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <input 
                type="text"
                placeholder="Search by voice name, language, accent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-white/5 text-xs sm:text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Multi-Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* Left Side Filters (Col-3) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="sticky top-20 rounded-2xl border border-white/10 bg-white/5 p-5 space-y-5 backdrop-blur-md shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-violet-400" /> Filtering Panel
              </span>
              {(categoryFilter !== 'all' || langFilter !== 'all' || genderFilter !== 'all' || tierFilter !== 'all' || searchTerm !== '') && (
                <button
                  onClick={() => {
                    setCategoryFilter('all');
                    setLangFilter('all');
                    setGenderFilter('all');
                    setTierFilter('all');
                    setSearchTerm('');
                  }}
                  className="text-[10px] text-violet-400 hover:text-white transition-colors"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Language Selection Option */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider font-mono">Language Accent</label>
              <select
                value={langFilter}
                onChange={(e) => setLangFilter(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-white/10 bg-white/5 text-xs text-white focus:outline-none focus:border-violet-500 leading-normal"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang === 'all' ? 'All Languages' : lang}</option>
                ))}
              </select>
            </div>

            {/* Category selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider font-mono">Target Category</label>
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`flex w-full items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                      categoryFilter === cat 
                        ? 'bg-white/10 text-violet-400 border border-violet-500/30 font-semibold' 
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="capitalize">{cat === 'all' ? 'All Formats' : cat.replace('-', ' ')}</span>
                    {categoryFilter === cat && <Check className="h-3 w-3" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender filters */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider font-mono">Gender Group</label>
              <div className="grid grid-cols-2 gap-2">
                {['all', 'male', 'female', 'non-binary'].map(gender => (
                  <button
                    key={gender}
                    onClick={() => setGenderFilter(gender)}
                    className={`h-8 rounded-lg text-[11px] font-medium border transition-all truncate px-1 capitalize ${
                      genderFilter === gender
                        ? 'bg-white/10 border-violet-500/30 text-violet-400 font-bold'
                        : 'border-white/10 text-white/60 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

            {/* Tier Levels */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider font-mono">Tier Levels</label>
              <div className="flex gap-2">
                {['all', 'free', 'premium'].map(tier => (
                  <button
                    key={tier}
                    onClick={() => setTierFilter(tier)}
                    className={`flex-1 h-8 rounded-lg text-[11px] font-medium border transition-all capitalize ${
                      tierFilter === tier
                        ? 'bg-white/10 border-violet-500/30 text-violet-400 font-bold'
                        : 'border-white/10 text-white/60 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Side Cards List (Col-9) */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Sorting / Results Count header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm shadow-sm">
            <div className="text-xs text-white/50">
              Showing <span className="font-bold text-white">{filteredVoices.length}</span> individual voice engines matching criteria
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-white/30 shrink-0">Sorted by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-8 pl-2 pr-6 rounded-lg border border-white/10 bg-white/5 text-xs text-white/80 focus:outline-none leading-normal"
              >
                <option value="useCount">Popular Use</option>
                <option value="rating">Expert Rating</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Voices cards dynamic grid */}
          {filteredVoices.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 py-24 text-center backdrop-blur-sm">
              <Mic2 className="h-10 w-10 text-white/20 mx-auto mb-4 animate-bounce" />
              <p className="text-sm font-semibold text-white/40">No Audio Profiles Found</p>
              <p className="text-xs text-white/30 mt-1 max-w-xs mx-auto">Adjust your keywords or language filtering to discover compatible synthetic voices.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredVoices.map((voice) => {
                const isSaved = userStats.savedVoices.includes(voice.id);
                const isSpeaking = currentlySpeakingVoiceId === voice.id;
                
                return (
                  <div 
                    key={voice.id}
                    className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-white/20 hover:bg-white/10 transition-all group backdrop-blur-sm shadow-sm"
                  >
                    <div>
                      {/* Avatar Row */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr ${voice.accentColor} text-white font-bold text-md shadow-md`}>
                            {voice.name[0]}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white leading-none block">{voice.name}</span>
                            <span className="text-[10px] text-white/40 leading-none mt-1 inline-flex items-center gap-1 font-mono">
                              <Globe className="h-2.5 w-2.5" /> {voice.language}
                            </span>
                          </div>
                        </div>

                        {/* Favorite Trigger */}
                        <button
                          onClick={() => handleToggleFavorite(voice.id)}
                          className={`p-1.5 rounded-lg border transition-all ${
                            isSaved 
                              ? 'border-rose-500/30 bg-rose-500/10 text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.15)]' 
                              : 'border-white/10 text-white/30 hover:text-rose-400 hover:border-white/20 hover:bg-white/5'
                          }`}
                        >
                          <svg className={`h-3.5 w-3.5 fill-current`} viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        </button>
                      </div>

                      {/* Character description */}
                      <p className="text-[11px] text-white/70 leading-relaxed text-left line-clamp-3 mb-4">
                        {voice.description}
                      </p>

                      {/* Accent Tags info line */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-md bg-white/5 text-white/60 border border-white/5 uppercase">
                          {voice.category}
                        </span>
                        <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-md bg-white/5 text-white/60 border border-white/5 capitalize">
                          {voice.gender}
                        </span>
                        {voice.isPremium && (
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/10 uppercase">
                            Premium
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action buttons */}
                    <div className="pt-3 border-t border-white/5 flex items-center gap-2">
                      <button
                        onClick={() => onPlayVoice(voice)}
                        className={`flex-1 h-8 inline-flex items-center justify-center gap-1 text-[11px] font-semibold rounded-lg transition-transform active:scale-95 ${
                          isSpeaking
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        <Play className="h-3 w-3 fill-current" /> {isSpeaking ? 'Stop Preview' : 'Preview Voice'}
                      </button>
                      
                      <button
                        onClick={() => handleSelectVoiceForTTS(voice)}
                        className="flex-1 h-8 inline-flex items-center justify-center gap-1 text-[11px] font-bold rounded-lg text-white bg-violet-600 hover:bg-violet-500 active:scale-95 transition-all shadow-md shadow-violet-600/10"
                      >
                        Use in Studio <ArrowRight className="h-2.5 w-2.5" />
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
