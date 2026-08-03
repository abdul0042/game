import React from 'react';
import { RotateCcw, ArrowLeft, Trophy, Building2, Gift } from 'lucide-react';

export default function StackerScoreScreen({ scoreData, onReplay, onHome }) {
  const { floorsCount = 0, heightMeters = Math.round(floorsCount * 3.5), wonPrize } = scoreData || {};

  return (
    <div className="relative w-full h-full min-h-[600px] flex flex-col items-center justify-between p-6 bg-slate-50 overflow-hidden text-center">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100/80 via-slate-50 to-amber-50/60 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 pt-6 flex flex-col items-center">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-sky-800 bg-sky-100 border border-sky-300 mb-2 shadow-sm">
          <Building2 className="w-4 h-4 text-sky-600" /> Skyscraper Completed!
        </span>
        <h2 className="text-2xl font-black font-heading text-slate-900 uppercase tracking-wide">
          STACK YOUR TECH EMPIRE
        </h2>
      </div>

      {/* TOP HIGHLIGHTED FLOOR SCORE */}
      <div className="relative z-10 my-auto w-full max-w-xs flex flex-col items-center gap-3">
        <div className="w-full p-6 rounded-3xl bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 border-4 border-amber-200 shadow-[inset_0_2px_0_rgba(255,255,255,0.8),0_12px_28px_rgba(245,158,11,0.4)] flex flex-col items-center text-slate-950">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-7 h-7 text-slate-900" />
            <span className="text-sm font-black uppercase tracking-widest text-slate-900">FLOORS BUILT</span>
          </div>

          {/* Huge Highlighted Floor Count */}
          <span className="text-6xl font-black font-heading text-slate-950 leading-none my-2 drop-shadow-md">
            {floorsCount}
          </span>

          <span className="text-xs font-black uppercase tracking-wider text-slate-900 bg-amber-200/80 px-3 py-1 rounded-full border border-amber-300">
            {heightMeters} METERS TALL
          </span>
        </div>

        {/* WON PRIZE HIGHLIGHT BADGE (If 25+ floors stacked) */}
        {wonPrize && (
          <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white border-2 border-emerald-300 shadow-xl flex items-center justify-between animate-in zoom-in duration-300">
            <div className="text-4xl p-2 bg-white/20 rounded-xl">{wonPrize.icon}</div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-100 flex items-center gap-1 justify-end">
                <Gift className="w-3 h-3 text-amber-300" /> UNLOCKED BOOTH PRIZE!
              </span>
              <span className="text-sm font-black font-heading leading-tight">{wonPrize.name}</span>
              <span className="text-[10px] font-extrabold text-emerald-100">Claim at the booth!</span>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM BUTTONS: RETRY and BACK */}
      <div className="relative z-10 w-full max-w-xs pb-6 flex flex-col gap-3">
        {/* RETRY BUTTON */}
        <button
          onClick={onReplay}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 text-slate-950 font-black text-lg font-heading tracking-wider uppercase border-2 border-amber-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_8px_16px_rgba(0,0,0,0.35)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2.5"
        >
          <RotateCcw className="w-5 h-5 stroke-[3]" />
          RETRY
        </button>

        {/* BACK BUTTON */}
        <button
          onClick={onHome}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-b from-sky-400 via-sky-600 to-sky-800 text-white font-black text-base font-heading tracking-wider uppercase border-2 border-sky-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_6px_12px_rgba(0,0,0,0.3)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5 stroke-[3]" />
          BACK
        </button>
      </div>
    </div>
  );
}
