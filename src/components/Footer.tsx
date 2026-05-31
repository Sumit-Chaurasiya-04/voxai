import React from 'react';
import { Mic2, Copyright, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export default function Footer({ setCurrentTab }: FooterProps) {
  const links = {
    studio: [
      { id: 'tts', label: 'Speech Synthesis Studio' },
      { id: 'library', label: 'Comprehensive Voice Library' },
      { id: 'dashboard', label: 'User Analytics Hub' }
    ],
    resources: [
      { id: 'blog', label: 'Case Studies & Blog' },
      { id: 'home', label: 'Feature Walkthrough' }
    ],
    legal: [
      { id: 'privacy', label: 'Privacy Policy' },
      { id: 'terms', label: 'Terms of Service' },
      { id: 'cookie', label: 'Cookie Policy' },
      { id: 'dmca', label: 'DMCA Disclaimer' }
    ]
  };

  return (
    <footer className="border-t border-white/10 bg-black/25 text-white/60 py-12 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-600">
                <Mic2 className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-md font-bold text-white tracking-tight font-display">VoxAI Engine</span>
            </div>
            <p className="text-xs text-white/40 leading-relaxed max-w-xs">
              Next-generation client-authoritative synthetic speech network. Powered by high-fidelity local OS voices and custom linguistic mapping.
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-violet-400 font-mono">
              <Sparkles className="h-3 w-3 animate-pulse" />
              <span>Full compliance & No server overhead</span>
            </div>
          </div>

          {/* Links Col 1: Studio */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/80 font-mono mb-4">TTS Product Studio</h4>
            <ul className="space-y-2.5 text-xs">
              {links.studio.map(link => (
                <li key={link.id}>
                  <button 
                    onClick={() => setCurrentTab(link.id)}
                    className="hover:text-white transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Col 2: Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/80 font-mono mb-4">Linguistic Resources</h4>
            <ul className="space-y-2.5 text-xs">
              {links.resources.map(link => (
                <li key={link.id}>
                  <button 
                    onClick={() => setCurrentTab(link.id)}
                    className="hover:text-white transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Col 3: Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/80 font-mono mb-4">Regulatory & Privacy</h4>
            <ul className="space-y-2.5 text-xs">
              {links.legal.map(link => (
                <li key={link.id}>
                  <button 
                    onClick={() => setCurrentTab(link.id)}
                    className="hover:text-white transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/30">
          <div className="flex items-center gap-1">
            <Copyright className="h-3.5 w-3.5" />
            <span>2026 VoxAI. Created with extreme micro-frontends. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-white/20">
              <ShieldCheck className="h-3 w-3" /> Built with local secure sandboxing
            </span>
            <span className="flex items-center gap-1 text-white/20 text-[10px]">
              Crafted in deep space <Heart className="h-2.5 w-2.5 text-violet-500 animate-pulse" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
