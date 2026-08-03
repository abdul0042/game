import React from 'react';
import { Zap, Building2, Trophy, HelpCircle, ChevronRight, Sparkles } from 'lucide-react';

export default function GameSelectScreen({ onSelectRunner, onSelectStacker, onOpenLeaderboard, onOpenSettings }) {
  return (
    <div className="relative w-full h-full min-h-[600px] flex flex-col items-center justify-between p-6 bg-slate-50 overflow-y-auto text-center">
      {/* Sky Ambient Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100/70 via-slate-50 to-emerald-50/50 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 pt-3 flex flex-col items-center">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-sky-800 bg-white border border-sky-300 shadow-md mb-2">
          <Sparkles className="w-4 h-4 text-amber-500" /> Tech Kiosk Game Suite
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-heading tracking-tight text-slate-900 uppercase">
          MULTIPLY YOUR TECH
        </h1>
        <p className="text-sm font-extrabold text-sky-700 mt-0.5 tracking-wide uppercase">
          Select a Kiosk Challenge Below
        </p>
      </div>

      {/* 2 Game Options Cards */}
      <div className="relative z-10 my-4 w-full max-w-sm flex flex-col gap-4">
        {/* Game 1: Scale Your Tech (Runner) */}
        <button
          onClick={onSelectRunner}
          className="group relative p-5 rounded-3xl glass-panel-glow bg-white border-2 border-emerald-400 hover:border-emerald-500 text-left shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex flex-col gap-2 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100/50 rounded-full -mr-8 -mt-8 pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100">
              <Zap className="w-3.5 h-3.5 text-emerald-600" /> 3D Runner Challenge
            </span>
            <ChevronRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
          </div>

          <h3 className="text-xl font-black font-heading text-slate-900 uppercase tracking-tight">
            1. Scale Your Tech
          </h3>
          <p className="text-xs font-extrabold text-sky-700 uppercase">
            AUTOMATE & MULTIPLY
          </p>
          <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
            Run forward, hit AI Automation gates, evolve your businessman character, and charge the Business Scaling Meter!
          </p>
        </button>

        {/* Game 2: Stack Your Tech Empire (Crane Tower Stacker) */}
        <button
          onClick={onSelectStacker}
          className="group relative p-5 rounded-3xl glass-panel-glow bg-white border-2 border-sky-400 hover:border-sky-500 text-left shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex flex-col gap-2 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-100/50 rounded-full -mr-8 -mt-8 pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-sky-800 bg-sky-100">
              <Building2 className="w-3.5 h-3.5 text-sky-600" /> Crane Stacker Physics
            </span>
            <ChevronRight className="w-5 h-5 text-sky-600 group-hover:translate-x-1 transition-transform" />
          </div>

          <h3 className="text-xl font-black font-heading text-slate-900 uppercase tracking-tight">
            2. Stack Your Tech Empire
          </h3>
          <p className="text-xs font-extrabold text-emerald-700 uppercase">
            ONE-TAP TOWER BUILDER
          </p>
          <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
            Tap to drop swinging tech modules (GoWhats, Billzzy, Fynovo, Ciphergate) and stack a skyscraper into space!
          </p>
        </button>
      </div>

      {/* Footer Nav */}
      <div className="relative z-10 w-full max-w-sm pb-4 flex items-center justify-center gap-6 text-sm font-bold text-slate-600">
        <button 
          onClick={onOpenLeaderboard}
          className="flex items-center gap-1.5 hover:text-sky-700 transition-colors"
        >
          <Trophy className="w-4 h-4 text-amber-600" /> Leaderboard
        </button>
        <span>•</span>
        <button 
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 hover:text-sky-700 transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-sky-600" /> Kiosk Setup
        </button>
      </div>
    </div>
  );
}
