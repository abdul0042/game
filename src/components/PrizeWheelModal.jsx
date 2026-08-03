import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../utils/audioEngine';

const PRELOADED_PRIZES = [
  { id: 'glasses', name: 'Tech Sunglasses', icon: '🕶️', color: 'from-amber-400 via-amber-500 to-amber-600', border: 'border-amber-300' },
  { id: 'tshirt', name: 'Exclusive Tech T-Shirt', icon: '👕', color: 'from-sky-400 via-sky-500 to-sky-600', border: 'border-sky-300' },
  { id: 'bottle', name: 'Smart Water Bottle', icon: '🍾', color: 'from-emerald-400 via-emerald-500 to-emerald-600', border: 'border-emerald-300' },
  { id: 'cap', name: 'Branded Tech Cap', icon: '🧢', color: 'from-purple-400 via-purple-500 to-purple-600', border: 'border-purple-300' },
  { id: 'backpack', name: 'Tech Backpack', icon: '🎒', color: 'from-rose-400 via-rose-500 to-rose-600', border: 'border-rose-300' },
  { id: 'earbuds', name: 'Wireless Earbuds', icon: '🎧', color: 'from-indigo-400 via-indigo-500 to-indigo-600', border: 'border-indigo-300' }
];

// Create long seamless strip (8 repetitions = 48 items)
const REEL_ITEMS = [
  ...PRELOADED_PRIZES,
  ...PRELOADED_PRIZES,
  ...PRELOADED_PRIZES,
  ...PRELOADED_PRIZES,
  ...PRELOADED_PRIZES,
  ...PRELOADED_PRIZES,
  ...PRELOADED_PRIZES,
  ...PRELOADED_PRIZES
];

const CARD_WIDTH = 112; // 112px width
const CARD_GAP = 12;   // 12px gap
const STEP_SIZE = CARD_WIDTH + CARD_GAP; // 124px per card

