import React, { useEffect, useRef, useState } from 'react';
import { BanTarget } from '../types';

interface WheelProps {
  targets: BanTarget[];
  onSpinEnd: (target: BanTarget) => void;
  isSpinning: boolean;
}

const Wheel: React.FC<WheelProps> = ({ targets, onSpinEnd, isSpinning }) => {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const segmentAngle = 360 / targets.length;

  useEffect(() => {
    if (isSpinning) {
      // Calculate a random spin:
      // Minimum 5 full spins (1800 deg) + random segment offset
      const randomSegmentIndex = Math.floor(Math.random() * targets.length);
      const extraDegrees = 360 * 5 + (360 - (randomSegmentIndex * segmentAngle)); 
      
      // Add slight random offset within the segment to look realistic
      const fuzz = Math.random() * (segmentAngle - 2) + 1;
      
      const newRotation = rotation + extraDegrees + fuzz;
      setRotation(newRotation);

      // Timeout should match CSS transition duration
      setTimeout(() => {
        onSpinEnd(targets[randomSegmentIndex]);
      }, 4000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpinning]);

  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto my-8">
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20 w-8 h-10">
        <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-red-600 drop-shadow-lg"></div>
      </div>

      {/* Wheel Container */}
      <div
        ref={wheelRef}
        className="w-full h-full rounded-full border-4 border-gray-700 shadow-[0_0_20px_rgba(239,68,68,0.3)] overflow-hidden relative transition-transform cubic-bezier(0.25, 0.1, 0.25, 1)"
        style={{
          transform: `rotate(${rotation}deg)`,
          transitionDuration: isSpinning ? '4s' : '0s',
          background: 'conic-gradient(from 0deg, #1f2937 0%, #374151 100%)' // Fallback
        }}
      >
        {/* Segments */}
        {targets.map((target, index) => {
          const rotate = segmentAngle * index;
          const isEven = index % 2 === 0;
          return (
            <div
              key={target.id}
              className="absolute w-full h-full top-0 left-0"
              style={{
                transform: `rotate(${rotate}deg)`,
              }}
            >
              {/* Slice Background - using clip-path could be cleaner but this uses skew hack for simplicity or conic-gradient backing */}
              <div 
                className={`absolute w-full h-full origin-bottom-center ${isEven ? 'text-gray-300' : 'text-white'}`}
                style={{
                    backgroundColor: isEven ? '#1f2937' : '#374151',
                    clipPath: `polygon(50% 50%, 50% 0, ${50 + 50 * Math.tan((Math.PI * segmentAngle)/360)}% 0)` 
                    // This is a simplified approximate clip for standard slice logic, 
                    // usually CSS conic gradients are better for background, 
                    // but for DOM elements we place them carefully.
                }}
              />
              
              {/* Content Container (Centered in slice) */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 h-1/2 flex flex-col items-center justify-start pt-4 origin-bottom"
                style={{
                  transform: `rotate(${segmentAngle / 2}deg)`,
                  width: `${segmentAngle < 45 ? 60 : 100}px` 
                }}
              >
                <span className="text-2xl mb-1">{target.icon}</span>
                <span className="text-xs font-bold uppercase truncate max-w-full tracking-tighter" style={{writingMode: 'vertical-rl', textOrientation: 'mixed', height: '80px'}}>
                  {target.name}
                </span>
              </div>
              
              {/* Divider Line */}
              <div className="absolute top-0 left-1/2 w-[1px] h-1/2 bg-gray-600 origin-bottom transform -translate-x-1/2"></div>
            </div>
          );
        })}
      </div>
      
      {/* Center Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gray-900 rounded-full border-4 border-gray-600 flex items-center justify-center z-10 shadow-inner">
        <span className="text-xs font-bold text-gray-500">РКН</span>
      </div>
    </div>
  );
};

export default Wheel;
