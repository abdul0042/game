import React, { useEffect, useRef, useState, useCallback } from 'react';
import StackerHUD from './StackerHUD';
import { soundManager } from '../utils/audioEngine';

// Tech Building Module Floor Types (5 Distinct Tech Apps)
const TECH_MODULES = [
  {
    id: 'ciphergate',
    name: 'Ciphergate',
    sub: 'API & Security',
    color: '#f97316',
    wallColor: '#ffedd5',
    roofColor: '#ea580c',
    plaqueColor: '#c2410c',
    icon: '🔒',
    candidates: ['/ciphergate_lo_go (1).webp', '/ciphergate.webp', '/ciphergate.png']
  },
  {
    id: 'fynovo',
    name: 'Fynovo',
    sub: 'Financial Engine',
    color: '#8b5cf6',
    wallColor: '#f3e8ff',
    roofColor: '#7c3aed',
    plaqueColor: '#6d28d9',
    icon: '💳',
    candidates: ['/fynovo.webp', '/f3-icon.webp', '/fynovo.png', '/fynovo.jpg']
  },
  {
    id: 'billzzy',
    name: 'Billzzy',
    sub: 'Smart POS & Billing',
    color: '#0284c7',
    wallColor: '#e0f2fe',
    roofColor: '#0284c7',
    plaqueColor: '#0369a1',
    icon: '🧾',
    candidates: ['/billzzy.webp', '/billzzy.png']
  },
  {
    id: 'billzzy_lite',
    name: 'Billzzy Lite',
    sub: 'Instant Express Billing',
    color: '#06b6d4',
    wallColor: '#cffafe',
    roofColor: '#0891b2',
    plaqueColor: '#0e7490',
    icon: '⚡',
    candidates: ['/billzzy lite.webp', '/billzzy_lite.webp', '/billzzy-lite.png']
  },
  {
    id: 'gowhats',
    name: 'GoWhats',
    sub: 'WhatsApp Automation',
    color: '#10b981',
    wallColor: '#d1fae5',
    roofColor: '#059669',
    plaqueColor: '#047857',
    icon: '💬',
    candidates: ['/gowhats.webp', '/gowhats.png']
  }
];

// Pre-cached Physics Progression Array
const PHYSICS_TABLE = [
  { craneSpeed: 0.048, gravitySpeed: 2.80, missMarginPct: 0.58 }, // Floor 1
  { craneSpeed: 0.058, gravitySpeed: 3.00, missMarginPct: 0.54 }, // Floor 2
  { craneSpeed: 0.068, gravitySpeed: 3.20, missMarginPct: 0.50 }, // Floor 3
  { craneSpeed: 0.078, gravitySpeed: 3.40, missMarginPct: 0.46 }, // Floor 4
  { craneSpeed: 0.088, gravitySpeed: 3.60, missMarginPct: 0.42 }, // Floor 5
  { craneSpeed: 0.098, gravitySpeed: 3.80, missMarginPct: 0.38 }, // Floor 6
  { craneSpeed: 0.108, gravitySpeed: 4.00, missMarginPct: 0.34 }, // Floor 7
  { craneSpeed: 0.118, gravitySpeed: 4.15, missMarginPct: 0.30 }, // Floor 8
  { craneSpeed: 0.128, gravitySpeed: 4.30, missMarginPct: 0.27 }, // Floor 9
  { craneSpeed: 0.138, gravitySpeed: 4.50, missMarginPct: 0.25 }  // Floor 10+
];

const getHardModePhysics = (floorsCount) => {
  const idx = Math.min(Math.max(0, floorsCount - 1), PHYSICS_TABLE.length - 1);
  return PHYSICS_TABLE[idx];
};

