import React, { useState } from 'react';
import { Users, HardDrive, Cpu, Key, Trash } from 'lucide-react';
import { Voice, SystemLog } from '../types';

interface AdminDashboardProps {
  voices: Voice[];
  setVoices: React.Dispatch<React.SetStateAction<Voice[]>>;
  logs: SystemLog[];
  setLogs: React.Dispatch<React.SetStateAction<SystemLog[]>>;
  addLog: (action: string, details: string, type: 'synth' | 'auth' | 'admin' | 'download') => void;
}

export default function AdminDashboard({
  voices,
  setVoices,
  logs,
  setLogs,
  addLog
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'audit' | 'users' | 'voices'>('audit');

  // Simulated platform users
  const [simulatedUsers, setSimulatedUsers] = useState([
    { id: 'usr-1', name: 'Marcus Thorne', email: 'marcus@thorne.io', role: 'ADMIN', status: 'Active', tier: 'Pro' },
    { id: 'usr-2', name: 'Evelyn Carter', email: 'evelyn@voxai.com', role: 'ADMIN', status: 'Active', tier: 'Enterprise' },
    { id: 'usr-3', name: 'Devin Larson', email: 'devin@larson.dev', role: 'USER', status: 'Active', tier: 'Free' },
    { id: 'usr-4', name: 'Sonia Alvarez', email: 'sonia@creative.com', role: 'USER', status: 'Active', tier: 'Pro' },
    { id: 'usr-5', name: 'Leopold Bloom', email: 'bloom@dublin.org', role: 'USER', status: 'Suspended', tier: 'Free' }
  ]);

  const toggleUserStatus = (id: string) => {
    setSimulatedUsers(prev => prev.map(usr => {
      if (usr.id === id) {
        const nextStatus = usr.status === 'Active' ? 'Suspended' : 'Active';
        addLog('User Status Toggled', `Creator account ID ${id} set as ${nextStatus} inside registry.`, 'admin');
        return { ...usr, status: nextStatus };
      }
      return usr;
    }));
  };

  const toggleVoicePremium = (id: string) => {
    setVoices(prev => prev.map(vc => {
      if (vc.id === id) {
        const nextPrem = !vc.isPremium;
        addLog('Voice Tier Modified', `Vocal profile "{${vc.name}}" isPremium status flagged as {${nextPrem}} by administrator.`, 'admin');
        return { ...vc, isPremium: nextPrem };
      }
      return vc;
    }));
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('System Logs Cleared', 'Administrator purged active session diagnostic audit streams.', 'admin');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-white text-left">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
        <div>
          <span className="text-xs font-bold text-rose-400 font-mono uppercase tracking-widest leading-none">ROOT ACCESS</span>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-1 font-display">Platform Admin Console</h1>
          <p className="text-xs sm:text-sm text-white/50 leading-normal mt-0.5">Oversee member databases, customize synthetic voice tiers, and monitor active runtime audit logs.</p>
        </div>
      </div>

      {/* Admin stats widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Total Users */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-center gap-4 backdrop-blur-sm shadow-sm">
          <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400">
            <Users className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-white/40 font-medium font-mono uppercase tracking-wider">Total Members</span>
            <span className="text-xl font-bold text-white mt-0.5 animate-pulse">42,401</span>
          </div>
        </div>

        {/* Global generations */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-center gap-4 backdrop-blur-sm shadow-sm">
          <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Cpu className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-white/40 font-medium font-mono uppercase tracking-wider">TTS Generations</span>
            <span className="text-xl font-bold text-white mt-0.5">301,400</span>
          </div>
        </div>

        {/* Active voices */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-center gap-4 backdrop-blur-sm shadow-sm">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <HardDrive className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-white/40 font-medium font-mono uppercase tracking-wider">Preset Engines</span>
            <span className="text-xl font-bold text-white mt-0.5">{voices.length} Profiles</span>
          </div>
        </div>

        {/* Gemini status */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-center gap-4 backdrop-blur-sm shadow-sm">
          <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
            <Key className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-white/40 font-medium font-mono uppercase tracking-wider">Linguistic API Key</span>
            <span className="text-xs font-semibold text-emerald-400 font-mono mt-1 inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Active Sandbox
            </span>
          </div>
        </div>

      </div>

      {/* Tables & Tabs */}
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden backdrop-blur-md shadow-sm">
        
        {/* Navigation Selector Tabs row */}
        <div className="flex border-b border-white/10 bg-white/5 px-4 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 text-xs font-bold font-mono uppercase tracking-widest border-b-2 transition-all ${
              activeTab === 'audit' 
                ? 'border-violet-500 text-white' 
                : 'border-transparent text-white/45 hover:text-white'
            }`}
          >
            System diagnostic diagnostics ({logs.length})
          </button>
          
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 text-xs font-bold font-mono uppercase tracking-widest border-b-2 transition-all ${
              activeTab === 'users' 
                ? 'border-violet-500 text-white' 
                : 'border-transparent text-white/45 hover:text-white'
            }`}
          >
            Member Database Management
          </button>

          <button
            onClick={() => setActiveTab('voices')}
            className={`px-4 py-2.5 text-xs font-bold font-mono uppercase tracking-widest border-b-2 transition-all ${
              activeTab === 'voices' 
                ? 'border-violet-500 text-white' 
                : 'border-transparent text-white/45 hover:text-white'
            }`}
          >
            Manage Preset Vocals
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-x-auto">
          
          {/* TAB 1: SYSTEM DIAGNOSTIC LOGS */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5 text-xs text-white/40">
                <span>The session diagnosis prints local audio, refinement, and account upgrade events in real-time.</span>
                {logs.length > 0 && (
                  <button 
                    onClick={clearLogs}
                    className="text-rose-400 hover:text-rose-300 font-mono text-[10px] uppercase font-bold inline-flex items-center gap-1 border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 rounded-lg"
                  >
                    <Trash className="h-3 w-3" /> Clear Console
                  </button>
                )}
              </div>

              {logs.length === 0 ? (
                <div className="text-center py-16 text-white/30 font-mono text-xs">
                  Console diagnostic caches empty. Generate standard TTS speeches or upgrade your tier to print audits.
                </div>
              ) : (
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                  {logs.map((log) => (
                    <div 
                      key={log.id} 
                      className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:border-white/20 transition-all shadow-sm"
                    >
                      <div className="flex items-baseline gap-2">
                        <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded shrink-0 ${
                          log.type === 'auth' ? 'bg-violet-500/10 text-violet-400 border border-violet-500/10' :
                          log.type === 'admin' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/10' :
                          log.type === 'synth' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/10' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/10'
                        }`}>
                          {log.type}
                        </span>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-bold text-white/95">{log.action}</span>
                          <span className="text-[10px] text-white/50 leading-normal mt-0.5">{log.details}</span>
                        </div>
                      </div>

                      <div className="text-right whitespace-nowrap">
                        <span className="text-[10px] text-white/30 font-mono">{log.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MEMBER DATABASE */}
          {activeTab === 'users' && (
            <table className="w-full text-left text-xs text-white/60 border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-white/40 uppercase font-mono tracking-wider font-bold">
                  <th className="py-3 px-2">Member ID</th>
                  <th className="py-3 px-2">Name / Contact</th>
                  <th className="py-3 px-2">Role</th>
                  <th className="py-3 px-2">Active Tier</th>
                  <th className="py-3 px-2 text-right">Status Operation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {simulatedUsers.map(usr => (
                  <tr key={usr.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-2 font-mono text-white/40 text-[10px]">{usr.id}</td>
                    <td className="py-3.5 px-2">
                      <div className="flex flex-col">
                        <span className="font-bold text-white/95">{usr.name}</span>
                        <span className="text-[10px] text-white/30">{usr.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-2">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold leading-none ${
                        usr.role === 'ADMIN' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/10' : 'bg-white/10 text-white/60'
                      }`}>
                        {usr.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 font-mono text-violet-400 text-[10px]">{usr.tier} Account</td>
                    <td className="py-3.5 px-2 text-right">
                      <button
                        onClick={() => toggleUserStatus(usr.id)}
                        className={`px-2 py-1 text-[10px] font-bold font-mono rounded-md hover:text-white transition-all ${
                          usr.status === 'Active'
                            ? 'bg-white/10 text-white/60 hover:bg-white/20'
                            : 'bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25'
                        }`}
                      >
                        {usr.status === 'Active' ? '▌ SUSPEND' : '▶ ACTIVATE'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* TAB 3: MANAGE PRESET VOCALS */}
          {activeTab === 'voices' && (
            <table className="w-full text-left text-xs text-white/60 border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-white/40 uppercase font-mono tracking-wider font-bold">
                  <th className="py-3 px-2">Profile ID</th>
                  <th className="py-3 px-2">Voice Name</th>
                  <th className="py-3 px-2">Accent Locale</th>
                  <th className="py-3 px-2">Use Category</th>
                  <th className="py-3 px-2 text-right">Premium Toggling</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {voices.slice(0, 8).map(vc => (
                  <tr key={vc.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-2 font-mono text-white/30 text-[10px]">{vc.id}</td>
                    <td className="py-3.5 px-2">
                      <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full bg-gradient-to-tr ${vc.accentColor}`} />
                        <span className="font-bold text-white/95">{vc.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-2 font-mono text-[10px]">{vc.accent} · {vc.gender}</td>
                    <td className="py-3.5 px-2 capitalize text-white/70">{vc.category}</td>
                    <td className="py-3.5 px-2 text-right">
                      <button
                        onClick={() => toggleVoicePremium(vc.id)}
                        className={`px-2 py-1 text-[10px] font-bold font-mono rounded border transition-colors ${
                          vc.isPremium 
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/20 hover:bg-amber-500/20' 
                            : 'border-white/10 text-white/40 hover:border-white/20'
                        }`}
                      >
                        {vc.isPremium ? '★ Premium' : '☆ Free Voice'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>
      </div>

    </div>
  );
}
