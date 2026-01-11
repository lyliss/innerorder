import React, { useState, useEffect } from 'react';
import { X, Wind } from 'lucide-react';
import { STOIC_QUOTES } from '../constants';

interface BreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Phase = 'INHALE' | 'HOLD' | 'EXHALE' | 'IDLE';

const BreathingModal: React.FC<BreathingModalProps> = ({ isOpen, onClose }) => {
  const [phase, setPhase] = useState<Phase>('IDLE');
  const [cycleCount, setCycleCount] = useState(0);
  const [quote, setQuote] = useState(STOIC_QUOTES[0]);
  const [showQuote, setShowQuote] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPhase('INHALE');
      setCycleCount(0);
      setShowQuote(false);
      setQuote(STOIC_QUOTES[Math.floor(Math.random() * STOIC_QUOTES.length)]);
    } else {
      setPhase('IDLE');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    let timeout: ReturnType<typeof setTimeout>;

    if (phase === 'INHALE') {
      timeout = setTimeout(() => setPhase('HOLD'), 4000);
    } else if (phase === 'HOLD') {
      timeout = setTimeout(() => setPhase('EXHALE'), 7000);
    } else if (phase === 'EXHALE') {
      timeout = setTimeout(() => {
        const nextCount = cycleCount + 1;
        setCycleCount(nextCount);
        if (nextCount >= 3) {
          setShowQuote(true);
          // Optional: automatically close after some time or let user close
        }
        setPhase('INHALE');
      }, 8000);
    }

    return () => clearTimeout(timeout);
  }, [phase, isOpen, cycleCount]);

  if (!isOpen) return null;

  // Dynamic styles based on phase
  const getPhaseStyles = (p: Phase) => {
    switch (p) {
      case 'INHALE':
        return {
          core: 'bg-sky-200/90 shadow-[0_0_60px_rgba(186,230,253,0.4)] text-sky-900',
          aura: 'bg-sky-400/20',
          text: '吸气'
        };
      case 'HOLD':
        return {
          core: 'bg-amber-200/90 shadow-[0_0_60px_rgba(253,230,138,0.4)] text-amber-900',
          aura: 'bg-amber-400/20',
          text: '屏息'
        };
      case 'EXHALE':
        return {
          core: 'bg-emerald-100/90 shadow-[0_0_60px_rgba(167,243,208,0.4)] text-emerald-900',
          aura: 'bg-emerald-400/20',
          text: '呼气'
        };
      default:
        return {
          core: 'bg-stone-200/90 text-stone-800',
          aura: 'bg-stone-500/10',
          text: ''
        };
    }
  };

  const currentStyle = getPhaseStyles(phase);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-900/95 backdrop-blur-sm transition-opacity duration-500">
      <button 
        onClick={onClose} 
        className="absolute top-6 right-6 z-[60] text-stone-400 hover:text-white transition-colors p-2"
      >
        <X size={32} />
      </button>

      {!showQuote ? (
        <div className="flex flex-col items-center justify-center w-full h-full relative z-10">
          
          <div className="relative flex items-center justify-center w-80 h-80">
            {/* Base Static Circle */}
            <div className={`absolute w-32 h-32 rounded-full bg-stone-800/50`} />
            
            {/* Aura Circle (Outer Glow) */}
             <div 
              className={`
                absolute w-32 h-32 rounded-full blur-2xl transition-colors duration-1000
                ${currentStyle.aura}
                ${phase === 'INHALE' ? 'animate-aura-in' : ''}
                ${phase === 'HOLD' ? 'scale-[1.6] opacity-30' : ''}
                ${phase === 'EXHALE' ? 'animate-aura-out' : ''}
              `}
            />

            {/* Core Circle (Breathing) */}
            <div 
              className={`
                relative w-32 h-32 rounded-full transition-colors duration-1000 flex items-center justify-center
                ${currentStyle.core}
                ${phase === 'INHALE' ? 'animate-breathe-in' : ''}
                ${phase === 'HOLD' ? 'animate-hold' : ''}
                ${phase === 'EXHALE' ? 'animate-breathe-out' : ''}
              `}
            >
               <div className="absolute inset-0 flex items-center justify-center font-light text-xl tracking-widest uppercase opacity-90">
                {currentStyle.text}
               </div>
            </div>
          </div>
          
          <p className="mt-16 text-stone-500 font-light text-sm tracking-widest uppercase">
             第 {cycleCount + 1} / 3 次循环
          </p>
        </div>
      ) : (
        <div className="animate-fade-in max-w-2xl px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl text-stone-100 font-light mb-8 leading-relaxed">
            "{quote.text}"
          </h2>
          <p className="text-stone-500 uppercase tracking-widest text-sm">
            — {quote.author}
          </p>
          <button
            onClick={onClose}
            className="mt-16 px-8 py-3 rounded-full border border-stone-700 text-stone-400 hover:bg-stone-800 hover:text-white transition-all duration-300 tracking-wide text-sm"
          >
            回归秩序
          </button>
        </div>
      )}
    </div>
  );
};

export default BreathingModal;