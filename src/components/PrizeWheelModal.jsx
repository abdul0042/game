import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, CheckCircle2, Gift, Trophy } from 'lucide-react';
import { soundManager } from '../utils/audioEngine';

const PRELOADED_PRIZES = [
  { id: 'glasses', name: 'Tech Sunglasses', icon: '🕶️' },
  { id: 'tshirt', name: 'Exclusive Tech T-Shirt', icon: '👕' },
  { id: 'bottle', name: 'Smart Water Bottle', icon: '🍾' },
  { id: 'cap', name: 'Branded Tech Cap', icon: '🧢' },
  { id: 'backpack', name: 'Tech Backpack', icon: '🎒' },
  { id: 'earbuds', name: 'Wireless Earbuds', icon: '🎧' }
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
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm p-6 sm:p-7 rounded-[32px] bg-white border border-emerald-200/90 shadow-[0_25px_60px_-15px_rgba(16,185,129,0.25)] text-center text-slate-900 flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300 relative overflow-hidden">
        
        {/* Soft Ambient Mesh Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-100/70 rounded-full blur-3xl pointer-events-none" />

        {/* Title & Pill Badge */}
        <div className="relative z-10 flex flex-col items-center">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200/80 shadow-xs mb-2">
            <Gift className="w-3.5 h-3.5 text-emerald-600 animate-bounce" /> PRIZE UNLOCKED!
          </span>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-emerald-950 uppercase tracking-tight">
            SELECT A PRIZE REEL
          </h2>
          <p className="text-xs font-bold text-slate-500 mt-0.5">
            {isSpinning ? 'Fast spinning prize reel...' : '🎉 CONGRATULATIONS! YOU WON A PRIZE!'}
          </p>
        </div>

        {/* HORIZONTAL PHYSICAL SCROLLING PRIZE REEL CONTAINER */}
        <div 
          ref={containerRef}
          className="relative z-10 w-full h-36 my-1 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-2xl border-2 border-emerald-500/50 overflow-hidden shadow-[inset_0_4px_16px_rgba(0,0,0,0.7)] flex items-center"
        >
          {/* FIXED DEAD-CENTER SELECTOR POINTER (Top & Bottom Emerald Arrows) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px] border-t-emerald-400 drop-shadow-[0_2px_8px_rgba(16,185,129,0.9)]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[16px] border-b-emerald-400 drop-shadow-[0_-2px_8px_rgba(16,185,129,0.9)]" />

          {/* FIXED DEAD-CENTER HIGHLIGHT BOX WINDOW */}
          <div className="absolute top-2 bottom-2 left-1/2 -translate-x-1/2 w-[112px] pointer-events-none rounded-2xl border-2 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.6)] bg-emerald-500/10 z-20" />

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
                  className={`h-28 flex-shrink-0 rounded-2xl bg-gradient-to-b from-white via-emerald-50/40 to-emerald-100/70 border-2 p-2.5 flex flex-col items-center justify-between text-slate-900 transition-all duration-150 ${
                    isCenter 
                      ? 'border-emerald-500 scale-105 shadow-xl bg-white ring-2 ring-emerald-400/40' 
                      : 'border-emerald-200/80 opacity-60 scale-95'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100/60 border border-emerald-200/60 flex items-center justify-center text-2xl drop-shadow-xs my-auto">
                    {prize.icon}
                  </div>
                  <span className="text-[10.5px] font-black uppercase font-heading text-center leading-tight text-emerald-950 tracking-tight">
                    {prize.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* WON PRIZE CARD REVEAL */}
        {wonPrize && (
          <div className="relative z-10 w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white border border-emerald-300/60 shadow-[0_12px_28px_rgba(16,185,129,0.35)] flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-3xl p-2.5 bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 shadow-xs flex items-center justify-center">
              {wonPrize.icon}
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-200">YOUR BOOTH PRIZE</span>
              <span className="text-base font-black font-heading leading-tight text-white">{wonPrize.name}</span>
              <span className="text-[10.5px] font-extrabold text-emerald-100 mt-0.5">Show this to our booth team to claim!</span>
            </div>
          </div>
        )}

        {/* CLAIM BUTTON */}
        {!isSpinning && (
          <button
            onClick={() => onClaimPrize(wonPrize)}
            className="relative z-10 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white font-black text-sm font-heading tracking-wider uppercase border border-emerald-300 shadow-[0_10px_25px_-5px_rgba(16,185,129,0.4)] hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            CLAIM PRIZE & CONTINUE
          </button>
        )}
      </div>
    </div>
  );
}
