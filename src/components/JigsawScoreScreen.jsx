import React, { useState } from 'react';
import { Trophy, Star, Clock, RotateCcw, Home, Sparkles, CheckCircle2, Award, Gift } from 'lucide-react';

export default function JigsawScoreScreen({ scoreData, onReplay, onHome, onSaveScore }) {
  const [playerName, setPlayerName] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const { timeSeconds = 0, moves = 0, gridSize = '4×4', logoName = 'App Logo', score = 5000, wonPrize = null } = scoreData || {};

  // Calculate Stars (3 Stars < 15s, 2 Stars < 30s, 1 Star >= 30s)
  const stars = timeSeconds <= 15 ? 3 : timeSeconds <= 30 ? 2 : 1;

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
    <div className="relative w-full h-full min-h-[600px] flex flex-col items-center justify-between p-6 bg-gradient-to-b from-sky-50 via-slate-50 to-emerald-50 text-slate-900 overflow-y-auto text-center font-sans">
      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-slate-50 to-sky-500/10 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 pt-4 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 border border-emerald-300 shadow-sm mb-3">
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" /> Puzzle Solved!
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 uppercase font-heading">
          {logoName} Puzzle
        </h1>
        <p className="text-xs font-extrabold text-sky-700 tracking-wider uppercase mt-1">
          {gridSize} Jigsaw Mastered in {timeSeconds}s
        </p>
      </div>

      {/* Won Prize Reel Badge */}
      {wonPrize && (
        <div className="relative z-10 my-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 border-2 border-amber-300 text-slate-950 font-black shadow-lg animate-bounce flex items-center justify-center gap-2 text-sm uppercase">
          <Gift className="w-5 h-5 text-slate-950" />
          <span className="text-xl">{typeof wonPrize === 'object' ? wonPrize.icon : '🎁'}</span>
          <span>Prize Unlocked: {typeof wonPrize === 'object' ? wonPrize.name : wonPrize}!</span>
        </div>
      )}

      {/* Star Rating Badge */}
      <div className="relative z-10 my-3 flex items-center justify-center gap-3">
        {[1, 2, 3].map((starIdx) => (
          <div 
            key={starIdx}
            className={`p-3 rounded-2xl transition-all transform ${
              starIdx <= stars 
                ? 'bg-amber-100 border-2 border-amber-400 text-amber-500 scale-110 shadow-md shadow-amber-400/30' 
                : 'bg-slate-100 border border-slate-200 text-slate-400'
            }`}
          >
            <Star className={`w-8 h-8 ${starIdx <= stars ? 'fill-amber-400' : ''}`} />
          </div>
        ))}
      </div>

      {/* Stats Card */}
      <div className="relative z-10 w-full max-w-sm bg-white/90 backdrop-blur-md border border-slate-200 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Final Score</span>
          <span className="text-2xl font-black font-mono text-emerald-700">{score.toLocaleString()} PTS</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <Clock className="w-5 h-5 text-sky-600 mb-1" />
            <span className="text-[10px] font-bold text-slate-500 uppercase">Time</span>
            <span className="text-base font-black font-mono text-slate-900">{formatTime(timeSeconds)}</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <Award className="w-5 h-5 text-emerald-600 mb-1" />
            <span className="text-[10px] font-bold text-slate-500 uppercase">Moves</span>
            <span className="text-base font-black font-mono text-slate-900">{moves} Moves</span>
          </div>
        </div>

        {/* Leaderboard Submission Form */}
        {!isSaved ? (
          <form onSubmit={handleSave} className="flex flex-col gap-2 pt-2 border-t border-slate-200">
            <label className="text-xs font-bold text-slate-700 text-left">Save to Leaderboard:</label>
            <div className="flex gap-2">
              <input 
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name..."
                maxLength={20}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                disabled={!playerName.trim()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 disabled:opacity-50 text-xs font-black uppercase text-white shadow-md transition-all"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-100 rounded-xl border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Score Saved to Leaderboard!
          </div>
        )}
      </div>

      {/* Bottom Action Buttons */}
      <div className="relative z-10 w-full max-w-sm pt-4 flex gap-3">
        <button
          onClick={onReplay}
          className="flex-1 py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-black uppercase text-slate-800 shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4 text-sky-600" /> Play Again
        </button>

        <button
          onClick={onHome}
          className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-xs font-black uppercase text-white shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Home className="w-4 h-4" /> Select Game
        </button>
      </div>
    </div>
  );
}
