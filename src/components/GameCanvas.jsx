import React, { useEffect, useRef, useState, useCallback } from 'react';
import { soundManager } from '../utils/audioEngine';

// Gate Types matching exact user prompt specifications
const GATE_TYPES = {
  AUTOMATION: {
    type: 'AUTOMATION',
    color: '#06b6d4', // Electric Cyan
    glowColor: 'rgba(6, 182, 212, 0.4)',
    bgGradient: ['rgba(15, 23, 42, 0.95)', 'rgba(8, 51, 68, 0.9)'],
    brand: 'GoWhats AI Chatbot',
    name: 'AUTOMATION',
    op: '*',
    value: 3,
    displayText: '3x AUTOMATION'
  },
  FAST_BILLING: {
    type: 'FAST_BILLING',
    color: '#22d3ee', // Cyan Highlight
    glowColor: 'rgba(34, 211, 238, 0.4)',
    bgGradient: ['rgba(15, 23, 42, 0.95)', 'rgba(8, 51, 68, 0.9)'],
    brand: 'Billzzy Instant POS',
    name: 'INSTANT POS',
    op: '*',
    value: 2,
    displayText: '2x INSTANT POS'
  },
  MANUAL_ENTRY: {
    type: 'MANUAL_ENTRY',
    color: '#f59e0b', // Muted Amber
    glowColor: 'rgba(245, 158, 11, 0.4)',
    bgGradient: ['rgba(15, 23, 42, 0.95)', 'rgba(69, 26, 3, 0.85)'],
    brand: 'Paper Receipts',
    name: 'MANUAL TASKS',
    op: '-',
    value: 5,
    displayText: '-5 MANUAL TASKS'
  },
  SYSTEM_OUTAGE: {
    type: 'SYSTEM_OUTAGE',
    color: '#f43f5e', // Rose Red
    glowColor: 'rgba(244, 63, 94, 0.4)',
    bgGradient: ['rgba(15, 23, 42, 0.95)', 'rgba(76, 5, 25, 0.85)'],
    brand: 'Legacy Infrastructure',
    name: 'SYSTEM OUTAGE',
    op: '/',
    value: 2,
    displayText: '÷2 SYSTEM OUTAGE'
  }
};

