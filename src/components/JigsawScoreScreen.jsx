import React, { useState } from 'react';
import { Trophy, Star, Clock, RotateCcw, Home, Sparkles, CheckCircle2, Award, Gift } from 'lucide-react';

export default function JigsawScoreScreen({ scoreData, onReplay, onHome, onSaveScore }) {
  const [playerName, setPlayerName] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const { timeSeconds = 0, moves = 0, gridSize = '4×4', logoName = 'App Logo', score = 5000, wonPrize = null } = scoreData || {};

  // Calculate Stars (3 Stars <= 25s, 2 Stars <= 60s, 1 Star > 60s)
  const stars = timeSeconds <= 25 ? 3 : timeSeconds <= 60 ? 2 : 1;

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!playerName.trim() || isSaved) return;

    onSaveScore({
      name: `${playerName.trim()} (${logoName})`,
      score,
      squadCount: moves,
      date: 'Today'
    });

    setIsSaved(true);
  };

  return (
    <div className="relative w-full h-full h-[100dvh] flex flex-col items-center justify-between p-4 bg-gradient-to-b from-emerald-50 via-white to-teal-50 text-slate-900 overflow-hidden text-center font-sans select-none">
      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-white to-teal-500/10 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 pt-2 shrink-0 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-emerald-900 bg-white border border-emerald-300 shadow-sm mb-2">
          <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" /> Puzzle Solved!
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase font-heading">
          {logoName} Puzzle
        </h1>
        <p className="text-[11px] font-extrabold text-emerald-800 tracking-wider uppercase mt-0.5">
          {gridSize} Jigsaw Mastered in {timeSeconds}s
        </p>
      </div>

      {/* Won Prize Reel Badge */}
      {wonPrize && (
        <div className="relative z-10 my-1 shrink-0 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 border-2 border-emerald-300 text-white font-black shadow-lg animate-bounce flex items-center justify-center gap-2 text-xs sm:text-sm uppercase">
          <Gift className="w-5 h-5 text-white" />
          <span className="text-lg">{typeof wonPrize === 'object' ? wonPrize.icon : '🎁'}</span>
          <span>Prize Unlocked: {typeof wonPrize === 'object' ? wonPrize.name : wonPrize}!</span>
        </div>
      )}

      {/* Star Rating Badge */}
      <div className="relative z-10 my-1 shrink-0 flex items-center justify-center gap-3">
        {[1, 2, 3].map((starIdx) => (
          <div 
            key={starIdx}
            className={`p-2.5 rounded-2xl transition-all transform ${
              starIdx <= stars 
                ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-600 scale-110 shadow-md shadow-emerald-400/30' 
                : 'bg-slate-100 border border-slate-200 text-slate-400'
            }`}
          >
            <Star className={`w-7 h-7 ${starIdx <= stars ? 'fill-emerald-500' : ''}`} />
          </div>
        ))}
      </div>

      {/* Stats Card */}
      <div className="relative z-10 w-full max-w-sm flex-1 min-h-0 bg-white border-2 border-emerald-300 rounded-3xl p-4 shadow-xl flex flex-col justify-center gap-3">
        <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Final Score</span>
          <span className="text-xl font-black font-mono text-emerald-700">{score.toLocaleString()} PTS</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center p-2 rounded-2xl bg-emerald-50/60 border border-emerald-200">
            <Clock className="w-4 h-4 text-emerald-600 mb-0.5" />
            <span className="text-[9px] font-bold text-emerald-800 uppercase">Time</span>
            <span className="text-sm font-black font-mono text-slate-900">{formatTime(timeSeconds)}</span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-2xl bg-emerald-50/60 border border-emerald-200">
            <Award className="w-4 h-4 text-teal-600 mb-0.5" />
            <span className="text-[9px] font-bold text-emerald-800 uppercase">Moves</span>
            <span className="text-sm font-black font-mono text-slate-900">{moves} Moves</span>
          </div>
        </div>

        {/* Leaderboard Submission Form */}
        {!isSaved ? (
          <form onSubmit={handleSave} className="flex flex-col gap-1.5 pt-2 border-t border-emerald-100">
            <label className="text-[11px] font-bold text-emerald-900 text-left">Save to Leaderboard:</label>
            <div className="flex gap-2">
              <input 
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name..."
                maxLength={20}
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-emerald-300 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={!playerName.trim()}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-xs font-black uppercase text-white shadow-md transition-all"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 rounded-xl border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Score Saved to Leaderboard!
          </div>
        )}
      </div>

      {/* Bottom Action Buttons */}
      <div className="relative z-10 w-full max-w-sm pt-2 shrink-0 flex gap-3">
        <button
          onClick={onReplay}
          className="flex-1 py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-emerald-300 text-xs font-black uppercase text-emerald-900 shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4 text-emerald-600" /> Play Again
        </button>

        <button
          onClick={onHome}
          className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-xs font-black uppercase text-white shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Home className="w-4 h-4" /> Select Game
        </button>
      </div>
    </div>
  );
}
