import React from 'react';
import { ArrowLeft, RotateCcw, Settings } from 'lucide-react';

export default function StackerHUD({ 
  floorsCount = 0, 
  score = 0, 
  timeRemaining = 25, 
  missesCount = 0,
  maxMisses = 2,
  onBack,
  onReplay,
  onOpenSettings
}) {
  const livesRemaining = Math.max(0, maxMisses - missesCount);

  return (
    <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none flex flex-col items-center">
      {/* Horizontally Aligned Beveled Metallic/Gold Panels */}
      <div className="w-full px-2 py-2 sm:px-3 sm:py-3 flex items-center justify-between gap-1">
        {/* 1. Textured Gold Panel: FLOORS */}
        <div className="pointer-events-auto flex-1 py-1 px-1 sm:py-1.5 sm:px-1.5 rounded-xl bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 border border-amber-200 sm:border-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_4px_8px_rgba(0,0,0,0.3)] text-slate-950 text-center min-w-0">
          <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider block leading-none text-slate-900 truncate">FLOORS</span>
          <span className="text-xs sm:text-sm font-black font-heading text-slate-950 leading-tight">{floorsCount}</span>
        </div>

        {/* 2. Textured Dark Panel: LIVES */}
        <div className="pointer-events-auto flex-1 py-1 px-1 sm:py-1.5 sm:px-1.5 rounded-xl bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border border-slate-700 sm:border-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_8px_rgba(0,0,0,0.4)] text-center min-w-0">
          <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider block leading-none text-rose-400 truncate">LIVES</span>
          <span className="text-[11px] sm:text-xs font-black font-heading leading-tight flex items-center justify-center gap-0.5 mt-0.5">
            {livesRemaining >= 1 ? '❤️' : '🖤'}
            {livesRemaining >= 2 ? '❤️' : '🖤'}
          </span>
        </div>

        {/* 3. Textured Dark Panel: TIME */}
        <div className="pointer-events-auto flex-1 py-1 px-1 sm:py-1.5 sm:px-1.5 rounded-xl bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border border-slate-700 sm:border-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_8px_rgba(0,0,0,0.4)] text-center min-w-0">
          <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider block leading-none text-sky-400 truncate">TIME</span>
          <span className={`text-xs sm:text-sm font-black font-heading leading-tight ${timeRemaining <= 5 ? 'text-rose-400 animate-bounce' : 'text-white'}`}>
            {timeRemaining}s
          </span>
        </div>

        {/* 4. Textured Dark Panel: SCORE */}
        <div className="pointer-events-auto flex-1 py-1 px-1 sm:py-1.5 sm:px-1.5 rounded-xl bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border border-slate-700 sm:border-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_8px_rgba(0,0,0,0.4)] text-center min-w-0">
          <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider block leading-none text-emerald-400 truncate">SCORE</span>
          <span className="text-xs sm:text-sm font-black font-heading text-white leading-tight truncate block">{score}</span>
        </div>

        {/* 5. Top Right Dials: BACK Icon Button, RETRY Icon Button, and Settings */}
        <div className="pointer-events-auto flex items-center gap-0.5 sm:gap-1">
          {/* RETRY ICON BUTTON */}
          {onReplay && (
            <button 
              onClick={onReplay}
              className="p-1 sm:p-1.5 rounded-xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 border border-amber-200 sm:border-2 hover:brightness-110 active:scale-95 text-slate-950 transition-all shadow-md"
              title="Restart Game"
            >
              <RotateCcw className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          )}

          {/* BACK ICON BUTTON */}
          {onBack && (
            <button 
              onClick={onBack}
              className="p-1 sm:p-1.5 rounded-xl bg-gradient-to-b from-sky-500 via-sky-600 to-sky-700 border border-sky-300 sm:border-2 hover:brightness-110 active:scale-95 text-white transition-all shadow-md"
              title="Go Back"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          )}
          
          {/* SETTINGS ICON BUTTON */}
          {onOpenSettings && (
            <button 
              onClick={onOpenSettings}
              className="p-1 sm:p-1.5 rounded-xl bg-gradient-to-b from-slate-700 to-slate-900 border border-slate-600 sm:border-2 hover:border-amber-400 text-amber-300 transition-all shadow-md"
              title="Kiosk Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
