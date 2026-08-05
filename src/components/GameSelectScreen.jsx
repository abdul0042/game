import React from 'react';
import { Building2, Puzzle, Trophy, HelpCircle, ArrowRight, Sparkles, ShieldCheck, Gamepad2 } from 'lucide-react';

export default function GameSelectScreen({ onSelectStacker, onSelectJigsaw, onOpenLeaderboard, onOpenSettings }) {
  return (
    <div className="relative w-full h-full h-[100dvh] flex flex-col items-center justify-between p-4 bg-gradient-to-b from-emerald-50/80 via-white to-teal-50/70 text-slate-900 overflow-hidden text-center font-sans select-none">
      {/* Skeuomorphic Ambient Mesh Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-200/35 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      {/* 1. HEADER SECTION */}
      <div className="relative z-10 pt-2 flex flex-col items-center shrink-0">
        {/* Techvaseegrah Skeuomorphic Emblem Capsule */}
        <div className="skeuo-pill p-2 px-5 rounded-full mb-3 flex items-center justify-center shadow-md">
          <div className="w-32 sm:w-40 h-8 sm:h-9 flex items-center justify-center">
            <img 
              src="/image copy 2.png" 
              alt="Techvaseegrah" 
              className="w-full h-full object-contain filter drop-shadow-xs"
            />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black font-sora tracking-tight uppercase">
          <span className="text-gradient-luxury">MULTIPLY</span> YOUR TECH
        </h1>
        
        <div className="skeuo-pill inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10.5px] sm:text-xs font-black text-emerald-900 mt-2 uppercase tracking-wider shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" /> Select a Kiosk Challenge Below
        </div>
      </div>

      {/* 2. GAME SELECTION CARDS (MODERN SKEUOMORPHIC ARCADE PODS) */}
      <div className="relative z-10 my-auto w-full max-w-sm flex flex-col gap-4">
        {/* Game 1: Stack Your Tech Empire */}
        <button
          onClick={onSelectStacker}
          className="group relative skeuo-card rounded-[28px] p-5 text-left transition-all duration-300 flex flex-col gap-2.5 overflow-hidden active:scale-98 cursor-pointer"
        >
          {/* Beveled Top Gloss Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 opacity-90" />
          
          <div className="flex items-center justify-between">
            <div className="skeuo-icon-box w-12 h-12 p-2 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden shrink-0">
              <img src="/image copy.png" alt="Stack Your Tech Empire" className="w-full h-full object-contain" />
            </div>

            <div className="skeuo-button-action p-2.5 rounded-2xl text-white group-hover:scale-110 transition-transform flex items-center justify-center shadow-md">
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-emerald-800 bg-emerald-100/80 border border-emerald-300/80 px-2 py-0.5 rounded-md uppercase tracking-wider shadow-2xs">
                TOWER BUILDER
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black font-sora text-slate-950 uppercase tracking-tight leading-tight">
              1. Stack Your Tech Empire
            </h3>
          </div>
          
          <p className="text-xs text-slate-600 font-semibold leading-relaxed">
            Tap to drop swinging tech modules (GoWhats, Billzzy, Ciphergate) and stack a skyscraper into space!
          </p>
        </button>

        {/* Game 2: App Logo Jigsaw Puzzle */}
        <button
          onClick={onSelectJigsaw}
          className="group relative skeuo-card rounded-[28px] p-5 text-left transition-all duration-300 flex flex-col gap-2.5 overflow-hidden active:scale-98 cursor-pointer"
        >
          {/* Beveled Top Gloss Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 opacity-90" />
          
          <div className="flex items-center justify-between">
            <div className="skeuo-icon-box w-12 h-12 p-2 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden shrink-0">
              <img src="/image.png" alt="App Logo Jigsaw" className="w-full h-full object-contain" />
            </div>

            <div className="skeuo-button-action p-2.5 rounded-2xl text-white group-hover:scale-110 transition-transform flex items-center justify-center shadow-md">
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-emerald-800 bg-emerald-100/80 border border-emerald-300/80 px-2 py-0.5 rounded-md uppercase tracking-wider shadow-2xs">
                FREESTYLE PUZZLE
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black font-sora text-slate-950 uppercase tracking-tight leading-tight">
              2. App Logo Jigsaw
            </h3>
          </div>
          
          <p className="text-xs text-slate-600 font-semibold leading-relaxed">
            Piece together GoWhats, Billzzy, Ciphergate, and F3 Empire logos in custom grid difficulties!
          </p>
        </button>
      </div>

      {/* 3. SKEUOMORPHIC BOTTOM NAVIGATION BAR */}
      <div className="relative z-10 w-full max-w-sm shrink-0 pb-2">
        <div className="skeuo-pill w-full py-3 px-6 rounded-full flex items-center justify-around text-xs font-black text-emerald-950 uppercase shadow-md">
          <button 
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors group active:scale-95"
          >
            <Trophy className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform drop-shadow-xs" /> Leaderboard
          </button>
          
          <span className="text-emerald-300 font-bold">•</span>
          
          <button 
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors group active:scale-95"
          >
            <HelpCircle className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform drop-shadow-xs" /> Kiosk Setup
          </button>
        </div>
      </div>
    </div>
  );
}
