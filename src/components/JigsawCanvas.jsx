import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Settings, 
  Sparkles, 
  Trophy,
  Grid,
  ImageIcon,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { soundManager } from '../utils/audioEngine';

// Default App Logo Preset Options (GoWhats, Billzzy, CipherGate, F3 Engine)
const LOGO_PRESETS = [
  { id: 'gowhats', name: 'GoWhats', src: '/gowhats.png', usage: 'WhatsApp-based checkout and customer engagement.', scale: 1.4 },
  { id: 'billzzy', name: 'Billzzy', src: '/billzzy.png', usage: 'Simple, reliable billing for your business.', scale: 1.22 },
  { id: 'ciphergate', name: 'CipherGate', src: '/ciphergate logo.png', usage: 'Secure gateway for your business data.' },
  { id: 'f3', name: 'F3 Engine', src: '/f3-icon.png', usage: 'The backend engine powering core operations.' }
];

export default function JigsawCanvas({ settings, onGameComplete, onBack, onOpenSettings }) {
  // Grid config from settings or default 4x4
  const gridConfig = settings?.jigsawGrid || { label: '4×4', rows: 4, cols: 4, total: 16, name: 'Medium' };

  const [currentLogo, setCurrentLogo] = useState(LOGO_PRESETS[0]);
  const [showGhost, setShowGhost] = useState(true);
  const [showReference, setShowReference] = useState(true);
  
  // Board Slots Array: length = gridConfig.total, holds piece objects scattered across slots
  const [boardSlots, setBoardSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  const [movesCount, setMovesCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVictoryAnimating, setIsVictoryAnimating] = useState(false);

  const containerRef = useRef(null);

  // Total Timer Duration = 60 seconds
  const GAME_DURATION = 60;
  const timeRemaining = Math.max(0, GAME_DURATION - elapsedTime);

  // Correctly Placed Count
  const correctCount = boardSlots.filter((p, idx) => p && p.id === idx).length;

  // Initialize Puzzle: Scatter all jigsaw pieces directly onto the board matrix (Freestyle!)
  useEffect(() => {
    initPuzzle();
  }, [gridConfig]);

  // Timer Countdown Effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && !isGameOver) {
      if (elapsedTime >= GAME_DURATION) {
        setIsTimerRunning(false);
        setIsGameOver(true);
        soundManager.playRedGateSound(true);
      } else {
        interval = setInterval(() => {
          setElapsedTime(prev => {
            if (prev + 1 >= GAME_DURATION) {
              setIsTimerRunning(false);
              setIsGameOver(true);
              soundManager.playRedGateSound(true);
              return GAME_DURATION;
            }
            return prev + 1;
          });
        }, 1000);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isGameOver, elapsedTime]);

  const initPuzzle = () => {
    // Pick random logo
    const randomLogo = LOGO_PRESETS[Math.floor(Math.random() * LOGO_PRESETS.length)];
    setCurrentLogo(randomLogo);

    const { rows, cols, total } = gridConfig;

    // Generate inner edge tab directions (+1 = tab protruding right/down, -1 = tab indenting left/up)
    const horizEdges = Array.from({ length: rows }, () => 
      Array.from({ length: cols - 1 }, () => Math.random() < 0.5 ? 1 : -1)
    );
    const vertEdges = Array.from({ length: rows - 1 }, () => 
      Array.from({ length: cols }, () => Math.random() < 0.5 ? 1 : -1)
    );

    const createdPieces = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const id = r * cols + c;

        const top = r === 0 ? 0 : -vertEdges[r - 1][c];
        const right = c === cols - 1 ? 0 : horizEdges[r][c];
        const bottom = r === rows - 1 ? 0 : vertEdges[r][c];
        const left = c === 0 ? 0 : -horizEdges[r][c - 1];

        createdPieces.push({
          id,
          row: r,
          col: c,
          edges: { top, right, bottom, left }
        });
      }
    }

    // Shuffle pieces across all slots for freestyle gameplay
    let shuffledPieces = [...createdPieces].sort(() => Math.random() - 0.5);

    let attempts = 0;
    // Ensure 0% starting solved state
    while (attempts < 100 && shuffledPieces.some((p, i) => p.id === i)) {
      shuffledPieces = [...createdPieces].sort(() => Math.random() - 0.5);
      attempts++;
    }

    // Fallback: If random shuffle still has pieces in matching slots, shift offset by 1
    if (shuffledPieces.some((p, i) => p.id === i)) {
      shuffledPieces = createdPieces.map((_, i) => createdPieces[(i + 1) % createdPieces.length]);
    }

    setBoardSlots(shuffledPieces);
    setElapsedTime(0);
    setMovesCount(0);
    setSelectedSlot(null);
    setIsGameOver(false);
    setIsVictoryAnimating(false);
    setIsTimerRunning(false); // Timer starts on first slot touch
    soundManager.playShuffleSound();
  };

  // Build SVG Path String for Interlocking Bezier Jigsaw Tabs (Base Tile 100x100)
  const generatePieceSvgPath = (w, h, edges) => {
    const { top, right, bottom, left } = edges;
    const tabH = Math.min(w, h) * 0.22;

    let path = `M 0 0 `;

    // Top edge
    if (top === 0) {
      path += `L ${w} 0 `;
    } else {
      const d = top;
      path += `L ${w * 0.35} 0 `;
      path += `C ${w * 0.35} ${-d * tabH * 0.8}, ${w * 0.42} ${-d * tabH * 1.25}, ${w * 0.5} ${-d * tabH * 1.25} `;
      path += `C ${w * 0.58} ${-d * tabH * 1.25}, ${w * 0.65} ${-d * tabH * 0.8}, ${w * 0.65} 0 `;
      path += `L ${w} 0 `;
    }

    // Right edge
    if (right === 0) {
      path += `L ${w} ${h} `;
    } else {
      const d = right;
      path += `L ${w} ${h * 0.35} `;
      path += `C ${w + d * tabH * 0.8} ${h * 0.35}, ${w + d * tabH * 1.25} ${h * 0.42}, ${w + d * tabH * 1.25} ${h * 0.5} `;
      path += `C ${w + d * tabH * 1.25} ${h * 0.58}, ${w + d * tabH * 0.8} ${h * 0.65}, ${w} ${h} `;
      path += `L ${w} ${h} `;
    }

    // Bottom edge
    if (bottom === 0) {
      path += `L 0 ${h} `;
    } else {
      const d = bottom;
      path += `L ${w * 0.65} ${h} `;
      path += `C ${w * 0.65} ${h + d * tabH * 0.8}, ${w * 0.58} ${h + d * tabH * 1.25}, ${w * 0.5} ${h + d * tabH * 1.25} `;
      path += `C ${w * 0.42} ${h + d * tabH * 1.25}, ${w * 0.35} ${h + d * tabH * 0.8}, ${w * 0.35} ${h} `;
      path += `L 0 ${h} `;
    }

    // Left edge
    if (left === 0) {
      path += `Z`;
    } else {
      const d = left;
      path += `L 0 ${h * 0.65} `;
      path += `C ${-d * tabH * 0.8} ${h * 0.65}, ${-d * tabH * 1.25} ${h * 0.58}, ${-d * tabH * 1.25} ${h * 0.5} `;
      path += `C ${-d * tabH * 1.25} ${h * 0.42}, ${-d * tabH * 0.8} ${h * 0.35}, 0 ${h * 0.35} `;
      path += `Z`;
    }

    return path;
  };

  // Render SVG Jigsaw Piece for Board Swap Matrix
  const JigsawTileSvg = ({ piece, currentSlotIdx, isSelected, isVictoryAnimating }) => {
    const { rows, cols } = gridConfig;
    const tileW = 100;
    const tileH = 100;

    const pathD = generatePieceSvgPath(tileW, tileH, piece.edges);
    const clipId = `jigsaw-swap-clip-${piece.id}-${rows}x${cols}`;
    const isCorrect = piece.id === currentSlotIdx;

    // Support custom zoom/scale factor for preset logos
    const imgScale = currentLogo.scale || 1.0;
    const totalW = cols * tileW * imgScale;
    const totalH = rows * tileH * imgScale;
    const imgX = -piece.col * tileW - (totalW - cols * tileW) / 2;
    const imgY = -piece.row * tileH - (totalH - rows * tileH) / 2;

    return (
      <svg 
        viewBox="0 0 100 100" 
        className={`w-full h-full overflow-visible pointer-events-none transition-all duration-500 ${
          isSelected 
            ? 'filter drop-shadow-[0_0_15px_rgba(16,185,129,0.95)] scale-105 z-30' 
            : isCorrect 
            ? 'filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]' 
            : 'filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)] opacity-95'
        }`}
      >
        <defs>
          <clipPath id={clipId}>
            <path d={pathD} />
          </clipPath>
        </defs>

        <g clipPath={`url(#${clipId})`}>
          {/* Crisp Pure White Background for transparent PNG logos */}
          <rect 
            x={-piece.col * tileW} 
            y={-piece.row * tileH} 
            width={cols * tileW} 
            height={rows * tileH} 
            fill="#ffffff" 
          />
          <image 
            href={currentLogo.src} 
            x={imgX} 
            y={imgY} 
            width={totalW} 
            height={totalH} 
            preserveAspectRatio="none"
          />
        </g>

        {/* Solid Dark Black Jigsaw Cut Line Outline - Vanishes smoothly to transparent on victory! */}
        <path 
          d={pathD} 
          fill="none" 
          stroke={isVictoryAnimating ? 'transparent' : isSelected ? '#10b981' : '#090d16'} 
          strokeWidth={isSelected ? '3.5' : '2.2'} 
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-700"
        />
        {isSelected && !isVictoryAnimating && (
          <path 
            d={pathD} 
            fill="none" 
            stroke="#10b981" 
            strokeWidth="2.5" 
          />
        )}
        {isCorrect && !isSelected && !isVictoryAnimating && (
          <path 
            d={pathD} 
            fill="none" 
            stroke="#059669" 
            strokeWidth="1.8" 
          />
        )}
      </svg>
    );
  };

  // Handle Slot Tap / Swap Action (Freestyle - any piece can swap with any other slot!)
  const handleSlotTap = (slotIdx) => {
    if (isGameOver || isVictoryAnimating) return;
    soundManager.init();

    // Start 60s Countdown timer on first interaction
    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }

    if (selectedSlot === null) {
      // First piece selected
      setSelectedSlot(slotIdx);
      soundManager.playSnapSound();
    } else if (selectedSlot === slotIdx) {
      // Deselect same piece
      setSelectedSlot(null);
    } else {
      // Swap pieces between selectedSlot and slotIdx!
      const newSlots = [...boardSlots];
      const temp = newSlots[selectedSlot];
      newSlots[selectedSlot] = newSlots[slotIdx];
      newSlots[slotIdx] = temp;

      setBoardSlots(newSlots);
      setSelectedSlot(null);
      setMovesCount(prev => prev + 1);
      soundManager.playSnapSound();

      // Check Victory: Are all pieces in their correct slots?
      const isSolved = newSlots.every((p, idx) => p.id === idx);
      if (isSolved) {
        setIsTimerRunning(false);
        setIsVictoryAnimating(true);
        soundManager.playPuzzleCompleteSound();

        const finishedUnder60 = elapsedTime < 60;

        // Outlines vanish for 3 seconds before proceeding directly to prize selection!
        setTimeout(() => {
          onGameComplete({
            timeSeconds: elapsedTime,
            timeRemaining,
            moves: movesCount + 1,
            gridSize: gridConfig.label,
            logoName: currentLogo.name,
            eligibleForPrize: finishedUnder60,
            score: Math.max(300, 15000 - elapsedTime * 30 - (movesCount + 1) * 20)
          });
        }, 3000);
      }
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full h-[100dvh] flex flex-col justify-between p-2.5 bg-gradient-to-b from-emerald-50/70 via-white to-teal-50/60 text-slate-900 font-sans select-none overflow-hidden"
    >
      {/* --- GAME OVER MODAL OVERLAY --- */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm flex flex-col items-center rounded-3xl bg-white border-2 border-rose-400 p-6 shadow-2xl text-center">
            <div className="p-3.5 rounded-full bg-rose-100 text-rose-600 mb-3 animate-bounce shadow-md">
              <Clock className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black font-heading text-slate-900 uppercase tracking-tight">
              TIME'S UP! GAME OVER
            </h2>
            <p className="text-xs font-bold text-slate-500 mt-1 uppercase">
              You ran out of time (60s) before solving the puzzle.
            </p>

            <div className="my-4 p-3 w-full rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-extrabold text-emerald-900 flex justify-around shadow-inner">
              <div>
                <span className="block text-[10px] text-emerald-700 font-sans uppercase">Solved</span>
                <span className="text-base text-emerald-600 font-mono font-black">{correctCount} / {gridConfig.total}</span>
              </div>
              <div className="w-[1px] h-8 bg-emerald-200" />
              <div>
                <span className="block text-[10px] text-emerald-700 font-sans uppercase">Moves</span>
                <span className="text-base text-teal-700 font-mono font-black">{movesCount}</span>
              </div>
            </div>

            <div className="w-full flex flex-col gap-2">
              <button
                onClick={initPuzzle}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-95 text-white font-black text-xs font-heading tracking-wider uppercase border border-emerald-300 shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <RotateCcw className="w-4 h-4" /> Try Again (60s Reset)
              </button>

              <button
                onClick={onBack}
                className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-black text-xs uppercase border border-slate-300 flex items-center justify-center gap-2 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Return to Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 1. TOP: HEADER BAR (LUXURY GLASS ARCHITECTURE) --- */}
      <div className="relative z-20 w-full shrink-0">
        <div className="w-full p-2 px-3.5 luxury-glass-card rounded-full flex items-center justify-between gap-2 overflow-hidden">
          {/* Left: Circular Back Button */}
          <button 
            onClick={onBack}
            className="p-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-all active:scale-95 border border-emerald-200 shrink-0"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Center: Clean Title */}
          <h1 className="text-xs sm:text-sm font-black tracking-wider text-emerald-950 flex items-center gap-1.5 uppercase font-heading">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" /> LOGO JIGSAW
          </h1>

          {/* Right: Circular Action Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setShowReference(!showReference)}
              className={`p-1.5 rounded-full border transition-all ${
                showReference 
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-900 shadow-sm' 
                  : 'bg-emerald-50 border-emerald-200 text-emerald-600'
              }`}
              title="Toggle Guide"
            >
              <ImageIcon className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setShowGhost(!showGhost)}
              className={`p-1.5 rounded-full border transition-all ${
                showGhost 
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-900 shadow-sm' 
                  : 'bg-emerald-50 border-emerald-200 text-emerald-600'
              }`}
              title="Toggle Hint"
            >
              {showGhost ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={initPuzzle}
              className="p-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 transition-all active:rotate-180 duration-300"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenSettings}
              className="p-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 transition-all"
              title="Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* --- 2. ABOVE GAME: TIMER & STATS BADGE + REFERENCE GUIDE CARD --- */}
      <div className="relative z-10 shrink-0 w-full max-w-xs mx-auto mt-1 mb-1 flex flex-col items-center gap-1">
        {/* Free-Floating Large Countdown Timer & Solved Subtext ABOVE Reference Image */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5 text-emerald-950 font-mono font-black text-2xl sm:text-3xl tracking-tight drop-shadow-xs">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 inline" />
            <span className={timeRemaining <= 5 && isTimerRunning ? 'text-rose-600 font-black animate-ping' : 'text-emerald-900 font-black'}>
              {formatTime(timeRemaining)}
            </span>
          </div>
          
          <span className="text-[10px] sm:text-xs font-black text-emerald-800 tracking-wider uppercase font-sans">
            {correctCount} / {gridConfig.total} SOLVED
          </span>
        </div>

        {/* Reference Guide Image Card */}
        {showReference && (
          <div className="w-48 sm:w-52 p-2.5 luxury-glass-card rounded-2xl flex flex-col items-center gap-1.5 text-center shadow-md">
            <div className="relative aspect-square w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-xl bg-white overflow-hidden border border-emerald-200 p-1 flex items-center justify-center shadow-xs">
              <img 
                src={currentLogo.src} 
                alt={currentLogo.name} 
                className={`w-full h-full object-contain p-0.5 transition-transform ${currentLogo.scale ? 'scale-125' : ''}`}
              />
            </div>

            {/* App Usage Text Below Image */}
            {currentLogo.usage && (
              <div className="w-full px-2 py-1 rounded-xl bg-emerald-50/90 border border-emerald-200 text-center">
                <p className="text-[10px] font-black text-emerald-950 uppercase tracking-tight">
                  {currentLogo.name}
                </p>
                <p className="text-[8.5px] font-bold text-emerald-800 leading-tight mt-0.5">
                  "{currentLogo.usage}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- 3. CENTER GAME: SWAP JIGSAW PUZZLE BOARD MATRIX (LUXURY GLASS BOARD) --- */}
      <div className="relative z-10 flex-1 min-h-0 flex items-center justify-center my-0.5">
        <div className="relative h-full max-h-[340px] sm:max-h-[380px] aspect-square luxury-glass-card rounded-[32px] p-2.5 border-2 border-emerald-300/80 shadow-2xl flex items-center justify-center overflow-hidden">
          
          {/* Board Matrix Inner Container */}
          <div className="relative w-full h-full overflow-hidden rounded-2xl bg-emerald-50/60 border border-emerald-200/80">

            {/* Target Ghost Hint Image */}
            {showGhost && (
              <img 
                src={currentLogo.src} 
                alt="Target Hint" 
                className="absolute inset-0 w-full h-full object-fill opacity-25 pointer-events-none filter blur-[0.5px]"
              />
            )}

            {/* Tile Swap Grid Matrix */}
            <div 
              className="absolute inset-0 grid w-full h-full"
              style={{
                gridTemplateRows: `repeat(${gridConfig.rows}, minmax(0, 1fr))`,
                gridTemplateColumns: `repeat(${gridConfig.cols}, minmax(0, 1fr))`
              }}
            >
              {boardSlots.map((piece, slotIdx) => {
                if (!piece) return null;
                const isSelected = selectedSlot === slotIdx;
                const isCorrect = piece.id === slotIdx;

                return (
                  <div 
                    key={slotIdx}
                    onClick={() => handleSlotTap(slotIdx)}
                    className={`relative w-full h-full overflow-visible cursor-pointer transition-transform duration-150 ${
                      isSelected ? 'z-30 scale-105' : 'hover:scale-[1.02]'
                    }`}
                  >
                    {/* SVG Vector Jigsaw Piece Tile */}
                    <JigsawTileSvg 
                      piece={piece} 
                      currentSlotIdx={slotIdx} 
                      isSelected={isSelected} 
                      isVictoryAnimating={isVictoryAnimating}
                    />

                    {/* Green Checkmark Badge when Tile is in Correct Position (fades out on victory) */}
                    {isCorrect && !isSelected && !isVictoryAnimating && (
                      <div className="absolute top-1 right-1 z-20 p-0.5 rounded-full bg-emerald-600 text-white shadow-sm pointer-events-none animate-fade-in">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                    )}

                    {/* Selection Active Ring */}
                    {isSelected && !isVictoryAnimating && (
                      <div className="absolute inset-0 z-20 rounded-lg border-2 border-emerald-500 bg-emerald-500/10 pointer-events-none animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>

      {/* --- 4. BOTTOM INSTRUCTION BAR --- */}
      <div className="relative z-20 shrink-0 w-full max-w-sm mx-auto p-2 luxury-glass-card rounded-2xl text-center">
        <p className="text-[10px] sm:text-xs font-black text-emerald-900 uppercase tracking-wide flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" /> Tap one piece, then tap another to swap them!
        </p>
      </div>
    </div>
  );
}
