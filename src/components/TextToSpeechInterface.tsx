import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Square, Sparkles, Volume2, Download, Trash2, ArrowRight, Save, History, FileText, Languages, RefreshCcw, Star } from 'lucide-react';
import { Voice, Generation, UserStats } from '../types';

interface TextToSpeechInterfaceProps {
  voices: Voice[];
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
  generations: Generation[];
  setGenerations: React.Dispatch<React.SetStateAction<Generation[]>>;
  addLog: (action: string, details: string, type: 'synth' | 'auth' | 'admin' | 'download') => void;
  selectedVoiceId: string;
  setSelectedVoiceId: (id: string) => void;
  currentlySpeakingVoiceId: string | null;
  setCurrentlySpeakingVoiceId: (id: string | null) => void;
  setCurrentTab: (tab: string) => void;
}

export default function TextToSpeechInterface({
  voices,
  userStats,
  setUserStats,
  generations,
  setGenerations,
  addLog,
  selectedVoiceId,
  setSelectedVoiceId,
  currentlySpeakingVoiceId,
  setCurrentlySpeakingVoiceId,
  setCurrentTab
}: TextToSpeechInterfaceProps) {
  const [text, setText] = useState('Welcome to VoxAI Studio. Paste your script here, or select a template to test our advanced voice profiles.');
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [isAiRefining, setIsAiRefining] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const waveformCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Script templates
  const SCRIPT_TEMPLATES = {
    commercial: "Are you ready to elevate your digital workflow? Introducing the all-new ultra lightweight cloud matrix, synthesized with high speed throughput and maximum security parameters. Upgrade your network node today.",
    narration: "The ancient library was silent, save for the rhythmic turning of centuries-old parchment. Professor Marcus adjusted his spectacles, his eyes tracing the faded illustrations of an forgotten kingdom.",
    videogames: "Warning! Fusion core breach imminent! All personnel must evacuate the reactor deck immediately. Security units, engage safety protocols and retreat to the lower elevator.",
    audiobooks: "Chapter Three. The morning fog drifted slowly across the silent English valley, wrapping the old church of Arthur-On-Vance in a thick gray blanket of secrets.",
    professional: "According to quantum physics, the wave function describes the complete mathematical state of any physical subatomic particle or system, collapsing only upon localized observation."
  };

  const handleApplyTemplate = (type: keyof typeof SCRIPT_TEMPLATES) => {
    setText(SCRIPT_TEMPLATES[type]);
    addLog('Preset Loaded', `Applied "${type}" text script template into editor.`, 'synth');
  };

  // Language list
  const uniqueLanguages = ['all', 'English (US)', 'English (UK)', 'English (India)', 'Spanish', 'French', 'German', 'Japanese', 'Italian', 'Chinese'];

  // Filter voices based on selected Language and Category
  const filteredVoices = voices.filter(voice => {
    const matchLang = selectedLanguage === 'all' || voice.language === selectedLanguage;
    const matchCategory = categoryFilter === 'all' || voice.category === categoryFilter;
    return matchLang && matchCategory;
  });

  const selectedVoice = voices.find(v => v.id === selectedVoiceId) || voices[0];

  // Synthesize Speech Natively in Browser
  const handleSpeak = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert("Speech Synthesis is not supported in this browser version.");
      return;
    }

    // Stop current synthesis if any
    window.speechSynthesis.cancel();

    if (currentlySpeakingVoiceId !== null) {
      setCurrentlySpeakingVoiceId(null);
      return;
    }

    if (!text.trim()) {
      alert("Please enter some text to synthesize.");
      return;
    }

    // Find browser matching voice
    const sysVoices = window.speechSynthesis.getVoices();
    let selectedSysVoice: SpeechSynthesisVoice | null = null;

    // Smart accent translation map
    const langMap: { [key: string]: string } = {
      'English (US)': 'en-US',
      'English (UK)': 'en-GB',
      'English (India)': 'en-IN',
      'Spanish': 'es-ES',
      'French': 'fr-FR',
      'German': 'de-DE',
      'Japanese': 'ja-JP',
      'Italian': 'it-IT',
      'Chinese': 'zh-CN'
    };

    const targetLangCode = langMap[selectedVoice.language] || 'en-US';

    // Find a voice matching target language or name
    selectedSysVoice = sysVoices.find(v => 
      v.name.toLowerCase().includes(selectedVoice.name.split(' ')[0].toLowerCase()) ||
      v.lang.toLowerCase().replace('_', '-').startsWith(targetLangCode.toLowerCase())
    ) || sysVoices.find(v => v.lang.toLowerCase().startsWith(targetLangCode.toLowerCase()))
      || sysVoices[0];

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedSysVoice) {
      utterance.voice = selectedSysVoice;
    }
    
    // Set variables
    utterance.rate = speed;
    utterance.pitch = pitch;
    utterance.volume = volume;

    // Track state
    setCurrentlySpeakingVoiceId(selectedVoice.id);
    activeUtteranceRef.current = utterance;

    addLog('Synthesis Initiated', `Processed text synthesis chunk of ${text.length} chars under Voice: "${selectedVoice.name}"`, 'synth');

    utterance.onend = () => {
      setCurrentlySpeakingVoiceId(null);
      // Save generation to history
      const newGen: Generation = {
        id: 'gen-' + Date.now(),
        text: text,
        voiceId: selectedVoice.id,
        voiceName: selectedVoice.name,
        characterCount: text.length,
        timestamp: new Date().toLocaleTimeString(),
        settings: { speed, pitch, volume }
      };

      setGenerations(prev => [newGen, ...prev]);
      setUserStats(prev => ({
        ...prev,
        generationsCount: prev.generationsCount + 1,
        charactersCount: prev.charactersCount + text.length
      }));
    };

    utterance.onerror = (e) => {
      console.error("Speech Synthesis error:", e);
      setCurrentlySpeakingVoiceId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Run wave visualizer drawing loop
  useEffect(() => {
    const canvas = waveformCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      const w = canvas.width = canvas.parentElement?.clientWidth || 500;
      const h = canvas.height = 70;

      ctx.clearRect(0, 0, w, h);

      // Create rich slate gradients
      const gradient = ctx.createLinearGradient(0, 0, w, 0);
      gradient.addColorStop(0, '#eb4899'); // Pink
      gradient.addColorStop(0.5, '#6366f1'); // Indigo
      gradient.addColorStop(1, '#06b6d4'); // Cyan

      ctx.beginPath();
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2.5;

      const isSpeaking = currentlySpeakingVoiceId !== null;
      let amplitude = isSpeaking ? 18 : 0; // Flat line if speaking inactive
      const frequencies = isSpeaking ? 4 : 0.8;

      // Add a small noise jitter if speaking
      if (isSpeaking) {
        amplitude += Math.sin(Date.now() / 150) * 4;
      }

      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        // Base sine calculation
        const y = h / 2 + Math.sin(x * 0.02 * frequencies + phase) * amplitude * Math.sin(x * Math.PI / w);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw secondary backing glow wave
      if (isSpeaking) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
        ctx.lineWidth = 4;
        for (let x = 0; x < w; x++) {
          const y = h / 2 + Math.sin(x * 0.03 * frequencies - phase * 0.8) * (amplitude * 0.6) * Math.sin(x * Math.PI / w);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      phase += isSpeaking ? 0.15 : 0.02; // Slower speed if idle
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [currentlySpeakingVoiceId]);

  // AI Refine script logic using Gemini /api/refine Express route or simulation fallback
  const handleAiRefinement = async () => {
    if (!aiPrompt.trim()) {
      alert("Please state what you want to write or refine (e.g. 'Make it sound more emotional' or 'Write a short coupon script').");
      return;
    }

    setIsAiRefining(true);
    addLog('AI Prompt Sent', `Sending script refinement request with instructions: "${aiPrompt}"`, 'synth');

    try {
      // Fetch to server-side express route
      const response = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, originalText: text })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.refinedText) {
          setText(data.refinedText);
          addLog('AI Refine Completed', 'Gemini successfully reconstructed the voice scripture.', 'synth');
        }
      } else {
        // Fallback simulated refinement directly client-side if API key is unconfigured
        setTimeout(() => {
          const simulatedTexts: { [key: string]: string } = {
            emotion: `Oh, what a gorgeous twilight evening! ${text} My heart is literally bursting with excitement to share this magnificent discovery with you!`,
            advertise: `★ ATTENTION CREATORS! ★ ${text} Don't wait. Empower your business node with our cutting edge cloud matrix today!`,
            shorten: `${text.split('.').slice(0, 2).join('. ') || text}`
          };

          let chosenSim = simulatedTexts.advertise;
          if (aiPrompt.toLowerCase().includes('emotion') || aiPrompt.toLowerCase().includes('happy')) {
            chosenSim = simulatedTexts.emotion;
          } else if (aiPrompt.toLowerCase().includes('short') || aiPrompt.toLowerCase().includes('brief')) {
            chosenSim = simulatedTexts.shorten;
          }

          setText(chosenSim);
          addLog('AI Refinement Simulated', 'Refinement simulation resolved successfully in local worker.', 'synth');
        }, 800);
      }
    } catch (err) {
      console.warn("AI Script refiner server failure, falling back to client simulation.", err);
    } finally {
      setIsAiRefining(false);
      setAiPrompt('');
    }
  };

  // Mock download file generation for TTS
  const handleDownload = (genItem: Generation) => {
    // Generate a simple dummy file blob representing the generated text speech wav file
    const wavHeaderString = `RIFF_VOXAI_SPEECH_DATA_HEADER_${genItem.id}`;
    const blob = new Blob([wavHeaderString, genItem.text], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `voxai_speech_${genItem.id}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    addLog('Audio Download Triggered', `WAV file speech packet downloaded for Generation ID: ${genItem.id}`, 'download');
    alert(`Success! Simulated High-Quality WAV Audio file exported for generation "${genItem.id}"!`);
  };

  const handleToggleFavoriteVoice = (vId: string) => {
    const isSaved = userStats.savedVoices.includes(vId);
    let updated: string[];
    if (isSaved) {
      updated = userStats.savedVoices.filter(id => id !== vId);
    } else {
      updated = [...userStats.savedVoices, vId];
    }
    setUserStats(prev => ({ ...prev, savedVoices: updated }));
  };

  const isSelectedVoiceSaved = userStats.savedVoices.includes(selectedVoiceId);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-white text-left">
      
      <div className="text-left mb-8 pb-4 border-b border-white/10">
        <span className="text-xs font-bold text-violet-400 font-mono uppercase tracking-widest leading-none">VoxAI Workspace</span>
        <h1 className="text-3xl font-bold text-white tracking-tight mt-1 font-display">Creator TTS Speech Studio</h1>
        <p className="text-xs sm:text-sm text-white/50 leading-normal mt-1">Micro-adjust pitch curves, volume levels, and speech speed. Let AI assist you in crafting gorgeous voiceovers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Waveform, Input, Presets (Col-8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Neon Active Waveform visual card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 relative overflow-hidden flex flex-col justify-center backdrop-blur-sm shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold font-mono text-white/40 uppercase tracking-widest inline-flex items-center gap-1.5">
                <Volume2 className="h-3 w-3 text-violet-400" /> Neural Wave Resonance
              </span>
              <span className={`text-[10px] font-mono font-bold uppercase ${currentlySpeakingVoiceId ? 'text-emerald-400 animate-pulse' : 'text-white/30'}`}>
                {currentlySpeakingVoiceId ? 'Device Synthesizer Active' : 'Speaker Standby'}
              </span>
            </div>

            {/* Dynamic wave canvas container */}
            <div className="h-[74px] flex items-center justify-center">
              <canvas ref={waveformCanvasRef} className="w-full pointer-events-none rounded-lg" />
            </div>
          </div>

          {/* Text Area Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6 space-y-4 backdrop-blur-sm shadow-sm">
            
            {/* Template Presets header row */}
            <div className="flex flex-wrap items-center gap-2 pb-3.5 border-b border-white/5">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider font-mono mr-2 flex items-center gap-1">
                <FileText className="h-3 w-3" /> Preset Script Templates:
              </span>
              {Object.keys(SCRIPT_TEMPLATES).map((key) => (
                <button
                  key={key}
                  onClick={() => handleApplyTemplate(key as any)}
                  className="px-2.5 py-1 text-[10px] font-medium rounded-lg bg-white/10 border border-white/10 text-white/70 hover:text-white hover:bg-white/20 capitalize"
                >
                  {key.replace('-', ' ')}
                </button>
              ))}
            </div>

            {/* Text Editor Input Box */}
            <div className="space-y-1">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={5000}
                placeholder="Paste or type your script here..."
                className="w-full min-h-[190px] bg-transparent text-sm sm:text-base text-white/90 placeholder-white/20 resize-none border-none focus:outline-none leading-relaxed"
              />
              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-white/40">
                <span>{text.length} / 5,000 max character count</span>
                <button 
                  onClick={() => setText('')}
                  className="hover:text-white transition-colors"
                >
                  Clear Editor
                </button>
              </div>
            </div>

            {/* AI Refinement prompt inputs */}
            <div className="pt-4 border-t border-white/5 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider font-mono">Linguistic Script Refiner</span>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 'Make it more energetic', 'Shorten this', 'Add promotional exclamation hooks'..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  disabled={isAiRefining}
                  className="flex-grow h-9 px-3 rounded-lg border border-white/10 bg-white/5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-violet-500"
                />
                <button
                  onClick={handleAiRefinement}
                  disabled={isAiRefining}
                  className="h-9 px-4 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold border border-violet-500/30 flex items-center gap-1.5 shrink-0 transition-colors disabled:opacity-50 shadow-sm"
                >
                  {isAiRefining ? (
                    <RefreshCcw className="h-3 w-3 animate-spin" />
                  ) : (
                    <>Refine <ArrowRight className="h-3 w-3" /></>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* Slider Controllers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm shadow-sm">
            {/* Speed Rate Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-white/50">Speech Rate Speed</span>
                <span className="font-mono text-violet-400 font-bold">{speed.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={2.0}
                step={0.05}
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full accent-violet-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-white/20 font-mono">
                <span>0.5x (Slow)</span>
                <span>1.0x (Normal)</span>
                <span>2.0x (Fast)</span>
              </div>
            </div>

            {/* Vocal Pitch Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-white/50">Vocal Pitch Tone</span>
                <span className="font-mono text-violet-400 font-bold">{pitch.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={2.0}
                step={0.05}
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full accent-violet-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-white/20 font-mono">
                <span>Low Baritone</span>
                <span>1.0x (Default)</span>
                <span>High Soprano</span>
              </div>
            </div>

            {/* Wave Volume Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-white/50">Output Gain Level</span>
                <span className="font-mono text-violet-400 font-bold">{(volume * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min={0.0}
                max={1.0}
                step={0.05}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full accent-violet-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-white/20 font-mono">
                <span>0% (Mute)</span>
                <span>50%</span>
                <span>100% (Max)</span>
              </div>
            </div>
          </div>

          {/* Trigger Synthesis row */}
          <div className="flex gap-4 items-center">
            <button
              onClick={handleSpeak}
              className={`flex-grow h-12 rounded-xl text-white font-extrabold text-sm tracking-wide shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 ${
                currentlySpeakingVoiceId !== null
                  ? 'bg-rose-600 shadow-rose-600/10'
                  : 'bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-600/20'
              }`}
            >
              {currentlySpeakingVoiceId !== null ? (
                <>
                  <Square className="h-4 w-4 fill-white" /> Stop Native Synthesis Playback
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-white" /> Speak Text via "{selectedVoice.name}"
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Side: Speaker details, Voices selector, History lists (Col-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Selected Voice Profile Summary Display */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4 backdrop-blur-md shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-mono">Selected Vocal Profile</span>
              <button
                onClick={() => handleToggleFavoriteVoice(selectedVoiceId)}
                className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                  isSelectedVoiceSaved
                    ? 'border-rose-500/20 bg-rose-500/5 text-rose-400'
                    : 'border-white/10 text-white/50 hover:text-white bg-white/5 hover:bg-white/10'
                }`}
              >
                <Star className={`h-3 w-3 ${isSelectedVoiceSaved ? 'fill-current' : ''}`} /> {isSelectedVoiceSaved ? 'Saved' : 'Save'}
              </button>
            </div>

            <div className="flex gap-3 items-center">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr ${selectedVoice.accentColor} text-white font-bold text-lg shadow`}>
                {selectedVoice.name[0]}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-white">{selectedVoice.name}</span>
                <span className="text-[10px] text-white/40 font-mono mt-0.5">{selectedVoice.accent} · {selectedVoice.gender}</span>
              </div>
            </div>

            <p className="text-[11px] text-white/70 leading-relaxed text-left font-sans">
              {selectedVoice.description}
            </p>

            <div className="pt-3 border-t border-white/5 flex justify-between text-[10px] font-mono text-white/40">
              <span>Rating: {selectedVoice.rating} ⭐</span>
              <span>Downloads: {selectedVoice.downloads.toLocaleString()}</span>
            </div>
          </div>

          {/* Quick Vocal Selection Panel */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4 backdrop-blur-md shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-mono">Change Speaker</span>
              <button
                onClick={() => setCurrentTab('library')}
                className="text-[10px] text-violet-400 hover:text-white transition-colors"
              >
                Open Library
              </button>
            </div>

            {/* Quick selectors for Languages */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-semibold text-white/40 uppercase font-mono">Language</span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => {
                    setSelectedLanguage(e.target.value);
                    const compatible = voices.find(v => e.target.value === 'all' || v.language === e.target.value);
                    if (compatible) setSelectedVoiceId(compatible.id);
                  }}
                  className="h-8 rounded-lg border border-white/10 bg-white/5 text-[11px] font-medium focus:outline-none px-2 text-white leading-normal"
                >
                  {uniqueLanguages.map(lang => (
                    <option key={lang} value={lang}>{lang === 'all' ? 'All Languages' : lang}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-white/40 uppercase font-mono">Format</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-8 rounded-lg border border-white/10 bg-white/5 text-[11px] font-medium focus:outline-none px-2 text-white leading-normal animate-fade-in"
                >
                  <option value="all">All Formats</option>
                  <option value="narration">Narration</option>
                  <option value="commercial">Commercial</option>
                  <option value="video-games">Video Games</option>
                  <option value="audiobooks">Audiobooks</option>
                  <option value="characters">Characters</option>
                  <option value="professional">Professional</option>
                </select>
              </div>
            </div>

            {/* List scrollbox */}
            <div className="space-y-1.5 max-h-[170px] overflow-y-auto pr-1">
              {filteredVoices.map(voice => (
                <button
                  key={voice.id}
                  onClick={() => setSelectedVoiceId(voice.id)}
                  className={`flex w-full items-center justify-between p-2 rounded-lg text-xs leading-none transition-colors border ${
                    selectedVoiceId === voice.id 
                      ? 'bg-white/10 border-violet-500/30 text-violet-400 ring-1 ring-violet-500' 
                      : 'border-transparent text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`inline-block h-2 w-2 rounded-full bg-gradient-to-tr ${voice.accentColor}`} />
                    <span className="font-semibold text-left">{voice.name}</span>
                  </div>
                  <span className="text-[9px] text-white/30 font-mono">{voice.gender}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Session Generations list */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4 text-left backdrop-blur-md shadow-sm">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-mono block">Session Synthesis Logs</span>
            {generations.length === 0 ? (
              <p className="text-[11px] text-white/30 text-center leading-normal py-6">Your synthesized text files will reside here during this session for quick download.</p>
            ) : (
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {generations.map(item => (
                  <div 
                    key={item.id}
                    className="p-3 rounded-xl border border-white/10 bg-white/5 flex flex-col justify-between gap-2 hover:border-white/20 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10.5px] font-bold text-white capitalize">{item.voiceName}</span>
                        <span className="text-[9px] text-white/40 font-mono mt-0.5">{item.timestamp} · {item.characterCount} chars</span>
                      </div>
                      <button
                        onClick={() => handleDownload(item)}
                        title="Download WAV speech audio"
                        className="p-1 rounded bg-white/10 border border-white/10 hover:bg-white/20 text-white transition-colors animate-pulse"
                      >
                        <Download className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="text-[10px] text-white/50 line-clamp-1 italic shrink-0">
                      "{item.text}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
