
import React from 'react';
import { Task } from '../types';
import { GripVertical } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onClick?: () => void;
  isClickable?: boolean;
  isSelected?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDragStart, onClick, isClickable, isSelected }) => {
  
  if (task.isShredding) {
    return (
      <div className="animate-shred opacity-50 p-3 mb-2 bg-stone-200 rounded-lg text-stone-400 text-sm overflow-hidden select-none">
        <div className="flex items-center gap-2">
            <span className="line-through">{task.content}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={onClick}
      className={`
        relative group bg-white p-3 md:p-4 mb-2 md:mb-3 rounded-xl shadow-sm border transition-all duration-300 cursor-move
        ${isSelected ? 'ring-2 ring-stone-400 border-transparent scale-[0.98] shadow-inner' : 'border-stone-100 hover:shadow-md'}
        ${isClickable && !isSelected ? 'cursor-pointer hover:ring-1 hover:ring-rose-200' : ''}
      `}
    >
      <div className="flex items-start gap-2 md:gap-3">
        <div className="mt-1 text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
          <GripVertical size={14} />
        </div>
        <p className={`text-stone-700 font-light text-sm leading-relaxed select-none break-all ${isSelected ? 'opacity-60' : ''}`}>
          {task.content}
        </p>
      </div>
      
      {/* Mobile-only indicator that it's selectable */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-stone-100 md:hidden" />
    </div>
  );
};

export default TaskCard;