export default function StackerCanvas({ onGameComplete, onBack, onOpenSettings, gameDurationSeconds = 25, isMuted = false }) {
  const canvasRef = useRef(null);
  const moduleLogosRef = useRef({});
  const lastDropTimeRef = useRef(0);

  // Challenge Banner Overlay State
  const [showBanner, setShowBanner] = useState(true);

  // Perfect Square Box Dimensions (115x115px)
  const FIXED_BLOCK_WIDTH = 115;
  const FIXED_BLOCK_HEIGHT = 115;

  // React state for HUD
  const [hudState, setHudState] = useState({
    floorsCount: 0,
    score: 0,
    timeRemaining: gameDurationSeconds,
    combo: 0,
    missesCount: 0
  });

  // Preload Module Logos
  useEffect(() => {
    TECH_MODULES.forEach((mod) => {
      const candidates = mod.candidates || [`/${mod.id}.webp`];
      let candidateIndex = 0;

      const tryNextCandidate = () => {
        if (candidateIndex >= candidates.length) return;
        const src = candidates[candidateIndex];
        const img = new Image();
        img.src = src;

        img.onload = () => {
          if (img.naturalWidth > 0 && img.naturalHeight > 0) {
            moduleLogosRef.current[mod.id] = img;
          } else {
            candidateIndex++;
            tryNextCandidate();
          }
        };

        img.onerror = () => {
          candidateIndex++;
          tryNextCandidate();
        };
      };

      tryNextCandidate();
    });
  }, []);

  // Fresh Game State Refs
  const gameState = useRef({
    isRunning: true,
    hasStartedBuilding: false,
    score: 0,
    floorsCount: 0,
    combo: 0,
    missesCount: 0,
    maxMisses: 2,
    isGameOver: false,
    gameOverTimer: 0,
    cameraY: 0,
    targetCameraY: 0,
    craneX: 0,
    craneAngle: 0,
    hangingBlock: {
      width: FIXED_BLOCK_WIDTH,
      height: FIXED_BLOCK_HEIGHT,
      module: TECH_MODULES[0]
    },
    fallingBlock: null,
    tumblingBlocks: [],
    stackedBlocks: [],
    timeRemaining: gameDurationSeconds,
    screenShakeTimer: 0,
    unstableTimer: 0,
    particles: [],
    floatingTexts: [],
    impactRings: [],
    craneTrail: []
  });

  // Reset/Restart Game State
  const handleRestartGame = useCallback(() => {
    const canvas = canvasRef.current;
    const W = canvas ? canvas.width : 400;
    const H = canvas ? canvas.height : 600;

    gameState.current.score = 0;
    gameState.current.floorsCount = 0;
    gameState.current.combo = 0;
    gameState.current.missesCount = 0;
    gameState.current.isGameOver = false;
    gameState.current.gameOverTimer = 0;
    gameState.current.timeRemaining = gameDurationSeconds;
    gameState.current.isRunning = true;
    gameState.current.hasStartedBuilding = false;
    gameState.current.cameraY = 0;
    gameState.current.targetCameraY = 0;
    gameState.current.fallingBlock = null;
    gameState.current.tumblingBlocks = [];
    gameState.current.impactRings = [];
    gameState.current.particles = [];
    gameState.current.floatingTexts = [];
    gameState.current.stackedBlocks = [
      {
        x: W / 2,
        y: H * 0.74,
        width: 140,
        height: 115,
        isFoundation: true,
        module: {
          name: 'FOUNDATION',
          color: '#b45309'
        }
      }
    ];

    setHudState({
      floorsCount: 0,
      score: 0,
      timeRemaining: gameDurationSeconds,
      combo: 0,
      missesCount: 0
    });

    setShowBanner(true);
  }, [gameDurationSeconds]);

  // Fast lightweight particles
  const spawnParticles = (x, y, color, count = 12, isPerfect = false) => {
    const list = gameState.current.particles;
    if (list.length > 40) list.splice(0, list.length - 40);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (isPerfect ? 6 : 3) + Math.random() * 4;
      list.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        color: isPerfect ? '#fbbf24' : color,
        alpha: 1,
        symbol: isPerfect ? '⭐' : Math.random() > 0.5 ? '✨' : '💥'
      });
    }
  };

  // Spawn floating text
  const spawnFloatingText = (x, y, text, color) => {
    const list = gameState.current.floatingTexts;
    if (list.length > 5) list.splice(0, list.length - 5);

    list.push({
      x,
      y,
      text,
      color,
      alpha: 1,
      vy: -2.5
    });
  };

  // Handle Drop Action with DEBOUNCE
  const handleDropBlock = useCallback((e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }

    if (showBanner) return;

    const now = performance.now();
    if (now - lastDropTimeRef.current < 250) return;

    const state = gameState.current;
    if (!state.isRunning || state.fallingBlock || state.isGameOver) return;

    if (!state.hasStartedBuilding) {
      state.hasStartedBuilding = true;
    }

    lastDropTimeRef.current = now;

    state.fallingBlock = {
      x: state.craneX,
      y: 110,
      width: FIXED_BLOCK_WIDTH,
      height: FIXED_BLOCK_HEIGHT,
      vy: 0,
      module: state.hangingBlock.module
    };

    soundManager.playGatePassSound(true);
  }, [showBanner]);

  // Dismiss Banner via OK Button
  const handleDismissBanner = (e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    setShowBanner(false);
  };

  // Draw Clean Square Module Block Box (1:1 Ratio)
  const drawCleanModuleBlock = (ctx, x, y, width, height, module, isFoundation = false) => {
    ctx.save();

    if (isFoundation) {
      ctx.fillStyle = '#b45309';
      ctx.fillRect(x - width / 2, y, width, height);

      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.5;
      for (let i = y + 10; i < y + height; i += 16) {
        ctx.beginPath();
        ctx.moveTo(x - width / 2, i);
        ctx.lineTo(x + width / 2, i);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(x, y + height / 2, 24, 0, Math.PI * 2);
      ctx.fillStyle = '#0284c7';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x - 24, y + height / 2);
      ctx.lineTo(x + 24, y + height / 2);
      ctx.moveTo(x, y + height / 2 - 24);
      ctx.lineTo(x, y + height / 2 + 24);
      ctx.stroke();
      ctx.restore();
      return;
    }

    // Clean Square Wall Fill
    ctx.fillStyle = module.wallColor;
    ctx.fillRect(x - width / 2, y, width, height);

    // Beveled Frame Border
    ctx.strokeStyle = module.color;
    ctx.lineWidth = 4;
    ctx.strokeRect(x - width / 2, y, width, height);

    // Roof Trim
    ctx.fillStyle = module.roofColor;
    ctx.fillRect(x - width / 2 - 4, y - 6, width + 8, 8);

    // Centered Logo Asset Image
    const logoImg = moduleLogosRef.current[module.id];

    if (logoImg && logoImg.complete && logoImg.naturalWidth > 0 && logoImg.naturalHeight > 0) {
      const maxW = width - 18;
      const maxH = height - 18;
      const imgW = logoImg.naturalWidth;
      const imgH = logoImg.naturalHeight;

      const scale = Math.min(maxW / imgW, maxH / imgH);
      const renderW = imgW * scale;
      const renderH = imgH * scale;

      ctx.drawImage(logoImg, x - renderW / 2, y + (height - renderH) / 2, renderW, renderH);
    } else {
      const plaqueW = width * 0.86;
      const plaqueH = 34;
      const plaqueX = x - plaqueW / 2;
      const plaqueY = y + (height - plaqueH) / 2;

      ctx.fillStyle = module.plaqueColor;
      ctx.beginPath();
      ctx.roundRect(plaqueX, plaqueY, plaqueW, plaqueH, 6);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = "800 13px 'Space Grotesk', sans-serif";
      ctx.textAlign = 'center';
      ctx.fillText(`${module.icon} ${module.name}`, x, plaqueY + 22);
    }

    ctx.restore();
  };

  // Main 60 FPS Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const W_init = canvas.width || 400;
    
    gameState.current.score = 0;
    gameState.current.floorsCount = 0;
    gameState.current.combo = 0;
    gameState.current.missesCount = 0;
    gameState.current.isGameOver = false;
    gameState.current.gameOverTimer = 0;
    gameState.current.timeRemaining = gameDurationSeconds;
    gameState.current.isRunning = true;
    gameState.current.hasStartedBuilding = false;
    gameState.current.cameraY = 0;
    gameState.current.targetCameraY = 0;
    gameState.current.tumblingBlocks = [];
    gameState.current.impactRings = [];
    gameState.current.craneTrail = [];
    gameState.current.stackedBlocks = [
      {
        x: W_init / 2,
        y: 600,
        width: 140,
        height: 115,
        isFoundation: true,
        module: {
          name: 'FOUNDATION',
          color: '#b45309'
        }
      }
    ];

    setHudState({
      floorsCount: 0,
      score: 0,
      timeRemaining: gameDurationSeconds,
      combo: 0,
      missesCount: 0
    });

    let animationFrameId;
    let lastTime = performance.now();
    let lastSecondCheck = gameDurationSeconds;

    const render = (now) => {
      const deltaTime = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        if (gameState.current.stackedBlocks.length === 1) {
          gameState.current.stackedBlocks[0].x = canvas.width / 2;
          gameState.current.stackedBlocks[0].y = canvas.height * 0.74;
        }
      }

      const W = canvas.width;
      const H = canvas.height;
      const state = gameState.current;

      if (state.isRunning) {
        // Countdown Timer
        if (state.hasStartedBuilding && !state.isGameOver) {
          state.timeRemaining = Math.max(0, state.timeRemaining - deltaTime);

          const currentCeilSec = Math.ceil(state.timeRemaining);
          if (currentCeilSec !== lastSecondCheck) {
            lastSecondCheck = currentCeilSec;
            setHudState({
              floorsCount: state.floorsCount,
              score: state.score,
              timeRemaining: currentCeilSec,
              combo: state.combo,
              missesCount: state.missesCount
            });
          }

          if (state.timeRemaining <= 0) {
            state.isRunning = false;
            soundManager.playVictoryFanfare();
            if (onGameComplete) {
              onGameComplete({
                score: state.score,
                floorsCount: state.floorsCount,
                heightMeters: Math.round(state.floorsCount * 3.5)
              });
            }
          }
        }

        // Game Over countdown timer (when 2 blocks missed)
        if (state.isGameOver) {
          state.gameOverTimer -= deltaTime;
          if (state.gameOverTimer <= 0) {
            state.isRunning = false;
            if (onGameComplete) {
              onGameComplete({
                score: state.score,
                floorsCount: state.floorsCount,
                heightMeters: Math.round(state.floorsCount * 3.5),
                gameOverReason: 'MISSED_2_BLOCKS'
              });
            }
          }
        }

        if (state.screenShakeTimer > 0) state.screenShakeTimer -= deltaTime;
        if (state.unstableTimer > 0) state.unstableTimer -= deltaTime;

        state.cameraY += (state.targetCameraY - state.cameraY) * 0.1;

        // CALCULATE PHYSICS VALUES
        const physics = getHardModePhysics(state.floorsCount + 1);

        state.craneAngle += physics.craneSpeed;
        const swingAmplitude = W * 0.38;
        state.craneX = W / 2 + Math.sin(state.craneAngle) * swingAmplitude;

        // Lightweight crane speed motion trail
        if (physics.craneSpeed > 0.08) {
          if (state.craneTrail.length > 4) state.craneTrail.pop();
          state.craneTrail.unshift({
            x: state.craneX,
            y: 105,
            alpha: 0.7
          });
        }

        // Falling block gravity drop
        if (state.fallingBlock) {
          const fb = state.fallingBlock;
          fb.vy += physics.gravitySpeed * 0.75;
          fb.y += fb.vy;

          const topFloor = state.stackedBlocks[state.stackedBlocks.length - 1];
          const targetY = topFloor.y - fb.height;

          if (fb.y >= targetY) {
            fb.y = targetY;

            const offset = fb.x - topFloor.x;
            const absOffset = Math.abs(offset);
            const missThreshold = topFloor.width * physics.missMarginPct;

            if (absOffset > missThreshold) {
              state.missesCount += 1;
              state.screenShakeTimer = 0.35;
              state.unstableTimer = 1.2;
              state.combo = 0;
              soundManager.playRedGateSound(true);

              state.tumblingBlocks.push({
                x: fb.x,
                y: fb.y,
                width: FIXED_BLOCK_WIDTH,
                height: FIXED_BLOCK_HEIGHT,
                vx: offset > 0 ? 5 : -5,
                vy: -4,
                angle: 0,
                vAngle: offset > 0 ? 0.14 : -0.14,
                module: fb.module
              });

              spawnParticles(fb.x, fb.y, '#dc2626', 15, false);

              if (state.missesCount >= 2) {
                state.isGameOver = true;
                state.gameOverTimer = 1.2; // Grace period so user sees block fall and game over text
                spawnFloatingText(fb.x, fb.y - 30, '❌ GAME OVER! (2 MISSED)', '#dc2626');
              } else {
                spawnFloatingText(fb.x, fb.y - 30, `⚠️ MISSED! (${state.missesCount}/2)`, '#dc2626');
              }

              state.fallingBlock = null;

              setHudState({
                floorsCount: state.floorsCount,
                score: state.score,
                timeRemaining: Math.ceil(state.timeRemaining),
                combo: state.combo,
                missesCount: state.missesCount
              });
            } else {
              let isPerfect = false;

              state.screenShakeTimer = 0.15;

              if (state.impactRings.length < 3) {
                state.impactRings.push({
                  x: fb.x,
                  y: fb.y + fb.height,
                  radius: 12,
                  maxRadius: 65,
                  alpha: 1,
                  color: absOffset < 8 ? '#34d399' : fb.module.color
                });
              }

              if (absOffset < 8) {
                isPerfect = true;
                state.combo++;
                state.score += 250 + state.combo * 50;
                soundManager.playGatePassSound(true);
                spawnParticles(fb.x, fb.y + fb.height / 2, '#10b981', 20, true);
                spawnFloatingText(fb.x, fb.y - 30, `🌟 PERFECT! +${250 + state.combo * 50}`, '#10b981');
              } else {
                state.combo = 0;
                state.score += 100;
                soundManager.playGatePassSound(false);
                spawnParticles(fb.x, fb.y + fb.height / 2, fb.module.color, 12, false);
                spawnFloatingText(fb.x, fb.y - 20, '+100 Floor', fb.module.color);
              }

              state.floorsCount++;
              state.stackedBlocks.push({
                x: fb.x,
                y: fb.y,
                width: FIXED_BLOCK_WIDTH,
                height: FIXED_BLOCK_HEIGHT,
                module: fb.module,
                isPerfect
              });

              state.targetCameraY = (state.floorsCount - 1) * FIXED_BLOCK_HEIGHT;

              setHudState({
                floorsCount: state.floorsCount,
                score: state.score,
                timeRemaining: Math.ceil(state.timeRemaining),
                combo: state.combo,
                missesCount: state.missesCount
              });

              const nextMod = TECH_MODULES[state.floorsCount % TECH_MODULES.length];
              state.hangingBlock = {
                width: FIXED_BLOCK_WIDTH,
                height: FIXED_BLOCK_HEIGHT,
                module: nextMod
              };

              state.fallingBlock = null;
            }
          }
        }

        // Fade crane speed trails
        for (let i = state.craneTrail.length - 1; i >= 0; i--) {
          state.craneTrail[i].alpha -= 0.15;
          if (state.craneTrail[i].alpha <= 0) {
            state.craneTrail.splice(i, 1);
          }
        }

        // Expand impact shockwave rings
        for (let i = state.impactRings.length - 1; i >= 0; i--) {
          const ring = state.impactRings[i];
          ring.radius += 5;
          ring.alpha -= 0.08;
          if (ring.alpha <= 0 || ring.radius >= ring.maxRadius) {
            state.impactRings.splice(i, 1);
          }
        }

        for (let i = state.tumblingBlocks.length - 1; i >= 0; i--) {
          const tb = state.tumblingBlocks[i];
          tb.vy += 2.0;
          tb.x += tb.vx;
          tb.y += tb.vy;
          tb.angle += tb.vAngle;

          if (tb.y > H + 200) {
            state.tumblingBlocks.splice(i, 1);
          }
        }
      }

      // --- ULTRA-FAST 60 FPS CANVAS RENDERING ---
      ctx.clearRect(0, 0, W, H);

      ctx.save();

      if (state.screenShakeTimer > 0) {
        const shakeIntensity = 4;
        const shakeX = (Math.random() - 0.5) * shakeIntensity;
        const shakeY = (Math.random() - 0.5) * shakeIntensity;
        ctx.translate(shakeX, shakeY);
      }

      // Translate Camera Y for Tower Elevation
      ctx.save();
      ctx.translate(0, state.cameraY);

      // --- DRAW STACKED TOWER FLOORS ---
      state.stackedBlocks.forEach((b) => {
        drawCleanModuleBlock(ctx, b.x, b.y, b.width, b.height, b.module, b.isFoundation);
      });

      // --- DRAW FALLING BLOCK IF RELEASED ---
      if (state.fallingBlock) {
        const fb = state.fallingBlock;
        drawCleanModuleBlock(ctx, fb.x, fb.y, fb.width, fb.height, fb.module, false);
      }

      // --- DRAW IMPACT SHOCKWAVE RINGS ---
      state.impactRings.forEach((ring) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = ring.color || '#38bdf8';
        ctx.lineWidth = 3;
        ctx.globalAlpha = ring.alpha;
        ctx.stroke();
        ctx.restore();
      });

      // --- DRAW TUMBLING MISSED BLOCKS ---
      state.tumblingBlocks.forEach((tb) => {
        ctx.save();
        ctx.translate(tb.x, tb.y);
        ctx.rotate(tb.angle);
        drawCleanModuleBlock(ctx, 0, -tb.height / 2, tb.width, tb.height, tb.module, false);
        ctx.restore();
      });

      ctx.restore(); // Restore Camera Y transform

      // --- DETAILED CRANE CABLE & METAL HOOK ---
      const craneY = 65;

      // SPEED TRAILS
      if (state.craneTrail.length > 0) {
        ctx.save();
        state.craneTrail.forEach((trail, idx) => {
          ctx.beginPath();
          ctx.arc(trail.x, craneY + 40, 10 - idx, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${trail.alpha * 0.4})`;
          ctx.fill();
        });
        ctx.restore();
      }
      
      // Steel Cable Rope
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(state.craneX, craneY - 30);
      ctx.lineTo(state.craneX, craneY + 35);
      ctx.stroke();

      // Metal Hook
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(state.craneX, craneY + 40, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Hook Loop
      ctx.beginPath();
      ctx.arc(state.craneX + 6, craneY + 46, 7, 0, Math.PI);
      ctx.stroke();

      // --- DRAW DANGLING SQUARE BOX IF NOT RELEASED ---
      if (!state.fallingBlock) {
        const hb = state.hangingBlock;
        const hbX = state.craneX;
        const hbY = craneY + 52;
        drawCleanModuleBlock(ctx, hbX, hbY, hb.width, hb.height, hb.module, false);
      }

      // --- UNSTABLE OPERATIONS BANNER IF MISSED ---
      if (state.unstableTimer > 0 && !state.isGameOver) {
        ctx.save();
        ctx.fillStyle = 'rgba(220, 38, 38, 0.95)';
        ctx.fillRect(0, H * 0.38, W, 52);
        ctx.fillStyle = '#ffffff';
        ctx.font = "800 20px 'Space Grotesk', sans-serif";
        ctx.textAlign = 'center';
        ctx.fillText("⚠️ UNSTABLE OPERATIONS!", W / 2, H * 0.38 + 32);
        ctx.restore();
      }

      // --- GAME OVER BANNER IF 2 BLOCKS MISSED ---
      if (state.isGameOver) {
        ctx.save();
        ctx.fillStyle = 'rgba(225, 29, 72, 0.95)';
        ctx.fillRect(0, H * 0.36, W, 68);
        ctx.fillStyle = '#ffffff';
        ctx.font = "900 22px 'Space Grotesk', sans-serif";
        ctx.textAlign = 'center';
        ctx.fillText("❌ GAME OVER", W / 2, H * 0.36 + 30);
        ctx.font = "700 13px 'Space Grotesk', sans-serif";
        ctx.fillStyle = '#ffe4e6';
        ctx.fillText("2 Blocks Missed!", W / 2, H * 0.36 + 52);
        ctx.restore();
      }

      // --- PARTICLES & SPARK EFFECTS ---
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.04;
        if (p.alpha <= 0) {
          state.particles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.font = "14px serif";
        ctx.fillText(p.symbol || '✨', p.x, p.y);
      }
      ctx.globalAlpha = 1;

      for (let i = state.floatingTexts.length - 1; i >= 0; i--) {
        const ft = state.floatingTexts[i];
        ft.y += ft.vy;
        ft.alpha -= 0.03;
        if (ft.alpha <= 0) {
          state.floatingTexts.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = ft.alpha;
        ctx.fillStyle = ft.color;
        ctx.font = "800 20px 'Space Grotesk', sans-serif";
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameDurationSeconds, onGameComplete]);

  return (
    <div 
      className="relative w-full h-full min-h-[600px] overflow-hidden select-none touch-none bg-cover bg-center flex flex-col items-center justify-between"
      style={{ backgroundImage: 'url("/towerbloxx bg.png")' }}
      onPointerDown={handleDropBlock}
    >
      {/* Embedded Live Ticking HUD with Back Icon Button and Retry Icon Button */}
      <StackerHUD 
        floorsCount={hudState.floorsCount}
        score={hudState.score}
        timeRemaining={hudState.timeRemaining}
        missesCount={hudState.missesCount}
        maxMisses={2}
        onBack={onBack}
        onReplay={handleRestartGame}
        onOpenSettings={onOpenSettings}
      />

      <canvas ref={canvasRef} className="w-full h-full absolute inset-0 z-0 cursor-pointer" />

      {/* CHALLENGE BANNER OVERLAY */}
      {showBanner && (
        <div className="absolute inset-0 z-40 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs p-6 rounded-3xl bg-gradient-to-b from-sky-400 via-sky-500 to-sky-700 border-4 border-sky-200 shadow-2xl text-center text-white flex flex-col items-center gap-3.5 animate-in fade-in zoom-in duration-200">
            <div className="p-3 rounded-2xl bg-amber-400 text-slate-950 shadow-lg animate-bounce">
              🏆
            </div>
            
            <h3 className="text-xl font-black font-heading tracking-wide uppercase leading-tight">
              BOOTH CHALLENGE!
            </h3>

            <p className="text-sm font-black text-amber-200 leading-snug bg-slate-900/40 p-3.5 rounded-2xl border border-sky-300/40">
              "Stack 15 boxes in 25 seconds to win exciting prizes!"
            </p>

            <span className="text-[11px] font-bold text-rose-200 bg-rose-950/40 px-2.5 py-1 rounded-full border border-rose-400/40">
              ⚠️ 2 Missed Blocks = Game Over!
            </span>

            <span className="text-[11px] font-bold text-sky-100 opacity-90">
              ⏱️ Timer starts when you drop your first box!
            </span>

            <button
              onClick={handleDismissBanner}
              className="w-full py-3.5 px-4 mt-1 rounded-2xl bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 text-slate-950 font-black text-base font-heading tracking-wider uppercase border-2 border-amber-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_6px_14px_rgba(0,0,0,0.3)] hover:brightness-110 active:scale-95 transition-all"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="relative z-20 w-full p-4 pointer-events-none mt-auto flex justify-center">
        <button
          onClick={handleDropBlock}
          className="pointer-events-auto w-full max-w-xs py-4 px-6 rounded-2xl bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 text-slate-950 font-black text-lg font-heading tracking-wider uppercase border-2 border-amber-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_8px_16px_rgba(0,0,0,0.35)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          BUILD 🔨
        </button>
      </div>
    </div>
  );
}
