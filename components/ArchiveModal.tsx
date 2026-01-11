import React from 'react';
import { X, Archive, Trash2 } from 'lucide-react';
import { Task } from '../types';

interface ArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  archivedTasks: Task[];
  onDelete: (taskId: string) => void;
}

const ArchiveModal: React.FC<ArchiveModalProps> = ({ isOpen, onClose, archivedTasks, onDelete }) => {
  if (!isOpen) return null;

  // Sort by completed time desc
  const sortedTasks = [...archivedTasks].sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-200/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl border border-stone-100 max-h-[80vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-100">
          <div className="flex items-center gap-2 text-stone-600">
            <Archive size={18} />
            <h2 className="font-medium">已归档</h2>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto p-6 flex-1 space-y-3">
          {sortedTasks.length === 0 ? (
            <div className="text-center py-10 text-stone-400 font-light text-sm">
              暂无已完成的任务。
            </div>
          ) : (
            sortedTasks.map(task => (
              <div key={task.id} className="group flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100 transition-colors">
                <div className="flex flex-col">
                    <span className="text-stone-500 line-through text-sm">{task.content}</span>
                    <span className="text-stone-300 text-[10px] mt-1">
                        {task.completedAt ? new Date(task.completedAt).toLocaleString() : 'Unknown'}
                    </span>
                </div>
                <button 
                  onClick={() => onDelete(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-stone-300 hover:text-red-400 transition-all"
                  title="永久删除"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 text-center">
             <span className="text-[10px] text-stone-400 uppercase tracking-widest">
                总计完成: {sortedTasks.length}
             </span>
        </div>
      </div>
    </div>
  );
};

export default ArchiveModal;