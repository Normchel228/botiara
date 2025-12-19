import React from 'react';
import { BanDecree } from '../types';

interface DecreeModalProps {
  decree: BanDecree;
  onClose: () => void;
}

const DecreeModal: React.FC<DecreeModalProps> = ({ decree, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#e2e2e2] text-black w-full max-w-md rounded-sm p-1 shadow-2xl transform rotate-1 border-2 border-gray-400">
        
        {/* Paper texture feel */}
        <div className="bg-[#f0f0f0] border border-gray-300 p-6 relative overflow-hidden h-full flex flex-col gap-4">
          
          {/* Header */}
          <div className="border-b-2 border-black pb-4 text-center">
            <div className="w-16 h-16 mx-auto mb-2 opacity-80 bg-contain bg-no-repeat bg-center" style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/f/f3/Coat_of_Arms_of_Russia.svg')" }}></div>
            <h2 className="font-serif font-bold text-xl uppercase tracking-widest">ПОСТАНОВЛЕНИЕ</h2>
            <p className="text-xs font-mono text-gray-600">Федеральная служба по надзору</p>
            <p className="text-xs font-mono text-gray-600">#{decree.id} от {new Date(decree.timestamp).toLocaleDateString('ru-RU')}</p>
          </div>

          {/* Target */}
          <div className="flex items-center gap-4 bg-gray-200 p-3 rounded border border-gray-300 border-dashed">
            <span className="text-4xl">{decree.targetIcon}</span>
            <div>
              <p className="text-xs uppercase text-gray-500 font-bold">ОБЪЕКТ БЛОКИРОВКИ</p>
              <h3 className="text-xl font-bold font-mono">{decree.targetName}</h3>
            </div>
          </div>

          {/* Reason */}
          <div className="font-serif leading-relaxed">
            <p className="mb-2">
              <span className="font-bold">ПРИЧИНА:</span> {decree.reason}
            </p>
            <p className="text-sm mt-4 text-right italic font-bold">
              Основание: {decree.article}
            </p>
          </div>

          {/* STAMP */}
          <div className="absolute bottom-12 right-6 w-32 h-32 border-4 border-red-700 rounded-full flex items-center justify-center text-red-700 font-bold text-xl uppercase opacity-80 rotate-[-20deg] mix-blend-multiply stamp-animate mask-image">
            <div className="w-[90%] h-[90%] border-2 border-red-700 rounded-full flex flex-col items-center justify-center text-center leading-none">
              <span className="text-[10px]">РОСКОМНАДЗОР</span>
              <span className="text-2xl my-1">ЗАПРЕТ</span>
              <span className="text-[10px]">ПОДПИСАНО</span>
            </div>
          </div>

          {/* Footer Button */}
          <button 
            onClick={onClose}
            className="mt-6 w-full bg-black text-white py-3 font-mono font-bold uppercase hover:bg-gray-800 transition-colors z-10 relative"
          >
            ИСПОЛНИТЬ
          </button>
        </div>
      </div>
    </div>
  );
};

export default DecreeModal;
