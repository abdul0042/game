import React from 'react';
import { Trophy, X, Crown, Medal, Award, Zap } from 'lucide-react';

export default function LeaderboardModal({ leaderboard = [], onClose }) {
  const defaultLeaderboard = [
    { name: "Alex (GoWhats)", score: 7850, squadCount: 45, date: "Today" },
    { name: "Billzzy POS Team", score: 6420, squadCount: 36, date: "Today" },
    { name: "Tech Scaler #3", score: 5100, squadCount: 28, date: "Today" },
    { name: "FastChat Bot", score: 4250, squadCount: 22, date: "Today" },
    { name: "AutoFlow AI", score: 3600, squadCount: 18, date: "Today" }
  ];

  const displayList = leaderboard.length > 0 ? leaderboard : defaultLeaderboard;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md max-h-[85vh] flex flex-col rounded-3xl bg-white border-2 border-sky-400 p-6 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-600" />
            <h3 className="text-xl font-black font-heading text-slate-900 uppercase tracking-wide">
              TOP SCALERS TODAY
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* High Score List */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5">
          {displayList.map((entry, index) => {
            let rankBadge = <span className="w-6 text-center text-sm font-black text-slate-500">#{index + 1}</span>;
            let rowBorder = "border-slate-200 bg-slate-50";

            if (index === 0) {
              rankBadge = <Crown className="w-6 h-6 text-amber-500" />;
              rowBorder = "border-amber-400 bg-amber-50/90";
            } else if (index === 1) {
              rankBadge = <Medal className="w-6 h-6 text-slate-400" />;
              rowBorder = "border-slate-300 bg-slate-100";
            } else if (index === 2) {
              rankBadge = <Award className="w-6 h-6 text-amber-700" />;
              rowBorder = "border-amber-300 bg-amber-50/50";
            }

            return (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-2xl border ${rowBorder} transition-all`}
              >
                <div className="flex items-center gap-3">
                  {rankBadge}
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-900">{entry.name}</span>
                    <span className="text-[10px] text-slate-600 font-bold flex items-center gap-1">
                      <Zap className="w-3 h-3 text-emerald-600" /> {entry.squadCount || 20} Squad Multiplied
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-base font-black font-heading text-amber-700">{entry.score} pts</span>
                  <span className="text-[10px] text-slate-400 font-medium">{entry.date || 'Today'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-slate-200 text-center">
          <p className="text-[11px] text-sky-800 font-bold">
            💡 Tap Left Road or Right Road fast to hit Green Automation Gates!
          </p>
        </div>
      </div>
    </div>
  );
}
