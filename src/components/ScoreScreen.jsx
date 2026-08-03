import React, { useState } from 'react';
import { Trophy, RotateCcw, Send, CheckCircle2, MessageSquareText, ShieldCheck } from 'lucide-react';

export default function ScoreScreen({ scoreData, onReplay, onSaveScore }) {
  const { score = 0, squadCount = 5 } = scoreData || {};
  
  const [playerName, setPlayerName] = useState('');
  const [playerEmail, setPlayerEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  let tierTitle = "Startup Scaler";
  let tierSub = "Multiplied business capacity by 5x";
  let tierColor = "text-cyan-400";
  let tierBorder = "border-cyan-500/30";

  if (score > 3000) {
    tierTitle = "Growth Unicorn";
    tierSub = "Automated operations & scaled capacity 20x";
    tierColor = "text-emerald-400";
    tierBorder = "border-emerald-500/30";
  }
  if (score > 6000) {
    tierTitle = "Global Tech Titan";
    tierSub = "Achieved enterprise-wide automated scaling";
    tierColor = "text-amber-400";
    tierBorder = "border-amber-500/30";
  }

  let estimatedRank = score > 6000 ? "#1" : score > 3500 ? "#4" : score > 1500 ? "#8" : "#12";

  const handleSubmitScore = (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    if (onSaveScore) {
      onSaveScore({
        name: playerName.trim(),
        email: playerEmail.trim(),
        score,
        squadCount,
        date: new Date().toLocaleDateString()
      });
    }
    setIsSubmitted(true);
  };

  return (
    <div className="relative w-full h-full min-h-[600px] flex flex-col items-center justify-between p-6 bg-[#0a0e17] overflow-y-auto text-center text-slate-100 font-sans select-none">
      {/* Dark Ambient Background with subtle Cyan Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/20 via-[#0a0e17] to-[#0a0e17] pointer-events-none" />
      
      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Header Evaluation Badge */}
      <div className="relative z-10 pt-4 flex flex-col items-center max-w-md w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-wide text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 mb-3 backdrop-blur-md">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          Evaluation Complete
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-slate-100">
          Operational Capacity Scaled
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Performance summary and system valuation report
        </p>
      </div>

      {/* Score Summary & Lead Form */}
      <div className="relative z-10 my-4 w-full max-w-md flex flex-col gap-3">
        {/* Tier Card */}
        <div className={`p-4 rounded-xl glass-panel border ${tierBorder} bg-slate-900/60 backdrop-blur-md flex flex-col items-center shadow-lg text-left`}>
          <div className="flex items-center justify-between w-full mb-1.5">
            <div className="flex items-center gap-2">
              <Trophy className={`w-5 h-5 ${tierColor}`} />
              <span className={`text-lg font-bold font-heading ${tierColor}`}>{tierTitle}</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
              Rank {estimatedRank} Today
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">{tierSub}</p>

          <div className="grid grid-cols-2 gap-3 w-full mt-3 pt-3 border-t border-slate-800">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">System Score</span>
              <span className="text-xl font-bold text-slate-100 font-heading mt-0.5">{score.toLocaleString()}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Squad Capacity</span>
              <span className="text-xl font-bold text-cyan-400 font-heading mt-0.5">{squadCount} Units</span>
            </div>
          </div>
        </div>

        {/* Product Demo Call to Action Box */}
        <div className="p-3.5 rounded-xl glass-panel border border-cyan-500/30 bg-cyan-950/30 backdrop-blur-md text-left">
          <div className="flex items-center gap-2 text-cyan-400 mb-1">
            <MessageSquareText className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold uppercase tracking-wide">Enterprise Operations</span>
          </div>
          <p className="text-xs text-slate-300 font-medium leading-relaxed">
            Ready to automate and scale your business operations in real life? Speak with our team today.
          </p>
        </div>

        {/* Lead Capture Form */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmitScore} className="p-4 rounded-xl glass-panel border border-slate-800 bg-slate-900/50 flex flex-col gap-3 text-left">
            <span className="text-xs font-semibold text-slate-300 tracking-wide">
              Submit Record to Leaderboard
            </span>
            <input 
              type="text"
              required
              placeholder="Name or Organization"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500/50 transition-colors font-medium placeholder:text-slate-500"
            />
            <input 
              type="email"
              placeholder="Email address (optional for report)"
              value={playerEmail}
              onChange={(e) => setPlayerEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500/50 transition-colors font-medium placeholder:text-slate-500"
            />
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400 font-semibold text-xs font-heading tracking-wide flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-3.5 h-3.5 text-cyan-400" /> Record Entry
            </button>
          </form>
        ) : (
          <div className="p-3.5 rounded-xl glass-panel border border-emerald-500/30 bg-emerald-950/30 text-emerald-400 text-xs font-medium flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Record submitted to today's leaderboard
          </div>
        )}
      </div>

      {/* Action Replay Button */}
      <div className="relative z-10 w-full max-w-md pb-4">
        <button
          onClick={onReplay}
          className="w-full py-3.5 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm font-heading tracking-wide shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
        >
          <RotateCcw className="w-4 h-4 stroke-[2.5] group-hover:-rotate-45 transition-transform" />
          Reinitialize Challenge
        </button>
      </div>
    </div>
  );
}
