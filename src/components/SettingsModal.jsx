import React from 'react';
import { X, Sliders, Monitor, Volume2, Trash2, Puzzle, Grid, Home, Play } from 'lucide-react';

export default function SettingsModal({ 
  settings, 
  onUpdateSettings, 
  onResetLeaderboard, 
  onSwitchToJigsaw,
  onSwitchToSelect,
  currentScreen,
  onClose 
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md flex flex-col rounded-3xl bg-white border-2 border-emerald-300 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-6 h-6 text-emerald-600" />
            <h3 className="text-xl font-black font-heading text-slate-900 uppercase tracking-wide">
              KIOSK & GAME SETTINGS
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Options */}
        <div className="flex flex-col gap-5 text-left">
          {/* ACTIVE GAME QUICK LAUNCH / HOME */}
          <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-emerald-50/80 border-2 border-emerald-300 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-emerald-900 uppercase flex items-center gap-2">
                <Puzzle className="w-4 h-4 text-emerald-600" /> APP LOGO JIGSAW
              </label>
              <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-md">
                Active Game
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onSwitchToJigsaw) onSwitchToJigsaw();
                }}
                className={`py-2.5 px-3 rounded-xl text-center flex items-center justify-center gap-1.5 border transition-all text-xs font-extrabold uppercase ${
                  currentScreen?.includes('JIGSAW')
                    ? 'border-emerald-500 bg-emerald-600 text-white shadow-sm'
                    : 'border-emerald-300 bg-white text-emerald-950 hover:bg-emerald-50'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Puzzle</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onSwitchToSelect) onSwitchToSelect();
                }}
                className={`py-2.5 px-3 rounded-xl text-center flex items-center justify-center gap-1.5 border transition-all text-xs font-extrabold uppercase ${
                  currentScreen === 'GAME_SELECT'
                    ? 'border-emerald-500 bg-emerald-600 text-white shadow-sm'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home Screen</span>
              </button>
            </div>
          </div>

          {/* JIGSAW GRID SIZE SETTING */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-slate-700 uppercase flex items-center gap-2">
              <Grid className="w-4 h-4 text-purple-600" /> Jigsaw Grid Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '3×3 (Easy)', value: '3x3', rows: 3, cols: 3, total: 9 },
                { label: '4×4 (Default)', value: '4x4', rows: 4, cols: 4, total: 16 },
                { label: '6×6 (Hard)', value: '6x6', rows: 6, cols: 6, total: 36 }
              ].map((grid) => (
                <button
                  key={grid.value}
                  type="button"
                  onClick={() => onUpdateSettings({ jigsawGrid: grid })}
                  className={`py-2.5 px-2 rounded-xl border text-[11px] font-black transition-all ${
                    (settings.jigsawGrid?.value || '4x4') === grid.value
                      ? 'border-purple-500 bg-purple-100 text-purple-900 shadow-sm'
                      : 'border-slate-300 bg-slate-50 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {grid.label}
                </button>
              ))}
            </div>
          </div>

          {/* Display Mode */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-slate-700 uppercase flex items-center gap-2">
              <Monitor className="w-4 h-4 text-sky-600" /> Display Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdateSettings({ aspectMode: 'kiosk' })}
                className={`py-2.5 px-3 rounded-xl border text-xs font-black transition-all ${
                  settings.aspectMode === 'kiosk'
                    ? 'border-sky-500 bg-sky-100 text-sky-900 shadow-sm'
                    : 'border-slate-300 bg-slate-50 text-slate-600 hover:text-slate-900'
                }`}
              >
                📱 Kiosk (9:16 Portrait)
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings({ aspectMode: 'fullscreen' })}
                className={`py-2.5 px-3 rounded-xl border text-xs font-black transition-all ${
                  settings.aspectMode === 'fullscreen'
                    ? 'border-sky-500 bg-sky-100 text-sky-900 shadow-sm'
                    : 'border-slate-300 bg-slate-50 text-slate-600 hover:text-slate-900'
                }`}
              >
                🖥️ Fullscreen Responsive
              </button>
            </div>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-black text-slate-700">Sound Effects Synthesizer</span>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ isMuted: !settings.isMuted })}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-colors ${
                !settings.isMuted ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
              }`}
            >
              {!settings.isMuted ? 'ENABLED' : 'MUTED'}
            </button>
          </div>

          {/* Reset Scores */}
          <button
            type="button"
            onClick={onResetLeaderboard}
            className="w-full mt-2 py-2.5 px-4 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-rose-600" /> Reset Today's Scores
          </button>
        </div>
      </div>
    </div>
  );
}
