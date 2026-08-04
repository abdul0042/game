import React from 'react';
import { Building2, Puzzle, Trophy, HelpCircle, ChevronRight, Sparkles } from 'lucide-react';

export default function GameSelectScreen({ onSelectStacker, onSelectJigsaw, onOpenLeaderboard, onOpenSettings }) {
  return (
    <div className="relative w-full h-full min-h-[600px] flex flex-col items-center justify-between p-6 bg-gradient-to-b from-sky-50 via-slate-50 to-emerald-50 text-slate-900 overflow-y-auto text-center font-sans select-none">
      {/* Dynamic Ambient Sky Glow Circles */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-sky-200/40 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      {/* Header */}
      <div className="relative z-10 pt-4 flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-black font-sora tracking-tight uppercase">
          <span className="text-gradient-sky">MULTIPLY</span> YOUR TECH
        </h1>
        
        <p className="text-xs sm:text-sm font-extrabold text-slate-600 mt-1 tracking-wider uppercase font-sans">
          Select a Kiosk Challenge Below
        </p>
      </div>

      {/* 2 Game Options Cards (Stack Your Tech Empire + App Logo Jigsaw) */}
      <div className="relative z-10 my-6 w-full max-w-sm flex flex-col gap-4">
        {/* Game 1: Stack Your Tech Empire (Crane Tower Stacker Physics) */}
        <button
          onClick={onSelectStacker}
          className="group relative p-5 rounded-3xl bg-white border-2 border-sky-300 hover:border-sky-500 text-left shadow-xl shadow-sky-500/10 hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex flex-col gap-2 overflow-hidden animate-shimmer"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-sky-100/60 rounded-full -mr-8 -mt-8 pointer-events-none group-hover:scale-125 transition-transform duration-300" />
          
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-sky-900 bg-sky-100 border border-sky-300 shadow-xs animate-float-slow">
              <Building2 className="w-3.5 h-3.5 text-sky-600" /> Crane Stacker Physics
            </span>
            <ChevronRight className="w-5 h-5 text-sky-600 group-hover:translate-x-1.5 transition-transform duration-200" />
          </div>

          <h3 className="text-xl font-black font-sora text-slate-900 uppercase tracking-tight mt-1">
            1. Stack Your Tech Empire
          </h3>
          
          <p className="text-xs font-black text-gradient-sky uppercase tracking-wider">
            ONE-TAP TOWER BUILDER
          </p>
          
          <p className="text-xs text-slate-600 font-semibold leading-relaxed">
            Tap to drop swinging tech modules (GoWhats, Billzzy, Fynovo, Ciphergate) and stack a skyscraper into space!
          </p>
        </button>

        {/* Game 2: App Logo Jigsaw Puzzle */}
        <button
          onClick={onSelectJigsaw}
          className="group relative p-5 rounded-3xl bg-white border-2 border-purple-300 hover:border-purple-500 text-left shadow-xl shadow-purple-500/10 hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex flex-col gap-2 overflow-hidden animate-shimmer"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-purple-100/60 rounded-full -mr-8 -mt-8 pointer-events-none group-hover:scale-125 transition-transform duration-300" />
          
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-purple-800 bg-purple-100 border border-purple-300 shadow-xs animate-float-slow">
              <Puzzle className="w-3.5 h-3.5 text-purple-600" /> App Logo Jigsaw
            </span>
            <ChevronRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1.5 transition-transform duration-200" />
          </div>

          <h3 className="text-xl font-black font-sora text-slate-900 uppercase tracking-tight mt-1">
            2. App Logo Jigsaw
          </h3>
          
          <p className="text-xs font-black text-gradient-purple uppercase tracking-wider">
            INTERLOCKING LOGO PUZZLE
          </p>
          
          <p className="text-xs text-slate-600 font-semibold leading-relaxed">
            Piece together GoWhats, Billzzy, Ciphergate, and F3 Empire logos in custom grid difficulties!
          </p>
        </button>
      </div>

      {/* Footer Nav */}
      <div className="relative z-10 w-full max-w-sm pb-4 flex items-center justify-center gap-6 text-xs font-black text-slate-700 uppercase">
        <button 
          onClick={onOpenLeaderboard}
          className="flex items-center gap-1.5 hover:text-sky-700 transition-colors group"
        >
          <Trophy className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" /> Leaderboard
        </button>
        <span>•</span>
        <button 
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 hover:text-sky-700 transition-colors group"
        >
          <HelpCircle className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" /> Kiosk Setup
        </button>
      </div>
    </div>
  );
}
