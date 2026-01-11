import React, { useState, KeyboardEvent } from 'react';
import { Plus } from 'lucide-react';

interface InboxProps {
  onAddTask: (content: string) => void;
}

const Inbox: React.FC<InboxProps> = ({ onAddTask }) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim()) {
      onAddTask(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-6 md:mb-10">
      <div className="relative group">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="此刻有何杂念？（回车键存入收集箱）"
          className="w-full bg-white border-none py-3 pl-5 pr-12 md:py-4 md:pl-6 md:pr-14 rounded-2xl shadow-sm text-stone-700 placeholder:text-stone-300 focus:ring-1 focus:ring-stone-200 outline-none transition-all duration-300 text-base md:text-lg font-light"
        />
        <button 
          onClick={handleSubmit}
          className={`absolute right-2 md:right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all duration-300 ${input.trim() ? 'bg-stone-800 text-white' : 'bg-transparent text-stone-300 hover:text-stone-400'}`}
        >
          <Plus size={18} className="md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  );
};

export default Inbox;