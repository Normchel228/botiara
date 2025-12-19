import React, { useState, useEffect } from 'react';
import { BanDecree } from '../types';

interface DecreeModalProps {
  decree: BanDecree;
  onClose: () => void;
}

const DecreeModal: React.FC<DecreeModalProps> = ({ decree, onClose }) => {
  const [isStamped, setIsStamped] = useState(false);
  const [displayedReason, setDisplayedReason] = useState("");
  
  // Typewriter effect for the reason
  useEffect(() => {
    let i = 0;
    const speed = 20; 
    const text = decree.reason;
    
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedReason((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [decree.reason]);

  const handleStamp = () => {
    if (isStamped) return;
    
    // Haptic feedback for stamp
    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
    }

    setIsStamped(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#e2e2e2] text-black w-full max-w-md rounded-sm p-1 shadow-2xl transform rotate-1 border-2 border-gray-400">
        
        <div className="bg-[#f4f1ea] border border-gray-400 p-6 relative overflow-hidden h-full flex flex-col gap-4 shadow-inner" style={{backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, #e5e5e5 20px)'}}>
          
          {/* Header */}
          <div className="border-b-4 border-double border-black pb-2 text-center">
            <h2 className="font-serif font-bold text-xl uppercase tracking-widest">ПРИКАЗ №{decree.id.slice(0,4)}</h2>
            <p className="text-[10px] font-mono text-gray-600 uppercase">Федеральная служба по мониторингу мемов</p>
          </div>

          {/* Target */}
          <div className="flex items-center gap-4 bg-white/50 p-2 border-2 border-black border-dashed">
            <span className="text-4xl grayscale contrast-125">{decree.targetIcon}</span>
            <div>
              <p className="text-[9px] uppercase text-gray-600 font-bold">НАРУШИТЕЛЬ</p>
              <h3 className="text-lg font-bold font-mono uppercase">{decree.targetName}</h3>
            </div>
          </div>

          {/* Reason (Typewriter) */}
          <div className="font-serif text-sm leading-6 min-h-[100px] bg-white/30 p-2">
            <span className="font-bold underline">ОБСТОЯТЕЛЬСТВА:</span><br/>
            {displayedReason}
            {displayedReason.length < decree.reason.length && <span className="animate-pulse">_</span>}
          </div>
          
          <div className="text-xs font-mono text-right mt-2">
            <b>ОСНОВАНИЕ:</b> {decree.article}
          </div>

          {/* Interactive Stamp Area */}
          <div 
            onClick={handleStamp}
            className={`
                relative h-32 border-2 border-gray-300 rounded-lg flex items-center justify-center cursor-pointer transition-colors
                ${!isStamped ? 'hover:bg-red-50 hover:border-red-200 bg-gray-50' : ''}
            `}
          >
            {!isStamped && (
                <span className="text-gray-400 font-bold uppercase animate-pulse select-none">
                    НАЖМИ ЧТОБЫ ПОСТАВИТЬ ПЕЧАТЬ
                </span>
            )}

            {/* The Stamp Graphic */}
            <div className={`
                absolute transition-all duration-200 ease-in
                ${isStamped ? 'opacity-90 scale-100 rotate-[-12deg]' : 'opacity-0 scale-150 rotate-[-45deg]'}
            `}>
                <div className="w-36 h-36 border-4 border-red-800 rounded-full flex flex-col items-center justify-center text-red-800 font-bold uppercase mix-blend-multiply mask-image" style={{boxShadow: '0 0 0 4px rgba(153, 27, 27, 0.1)'}}>
                    <div className="w-[92%] h-[92%] border-2 border-red-800 rounded-full flex flex-col items-center justify-center text-center leading-none">
                        <span className="text-[10px] tracking-widest mb-1">ФЕДЕРАЛЬНЫЙ</span>
                        <span className="text-3xl font-black tracking-tighter block border-y-2 border-red-800 w-full py-1 mb-1">ЗАПРЕТИТЬ</span>
                        <span className="text-[9px]">{new Date().toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
          </div>

          {/* Footer Button - Only appears after stamping */}
          <button 
            onClick={onClose}
            disabled={!isStamped}
            className={`
                mt-2 w-full py-4 font-mono font-bold uppercase transition-all duration-300
                ${isStamped 
                    ? 'bg-black text-white hover:bg-gray-800 translate-y-0 opacity-100' 
                    : 'bg-gray-300 text-gray-500 translate-y-4 opacity-0 pointer-events-none'}
            `}
          >
            ОТПРАВИТЬ В АРХИВ
          </button>
        </div>
      </div>
    </div>
  );
};

export default DecreeModal;
