import React, { useState, useEffect } from 'react';
import { BanTarget, BanDecree, GameState, PlayerStats } from './types';
import HorizontalRoulette from './components/Wheel';
import DecreeModal from './components/DecreeModal';
import { generateBanReason } from './services/geminiService';

const TARGETS: BanTarget[] = [
  { id: '1', name: 'VPN', icon: '🛡️' },
  { id: '2', name: 'ANIME', icon: '👘' },
  { id: '3', name: 'YOUTUBE', icon: '▶️' },
  { id: '4', name: 'WIKI', icon: '📚' },
  { id: '5', name: 'CATS', icon: '🐱' },
  { id: '6', name: 'GAMES', icon: '🎮' },
  { id: '7', name: 'BURGER', icon: '🍔' },
  { id: '8', name: 'MEMES', icon: '🐸' },
  { id: '9', name: 'CRYPTO', icon: '🪙' },
  { id: '10', name: 'TIKTOK', icon: '🎵' },
  { id: '11', name: 'COFFEE', icon: '☕' },
  { id: '12', name: 'CODE', icon: '💻' },
];

function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [currentDecree, setCurrentDecree] = useState<BanDecree | null>(null);
  const [loadingText, setLoadingText] = useState("Инициализация...");
  
  const [stats, setStats] = useState<PlayerStats>({
    bannedCount: 0,
    quota: 1000, // Measured in "Megabytes" or just arbitrary points
    rank: "Стажёр"
  });

  // Init Telegram WebApp
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      window.Telegram.WebApp.setHeaderColor('#111827');
    }
  }, []);

  const handleSpinClick = () => {
    if (gameState !== GameState.IDLE) return;
    
    // Haptic feedback for button press
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
    
    setGameState(GameState.SPINNING);
  };

  const handleSpinEnd = async (target: BanTarget) => {
    setGameState(GameState.PROCESSING);
    setLoadingText("ГЕНЕРАЦИЯ ПРИЧИНЫ...");

    try {
      const response = await generateBanReason(target.name);
      
      const newDecree: BanDecree = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        targetName: target.name,
        targetIcon: target.icon,
        reason: response.reason,
        article: response.article,
        timestamp: Date.now(),
      };

      setCurrentDecree(newDecree);
      setGameState(GameState.RESULT);
    } catch (e) {
      setGameState(GameState.IDLE);
    }
  };

  const closeDecree = () => {
    // Update Stats
    setStats(prev => {
        const newCount = prev.bannedCount + 1;
        let newRank = prev.rank;
        if (newCount > 5) newRank = "Младший Цензор";
        if (newCount > 15) newRank = "Старший Цензор";
        if (newCount > 30) newRank = "Глава Департамента";
        
        return {
            bannedCount: newCount,
            quota: Math.max(0, prev.quota - Math.floor(Math.random() * 50 + 10)),
            rank: newRank
        };
    });

    setGameState(GameState.IDLE);
    setCurrentDecree(null);
  };

  // Quota progress calculation
  const quotaProgress = Math.min(100, (stats.bannedCount / 20) * 100); 

  return (
    <div className="min-h-screen flex flex-col bg-[#111827] text-white overflow-hidden font-mono selection:bg-red-900">
      
      {/* CRT Scanline Effect Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-10" style={{background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%'}}></div>

      {/* Top Bar: Player Stats */}
      <div className="bg-gray-800 border-b border-gray-700 p-3 flex justify-between items-end shadow-md z-20">
        <div>
            <div className="text-[10px] text-gray-400 uppercase">Сотрудник</div>
            <div className="text-sm font-bold text-red-400">{stats.rank}</div>
        </div>
        <div className="text-right">
            <div className="text-[10px] text-gray-400 uppercase">Выполнено</div>
            <div className="text-xl font-['Russo_One'] tracking-widest">{stats.bannedCount}</div>
        </div>
      </div>

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative w-full overflow-hidden">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-10 left-0 w-full text-[100px] font-black text-gray-800 opacity-20 select-none whitespace-nowrap animate-pulse">
            RKN-SIM RKN-SIM RKN-SIM
        </div>

        {/* Status Text */}
        <div className="h-16 flex items-center justify-center z-10 w-full px-4">
            {gameState === GameState.PROCESSING ? (
                <div className="text-red-500 font-bold animate-pulse text-center border border-red-900 bg-red-900/20 px-4 py-2 rounded">
                    {loadingText}
                </div>
            ) : gameState === GameState.SPINNING ? (
                <div className="text-yellow-500 font-bold text-center">
                    ПОИСК ЗАПРЕЩЕННОГО КОНТЕНТА...
                </div>
            ) : (
                <div className="text-gray-500 text-xs text-center border-l-2 border-gray-600 pl-3">
                    СИСТЕМА ОЖИДАЕТ ВВОДА<br/>
                    <span className="text-[10px] opacity-60">v2.0.4-STABLE</span>
                </div>
            )}
        </div>

        {/* The New Horizontal Roulette */}
        <HorizontalRoulette 
          targets={TARGETS} 
          onSpinEnd={handleSpinEnd} 
          isSpinning={gameState === GameState.SPINNING} 
        />

        {/* Primary Action Button */}
        <div className="w-full px-6 mt-4 z-20 pb-8">
            <button
                onClick={handleSpinClick}
                disabled={gameState !== GameState.IDLE}
                className={`
                group relative w-full h-20 rounded-sm font-['Russo_One'] text-2xl tracking-widest uppercase transition-all
                overflow-hidden border-2
                ${gameState === GameState.IDLE 
                    ? 'border-red-600 bg-red-700 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] active:scale-[0.98]' 
                    : 'border-gray-600 bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'}
                `}
            >
                {/* Button Glitch Effect layer */}
                <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {gameState === GameState.IDLE ? (
                        <>
                            <span>БЛОКИРОВАТЬ</span>
                            <span className="text-sm bg-black/30 px-2 py-1 rounded">SPACE</span>
                        </>
                    ) : (
                        <span>РАБОТАЕТ...</span>
                    )}
                </span>
            </button>
            <div className="text-center mt-2 text-[10px] text-gray-500">
                Нажимая кнопку, вы соглашаетесь с ответственностью
            </div>
        </div>
      </main>

      {/* Quota Progress Bar (Bottom) */}
      <div className="w-full bg-gray-900 p-2 border-t border-gray-700">
        <div className="flex justify-between text-[10px] text-gray-400 mb-1 px-1">
            <span>ПЛАН БЛОКИРОВОК</span>
            <span>{Math.round(quotaProgress)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
                className="h-full bg-gradient-to-r from-green-600 to-red-600 transition-all duration-500 ease-out"
                style={{width: `${quotaProgress}%`}}
            ></div>
        </div>
      </div>

      {/* Modals */}
      {currentDecree && (
        <DecreeModal decree={currentDecree} onClose={closeDecree} />
      )}
    </div>
  );
}

export default App;
