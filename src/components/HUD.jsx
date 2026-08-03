import React from 'react';
import { Volume2, VolumeX, Settings, Zap, Clock } from 'lucide-react';

export default function HUD({ 
  squadCount = 5, 
  score = 0, 
  timeRemaining = 25, 
  progressPercent = 0,
  isMuted = false,
  onToggleMute,
  onOpenSettings
}) {
  const formattedMoney = (squadCount * 2500).toLocaleString();

  return (
    <div className="absolute top-0 left-0 right-0 z-20 p-4 pointer-events-none flex flex-col gap-3 font-sans select-none">
      {/* Top OS Status Bar */}
      <div className="flex items-center justify-between gap-3">
        {/* Squad & Valuation Panel */}
        <div className="pointer-events-auto flex items-center gap-3 px-3.5 py-2 rounded-xl glass-panel border border-cyan-500/20 bg-slate-900/80 shadow-lg backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase leading-none">
              Capacity & Value
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-lg font-bold font-heading text-cyan-400 leading-none">
                {squadCount} <span className="text-xs font-normal text-slate-400">Units</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-sm font-semibold text-slate-200 font-mono leading-none">
                ${formattedMoney}
              </span>
            </div>
          </div>
        </div>

        {/* Countdown Timer Badge */}
        <div className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-2 rounded-xl glass-panel border border-slate-800 bg-slate-900/80 shadow-lg backdrop-blur-md">
          <Clock className={`w-4 h-4 ${timeRemaining <= 5 ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase leading-none">Time Remaining</span>
            <span className={`text-base font-bold font-mono leading-tight mt-0.5 ${timeRemaining <= 5 ? 'text-rose-400' : 'text-slate-100'}`}>
              {timeRemaining}s
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button 
            onClick={onToggleMute}
            className="p-2.5 rounded-xl glass-panel bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-400 transition-colors shadow-md"
            title="Toggle Mute"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
          
          {onOpenSettings && (
            <button 
              onClick={onOpenSettings}
              className="p-2.5 rounded-xl glass-panel bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-400 transition-colors shadow-md"
              title="Kiosk Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Sleek Progress Track */}
      <div className="w-full bg-slate-950/90 rounded-lg h-2 p-0.5 border border-slate-800/80 glass-panel shadow-inner">
        <div 
          className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-full rounded-md transition-all duration-200 ease-out shadow-[0_0_10px_rgba(6,182,212,0.5)]"
          style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
        />
      </div>
    </div>
  );
}