export default function PrizeWheelModal({ onClaimPrize }) {
  const [translateX, setTranslateX] = useState(0);
  const [isSpinning, setIsSpinning] = useState(true);
  const [wonPrize, setWonPrize] = useState(null);
  const [centerItemIdx, setCenterItemIdx] = useState(0);

  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const lastSoundCardIdx = useRef(0);

  useEffect(() => {
    // Pick winning prize
    const randomPrizeIdx = Math.floor(Math.random() * PRELOADED_PRIZES.length); // 0-5
    const winningPrizeObj = PRELOADED_PRIZES[randomPrizeIdx];

    // Target index inside the long strip (e.g. cycle 6: index 36 + randomPrizeIdx)
    const targetStripIndex = 36 + randomPrizeIdx;

    // Container width (default ~320px, calculated dynamically)
    const containerW = containerRef.current ? containerRef.current.clientWidth : 320;
    const centerOffset = containerW / 2 - CARD_WIDTH / 2;

    // Target TranslateX to center the winning card directly under the fixed middle pointer
    const targetX = -(targetStripIndex * STEP_SIZE - centerOffset);

    const startX = centerOffset; // Start at first card centered
    const spinDuration = 3600; // 3.6 seconds fast spin + deceleration
    const startTime = performance.now();

    // Cubic Easing out curve: starts super fast, decelerates smoothly to a stop!
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const animateReel = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / spinDuration);
      const easedProgress = easeOutQuart(progress);

      const currentX = startX + (targetX - startX) * easedProgress;
      setTranslateX(currentX);

      // Calculate card index passing center for ticking audio
      const passedCardIdx = Math.floor(Math.abs(currentX - centerOffset) / STEP_SIZE);
      if (passedCardIdx !== lastSoundCardIdx.current) {
        lastSoundCardIdx.current = passedCardIdx;
        setCenterItemIdx(passedCardIdx % REEL_ITEMS.length);
        soundManager.playGatePassSound(false);
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateReel);
      } else {
        setTranslateX(targetX);
        setCenterItemIdx(targetStripIndex % REEL_ITEMS.length);
        setWonPrize(winningPrizeObj);
        setIsSpinning(false);
        soundManager.playVictoryFanfare();
      }
    };

    animationRef.current = requestAnimationFrame(animateReel);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-4 border-amber-400 shadow-2xl text-center text-white flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 via-transparent to-sky-500/10 pointer-events-none" />

        {/* Title Badge */}
        <div className="relative z-10 flex flex-col items-center">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-amber-300 bg-amber-950/80 border border-amber-400 mb-2 shadow-md">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" /> 15 FLOORS BUILT!
          </span>
          <h2 className="text-2xl font-black font-heading text-white uppercase tracking-wide">
            SELECT A PRIZE REEL 🎁
          </h2>
          <p className="text-xs font-bold text-slate-300 mt-0.5">
            {isSpinning ? 'Fast spinning prize reel...' : '🎉 CONGRATULATIONS! YOU WON A PRIZE!'}
          </p>
        </div>

        {/* HORIZONTAL PHYSICAL SCROLLING PRIZE REEL CONTAINER */}
        <div 
          ref={containerRef}
          className="relative z-10 w-full h-36 my-2 bg-slate-950 rounded-2xl border-2 border-amber-500/60 overflow-hidden shadow-[inset_0_4px_12px_rgba(0,0,0,0.8)] flex items-center"
        >
          {/* FIXED DEAD-CENTER SELECTOR POINTER (Top & Bottom Golden Arrows) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px] border-t-amber-400 drop-shadow-[0_2px_6px_rgba(245,158,11,0.8)]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[16px] border-b-amber-400 drop-shadow-[0_-2px_6px_rgba(245,158,11,0.8)]" />

          {/* FIXED DEAD-CENTER HIGHLIGHT BOX WINDOW */}
          <div className="absolute top-2 bottom-2 left-1/2 -translate-x-1/2 w-[112px] pointer-events-none rounded-2xl border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.6)] bg-amber-400/10 z-20" />

          {/* PHYSICAL MOVING HORIZONTAL RIBBON STRIP */}
          <div 
            className="flex items-center gap-[12px] absolute left-0 top-1/2 -translate-y-1/2 will-change-transform"
            style={{ transform: `translate3d(${translateX}px, -50%, 0)` }}
          >
            {REEL_ITEMS.map((prize, idx) => {
              const isCenter = idx === centerItemIdx;
              return (
                <div
                  key={`${prize.id}-${idx}`}
                  style={{ width: `${CARD_WIDTH}px` }}
                  className={`h-28 flex-shrink-0 rounded-2xl bg-gradient-to-b ${prize.color} border-2 ${prize.border} p-2.5 flex flex-col items-center justify-between text-white transition-transform duration-100 ${
                    isCenter ? 'scale-105 shadow-xl' : 'opacity-70 scale-95'
                  }`}
                >
                  <span className="text-3xl drop-shadow-md my-auto">{prize.icon}</span>
                  <span className="text-[11px] font-black uppercase font-heading text-center leading-tight text-white drop-shadow">
                    {prize.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* WON PRIZE CARD REVEAL */}
        {wonPrize && (
          <div className="relative z-10 w-full p-4 rounded-2xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-slate-950 border-2 border-amber-200 shadow-xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-4xl p-2 bg-amber-200/60 rounded-xl shadow-inner">{wonPrize.icon}</div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900">YOUR BOOTH PRIZE</span>
              <span className="text-base font-black font-heading leading-tight">{wonPrize.name}</span>
              <span className="text-[10px] font-extrabold text-slate-900 mt-0.5">Show this to our booth team to claim!</span>
            </div>
          </div>
        )}

        {/* CLAIM BUTTON */}
        {!isSpinning && (
          <button
            onClick={() => onClaimPrize(wonPrize)}
            className="relative z-10 w-full py-4 px-6 rounded-2xl bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-700 text-white font-black text-base font-heading tracking-wider uppercase border-2 border-emerald-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_8px_16px_rgba(0,0,0,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            CLAIM PRIZE & CONTINUE
          </button>
        )}
      </div>
    </div>
  );
}
