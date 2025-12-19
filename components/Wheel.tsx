import React, { useEffect, useRef, useState, useMemo } from 'react';
import { BanTarget } from '../types';

interface WheelProps {
  targets: BanTarget[];
  onSpinEnd: (target: BanTarget) => void;
  isSpinning: boolean;
}

const ITEM_WIDTH = 100; // Width of one card in pixels
const VISIBLE_ITEMS = 3; // How many items visible in the window

const HorizontalRoulette: React.FC<WheelProps> = ({ targets, onSpinEnd, isSpinning }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  
  // Generate a long tape of items. 
  // We repeat the targets list many times to create the illusion of infinite scrolling.
  // The "Winner" will be placed at a specific index near the end.
  const tapeItems = useMemo(() => {
    const repeated = [];
    // Create a long strip: 80 items total
    for (let i = 0; i < 80; i++) {
      repeated.push(targets[i % targets.length]);
    }
    return repeated;
  }, [targets]);

  useEffect(() => {
    if (isSpinning) {
      // 1. Pick a random winner index between 60 and 75 (towards the end of the tape)
      const winnerIndex = Math.floor(Math.random() * (75 - 60 + 1)) + 60;
      const winner = tapeItems[winnerIndex];

      // 2. Calculate pixel offset to center the winner
      // Formula: -(ItemPosition) + (HalfContainerWidth) - (HalfItemWidth)
      // We assume container width based on VISIBLE_ITEMS * ITEM_WIDTH, 
      // but purely CSS centering is safer. Let's aim to align the left edge of winner to center minus half width.
      
      // Add a random variance within the item (so it doesn't always stop perfectly in center)
      const variance = Math.floor(Math.random() * 40) - 20; 
      
      const containerCenter = (window.innerWidth < 400 ? window.innerWidth : 400) / 2;
      const finalPosition = (winnerIndex * ITEM_WIDTH) - containerCenter + (ITEM_WIDTH / 2) + variance;

      // 3. Start Animation
      setOffset(finalPosition);

      // 4. Trigger generic haptics if available (simple loop simulation)
      if (window.Telegram?.WebApp?.HapticFeedback) {
        let count = 0;
        const interval = setInterval(() => {
            count++;
            if(count > 10) clearInterval(interval);
            window.Telegram.WebApp.HapticFeedback.selectionChanged();
        }, 300);
      }

      // 5. End Spin
      setTimeout(() => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }
        onSpinEnd(winner);
      }, 5500); // Duration matches CSS transition
    } else {
        // Reset to start (near 0 but slightly offset to hide start edge)
        setOffset(0);
    }
  }, [isSpinning, onSpinEnd, tapeItems]);

  return (
    <div className="relative w-full max-w-md mx-auto my-8 overflow-hidden bg-gray-900 border-y-4 border-gray-700 h-32 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
      
      {/* Center Marker / Cursor */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-red-600 z-20 -translate-x-1/2 shadow-[0_0_10px_#ff0000]"></div>
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-red-600 z-30"></div>
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-red-600 z-30"></div>

      {/* Glass Reflection Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black via-transparent to-black opacity-60 pointer-events-none"></div>

      {/* The Moving Tape */}
      <div 
        className="flex items-center h-full will-change-transform"
        style={{
          transform: `translateX(-${offset}px)`,
          transition: isSpinning ? 'transform 5.5s cubic-bezier(0.15, 0.9, 0.3, 1)' : 'none',
        }}
      >
        {tapeItems.map((item, index) => (
          <div 
            key={`${item.id}-${index}`} 
            className="flex-shrink-0 flex flex-col items-center justify-center border-r border-gray-800 bg-[#1f2937] relative"
            style={{ width: `${ITEM_WIDTH}px`, height: '100%' }}
          >
            <span className="text-4xl drop-shadow-md mb-1">{item.icon}</span>
            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-tighter truncate max-w-[90%]">
              {item.name}
            </span>
            
            {/* Rare Background Pattern for visual variety */}
            {index % 7 === 0 && <div className="absolute inset-0 bg-yellow-500/5 pointer-events-none"></div>}
            {index % 5 === 0 && <div className="absolute inset-0 bg-red-500/5 pointer-events-none"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalRoulette;
