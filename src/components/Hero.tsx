import React from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, Volume2, Globe, ArrowRight } from 'lucide-react';
import { Voice } from '../types';

interface HeroProps {
  voices: Voice[];
  onPlayVoice: (voice: Voice) => void;
  currentlySpeakingVoiceId: string | null;
  setCurrentTab: (tab: string) => void;
}

export default function Hero({ voices, onPlayVoice, currentlySpeakingVoiceId, setCurrentTab }: HeroProps) {
  // Select 3 highly representative trending voices for instant tests
  const featured = voices.filter(v => ['en-us-sarah', 'en-gb-arthur', 'ja-jp-sakura'].includes(v.id));

  return (
    <section className="relative overflow-hidden bg-transparent pb-16 pt-12">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Marketing Panel */}
          <div className="lg:col-span-7 flex flex-col text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex max-w-fit items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-6"
            >
              <span className="flex h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse"></span>
              NEW: Piper WASM 2.0 Integration
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.1] font-display"
            >
              Lifelike AI Voices <br />
              <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                for Every Creator.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-white/70 mb-8 leading-relaxed max-w-xl animate-fade-in"
            >
              Generate ultra-realistic speech in seconds. Powered by open-source excellence and high-fidelity inference models. Completely client-authoritative with zero platform overhead.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10"
            >
              <button 
                onClick={() => setCurrentTab('tts')}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 px-6 text-sm font-bold text-white shadow-lg shadow-violet-600/20 active:scale-[0.98] transition-all"
              >
                Open Creator Studio <ArrowRight className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setCurrentTab('library')}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 px-6 text-xs sm:text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                Browse Voice Library <Globe className="h-4 w-4" />
              </button>
            </motion.div>

            {/* Micro Stats Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-3 gap-4"
            >
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-[10px] uppercase text-white/40 mb-1 font-bold">Total Generations</p>
                <p className="text-2xl font-mono font-bold text-white">1,248</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-[10px] uppercase text-white/40 mb-1 font-bold">Active Voices</p>
                <p className="text-2xl font-mono font-bold text-white">30+</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-[10px] uppercase text-white/40 mb-1 font-bold">Inference</p>
                <p className="text-2xl font-mono font-bold text-white">0ms</p>
              </div>
            </motion.div>
          </div>

          {/* Side Glass-Card Visual Preview */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-violet-400" />
                  <span className="text-xs font-semibold text-white/50 tracking-wider uppercase">Voice Library</span>
                </div>
                <div className="rounded-md bg-violet-500/10 border border-violet-500/30 px-2 py-0.5 text-[10px] font-mono text-violet-400">
                  Interactive Preview
                </div>
              </div>

              <div className="space-y-4">
                {featured.map((v) => {
                  const isSpeaking = currentlySpeakingVoiceId === v.id;
                  return (
                    <div 
                      key={v.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                        isSpeaking 
                          ? 'border-violet-500 bg-white/10 ring-1 ring-violet-500' 
                          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr ${v.accentColor} text-white font-bold text-sm shadow-md`}>
                          {v.name[0]}
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-sm font-bold text-white">{v.name}</span>
                          <span className="text-[10px] text-white/40 font-mono leading-none mt-1">{v.accent} · {v.gender}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onPlayVoice(v)}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-transform active:scale-95 ${
                          isSpeaking
                            ? 'bg-violet-600 text-white animate-pulse'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        {isSpeaking ? (
                          <div className="flex gap-0.5 items-center justify-center h-3">
                            <span className="w-0.5 h-3 bg-white rounded-full animate-bounce" />
                            <span className="w-0.5 h-2 bg-white rounded-full animate-bounce delay-75" />
                            <span className="w-0.5 h-3 bg-white rounded-full animate-bounce delay-150" />
                          </div>
                        ) : (
                          <Play className="h-3.5 w-3.5 fill-current" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <Volume2 className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
                <div className="flex flex-col text-left text-xs">
                  <span className="font-semibold text-white">Click any button to hear natural speech!</span>
                  <span className="text-white/50 mt-1 leading-relaxed">Runs completely natively using high-grade neural phonetic structures embedded in your device.</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
