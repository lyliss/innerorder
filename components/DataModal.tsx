
import React, { useRef } from 'react';
import { X, Download, Upload, ShieldCheck } from 'lucide-react';
import { Task } from '../types';
import { exportTasksToJson, importTasksFromJson } from '../services/dataService';

interface DataModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onImportSuccess: (tasks: Task[]) => void;
}

const DataModal: React.FC<DataModalProps> = ({ isOpen, onClose, tasks, onImportSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const newTasks = await importTasksFromJson(file);
        if (confirm("确定要导入备份吗？这将替换您当前的全部任务数据。")) {
          onImportSuccess(newTasks);
          onClose();
        }
      } catch (err) {
        alert(err instanceof Error ? err.message : "导入失败");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-200/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-xl border border-stone-100 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-stone-400 text-xs uppercase tracking-[0.2em] font-medium flex items-center gap-2">
            <ShieldCheck size={14} /> 数据密室
          </h2>
          <button onClick={onClose} className="text-stone-300 hover:text-stone-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <button 
            onClick={() => exportTasksToJson(tasks)}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-stone-50 hover:bg-stone-100 transition-all group"
          >
            <div className="flex flex-col items-start">
              <span className="text-stone-700 text-sm font-light">导出备份</span>
              <span className="text-stone-400 text-[10px] mt-1">保存当前的认知秩序</span>
            </div>
            <Download size={18} className="text-stone-300 group-hover:text-stone-500 transition-colors" />
          </button>

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-stone-50 hover:bg-stone-100 transition-all group"
          >
            <div className="flex flex-col items-start">
              <span className="text-stone-700 text-sm font-light">导入恢复</span>
              <span className="text-stone-400 text-[10px] mt-1">从备份中重构秩序</span>
            </div>
            <Upload size={18} className="text-stone-300 group-hover:text-stone-500 transition-colors" />
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImport} 
            accept=".json" 
            className="hidden" 
          />
        </div>

        <p className="mt-10 text-center text-[10px] text-stone-300 uppercase tracking-widest leading-loose">
          数据本地存储 · 隐私无涉
        </p>
      </div>
    </div>
  );
};

export default DataModal;
