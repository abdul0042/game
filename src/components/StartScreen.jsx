import React from 'react';
import { Play, Trophy, Zap, AlertTriangle, Settings } from 'lucide-react';

export default function StartScreen({ onStartGame, onOpenLeaderboard, onOpenSettings }) {
  return (
    <div className="relative w-full h-full min-h-[600px] flex flex-col items-center justify-between p-6 bg-[#0a0e17] overflow-y-auto text-center text-slate-100 font-sans select-none">
      {/* Dark Ambient Background with subtle Cyan Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/20 via-[#0a0e17] to-[#0a0e17] pointer-events-none" />
      
      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Header Badge */}
      <div className="relative z-10 pt-6 flex flex-col items-center max-w-md w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-wide text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 mb-4 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Kiosk Terminal v2.4
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-heading tracking-tight text-slate-100">
          Scale Your Tech
        </h1>
        <p className="text-sm font-medium text-slate-400 mt-1.5 tracking-normal">
          Automate workflows and maximize efficiency
        </p>
      </div>

      {/* System Operation Guide */}
      <div className="relative z-10 my-6 w-full max-w-md flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-medium text-slate-400 tracking-wider">
            System Operations Guide
          </span>
          <span className="text-[11px] text-slate-500 font-mono">2 Lanes</span>
        </div>
        
        {/* Gate Showcase Cards */}
        <div className="grid grid-cols-2 gap-3 text-left">
          {/* Automation Gate */}
          <div className="p-3.5 rounded-xl glass-panel border border-cyan-500/20 bg-slate-900/50 hover:border-cyan-500/40 transition-colors">
            <div className="flex items-center justify-between text-cyan-400 font-medium text-xs font-heading">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> Automation
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20">3x Squad</span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-2">GoWhats AI Chatbot</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Automates customer routing</p>
          </div>

          {/* Fast Billing Gate */}
          <div className="p-3.5 rounded-xl glass-panel border border-cyan-500/20 bg-slate-900/50 hover:border-cyan-500/40 transition-colors">
            <div className="flex items-center justify-between text-cyan-400 font-medium text-xs font-heading">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> Instant POS
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20">2x Power</span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-2">Billzzy Billing</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Accelerates processing speed</p>
          </div>

          {/* Manual Entry Gate */}
          <div className="p-3.5 rounded-xl glass-panel border border-slate-800 bg-slate-900/30 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-slate-400 font-medium text-xs font-heading">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Manual Tasks
              </span>
              <span className="text-[11px] font-mono text-rose-400 bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-500/20">-5 Squad</span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-2">Paper Receipts</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Creates workflow bottlenecks</p>
          </div>

          {/* System Outage Gate */}
          <div className="p-3.5 rounded-xl glass-panel border border-slate-800 bg-slate-900/30 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-slate-400 font-medium text-xs font-heading">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> System Outage
              </span>
              <span className="text-[11px] font-mono text-rose-400 bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-500/20">-50% Squad</span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-2">Legacy Infrastructure</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Causes service interruptions</p>
          </div>
        </div>
      </div>

      {/* Action Play Button & Navigation */}
      <div className="relative z-10 w-full max-w-md pb-6 flex flex-col items-center gap-4">
        <button
          onClick={onStartGame}
          className="w-full py-3.5 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-base font-heading tracking-wide shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
        >
          <Play className="w-4 h-4 fill-slate-950 group-hover:translate-x-0.5 transition-transform" />
          Initialize Challenge
        </button>

        {/* Secondary Navigation */}
        <div className="flex items-center justify-center gap-6 text-xs font-medium text-slate-400 pt-1">
          <button 
            onClick={onOpenLeaderboard}
            className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
          >
            <Trophy className="w-4 h-4 text-slate-400 hover:text-cyan-400" /> Leaderboard
          </button>
          <span className="text-slate-700">•</span>
          <button 
            onClick={onOpenSettings}
            className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-400 hover:text-cyan-400" /> Kiosk Settings
          </button>
        </div>
      </div>
    </div>
  );
}
