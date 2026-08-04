import React from 'react';
import { Building2, Puzzle, Trophy, HelpCircle, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export default function GameSelectScreen({ onSelectStacker, onSelectJigsaw, onOpenLeaderboard, onOpenSettings }) {
  return (
    <div className="relative w-full h-full h-[100dvh] flex flex-col items-center justify-start p-4 bg-gradient-to-b from-emerald-50/70 via-white to-teal-50/60 text-slate-900 overflow-hidden text-center font-sans select-none">
      {/* Luxury Ambient Mesh Glow Effects */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-200/35 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      {/* Header */}
      <div className="relative z-10 pt-2 flex flex-col items-center shrink-0">
        {/* Techvaseegrah Company Logo */}
        <div className="w-36 sm:w-44 h-10 sm:h-12 mb-3.5 sm:mb-4 flex items-center justify-center">
          <img 
            src="/image copy 2.png" 
            alt="Techvaseegrah" 
            className="w-full h-full object-contain filter drop-shadow-xs"
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black font-sora tracking-tight uppercase">
          <span className="text-gradient-luxury">MULTIPLY</span> YOUR TECH
        </h1>
        
        <p className="text-[11px] sm:text-xs font-extrabold text-emerald-800 mt-1.5 tracking-wider uppercase font-sans flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" /> Select a Kiosk Challenge Below
        </p>
      </div>

      {/* 2 Game Options Cards */}
      <div className="relative z-10 mt-5 sm:mt-6 mb-2 w-full max-w-sm flex flex-col gap-3.5">
        {/* Game 1: Stack Your Tech Empire */}
        <button
          onClick={onSelectStacker}
          className="group relative luxury-glass-card rounded-2xl sm:rounded-[24px] p-4 text-left transition-all duration-300 flex flex-col gap-2 overflow-hidden animate-shimmer"
        >
          {/* Subtle Metallic Gold Accent Header Line */}
          <div className="w-14 h-[3px] bg-gradient-to-r from-emerald-500 via-amber-400 to-transparent rounded-full" />
          
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 p-1.5 bg-white border border-emerald-200 rounded-xl shadow-md flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden shrink-0">
              <img src="/image copy.png" alt="Stack Your Tech Empire" className="w-full h-full object-contain" />
            </div>

            <div className="p-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 shadow-xs transition-all">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-black font-sora text-slate-900 uppercase tracking-tight">
              1. Stack Your Tech Empire
            </h3>
            <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">
              ONE-TAP TOWER BUILDER
            </p>
          </div>
          
          <p className="text-[11px] sm:text-xs text-slate-600 font-semibold leading-snug">
            Tap to drop swinging tech modules (GoWhats, Billzzy, Ciphergate) and stack a skyscraper into space!
          </p>
        </button>

        {/* Game 2: App Logo Jigsaw Puzzle */}
        <button
          onClick={onSelectJigsaw}
          className="group relative luxury-glass-card rounded-2xl sm:rounded-[24px] p-4 text-left transition-all duration-300 flex flex-col gap-2 overflow-hidden animate-shimmer"
        >
          {/* Subtle Metallic Gold Accent Header Line */}
          <div className="w-14 h-[3px] bg-gradient-to-r from-emerald-500 via-amber-400 to-transparent rounded-full" />
          
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 p-1.5 bg-white border border-emerald-200 rounded-xl shadow-md flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden shrink-0">
              <img src="/image.png" alt="App Logo Jigsaw" className="w-full h-full object-contain" />
            </div>

            <div className="p-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 shadow-xs transition-all">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-black font-sora text-slate-900 uppercase tracking-tight">
              2. App Logo Jigsaw
            </h3>
            <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">
              INTERLOCKING LOGO PUZZLE
            </p>
          </div>
          
          <p className="text-[11px] sm:text-xs text-slate-600 font-semibold leading-snug">
            Piece together GoWhats, Billzzy, Ciphergate, and F3 Empire logos in custom grid difficulties!
          </p>
        </button>
      </div>

      {/* Footer Nav Aligned Cleanly at Bottom */}
      <div className="relative z-10 w-full max-w-sm mt-auto pb-2 shrink-0 flex items-center justify-center gap-6 text-xs font-black text-emerald-950 uppercase">
        <button 
          onClick={onOpenLeaderboard}
          className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors group"
        >
          <Trophy className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" /> Leaderboard
        </button>
        <span className="text-emerald-300">•</span>
        <button 
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors group"
        >
          <HelpCircle className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" /> Kiosk Setup
        </button>
      </div>
    </div>
  );
}
