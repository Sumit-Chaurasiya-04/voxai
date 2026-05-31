import React, { useState } from 'react';
import { Star, ChevronDown, Check, Sparkles } from 'lucide-react';
import { Voice, UserStats } from '../types';

interface HomeViewsProps {
  voices: Voice[];
  onPlayVoice: (voice: Voice) => void;
  currentlySpeakingVoiceId: string | null;
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
  addLog: (action: string, details: string, type: 'synth' | 'auth' | 'admin' | 'download') => void;
  setCurrentTab: (tab: string) => void;
}

export default function HomeViews({
  voices,
  onPlayVoice,
  currentlySpeakingVoiceId,
  userStats,
  setUserStats,
  addLog,
  setCurrentTab
}: HomeViewsProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isYearly, setIsYearly] = useState(false);

  const testimonials = [
    {
      name: "Marcus Aurelius Thorne",
      role: "Audiobook Narrator & Podcaster",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60",
      quote: "VoxAI is an absolute revelation for my vocal backups. The latency is practically non-existent because it uses local engine resources, and the Castilian tones are remarkable."
    },
    {
      name: "Jean-Pierre Laurent",
      role: "E-Learning Content Developer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60",
      quote: "No subscriptions required to start, local browser rendering stands out. It generates lessons instantly. Highly recommend the Professor Baxter scientific voice model!"
    },
    {
      name: "Emily Vance-Gomez",
      role: "YouTube Game Lore Creator",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60",
      quote: "Finding high-quality child and character voices is normally an expensive process. Little Jimmy and Sakura are ridiculously authentic and render instantly."
    }
  ];

  const faqs = [
    {
      question: "How does the zero-cost voice platform synthesis work?",
      answer: "VoxAI runs directly within your modern web browser by utilizing highly advanced local neural synthesis systems and phonetic BCP-47 engines built into your operating system. Because the speech processing is performed entirely client-side, the platform can be scaled to millions of users with zero cloud processing fees, keeping the platform permanently free for baseline creations."
    },
    {
      question: "Are these voice files copyrighted, or can I use them in monetized media?",
      answer: "All recordings synthesized through the VoxAI platform utilizing standard free voices are 100% royalty-free. You can use them for commercial projects, podcasts, YouTube monetization, educational curricula, and broadcast media with zero licensing payments."
    },
    {
      question: "Can I simulate different subscriber plans, e.g. upgrading to Pro?",
      answer: "Yes! Our platform features a full-fidelity 'SaaS Pricing Simulator' below. By clicking 'Simulate Activation' on the Pro tier card, your client profile is instantly awarded Pro status, which activates premium-only voices, lifts generation limitations, and adds simulation audit records to your analytics dashboard."
    },
    {
      question: "Will Web Speech APIs work on all devices?",
      answer: "Yes! Modern web browsers on Android, iOS, Windows, macOS, and Linux are equipped with high-performance speech synthesis engines. Speech parameters automatically fall back gracefully to equivalent high-fidelity phonetic variants depending on your operating system architecture."
    }
  ];

  const handleSimulateUpgrade = (tier: 'Pro' | 'Enterprise') => {
    setUserStats(prev => ({
      ...prev,
      tier: tier,
      apiCallsLimit: tier === 'Pro' ? 100000 : 999999
    }));
    addLog('Tier Upgrade Simulation Completed', `Creator account upgraded to the ${tier} Sandbox Tier successfully. Premium access unlocked.`, 'auth');
    alert(`Success! You have been upgraded to the ${tier} simulator tier. Exclusive premium voices are now unlocked inside Creator Studio and Voice Library!`);
    setCurrentTab('dashboard');
  };

  const trendingVoices = voices.slice(4, 8); // Slice 4 voices

  return (
    <div className="bg-transparent text-white/90">
      
      {/* 1. TRENDING VOICE SHOWCASE */}
      <section className="py-16 border-t border-white/10 bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold text-violet-400 font-mono tracking-widest uppercase">Platform Gallery</span>
            <h2 className="text-3xl font-bold text-white mt-1.5 mb-4 font-display">Trending Synthetic Voices</h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Discover popular voice profiles crafted for narration, marketing announcements, characters, and professional tutoring formats.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingVoices.map((voice) => {
              const isSpeaking = currentlySpeakingVoiceId === voice.id;
              return (
                <div 
                  key={voice.id}
                  className="group relative rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-white/20 hover:bg-white/10 transition-all flex flex-col justify-between backdrop-blur-sm shadow-sm"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr ${voice.accentColor} text-white font-bold text-shadow shadow-md`}>
                        {voice.name[0]}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-amber-400">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span className="font-semibold">{voice.rating}</span>
                      </div>
                    </div>

                    <div className="text-left">
                      <span className="text-[10px] font-mono text-violet-400 uppercase tracking-widest leading-none block mb-1">
                        {voice.category}
                      </span>
                      <h3 className="text-sm font-bold text-white leading-normal truncate">{voice.name}</h3>
                      <p className="text-[11px] text-white/40 mt-0.5 leading-normal">{voice.accent} Accent</p>
                      
                      <p className="text-[11.5px] text-white/70 mt-3 leading-relaxed line-clamp-3">
                        {voice.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[9px] font-mono text-white/30">
                      {voice.downloads.toLocaleString()} usages
                    </span>
                    <button
                      onClick={() => onPlayVoice(voice)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-transform active:scale-95 ${
                        isSpeaking
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-white/10 hover:bg-violet-600 text-white/90 hover:text-white'
                      }`}
                    >
                      {isSpeaking ? (
                        <>Speaking...</>
                      ) : (
                        <>Test Voice</>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <button 
              onClick={() => setCurrentTab('library')}
              className="inline-flex items-center gap-2 text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors group"
            >
              Explore all voices in our unified voice library 
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC SAAS PRICING MATRIX */}
      <section className="py-16 border-t border-white/10 bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold text-violet-400 font-mono tracking-widest uppercase">SaaS Pricing Sandbox</span>
            <h2 className="text-3xl font-bold text-white mt-1.5 mb-4 font-display">Flexible Creator Budgets</h2>
            <p className="text-white/50 text-sm leading-relaxed">
              VoxAI is fully open-source and free, meaning you can toggle subscription levels instantly inside this simulation environment.
            </p>

            {/* Toggle slider */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className={`text-xs ${!isYearly ? 'text-white' : 'text-white/40'}`}>Monthly</span>
              <button 
                onClick={() => setIsYearly(!isYearly)}
                className="relative h-6 w-11 rounded-full bg-violet-600 p-0.5 transition-colors focus:outline-none"
              >
                <div className={`h-5 w-5 rounded-full bg-white transition-transform ${isYearly ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
              <span className={`text-xs ${isYearly ? 'text-white' : 'text-white/40'}`}>Yearly <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full ml-1">Save 20%</span></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Free Tier */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 flex flex-col justify-between hover:border-white/20 transition-colors backdrop-blur-sm relative">
              <div>
                <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest">Hobbyist</h3>
                <p className="text-sm font-semibold text-white/50 mt-1">Natively Shared Voices</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-white">$0</span>
                  <span className="text-white/30 text-xs"> / permanently</span>
                </div>
                <ul className="space-y-3.5 text-xs text-left text-white/60">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> Open Access to Sarah & Arthur</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> Full Voice Library Search & Filter</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> Max 5,000 chars per generation</li>
                  <li className="flex items-center gap-2 text-white/30"><Check className="h-4 w-4 text-white/20 shrink-0" /> No premium educational models</li>
                </ul>
              </div>
              <div className="mt-8">
                <button 
                  disabled={userStats.tier === 'Free'}
                  onClick={() => {
                    setUserStats(prev => ({ ...prev, tier: 'Free', apiCallsLimit: 1000 }));
                    addLog('Tier Reverted To Free', 'User profile downgraded to standard Free hobby limits.', 'auth');
                    alert("Reverted successfully to the Free Hobbyist Tier!");
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    userStats.tier === 'Free'
                      ? 'border-white/5 bg-white/5 text-white/30 cursor-not-allowed'
                      : 'border-white/10 hover:border-white/20 hover:text-white bg-white/5'
                  }`}
                >
                  {userStats.tier === 'Free' ? 'Active Hobbyist' : 'Downgrade to Free'}
                </button>
              </div>
            </div>

            {/* Pro Tier */}
            <div className="rounded-2xl border border-violet-500 bg-white/10 p-8 flex flex-col justify-between hover:scale-[1.01] hover:bg-white/15 transition-transform backdrop-blur-md relative ring-1 ring-violet-500">
              <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-widest font-mono">
                Most Popular
              </div>
              <div>
                <h3 className="text-xs font-semibold text-violet-400 uppercase tracking-widest">Creator Pro</h3>
                <p className="text-sm font-semibold text-white/60 mt-1">High-Fidelity AI Premium</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-white">${isYearly ? '15' : '19'}</span>
                  <span className="text-white/40 text-xs"> / month</span>
                </div>
                <ul className="space-y-3.5 text-xs text-left text-white/80">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-violet-400 shrink-0" /> Unlock ALL 30+ Premium Voices</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-violet-400 shrink-0" /> Simulated high-speed generation rates</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-violet-400 shrink-0" /> Advanced Script refining assistance</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-violet-400 shrink-0" /> Commercial royalty-free licensing</li>
                </ul>
              </div>
              <div className="mt-8">
                <button 
                  onClick={() => handleSimulateUpgrade('Pro')}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-violet-600 tracking-wide font-semibold shadow-lg shadow-violet-600/20 hover:bg-violet-500 active:scale-95 transition-all"
                >
                  {userStats.tier === 'Pro' ? '★ Pro Mode Active' : 'Simulate Pro Upgrade'}
                </button>
              </div>
            </div>

            {/* Enterprise Tier */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 flex flex-col justify-between hover:border-white/20 transition-colors backdrop-blur-sm relative">
              <div>
                <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest">Enterprise</h3>
                <p className="text-sm font-semibold text-white/50 mt-1">Collaborative Audio Teams</p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-white">${isYearly ? '79' : '99'}</span>
                  <span className="text-white/40 text-xs"> / month</span>
                </div>
                <ul className="space-y-3.5 text-xs text-left text-white/60">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> Unlimited character syntheses</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> Custom accent cloning configurations</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> Multi-speaker dialog scripts</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400 shrink-0" /> Dedicated priority customer SLA</li>
                </ul>
              </div>
              <div className="mt-8">
                <button 
                  onClick={() => handleSimulateUpgrade('Enterprise')}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold border transition-all border-white/10 bg-white/5 hover:border-white/20 hover:text-white ${
                    userStats.tier === 'Enterprise' ? 'border-violet-500 text-violet-400 bg-white/10 ring-1 ring-violet-500' : ''
                  }`}
                >
                  {userStats.tier === 'Enterprise' ? '★ Enterprise Active' : 'Simulate Enterprise'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. TESTIMONIALS SLIDER */}
      <section className="py-16 border-t border-white/10 bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold text-violet-400 font-mono tracking-widest uppercase">User Trust</span>
            <h2 className="text-3xl font-bold text-white mt-1.5 mb-4 font-display">Vocalists & Creators Love VoxAI</h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Join thousands of indie authors and video developers who rely on our platform to narrate scripts instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, i) => (
              <div 
                key={i}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm flex flex-col justify-between text-left"
              >
                <div>
                  <div className="flex gap-1 text-amber-500 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current shrink-0" />)}
                  </div>
                  <p className="text-white/80 text-sm italic leading-relaxed">
                    "{test.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-6 border-t border-white/5 pt-4">
                  <img 
                    src={test.avatar} 
                    alt={test.name} 
                    className="h-9 w-9 rounded-full object-cover border border-white/10 shrink-0"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white leading-none">{test.name}</span>
                    <span className="text-[10px] text-white/40 leading-none mt-1">{test.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PROFESSIONAL FAQ COLLAPSIBLE */}
      <section className="py-16 border-t border-white/10 bg-transparent">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-violet-400 font-mono tracking-widest uppercase">Help center</span>
            <h2 className="text-3xl font-bold text-white mt-1.5 mb-4 font-display">Frequently Asked Questions</h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Answers to common queries regarding browser voices, commercial audio licensing and subscription sandbox properties.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index}
                  className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden text-left"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-5 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`h-4 w-4 text-white/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isOpen && (
                    <div className="p-5 pt-0 border-t border-white/5 text-xs sm:text-sm text-white/70 leading-relaxed bg-white/5">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
