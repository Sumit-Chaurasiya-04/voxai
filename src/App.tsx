import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import HomeViews from './components/HomeViews';
import TextToSpeechInterface from './components/TextToSpeechInterface';
import VoiceLibrary from './components/VoiceLibrary';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import BlogSystem from './components/BlogSystem';
import LegalPages from './components/LegalPages';

import { PRESET_VOICES } from './data/voices';
import { Voice, UserStats, Generation, SystemLog } from './types';

export default function App() {
  // Navigation & Routing state
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Master local database states
  const [voices, setVoices] = useState<Voice[]>(PRESET_VOICES);
  const [userStats, setUserStats] = useState<UserStats>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('voxai_stats');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.warn("Retrying stats seed.");
        }
      }
    }
    return {
      tier: 'Free',
      generationsCount: 6,
      charactersCount: 14200,
      apiCallsLimit: 1000,
      savedVoices: ['en-us-sarah', 'en-gb-arthur']
    };
  });

  const [generations, setGenerations] = useState<Generation[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('en-us-sarah');
  const [currentlySpeakingVoiceId, setCurrentlySpeakingVoiceId] = useState<string | null>(null);

  // Synchronize user stats to localStorage
  useEffect(() => {
    localStorage.setItem('voxai_stats', JSON.stringify(userStats));
  }, [userStats]);

  // Create real-time logged parameters
  const addLog = (
    action: string,
    details: string,
    type: 'synth' | 'auth' | 'admin' | 'download'
  ) => {
    const newLog: SystemLog = {
      id: 'log-' + Date.now() + Math.random().toString(36).substr(2, 4),
      action,
      user: 'Sandbox Creator',
      details,
      timestamp: new Date().toLocaleTimeString(),
      type
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Seed initial audit log streams
  useEffect(() => {
    addLog('Platform Initialized', 'VoxAI Client Space Core boot success. Virtual sound drivers linked.', 'auth');
    addLog('System Check completed', '30 dynamic operating system voice packages scanned.', 'admin');
  }, []);

  // Global Audio Playback preview handler
  const handlePlayVoicePreview = (voice: Voice) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert("TTS audio playback is not supported by your browser software.");
      return;
    }

    // Toggle Speak
    if (currentlySpeakingVoiceId === voice.id) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingVoiceId(null);
      addLog('Audio Stream Stopped', `Active playback preview cancelled for voice: ${voice.name}`, 'synth');
      return;
    }

    window.speechSynthesis.cancel();

    // Prepare demo utterance
    const utterance = new SpeechSynthesisUtterance(voice.sampleText);
    
    // Find matching speech voices
    const sysVoices = window.speechSynthesis.getVoices();
    const langMap: { [key: string]: string } = {
      'English (US)': 'en-US',
      'English (UK)': 'en-GB',
      'English (India)': 'en-IN',
      'Spanish': 'es',
      'French': 'fr',
      'German': 'de',
      'Japanese': 'ja',
      'Italian': 'it',
      'Chinese': 'zh'
    };
    const targetCode = langMap[voice.language] || 'en';
    
    const matchedVoice = sysVoices.find(v => 
      v.name.toLowerCase().includes(voice.name.split(' ')[0].toLowerCase()) ||
      v.lang.toLowerCase().replace('_', '-').startsWith(targetCode.toLowerCase())
    ) || sysVoices.find(v => v.lang.toLowerCase().startsWith(targetCode.toLowerCase()))
      || sysVoices[0];

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    setCurrentlySpeakingVoiceId(voice.id);
    addLog('Audio Preview Play', `Synthesizing greeting demo for voice "${voice.name}"`, 'synth');

    utterance.onend = () => {
      setCurrentlySpeakingVoiceId(null);
    };

    utterance.onerror = () => {
      setCurrentlySpeakingVoiceId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Safe router rendering mapper
  const renderTabContent = () => {
    switch (currentTab) {
      case 'home':
        return (
          <>
            <Hero 
              voices={voices}
              onPlayVoice={handlePlayVoicePreview}
              currentlySpeakingVoiceId={currentlySpeakingVoiceId}
              setCurrentTab={setCurrentTab}
            />
            <HomeViews 
              voices={voices}
              onPlayVoice={handlePlayVoicePreview}
              currentlySpeakingVoiceId={currentlySpeakingVoiceId}
              userStats={userStats}
              setUserStats={setUserStats}
              addLog={addLog}
              setCurrentTab={setCurrentTab}
            />
          </>
        );
      case 'tts':
        return (
          <TextToSpeechInterface 
            voices={voices}
            userStats={userStats}
            setUserStats={setUserStats}
            generations={generations}
            setGenerations={setGenerations}
            addLog={addLog}
            selectedVoiceId={selectedVoiceId}
            setSelectedVoiceId={setSelectedVoiceId}
            currentlySpeakingVoiceId={currentlySpeakingVoiceId}
            setCurrentlySpeakingVoiceId={setCurrentlySpeakingVoiceId}
            setCurrentTab={setCurrentTab}
          />
        );
      case 'library':
        return (
          <VoiceLibrary 
            voices={voices}
            onPlayVoice={handlePlayVoicePreview}
            currentlySpeakingVoiceId={currentlySpeakingVoiceId}
            userStats={userStats}
            setUserStats={setUserStats}
            addLog={addLog}
            setSelectedVoiceId={setSelectedVoiceId}
            setCurrentTab={setCurrentTab}
          />
        );
      case 'dashboard':
        return (
          <UserDashboard 
            voices={voices}
            userStats={userStats}
            setUserStats={setUserStats}
            generations={generations}
            onPlayVoice={handlePlayVoicePreview}
            currentlySpeakingVoiceId={currentlySpeakingVoiceId}
            addLog={addLog}
            setCurrentTab={setCurrentTab}
          />
        );
      case 'admin':
        return (
          <AdminDashboard 
            voices={voices}
            setVoices={setVoices}
            logs={logs}
            setLogs={setLogs}
            addLog={addLog}
          />
        );
      case 'blog':
        return (
          <BlogSystem 
            addLog={addLog}
          />
        );
      case 'privacy':
      case 'terms':
      case 'cookie':
      case 'dmca':
      case 'disclaimer':
        return (
          <LegalPages />
        );
      default:
        return (
          <div className="py-20 text-center text-neutral-400">
            Route under construction. Please check back later.
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col justify-between overflow-x-hidden antialiased relative">
      {/* Background Mesh Gradients */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[130px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-900/15 rounded-full blur-[140px] pointer-events-none z-0"></div>

      <div className="z-10 flex flex-col justify-between min-h-screen relative">
        <div>
          {/* Navigation Bar */}
          <Navbar 
            currentTab={currentTab} 
            setCurrentTab={setCurrentTab} 
            userStats={userStats}
          />

          {/* Dynamic Route Body */}
          <main className="relative pt-4">
            {renderTabContent()}
          </main>
        </div>

        {/* Footer link structure */}
        <Footer setCurrentTab={setCurrentTab} />
      </div>
    </div>
  );
}
