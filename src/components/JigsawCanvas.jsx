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

// Default App Logo Preset Options (GoWhats, Billzzy, Ciphergate, F3 Empire)
const LOGO_PRESETS = [
  { id: 'gowhats', name: 'GoWhats', src: '/gowhats.webp' },
  { id: 'billzzy', name: 'Billzzy', src: '/billzzy.webp' },
  { id: 'ciphergate', name: 'Ciphergate', src: '/ciphergate_lo_go (1).webp' },
  { id: 'f3', name: 'F3 Empire', src: '/f3-icon.webp' }
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

  const containerRef = useRef(null);

  // Total Timer Duration = 45 seconds
  const GAME_DURATION = 45;
  const timeRemaining = Math.max(0, GAME_DURATION - elapsedTime);

  // Correctly Placed Count
  const correctCount = boardSlots.filter((p, idx) => p && p.id === idx).length;

  // Initialize Puzzle: Scatter all jigsaw pieces directly onto the board matrix!
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

    // Shuffle pieces across slots (ensure at least 50% are misplaced on start)
    let shuffled = [...createdPieces].sort(() => Math.random() - 0.5);
    while (shuffled.filter((p, idx) => p.id === idx).length > total * 0.4) {
      shuffled = [...createdPieces].sort(() => Math.random() - 0.5);
    }

    setBoardSlots(shuffled);
    setElapsedTime(0);
    setMovesCount(0);
    setSelectedSlot(null);
    setIsGameOver(false);
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
      path += `C ${w + d * tabH * 1.25} ${h * 0.58}, ${w + d * tabH * 0.8} ${h * 0.65}, ${w} ${h * 0.65} `;
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
  const JigsawTileSvg = ({ piece, currentSlotIdx, isSelected }) => {
    const { rows, cols } = gridConfig;
    const tileW = 100;
    const tileH = 100;

    const pathD = generatePieceSvgPath(tileW, tileH, piece.edges);
    const clipId = `jigsaw-swap-clip-${piece.id}-${rows}x${cols}`;
    const isCorrect = piece.id === currentSlotIdx;

    return (
      <svg 
        viewBox="0 0 100 100" 
        className={`w-full h-full overflow-visible pointer-events-none transition-all duration-200 ${
          isSelected 
            ? 'filter drop-shadow-[0_0_12px_rgba(16,185,129,0.9)] scale-105 z-30' 
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
          <image 
            href={currentLogo.src} 
            x={-piece.col * tileW} 
            y={-piece.row * tileH} 
            width={cols * tileW} 
            height={rows * tileH} 
            preserveAspectRatio="none"
          />
        </g>

        {/* Solid Dark Black Jigsaw Cut Line Outline */}
        <path 
          d={pathD} 
          fill="none" 
          stroke="#090d16" 
          strokeWidth={isSelected ? '3.5' : '2.2'} 
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {isSelected && (
          <path 
            d={pathD} 
            fill="none" 
            stroke="#10b981" 
            strokeWidth="2.5" 
          />
        )}
        {isCorrect && !isSelected && (
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

  // Handle Slot Tap / Swap Action
  const handleSlotTap = (slotIdx) => {
    if (isGameOver) return;
    soundManager.init();

    // Start 30s Countdown timer on first interaction
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
        soundManager.playPuzzleCompleteSound();

        const finishedUnder45 = elapsedTime < 45;

        setTimeout(() => {
          onGameComplete({
            timeSeconds: elapsedTime,
            timeRemaining,
            moves: movesCount + 1,
            gridSize: gridConfig.label,
            logoName: currentLogo.name,
            eligibleForPrize: finishedUnder45,
            score: Math.max(300, 15000 - elapsedTime * 30 - (movesCount + 1) * 20)
          });
        }, 800);
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
      className="relative w-full h-full h-[100dvh] flex flex-col justify-between p-2.5 bg-gradient-to-br from-slate-200 via-sky-100/70 to-emerald-100/60 text-slate-900 font-sans select-none overflow-hidden"
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
              You ran out of time (45s) before solving the puzzle.
            </p>

            <div className="my-4 p-3 w-full rounded-2xl bg-slate-50 border border-slate-200 text-xs font-extrabold text-slate-700 flex justify-around shadow-inner">
              <div>
                <span className="block text-[10px] text-slate-400 font-sans uppercase">Solved</span>
                <span className="text-base text-emerald-600 font-mono font-black">{correctCount} / {gridConfig.total}</span>
              </div>
              <div className="w-[1px] h-8 bg-slate-200" />
              <div>
                <span className="block text-[10px] text-slate-400 font-sans uppercase">Moves</span>
                <span className="text-base text-sky-700 font-mono font-black">{movesCount}</span>
              </div>
            </div>

            <div className="w-full flex flex-col gap-2">
              <button
                onClick={initPuzzle}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:brightness-110 active:scale-95 text-white font-black text-xs font-heading tracking-wider uppercase border border-rose-300 shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <RotateCcw className="w-4 h-4" /> Try Again (45s Reset)
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

      {/* --- 1. TOP: HEADER BAR --- */}
      <div className="relative z-20 w-full shrink-0">
        <div className="w-full p-2 px-3 bg-slate-100/90 backdrop-blur-md rounded-full border border-slate-300/80 shadow-sm flex items-center justify-between gap-2 overflow-hidden">
          {/* Left: Circular Back Button */}
          <button 
            onClick={onBack}
            className="p-1.5 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 transition-all active:scale-95 border border-slate-300 shrink-0"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Center: Title & Countdown / Moves Badge */}
          <div className="flex flex-col items-center text-center">
            <h1 className="text-xs font-black tracking-wide text-slate-900 flex items-center gap-1 uppercase font-heading">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> LOGO JIGSAW
            </h1>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-200/80 text-[10px] font-extrabold font-mono text-emerald-800 border border-slate-300">
              <span>Countdown <strong className={timeRemaining <= 5 && isTimerRunning ? 'text-rose-600 font-black animate-ping' : 'text-emerald-800 font-black'}>{formatTime(timeRemaining)}</strong></span>
              <span className="text-slate-400">|</span>
              <span>Moves <strong className="text-sky-800 font-black">{movesCount}</strong></span>
              <span className="text-slate-400">|</span>
              <span className="text-emerald-800 font-black">{correctCount}/{gridConfig.total}</span>
            </div>
          </div>

          {/* Right: Circular Action Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setShowReference(!showReference)}
              className={`p-1.5 rounded-full border transition-all ${
                showReference 
                  ? 'bg-cyan-200/80 border-cyan-400 text-cyan-900 shadow-sm' 
                  : 'bg-slate-200/80 border-slate-300 text-slate-600'
              }`}
              title="Toggle Guide"
            >
              <ImageIcon className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setShowGhost(!showGhost)}
              className={`p-1.5 rounded-full border transition-all ${
                showGhost 
                  ? 'bg-emerald-200/80 border-emerald-400 text-emerald-900 shadow-sm' 
                  : 'bg-slate-200/80 border-slate-300 text-slate-600'
              }`}
              title="Toggle Hint"
            >
              {showGhost ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={initPuzzle}
              className="p-1.5 rounded-full bg-slate-200/80 hover:bg-slate-300 border border-slate-300 text-slate-700 transition-all active:rotate-180 duration-300"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenSettings}
              className="p-1.5 rounded-full bg-slate-200/80 hover:bg-slate-300 border border-slate-300 text-slate-700 transition-all"
              title="Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* --- 2. ABOVE GAME: COMPACT REFERENCE IMAGE GUIDE CARD --- */}
      {showReference && (
        <div className="relative z-10 shrink-0 w-36 sm:w-40 mx-auto mt-2.5 mb-1.5 p-2 bg-slate-100/90 backdrop-blur rounded-2xl shadow-md border border-slate-300/90 flex flex-col gap-1 text-center">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1">
              <ImageIcon className="w-3 h-3 text-cyan-600" /> REFERENCE
            </span>
            <span className="text-[8px] font-extrabold text-emerald-800 bg-emerald-200/80 px-1.5 py-0.2 rounded-full border border-emerald-300">
              Target Guide
            </span>
          </div>

          <div className="relative aspect-square w-full rounded-xl bg-slate-200/70 overflow-hidden border border-slate-300 p-1 flex items-center justify-center">
            <img 
              src={currentLogo.src} 
              alt="Reference Target" 
              className="w-full h-full object-contain p-0.5"
            />
            <div className="absolute bottom-0.5 left-0.5 right-0.5 px-1 py-0.2 rounded-md bg-slate-100/95 text-center text-[8px] font-extrabold text-slate-800 shadow-xs border border-slate-300">
              {gridConfig.label} Solved
            </div>
          </div>
        </div>
      )}

      {/* --- 3. CENTER GAME: SWAP JIGSAW PUZZLE BOARD MATRIX --- */}
      <div className="relative z-10 flex-1 min-h-0 flex items-center justify-center my-0.5">
        <div className="relative h-full max-h-[250px] sm:max-h-[280px] aspect-square bg-slate-200/90 backdrop-blur rounded-3xl p-2.5 border-2 border-slate-300/90 shadow-xl flex items-center justify-center overflow-hidden">
          
          {/* Board Outer Container */}
          <div className="relative w-full h-full overflow-hidden rounded-2xl bg-slate-300/60 border border-slate-400/60 shadow-inner">

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
                    />

                    {/* Green Checkmark Badge when Tile is in Correct Position */}
                    {isCorrect && (
                      <div className="absolute top-1 right-1 z-20 p-0.5 rounded-full bg-emerald-600 text-white shadow-sm pointer-events-none animate-fade-in">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                    )}

                    {/* Selection Active Ring */}
                    {isSelected && (
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
      <div className="relative z-20 shrink-0 w-full max-w-sm mx-auto p-2 bg-slate-100/90 backdrop-blur rounded-2xl shadow-md border border-slate-300 text-center">
        <p className="text-[10px] sm:text-xs font-black text-slate-800 uppercase tracking-wide flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" /> Tap one piece, then tap another to swap them!
        </p>
      </div>
    </div>
  );
}
