import React, { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import GameCanvas from './components/GameCanvas';
import HUD from './components/HUD';
import ScoreScreen from './components/ScoreScreen';
import StackerCanvas from './components/StackerCanvas';
import StackerScoreScreen from './components/StackerScoreScreen';
import PrizeWheelModal from './components/PrizeWheelModal';
import LeaderboardModal from './components/LeaderboardModal';
import SettingsModal from './components/SettingsModal';
import { soundManager } from './utils/audioEngine';

export default function App() {
  // Default main entry point is STACK YOUR TECH EMPIRE (Box Stacker Game)! (User Directive)
  const [screen, setScreen] = useState('STACKER_PLAY');
  
  const [settings, setSettings] = useState({
    aspectMode: 'kiosk',
    duration: 25,
    isMuted: false
  });

  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [runnerScoreData, setRunnerScoreData] = useState({ score: 0, squadCount: 5 });
  const [stackerScoreData, setStackerScoreData] = useState({ score: 0, floorsCount: 0, heightMeters: 0, wonPrize: null });

  // Prize Reel Modal State for 15+ Floors Build
  const [showPrizeWheel, setShowPrizeWheel] = useState(false);
  const [pendingStackerData, setPendingStackerData] = useState(null);

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

  const handleRunnerComplete = (data) => {
    setRunnerScoreData(data);
    setScreen('RUNNER_SCORE');
  };

  const handleStackerComplete = (data) => {
    if (data.floorsCount >= 15) {
      setPendingStackerData(data);
      setShowPrizeWheel(true);
    } else {
      setStackerScoreData(data);
      setScreen('STACKER_SCORE');
    }
  };

  const handleClaimPrize = (wonPrize) => {
    const finalData = {
      ...(pendingStackerData || {}),
      wonPrize
    };
    setStackerScoreData(finalData);
    setShowPrizeWheel(false);
    setScreen('STACKER_SCORE');
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
    <div className="w-screen h-screen bg-slate-200 flex items-center justify-center overflow-hidden">
      <div 
        className={`relative overflow-hidden transition-all duration-300 ${
          settings.aspectMode === 'kiosk'
            ? 'w-full max-w-[480px] h-full max-h-[920px] rounded-none sm:rounded-3xl border-0 sm:border-4 border-white shadow-[0_20px_60px_-15px_rgba(14,165,233,0.3)] bg-slate-50'
            : 'w-full h-full bg-slate-50'
        }`}
      >
        {/* --- MAIN GAME: STACK YOUR TECH EMPIRE (CRANE TOWER BOX GAME) --- */}
        {screen === 'STACKER_PLAY' && (
          <StackerCanvas 
            gameDurationSeconds={settings.duration}
            isMuted={settings.isMuted}
            onGameComplete={handleStackerComplete}
            onBack={handleStartStacker}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {/* Prize Wheel Modal Triggered when 15+ Floors are built */}
        {showPrizeWheel && (
          <PrizeWheelModal onClaimPrize={handleClaimPrize} />
        )}

        {screen === 'STACKER_SCORE' && (
          <StackerScoreScreen 
            scoreData={stackerScoreData}
            onReplay={handleStartStacker}
            onHome={handleStartStacker}
            onSaveScore={handleSaveScore}
          />
        )}

        {/* --- SECONDARY GAME: SCALE YOUR TECH (3D RUNNER) --- */}
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
            currentScreen={screen}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
