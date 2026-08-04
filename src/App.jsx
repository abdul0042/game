import React, { useState, useEffect } from 'react';
import GameSelectScreen from './components/GameSelectScreen';
import StartScreen from './components/StartScreen';
import GameCanvas from './components/GameCanvas';
import HUD from './components/HUD';
import ScoreScreen from './components/ScoreScreen';
import StackerCanvas from './components/StackerCanvas';
import StackerScoreScreen from './components/StackerScoreScreen';
import JigsawCanvas from './components/JigsawCanvas';
import JigsawScoreScreen from './components/JigsawScoreScreen';
import PrizeWheelModal from './components/PrizeWheelModal';
import LeaderboardModal from './components/LeaderboardModal';
import SettingsModal from './components/SettingsModal';
import { soundManager } from './utils/audioEngine';

export default function App() {
  const [screen, setScreen] = useState('GAME_SELECT');
  
  const [settings, setSettings] = useState({
    aspectMode: 'kiosk',
    duration: 25,
    isMuted: false,
    jigsawGrid: { label: '4×4', rows: 4, cols: 4, total: 16, name: 'Medium' }
  });

  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [runnerScoreData, setRunnerScoreData] = useState({ score: 0, squadCount: 5 });
  const [stackerScoreData, setStackerScoreData] = useState({ score: 0, floorsCount: 0, heightMeters: 0, wonPrize: null });
  const [jigsawScoreData, setJigsawScoreData] = useState({ timeSeconds: 0, moves: 0, gridSize: '4x4', logoName: 'Random Logo', score: 0, wonPrize: null });

  // Prize Reel Modal State
  const [showPrizeWheel, setShowPrizeWheel] = useState(false);
  const [prizeSourceGame, setPrizeSourceGame] = useState(null); // 'STACKER' or 'JIGSAW'
  const [pendingStackerData, setPendingStackerData] = useState(null);
  const [pendingJigsawData, setPendingJigsawData] = useState(null);

  const [leaderboard, setLeaderboard] = useState(() => {
    const saved = localStorage.getItem('scale_tech_leaderboard');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { name: "Alex (GoWhats)", score: 7850, squadCount: 45, date: "Today" },
      { name: "Billzzy POS Team", score: 6420, squadCount: 36, date: "Today" },
      { name: "Tech Scaler #3", score: 5100, squadCount: 28, date: "Today" },
      { name: "FastChat Bot", score: 4250, squadCount: 22, date: "Today" },
      { name: "AutoFlow AI", score: 3600, squadCount: 18, date: "Today" }
    ];
  });

  useEffect(() => {
    localStorage.setItem('scale_tech_leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  const handleStartRunner = () => {
    soundManager.init();
    setRunnerScoreData({ score: 0, squadCount: 5 });
    setScreen('RUNNER_PLAY');
  };

  const handleStartStacker = () => {
    soundManager.init();
    setStackerScoreData({ score: 0, floorsCount: 0, heightMeters: 0, wonPrize: null });
    setPendingStackerData(null);
    setShowPrizeWheel(false);
    setScreen('STACKER_PLAY');
  };

  const handleStartJigsaw = () => {
    soundManager.init();
    setJigsawScoreData({ timeSeconds: 0, moves: 0, gridSize: settings.jigsawGrid?.label || '4×4', logoName: 'Random Logo', score: 0, wonPrize: null });
    setPendingJigsawData(null);
    setShowPrizeWheel(false);
    setScreen('JIGSAW_PLAY');
  };

  const handleRunnerComplete = (data) => {
    setRunnerScoreData(data);
    setScreen('RUNNER_SCORE');
  };

  const handleStackerComplete = (data) => {
    if (data.floorsCount >= 15) {
      setPendingStackerData(data);
      setPrizeSourceGame('STACKER');
      setShowPrizeWheel(true);
    } else {
      setStackerScoreData(data);
      setScreen('STACKER_SCORE');
    }
  };

  const handleJigsawComplete = (data) => {
    if (data.eligibleForPrize) {
      setPendingJigsawData(data);
      setPrizeSourceGame('JIGSAW');
      setShowPrizeWheel(true);
    } else {
      setJigsawScoreData(data);
      setScreen('JIGSAW_SCORE');
    }
  };

  const handleClaimPrize = (wonPrize) => {
    setShowPrizeWheel(false);

    if (prizeSourceGame === 'JIGSAW') {
      const finalData = {
        ...(pendingJigsawData || {}),
        wonPrize
      };
      setJigsawScoreData(finalData);
      setScreen('JIGSAW_SCORE');
    } else {
      const finalData = {
        ...(pendingStackerData || {}),
        wonPrize
      };
      setStackerScoreData(finalData);
      setScreen('STACKER_SCORE');
    }
  };

  const handleSaveScore = (entry) => {
    setLeaderboard((prev) => {
      const updated = [...prev, entry].sort((a, b) => b.score - a.score).slice(0, 15);
      return updated;
    });
  };

  const handleResetLeaderboard = () => {
    setLeaderboard([]);
    localStorage.removeItem('scale_tech_leaderboard');
  };

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setSettings((prev) => ({ ...prev, isMuted: muted }));
  };

  const handleUpdateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <div className="w-full h-full h-[100dvh] bg-slate-950 flex items-center justify-center overflow-hidden">
      <div 
        className={`relative overflow-hidden transition-all duration-300 ${
          settings.aspectMode === 'kiosk'
            ? 'w-full h-full sm:max-w-[480px] sm:h-[96vh] sm:max-h-[920px] rounded-none sm:rounded-3xl border-0 sm:border-4 border-white/20 shadow-[0_20px_60px_-15px_rgba(14,165,233,0.3)] bg-slate-50'
            : 'w-full h-full bg-slate-50'
        }`}
      >
        {/* --- MAIN GAME SELECT SUITE --- */}
        {screen === 'GAME_SELECT' && (
          <GameSelectScreen 
            onSelectRunner={() => setScreen('RUNNER_START')}
            onSelectStacker={handleStartStacker}
            onSelectJigsaw={handleStartJigsaw}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {/* --- GAME 1: STACK YOUR TECH EMPIRE (CRANE TOWER BOX GAME) --- */}
        {screen === 'STACKER_PLAY' && (
          <StackerCanvas 
            gameDurationSeconds={settings.duration}
            isMuted={settings.isMuted}
            onGameComplete={handleStackerComplete}
            onBack={() => setScreen('GAME_SELECT')}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {/* Prize Wheel Modal Triggered when 15+ Floors built OR Jigsaw completed < 30s */}
        {showPrizeWheel && (
          <PrizeWheelModal onClaimPrize={handleClaimPrize} />
        )}

        {screen === 'STACKER_SCORE' && (
          <StackerScoreScreen 
            scoreData={stackerScoreData}
            onReplay={handleStartStacker}
            onHome={() => setScreen('GAME_SELECT')}
            onSaveScore={handleSaveScore}
          />
        )}

        {/* --- GAME 2: SCALE YOUR TECH (3D RUNNER) --- */}
        {screen === 'RUNNER_START' && (
          <StartScreen 
            onStartGame={handleStartRunner}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {screen === 'RUNNER_PLAY' && (
          <div className="relative w-full h-full">
            <HUD 
              squadCount={runnerScoreData.squadCount}
              score={runnerScoreData.score}
              timeRemaining={settings.duration}
              progressPercent={0}
              isMuted={settings.isMuted}
              onToggleMute={handleToggleMute}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
            <GameCanvas 
              gameDurationSeconds={settings.duration}
              isMuted={settings.isMuted}
              onGameComplete={handleRunnerComplete}
            />
          </div>
        )}

        {screen === 'RUNNER_SCORE' && (
          <ScoreScreen 
            scoreData={runnerScoreData}
            onReplay={handleStartRunner}
            onSaveScore={handleSaveScore}
          />
        )}

        {/* --- GAME 3: APP LOGO JIGSAW PUZZLE --- */}
        {screen === 'JIGSAW_PLAY' && (
          <JigsawCanvas 
            settings={settings}
            onGameComplete={handleJigsawComplete}
            onBack={() => setScreen('GAME_SELECT')}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {screen === 'JIGSAW_SCORE' && (
          <JigsawScoreScreen 
            scoreData={jigsawScoreData}
            onReplay={handleStartJigsaw}
            onHome={() => setScreen('GAME_SELECT')}
            onSaveScore={handleSaveScore}
          />
        )}

        {/* Shared Modals */}
        {isLeaderboardOpen && (
          <LeaderboardModal 
            leaderboard={leaderboard}
            onClose={() => setIsLeaderboardOpen(false)}
          />
        )}

        {isSettingsOpen && (
          <SettingsModal 
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetLeaderboard={handleResetLeaderboard}
            onSwitchToRunner={() => setScreen('RUNNER_START')}
            onSwitchToStacker={handleStartStacker}
            onSwitchToJigsaw={handleStartJigsaw}
            onSwitchToSelect={() => setScreen('GAME_SELECT')}
            currentScreen={screen}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
