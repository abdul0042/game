import React from 'react';
import { Trophy, HelpCircle, ArrowRight, Sparkles, ShieldCheck, Clock, Gift } from 'lucide-react';

export default function GameSelectScreen({ onSelectJigsaw, onOpenLeaderboard, onOpenSettings }) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 sm:p-5 pt-3 sm:pt-4 bg-gradient-to-b from-emerald-50/80 via-white to-teal-50/70 text-slate-900 overflow-y-auto overflow-x-hidden text-center font-sans select-none">
      {/* Skeuomorphic Ambient Mesh Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-200/35 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      {/* 1. HEADER SECTION */}
      <div className="relative z-10 pt-1 flex flex-col items-center shrink-0">
        {/* Techvaseegrah Skeuomorphic Emblem Capsule */}
        <div className="skeuo-pill p-1.5 px-4 sm:p-2 sm:px-5 rounded-full mb-2 sm:mb-2.5 flex items-center justify-center shadow-md">
          <div className="w-28 sm:w-36 h-7 sm:h-8 flex items-center justify-center">
            <img 
              src="/image copy 2.png" 
              alt="Techvaseegrah" 
              className="w-full h-full object-contain filter drop-shadow-xs"
            />
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-black font-sora tracking-tight uppercase">
          <span className="text-gradient-luxury">MULTIPLY</span> YOUR TECH
        </h1>
        
        <div className="skeuo-pill inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black text-emerald-900 mt-1 uppercase tracking-wider shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" /> App Logo Jigsaw Challenge
        </div>
      </div>

      {/* 2. PRIMARY HERO GAME CARD */}
      <div className="relative z-10 my-auto py-2 w-full max-w-sm">
        <div className="relative skeuo-card rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 text-left transition-all duration-300 flex flex-col gap-3.5 sm:gap-4 overflow-hidden shadow-xl">
          {/* Beveled Top Gloss Line */}
          <div className="absolute top-0 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 opacity-90" />
          
          {/* Header Row: Icon & Tag */}
          <div className="flex items-center justify-between">
            <div className="skeuo-icon-box w-12 h-12 sm:w-14 sm:h-14 p-2.5 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-md">
              <img src="/image.png" alt="App Logo Jigsaw" className="w-full h-full object-contain" />
            </div>

            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[10px] font-black text-emerald-800 bg-emerald-100/90 border border-emerald-300/80 px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-2xs">
                FREESTYLE PUZZLE
              </span>
              <span className="text-[10px] font-extrabold text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" /> 60s Speed Run
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-sora text-slate-950 uppercase tracking-tight leading-tight">
              App Logo Jigsaw
            </h2>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed mt-1">
              Piece together GoWhats, Billzzy, CipherGate, and F3 Engine logos in custom grid difficulties!
            </p>
          </div>

          {/* Reward Feature Callout */}
          <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-emerald-100/70 to-teal-50 border border-emerald-300/60 text-emerald-950">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/90 border border-emerald-200 flex items-center justify-center shrink-0 text-base sm:text-lg shadow-xs">
              🎁
            </div>
            <div className="text-left leading-tight">
              <div className="text-[10.5px] sm:text-xs font-black uppercase text-emerald-900">Win Real Booth Prizes!</div>
              <div className="text-[9.5px] sm:text-[10px] font-bold text-emerald-700">Solve under 30s to unlock the prize reel</div>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={onSelectJigsaw}
            className="w-full py-3.5 sm:py-4 px-6 rounded-2xl skeuo-button-action text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:brightness-105 active:scale-98 transition-all cursor-pointer group"
          >
            <Sparkles className="w-4 h-4 text-emerald-200 group-hover:rotate-12 transition-transform" />
            <span>START PUZZLE CHALLENGE</span>
            <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* 3. SKEUOMORPHIC BOTTOM NAVIGATION BAR */}
      <div className="relative z-10 w-full max-w-sm shrink-0 pb-1 sm:pb-2 pt-1">
        <div className="skeuo-pill w-full py-2.5 sm:py-3 px-5 sm:px-6 rounded-full flex items-center justify-around text-[11px] sm:text-xs font-black text-emerald-950 uppercase shadow-md">
          <button 
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors group active:scale-95"
          >
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 group-hover:scale-110 transition-transform drop-shadow-xs" /> Leaderboard
          </button>
          
          <span className="text-emerald-300 font-bold">•</span>
          
          <button 
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors group active:scale-95"
          >
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 group-hover:scale-110 transition-transform drop-shadow-xs" /> Kiosk Setup
          </button>
        </div>
      </div>
    </div>
  );
}
