import React, { useState, useEffect } from 'react';
import { BanTarget, BanDecree, GameState } from './types';
import Wheel from './components/Wheel';
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
];

function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [history, setHistory] = useState<BanDecree[]>([]);
  const [currentDecree, setCurrentDecree] = useState<BanDecree | null>(null);
  const [loadingText, setLoadingText] = useState("Инициализация...");

  // Prevent zooming on mobile double taps
  useEffect(() => {
    document.addEventListener('gesturestart', function(e) { e.preventDefault(); });
  }, []);

  const handleSpinClick = () => {
    if (gameState !== GameState.IDLE) return;
    setGameState(GameState.SPINNING);
  };

  const handleSpinEnd = async (target: BanTarget) => {
    setGameState(GameState.PROCESSING);
    setLoadingText("Поиск нарушений...");

    const loadingPhrases = [
      "Анализ мемов...",
      "Звонок начальству...",
      "Чтение законов...",
      "Консультация с экспертами...",
      "Подготовка штампа..."
    ];
    
    const interval = setInterval(() => {
      setLoadingText(loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)]);
    }, 800);

    try {
      const response = await generateBanReason(target.name);
      clearInterval(interval);
      
      const newDecree: BanDecree = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        targetName: target.name,
        targetIcon: target.icon,
        reason: response.reason,
        article: response.article,
        timestamp: Date.now(),
      };

      setCurrentDecree(newDecree);
      setHistory(prev => [newDecree, ...prev]);
      setGameState(GameState.RESULT);
    } catch (e) {
      clearInterval(interval);
      setGameState(GameState.IDLE);
    }
  };

  const closeDecree = () => {
    setGameState(GameState.IDLE);
    setCurrentDecree(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center pb-12 relative bg-[#111827] text-white overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-red-600 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600 rounded-full filter blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="w-full p-4 flex justify-between items-center z-10 border-b border-gray-800 bg-[#111827]/90 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center font-bold text-lg">Р</div>
          <h1 className="font-['Russo_One'] text-lg tracking-wider">РКН СИМУЛЯТОР</h1>
        </div>
        <div className="text-xs font-mono text-gray-400">
          СЧЕТ: {history.length}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-lg px-4 z-10">
        
        {/* Status Display */}
        <div className="h-12 flex items-center justify-center mb-4">
          {gameState === GameState.PROCESSING ? (
             <div className="flex flex-col items-center animate-pulse">
               <span className="text-red-400 font-mono text-sm">{loadingText}</span>
             </div>
          ) : (
            <div className="text-gray-500 font-mono text-xs text-center">
              СИСТЕМА ГОТОВА К РАБОТЕ <br/> ОЖИДАНИЕ ОПЕРАТОРА
            </div>
          )}
        </div>

        {/* The Wheel */}
        <Wheel 
          targets={TARGETS} 
          onSpinEnd={handleSpinEnd} 
          isSpinning={gameState === GameState.SPINNING} 
        />

        {/* Controls */}
        <div className="w-full mt-8">
          <button
            onClick={handleSpinClick}
            disabled={gameState !== GameState.IDLE}
            className={`
              w-full py-4 rounded-xl font-['Russo_One'] text-xl tracking-widest shadow-lg transition-all transform active:scale-95
              ${gameState === GameState.IDLE 
                ? 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white shadow-red-900/50' 
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'}
            `}
          >
            {gameState === GameState.SPINNING ? 'СКАНИРОВАНИЕ...' : 'ПРОВЕСТИ ПРОВЕРКУ'}
          </button>
        </div>
      </main>

      {/* Recent History (Mini) */}
      {history.length > 0 && (
        <div className="w-full max-w-lg px-4 mt-8 z-10">
          <h3 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest px-1">Последние блокировки</h3>
          <div className="space-y-2">
            {history.slice(0, 3).map((item) => (
              <div key={item.id} className="bg-gray-800/50 border border-gray-700 p-3 rounded flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.targetIcon}</span>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-200">{item.targetName}</span>
                    <span className="text-[10px] text-gray-400">ст. {item.article}</span>
                  </div>
                </div>
                <span className="text-red-500 font-bold text-xs border border-red-500 px-1 rounded">BANNED</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {currentDecree && (
        <DecreeModal decree={currentDecree} onClose={closeDecree} />
      )}
    </div>
  );
}

export default App;