export default function GameCanvas({ onGameComplete, gameDurationSeconds = 25, isMuted = false }) {
  const canvasRef = useRef(null);

  // Preload & Process Transparent PNG Character Tier Sprites
  const tierImages = useRef({
    tier1: null,
    tier2: null,
    tier3: null,
    tier4: null
  });

  // Automatically remove background pixels to produce 100% transparent PNGs
  const processTransparentPNG = (img) => {
    try {
      const offCanvas = document.createElement('canvas');
      const w = img.naturalWidth || img.width || 256;
      const h = img.naturalHeight || img.height || 256;
      offCanvas.width = w;
      offCanvas.height = h;
      const offCtx = offCanvas.getContext('2d');
      offCtx.drawImage(img, 0, 0, w, h);

      const imgData = offCtx.getImageData(0, 0, w, h);
      const data = imgData.data;

      // Key out background pixels (near light grey / white)
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (r > 190 && g > 190 && b > 190) {
          data[i + 3] = 0; // Set Alpha to 0 (Transparent PNG)
        }
      }

      offCtx.putImageData(imgData, 0, 0);
      const transparentImg = new Image();
      transparentImg.src = offCanvas.toDataURL('image/png');
      return transparentImg;
    } catch (e) {
      return img;
    }
  };

  useEffect(() => {
    const loadAndProcess = (src, key) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => {
        tierImages.current[key] = processTransparentPNG(img);
      };
    };

    loadAndProcess('/tier1.png', 'tier1');
    loadAndProcess('/tier2.png', 'tier2');
    loadAndProcess('/tier3.png', 'tier3');
    loadAndProcess('/tier4.png', 'tier4');
  }, []);
  
  // Game State Refs
  const gameState = useRef({
    isRunning: true,
    score: 0,
    squadCount: 5,
    distanceTravelled: 0,
    maxDistance: 2000,
    speed: 2.0,
    speedBurstTimer: 0,
    screenShakeTimer: 0,
    lane: 0, // 0 = Left Road (x=0.3), 1 = Right Road (x=0.7)
    playerX: 0.3,
    targetPlayerX: 0.3,
    timeRemaining: gameDurationSeconds,
    isFinishPhase: false,
    bossMeterHeight: 0,
    bossMeterTarget: 0,
    bossPhaseTimer: 0,
    swarmLasers: [],
    confetti: [],
    particles: [],
    floatingTexts: [],
    gates: [],
    trackGridOffset: 0
  });

  const [, setHudState] = useState({
    squadCount: 5,
    score: 0,
    timeRemaining: gameDurationSeconds,
    progressPercent: 0
  });

  // Switch Lane Logic
  const setLane = useCallback((laneIndex) => {
    const targetX = laneIndex === 0 ? 0.3 : 0.7;
    gameState.current.lane = laneIndex;
    gameState.current.targetPlayerX = targetX;
  }, []);

  // Pointer / Tap / Click handling
  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const relativeX = (clientX - rect.left) / rect.width;

    if (relativeX < 0.5) {
      setLane(0);
    } else {
      setLane(1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setLane(0);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setLane(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setLane]);

  // Generate sequence of track gates
  const generateGatePairs = useCallback(() => {
    const gates = [];
    const gateDistances = [250, 550, 850, 1150, 1450, 1750];
    
    gateDistances.forEach((dist, idx) => {
      let leftType, rightType;
      
      if (idx % 2 === 0) {
        leftType = GATE_TYPES.AUTOMATION;
        rightType = Math.random() > 0.4 ? GATE_TYPES.MANUAL_ENTRY : GATE_TYPES.SYSTEM_OUTAGE;
      } else {
        leftType = Math.random() > 0.5 ? GATE_TYPES.SYSTEM_OUTAGE : GATE_TYPES.MANUAL_ENTRY;
        rightType = GATE_TYPES.FAST_BILLING;
      }

      if (idx === 3) {
        leftType = { ...GATE_TYPES.AUTOMATION, value: 5, displayText: '×5 AI AUTOMATION' };
        rightType = GATE_TYPES.FAST_BILLING;
      }

      gates.push({
        id: `gate_${idx}_L`,
        distance: dist,
        lane: 0,
        type: leftType,
        passed: false
      });

      gates.push({
        id: `gate_${idx}_R`,
        distance: dist,
        lane: 1,
        type: rightType,
        passed: false
      });
    });

    return gates;
  }, []);

  // Spawn visual particles
  const spawnParticles = (x, y, color, count = 20, isCrash = false) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (isCrash ? 4 : 2) + Math.random() * 6;
      gameState.current.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        color,
        size: 4 + Math.random() * 5,
        alpha: 1,
        symbol: isCrash ? '💥' : Math.random() > 0.5 ? '⚡' : '💵'
      });
    }
  };

  // Spawn floating text
  const spawnFloatingText = (x, y, text, color) => {
    gameState.current.floatingTexts.push({
      x,
      y,
      text,
      color,
      alpha: 1,
      vy: -2
    });
  };

  // Spawn Confetti Burst
  const spawnConfetti = (W, H) => {
    const colors = ['#10b981', '#0284c7', '#eab308', '#ec4899', '#8b5cf6'];
    for (let i = 0; i < 80; i++) {
      gameState.current.confetti.push({
        x: W / 2 + (Math.random() - 0.5) * 200,
        y: H * 0.35,
        vx: (Math.random() - 0.5) * 12,
        vy: -4 - Math.random() * 10,
        size: 6 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        alpha: 1
      });
    }
  };

  // --- DRAW TRANSPARENT PNG CHARACTER SPRITE ---
  const drawEvolutionCharacter = (ctx, x, y, squadCount, tick) => {
    ctx.save();

    let tier = 1;
    if (squadCount >= 8) tier = 2;
    if (squadCount >= 21) tier = 3;
    if (squadCount >= 46) tier = 4;

    const imgKey = `tier${tier}`;
    const imgAsset = tierImages.current[imgKey];

    const gaitOffset = Math.sin(tick * (tier === 1 ? 0.08 : tier === 2 ? 0.14 : 0.22)) * (tier === 1 ? 4 : 2);

    // Render Transparent PNG Character
    if (imgAsset && imgAsset.complete && imgAsset.naturalWidth > 0) {
      const spriteW = 85;
      const spriteH = 85;
      
      if (tier >= 3) {
        ctx.beginPath();
        ctx.arc(x, y - 25, 40, 0, Math.PI * 2);
        ctx.fillStyle = tier === 4 ? 'rgba(2, 132, 199, 0.35)' : 'rgba(16, 185, 129, 0.25)';
        ctx.fill();
      }

      ctx.drawImage(imgAsset, x - spriteW / 2, y - spriteH + 15 + gaitOffset, spriteW, spriteH);
    } else {
      // Vector Fallback Renderer
      if (tier === 1) {
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.roundRect(x - 14, y - 14 + gaitOffset, 28, 24, 4);
        ctx.fill();

        ctx.fillStyle = '#fed7aa';
        ctx.beginPath();
        ctx.arc(x, y - 22 + gaitOffset, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#b45309';
        ctx.fillRect(x - 15, y - 10 + gaitOffset, 30, 16);
        ctx.fillStyle = '#ffffff';
        ctx.font = "800 7px 'Space Grotesk', sans-serif";
        ctx.textAlign = 'center';
        ctx.fillText("PAPER INVOICES", x, y + 1 + gaitOffset);
      } else if (tier === 2) {
        ctx.fillStyle = '#1d4ed8';
        ctx.beginPath();
        ctx.roundRect(x - 14, y - 14 + gaitOffset, 28, 24, 5);
        ctx.fill();

        ctx.fillStyle = '#fed7aa';
        ctx.beginPath();
        ctx.arc(x, y - 22 + gaitOffset, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x + 10, y - 12 + gaitOffset, 14, 18);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x + 12, y - 10 + gaitOffset, 10, 14);
        ctx.fillStyle = '#ffffff';
        ctx.font = "800 6px 'Space Grotesk', sans-serif";
        ctx.fillText("BILL", x + 17, y - 2 + gaitOffset);
      } else if (tier === 3) {
        ctx.beginPath();
        ctx.arc(x, y - 15, 32, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.fill();

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(x - 14, y - 14 + gaitOffset, 28, 24, 6);
        ctx.fill();

        ctx.fillStyle = '#0284c7';
        ctx.fillRect(x - 2, y - 12 + gaitOffset, 4, 12);

        ctx.fillStyle = '#fed7aa';
        ctx.beginPath();
        ctx.arc(x, y - 22 + gaitOffset, 10, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(x, y - 18, 42, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(2, 132, 199, 0.4)';
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(x - 16, y - 16 + gaitOffset, 32, 26, 8);
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.moveTo(x - 12, y - 32 + gaitOffset);
        ctx.lineTo(x - 12, y - 44 + gaitOffset);
        ctx.lineTo(x - 6, y - 38 + gaitOffset);
        ctx.lineTo(x, y - 48 + gaitOffset);
        ctx.lineTo(x + 6, y - 38 + gaitOffset);
        ctx.lineTo(x + 12, y - 44 + gaitOffset);
        ctx.lineTo(x + 12, y - 32 + gaitOffset);
        ctx.closePath();
        ctx.fill();
      }
    }

    ctx.restore();
  };

  // Main 60 FPS Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    gameState.current.gates = generateGatePairs();

    let animationFrameId;
    let lastTime = performance.now();
    let animTick = 0;

    const render = (now) => {
      const deltaTime = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      animTick++;

      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }

      const W = canvas.width;
      const H = canvas.height;

      // --- GAME STATE UPDATE ---
      const state = gameState.current;

      if (state.isRunning) {
        let effectiveSpeed = state.speed;
        if (state.speedBurstTimer > 0) {
          state.speedBurstTimer -= deltaTime;
          effectiveSpeed = state.speed * 1.8;
        }

        if (state.screenShakeTimer > 0) {
          state.screenShakeTimer -= deltaTime;
        }

        state.playerX += (state.targetPlayerX - state.playerX) * 0.18;

        if (!state.isFinishPhase) {
          state.distanceTravelled += effectiveSpeed;
          state.trackGridOffset = (state.trackGridOffset + effectiveSpeed * 2) % 60;
          
          const totalDist = state.maxDistance;
          const progress = Math.min(1, state.distanceTravelled / totalDist);
          state.timeRemaining = Math.max(0, gameDurationSeconds * (1 - progress));

          if (state.distanceTravelled >= state.maxDistance) {
            state.isFinishPhase = true;
            state.bossMeterTarget = state.squadCount * 100;
          }

          // Gate Collisions
          const trackBottomY = H * 0.82;
          
          state.gates.forEach((gate) => {
            if (gate.passed) return;

            const relDist = gate.distance - state.distanceTravelled;
            
            if (relDist <= 15 && relDist >= -30) {
              const currentLane = state.playerX < 0.5 ? 0 : 1;

              if (currentLane === gate.lane) {
                gate.passed = true;
                
                let oldVal = state.squadCount;
                if (gate.type.op === '*') {
                  state.squadCount = Math.round(state.squadCount * gate.type.value);
                  soundManager.playGatePassSound(true);
                  if (gate.type.type === 'AUTOMATION') {
                    state.speedBurstTimer = 1.2;
                  }
                } else if (gate.type.op === '+') {
                  state.squadCount += gate.type.value;
                  soundManager.playGatePassSound(true);
                } else if (gate.type.op === '-') {
                  state.squadCount = Math.max(1, state.squadCount - gate.type.value);
                  soundManager.playRedGateSound(false);
                  state.screenShakeTimer = 0.4;
                } else if (gate.type.op === '/') {
                  state.squadCount = Math.max(1, Math.floor(state.squadCount / gate.type.value));
                  soundManager.playRedGateSound(true);
                  state.screenShakeTimer = 0.5;
                }

                const deltaSquad = state.squadCount - oldVal;
                state.score += Math.max(50, deltaSquad * 100);

                const gateX = gate.lane === 0 ? W * 0.3 : W * 0.7;
                spawnParticles(gateX, trackBottomY - 40, gate.type.color, 25, gate.type.op === '-' || gate.type.op === '/');
                spawnFloatingText(
                  gateX,
                  trackBottomY - 80,
                  `${gate.type.op}${gate.type.value} (${state.squadCount} Swarm)`,
                  gate.type.color
                );
              }
            }
          });
        } else {
          // FINISH BOSS PHASE
          state.bossPhaseTimer += deltaTime;

          if (state.bossMeterHeight < state.bossMeterTarget) {
            state.bossMeterHeight += (state.bossMeterTarget - state.bossMeterHeight) * 0.08 + 15;
            soundManager.playBossBlastSound();
          }

          if (state.bossPhaseTimer < 2.0 && Math.random() > 0.2) {
            const startX = W * 0.3 + Math.random() * (W * 0.4);
            state.swarmLasers.push({
              x: startX,
              y: H * 0.8,
              targetX: W / 2 + (Math.random() - 0.5) * 120,
              targetY: H * 0.25 + Math.random() * 150,
              progress: 0,
              color: '#0284c7'
            });
          }

          if (state.bossPhaseTimer >= 2.2 && state.confetti.length === 0) {
            spawnConfetti(W, H);
            soundManager.playVictoryFanfare();
          }

          if (state.bossPhaseTimer > 4.0) {
            state.isRunning = false;
            if (onGameComplete) {
              onGameComplete({
                score: Math.round(state.score + state.squadCount * 250),
                squadCount: state.squadCount,
                bossMeterHeight: Math.round(state.bossMeterHeight)
              });
            }
          }
        }

        setHudState({
          squadCount: state.squadCount,
          score: Math.round(state.score),
          timeRemaining: Math.ceil(state.timeRemaining),
          progressPercent: Math.min(100, Math.round((state.distanceTravelled / state.maxDistance) * 100))
        });
      }

      // --- RENDERING CANVAS ---
      ctx.save();
      if (state.screenShakeTimer > 0) {
        const shakeX = (Math.random() - 0.5) * 14;
        const shakeY = (Math.random() - 0.5) * 14;
        ctx.translate(shakeX, shakeY);
      }

      // Dark Futuristic OS Sky Background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, H);
      bgGradient.addColorStop(0, '#0a0e17');
      bgGradient.addColorStop(0.5, '#0f172a');
      bgGradient.addColorStop(1, '#0a0e17');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, W, H);

      // Track Perspective geometry
      const perspectiveY = H * 0.22;
      const trackTopWidth = W * 0.4;
      const trackBottomWidth = W * 0.9;
      const trackTopLeft = (W - trackTopWidth) / 2;
      const trackTopRight = trackTopLeft + trackTopWidth;
      const trackBottomLeft = (W - trackBottomWidth) / 2;
      const trackBottomRight = trackBottomLeft + trackBottomWidth;

      // Draw Main Dual-Road Surface
      ctx.beginPath();
      ctx.moveTo(trackTopLeft, perspectiveY);
      ctx.lineTo(trackTopRight, perspectiveY);
      ctx.lineTo(trackBottomRight, H);
      ctx.lineTo(trackBottomLeft, H);
      ctx.closePath();
      
      const trackFill = ctx.createLinearGradient(0, perspectiveY, 0, H);
      trackFill.addColorStop(0, '#0f172a');
      trackFill.addColorStop(1, '#1e293b');
      ctx.fillStyle = trackFill;
      ctx.fill();

      // Outer Road Rails
      ctx.lineWidth = 4;
      ctx.strokeStyle = state.speedBurstTimer > 0 ? '#22d3ee' : 'rgba(6, 182, 212, 0.4)';
      ctx.beginPath();
      ctx.moveTo(trackTopLeft, perspectiveY);
      ctx.lineTo(trackBottomLeft, H);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(trackTopRight, perspectiveY);
      ctx.lineTo(trackBottomRight, H);
      ctx.stroke();

      // TWO-ROADS MIDDLE DIVIDER MEDIAN LINE
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 3;
      ctx.setLineDash([16, 12]);
      ctx.beginPath();
      ctx.moveTo(W / 2, perspectiveY);
      ctx.lineTo(W / 2, H);
      ctx.stroke();
      ctx.setLineDash([]);

      // Road Lane Labels
      ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
      ctx.font = "600 11px 'Space Grotesk', sans-serif";
      ctx.textAlign = 'center';
      ctx.fillText("LEFT LANE", W * 0.3, H - 15);
      ctx.fillText("RIGHT LANE", W * 0.7, H - 15);

      // Moving Road Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1.5;
      const lineSpacing = 45;
      for (let y = perspectiveY + state.trackGridOffset; y < H; y += lineSpacing) {
        const progressY = (y - perspectiveY) / (H - perspectiveY);
        const currentW = trackTopWidth + (trackBottomWidth - trackTopWidth) * progressY;
        const leftX = (W - currentW) / 2;
        ctx.beginPath();
        ctx.moveTo(leftX, y);
        ctx.lineTo(leftX + currentW, y);
        ctx.stroke();
      }

      // --- DRAW MULTIPLIER PORTAL GATES ---
      state.gates.forEach((gate) => {
        const relDist = gate.distance - state.distanceTravelled;
        if (relDist < -50 || relDist > 800) return;

        const gateProgress = 1 - Math.max(0, Math.min(1, relDist / 800));
        const gateY = perspectiveY + (H - perspectiveY) * Math.pow(gateProgress, 1.8);
        const currentTrackW = trackTopWidth + (trackBottomWidth - trackTopWidth) * Math.pow(gateProgress, 1.8);
        const gateScale = 0.45 + gateProgress * 0.55;

        const isLeft = gate.lane === 0;
        const gateWidth = currentTrackW * 0.46;
        const gateX = isLeft 
          ? (W - currentTrackW) / 2 + currentTrackW * 0.02
          : (W - currentTrackW) / 2 + currentTrackW * 0.52;

        const gateHeight = 95 * gateScale;

        ctx.save();

        const isGood = gate.type.op === '*' || gate.type.op === '+';
        const isAmber = gate.type.op === '-';
        const borderColor = isGood ? '#06b6d4' : isAmber ? '#f59e0b' : '#f43f5e';
        const headerColor = isGood ? '#22d3ee' : isAmber ? '#fbbf24' : '#fb7185';

        const gateBg = ctx.createLinearGradient(gateX, gateY - gateHeight, gateX, gateY);
        gateBg.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
        gateBg.addColorStop(1, isGood ? 'rgba(8, 51, 68, 0.9)' : isAmber ? 'rgba(69, 26, 3, 0.85)' : 'rgba(76, 5, 25, 0.85)');
        ctx.fillStyle = gateBg;
        ctx.beginPath();
        ctx.roundRect(gateX, gateY - gateHeight, gateWidth, gateHeight, 8 * gateScale);
        ctx.fill();

        ctx.strokeStyle = borderColor;
        ctx.lineWidth = Math.max(2, 3 * gateScale);
        ctx.stroke();

        ctx.fillStyle = headerColor;
        ctx.font = `700 ${Math.max(11, Math.round(15 * gateScale))}px 'Space Grotesk', sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(gate.type.displayText, gateX + gateWidth / 2, gateY - gateHeight + 28 * gateScale);

        ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
        ctx.font = `500 ${Math.max(9, Math.round(11 * gateScale))}px 'Inter', sans-serif`;
        ctx.fillText(gate.type.brand, gateX + gateWidth / 2, gateY - gateHeight + 54 * gateScale);

        ctx.restore();
      });

      // --- DRAW FINISH LINE & TOWERING BUSINESS SCALING METER BUILDING ---
      if (state.distanceTravelled >= state.maxDistance - 250) {
        const finishRel = state.maxDistance - state.distanceTravelled;
        const finishProgress = 1 - Math.max(0, Math.min(1, finishRel / 250));
        const finishY = perspectiveY + (H - perspectiveY) * finishProgress;

        ctx.save();
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(trackBottomLeft, finishY - 12, trackBottomWidth, 14);
        ctx.restore();

        if (state.isFinishPhase) {
          const towerW = Math.min(260, W * 0.6);
          const towerX = (W - towerW) / 2;
          const towerH = H * 0.55;
          const towerY = H * 0.15;

          ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(towerX, towerY, towerW, towerH, 14);
          ctx.fill();
          ctx.stroke();

          const fillRatio = Math.min(1, state.bossMeterHeight / (state.bossMeterTarget || 1000));
          const currentFillH = (towerH - 20) * fillRatio;
          
          const fillGrad = ctx.createLinearGradient(0, towerY + towerH - 10, 0, towerY + 10);
          fillGrad.addColorStop(0, '#06b6d4');
          fillGrad.addColorStop(0.5, '#10b981');
          fillGrad.addColorStop(1, '#f59e0b');
          
          ctx.fillStyle = fillGrad;
          ctx.beginPath();
          ctx.roundRect(towerX + 8, towerY + towerH - 10 - currentFillH, towerW - 16, currentFillH, 10);
          ctx.fill();

          ctx.fillStyle = '#f8fafc';
          ctx.font = "700 16px 'Space Grotesk', sans-serif";
          ctx.textAlign = 'center';
          ctx.fillText("Capacity Scale Meter", W / 2, towerY - 20);

          const tierY1 = towerY + towerH - 35;
          const tierY2 = towerY + towerH * 0.5;
          const tierY3 = towerY + 45;

          ctx.fillStyle = fillRatio >= 0.1 ? '#ffffff' : '#64748b';
          ctx.font = "600 13px 'Space Grotesk', sans-serif";
          ctx.fillText("Startup Capacity", W / 2, tierY1);

          ctx.fillStyle = fillRatio >= 0.4 ? '#ffffff' : '#64748b';
          ctx.fillText("Growth Capacity", W / 2, tierY2);

          ctx.fillStyle = fillRatio >= 0.8 ? '#ffffff' : '#64748b';
          ctx.font = "700 14px 'Space Grotesk', sans-serif";
          ctx.fillText("Enterprise Titan Scale", W / 2, tierY3);
        }
      }

      // --- DRAW PLAYER SWARM & TRANSPARENT PNG CHARACTER EVOLUTION ---
      const playerY = H * 0.82;
      const currentTrackW = trackBottomWidth;
      const playerPixelX = (W - currentTrackW) / 2 + currentTrackW * state.playerX;

      if (!state.isFinishPhase) {
        const count = Math.min(120, state.squadCount);
        const rows = Math.ceil(Math.sqrt(count));
        const spacing = Math.max(7, Math.min(14, 160 / Math.sqrt(count)));

        ctx.save();
        for (let i = 1; i < count; i++) {
          const row = Math.floor(i / rows);
          const col = i % rows;
          const offsetX = (col - rows / 2) * spacing;
          const offsetY = (row - rows / 2) * spacing + 14;

          const memberX = playerPixelX + offsetX;
          const memberY = playerY + offsetY;

          ctx.beginPath();
          ctx.arc(memberX, memberY, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#06b6d4';
          ctx.fill();
        }
        ctx.restore();

        // Lead Character Evolution Model (Transparent PNG Sprite)
        drawEvolutionCharacter(ctx, playerPixelX, playerY, state.squadCount, animTick);
      }

      // --- ANIMATE SWARM LASERS ---
      for (let i = state.swarmLasers.length - 1; i >= 0; i--) {
        const l = state.swarmLasers[i];
        l.progress += 0.06;
        if (l.progress >= 1) {
          state.swarmLasers.splice(i, 1);
          continue;
        }
        const lx = l.x + (l.targetX - l.x) * l.progress;
        const ly = l.y + (l.targetY - l.y) * l.progress;

        ctx.beginPath();
        ctx.arc(lx, ly, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#22d3ee';
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // --- ANIMATE CONFETTI BURST ---
      for (let i = state.confetti.length - 1; i >= 0; i--) {
        const c = state.confetti[i];
        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.3;
        c.rotation += c.vRot;
        c.alpha -= 0.01;

        if (c.alpha <= 0 || c.y > H) {
          state.confetti.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = c.alpha;
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
        ctx.restore();
      }

      // --- PARTICLES & FLOATING TEXT ---
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.03;
        if (p.alpha <= 0) {
          state.particles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.font = "16px serif";
        ctx.fillText(p.symbol || '⚡', p.x, p.y);
      }
      ctx.globalAlpha = 1;

      for (let i = state.floatingTexts.length - 1; i >= 0; i--) {
        const ft = state.floatingTexts[i];
        ft.y += ft.vy;
        ft.alpha -= 0.02;
        if (ft.alpha <= 0) {
          state.floatingTexts.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = ft.alpha;
        ctx.fillStyle = ft.color;
        ctx.font = "700 18px 'Space Grotesk', sans-serif";
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
  }, [generateGatePairs, gameDurationSeconds, onGameComplete]);

  return (
    <div 
      className="relative w-full h-full min-h-[600px] overflow-hidden select-none touch-none bg-[#0a0e17] flex flex-col items-center justify-center cursor-pointer"
      onPointerDown={handlePointerDown}
    >
      <canvas ref={canvasRef} className="w-full h-full absolute inset-0 z-0" />

      <div className="absolute bottom-6 z-10 pointer-events-none flex items-center justify-center gap-4 px-4 py-2 rounded-xl glass-panel border border-slate-800 text-xs font-medium text-slate-400 backdrop-blur-md shadow-lg">
        <span className="flex items-center gap-1.5 text-cyan-400">Left Lane</span>
        <span className="text-slate-700">•</span>
        <span className="flex items-center gap-1.5 text-cyan-400">Right Lane</span>
      </div>
    </div>
  );
}
