import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { CheckCircle2, XCircle, Timer, Pause, Play } from 'lucide-react';

interface DeepWorkModeProps {
  task: Task;
  onComplete: () => void;
  onExit: () => void;
}

const DeepWorkMode: React.FC<DeepWorkModeProps> = ({ task, onComplete, onExit }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isPomodoro, setIsPomodoro] = useState(false); // Toggle between stopwatch and pomodoro (25m)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(s => isPomodoro ? s - 1 : s + 1);
      }, 1000);
    }
    
    // Pomodoro finish check
    if (isPomodoro && seconds <= 0 && isActive) {
      setIsActive(false);
      // Play a sound or notify? For minimalist UI, just stopping is fine.
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPomodoro, seconds]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const formatTime = (secs: number) => {
    const m = Math.floor(Math.abs(secs) / 60);
    const s = Math.abs(secs) % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handlePomodoroToggle = () => {
    setIsPomodoro(!isPomodoro);
    setIsActive(false);
    setSeconds(!isPomodoro ? 25 * 60 : 0);
  };

  return (
    <div className="fixed inset-0 z-40 bg-stone-900 text-stone-100 flex flex-col items-center justify-center animate-fade-in p-6">
      {/* Header Controls */}
      <div className="absolute top-6 right-6 md:top-8 md:right-8 flex gap-4">
        <button 
          onClick={handlePomodoroToggle}
          className={`p-2 rounded-full transition-colors ${isPomodoro ? 'text-stone-100 bg-stone-800' : 'text-stone-500 hover:text-stone-300'}`}
          title={isPomodoro ? "切换至计时器" : "切换至番茄钟"}
        >
          <Timer size={20} />
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-3xl text-center flex flex-col items-center">
        <div className="mb-8 md:mb-12">
          <div className="text-7xl md:text-8xl font-thin tracking-tighter text-stone-200 tabular-nums">
            {formatTime(seconds)}
          </div>
          <div className="mt-4 flex justify-center gap-2">
             <button onClick={toggleTimer} className="text-stone-500 hover:text-white transition-colors uppercase text-xs tracking-widest flex items-center gap-2 px-4 py-2">
               {isActive ? <><Pause size={12}/> 暂停</> : <><Play size={12}/> 继续</>}
             </button>
          </div>
        </div>

        <h1 className="text-xl md:text-4xl leading-relaxed font-light mb-12 md:mb-16 text-white/90 max-w-xl break-words">
          {task.content}
        </h1>

        <div className="flex justify-center gap-8 md:gap-12">
           <button 
             onClick={onExit}
             className="group flex flex-col items-center gap-2 md:gap-3 text-stone-500 hover:text-stone-300 transition-colors"
           >
             <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-stone-700 flex items-center justify-center group-hover:border-stone-500 transition-colors">
                <XCircle size={20} className="md:w-6 md:h-6" />
             </div>
             <span className="text-[10px] md:text-xs uppercase tracking-widest">推迟</span>
           </button>

           <button 
             onClick={onComplete}
             className="group flex flex-col items-center gap-2 md:gap-3 text-emerald-500 hover:text-emerald-400 transition-colors"
           >
             <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-emerald-900/50 bg-emerald-900/20 flex items-center justify-center group-hover:border-emerald-500/50 group-hover:scale-110 transition-all duration-300">
                <CheckCircle2 size={28} className="md:w-8 md:h-8" />
             </div>
             <span className="text-[10px] md:text-xs uppercase tracking-widest">完成</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default DeepWorkMode;