
import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Wind, Brain, Archive, Database, ArrowRightLeft, X } from 'lucide-react';
import { Task, QuadrantType, AppMode } from './types';
import { QUADRANT_CONFIG } from './constants';
import { loadTasks, saveTasks } from './services/storageService';
import Inbox from './components/Inbox';
import TaskCard from './components/TaskCard';
import BreathingModal from './components/BreathingModal';
import DeepWorkMode from './components/DeepWorkMode';
import ArchiveModal from './components/ArchiveModal';
import DataModal from './components/DataModal';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [mode, setMode] = useState<AppMode>(AppMode.PLANNING);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isChaosOpen, setIsChaosOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isDataOpen, setIsDataOpen] = useState(false);
  
  // Mobile movement selection
  const [selectedMoveTaskId, setSelectedMoveTaskId] = useState<string | null>(null);

  // Load initial tasks
  useEffect(() => {
    const storedTasks = loadTasks();
    setTasks(storedTasks);
  }, []);

  // Persist tasks on change
  useEffect(() => {
    if (tasks.length > 0) {
        saveTasks(tasks);
    }
  }, [tasks]);

  const addTask = (content: string) => {
    const newTask: Task = {
      id: uuidv4(),
      content,
      quadrant: QuadrantType.INBOX,
      createdAt: Date.now(),
      completed: false
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const moveTask = (taskId: string, targetQuadrant: QuadrantType) => {
    if (targetQuadrant === QuadrantType.D) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isShredding: true } : t));
      setTimeout(() => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
        if (selectedMoveTaskId === taskId) setSelectedMoveTaskId(null);
      }, 700);
    } else {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, quadrant: targetQuadrant } : t));
      setSelectedMoveTaskId(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    setSelectedMoveTaskId(null); // Cancel click-selection if dragging starts
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, quadrant: QuadrantType) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      moveTask(taskId, quadrant);
    }
  };

  const toggleTaskSelection = (taskId: string) => {
    if (selectedMoveTaskId === taskId) {
      setSelectedMoveTaskId(null);
    } else {
      setSelectedMoveTaskId(taskId);
    }
  };

  const startDeepWork = (task: Task) => {
    if (selectedMoveTaskId) {
        setSelectedMoveTaskId(null);
        return;
    }
    setActiveTaskId(task.id);
    setMode(AppMode.DEEP_WORK);
  };

  const completeTask = () => {
    if (activeTaskId) {
      setTasks(prev => prev.map(t => 
        t.id === activeTaskId 
          ? { ...t, completed: true, completedAt: Date.now() } 
          : t
      ));
      setMode(AppMode.PLANNING);
      setActiveTaskId(null);
    }
  };

  const deleteArchivedTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const exitDeepWork = () => {
    setMode(AppMode.PLANNING);
    setActiveTaskId(null);
  };

  const handleImportTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const getTasksByQuadrant = (q: QuadrantType) => tasks.filter(t => t.quadrant === q && !t.completed);
  const getArchivedTasks = () => tasks.filter(t => t.completed);

  // Render Logic
  if (mode === AppMode.DEEP_WORK && activeTaskId) {
    const activeTask = tasks.find(t => t.id === activeTaskId);
    if (activeTask) {
      return (
        <DeepWorkMode 
          task={activeTask} 
          onComplete={completeTask} 
          onExit={exitDeepWork} 
        />
      );
    }
  }

  const selectedTask = tasks.find(t => t.id === selectedMoveTaskId);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-stone-200 pb-24 md:pb-6">
      
      {/* Mobile Move Toolbar */}
      {selectedMoveTaskId && selectedTask && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md animate-fade-in">
          <div className="bg-stone-800 text-stone-100 rounded-3xl shadow-2xl p-4 backdrop-blur-md bg-opacity-95 border border-white/10">
            <div className="flex items-center justify-between mb-4 px-2">
                <span className="text-[10px] uppercase tracking-widest text-stone-400 flex items-center gap-2">
                    <ArrowRightLeft size={12} /> 移动至...
                </span>
                <button onClick={() => setSelectedMoveTaskId(null)} className="text-stone-500 hover:text-white transition-colors">
                    <X size={16} />
                </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
                {[QuadrantType.INBOX, QuadrantType.A, QuadrantType.B, QuadrantType.C, QuadrantType.D].map(q => {
                    const isCurrent = selectedTask.quadrant === q;
                    return (
                        <button
                            key={q}
                            onClick={() => moveTask(selectedMoveTaskId, q)}
                            disabled={isCurrent}
                            className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${isCurrent ? 'opacity-20 grayscale cursor-not-allowed' : 'hover:bg-white/10 active:scale-90'}`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 text-xs font-bold border ${q === QuadrantType.D ? 'border-red-900/50 text-red-400' : 'border-white/10'}`}>
                                {q === QuadrantType.INBOX ? 'IN' : q}
                            </div>
                            <span className="text-[8px] uppercase tracking-tighter text-stone-400">
                                {q === QuadrantType.D ? '粉碎' : '放入'}
                            </span>
                        </button>
                    );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Chaos Button */}
      <button 
        onClick={() => setIsChaosOpen(true)}
        className="fixed bottom-6 right-6 z-30 p-3 md:p-4 rounded-full bg-stone-200 text-stone-500 hover:bg-stone-300 hover:text-stone-700 transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
        title="我很混乱"
      >
        <Wind size={20} className="md:w-6 md:h-6" />
      </button>

      <BreathingModal isOpen={isChaosOpen} onClose={() => setIsChaosOpen(false)} />

      <ArchiveModal 
        isOpen={isArchiveOpen} 
        onClose={() => setIsArchiveOpen(false)} 
        archivedTasks={getArchivedTasks()}
        onDelete={deleteArchivedTask}
      />

      <DataModal 
        isOpen={isDataOpen} 
        onClose={() => setIsDataOpen(false)} 
        tasks={tasks}
        onImportSuccess={handleImportTasks}
      />

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12 relative">
        
        <div className="absolute top-6 right-4 md:top-8 md:right-8 flex items-center gap-1 md:gap-3">
            <button 
                onClick={() => setIsDataOpen(true)}
                className="text-stone-200 hover:text-stone-400 transition-colors p-2"
                title="数据管理"
            >
                <Database size={16} />
            </button>
            <button 
                onClick={() => setIsArchiveOpen(true)}
                className="text-stone-300 hover:text-stone-500 transition-colors p-2"
                title="已归档任务"
            >
                <Archive size={18} />
            </button>
        </div>

        <header className="text-center mb-6 md:mb-12">
          <h1 className="text-xl md:text-2xl font-light tracking-widest text-stone-400 uppercase mb-2">InnerOrder</h1>
          <p className="text-stone-500 text-xs md:text-sm font-light">认知归序 · 行动聚焦 · 心态校准</p>
        </header>

        <Inbox onAddTask={addTask} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8 items-start">
          
          {/* Inbox List */}
          <div 
            className="lg:col-span-1 min-h-[160px] md:min-h-[200px] rounded-2xl md:rounded-3xl bg-white p-4 md:p-6 shadow-sm border border-stone-100"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, QuadrantType.INBOX)}
          >
            <h2 className="text-sm font-medium text-stone-400 uppercase tracking-wider mb-4 md:mb-6 flex items-center gap-2">
              <Brain size={16} /> 收集箱
            </h2>
            <div className="space-y-2 min-h-[80px]">
              {getTasksByQuadrant(QuadrantType.INBOX).map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onDragStart={handleDragStart} 
                  isSelected={selectedMoveTaskId === task.id}
                  onClick={() => toggleTaskSelection(task.id)}
                />
              ))}
              {getTasksByQuadrant(QuadrantType.INBOX).length === 0 && (
                <div className="text-center py-6 text-stone-300 text-xs italic">
                  杂念已清。
                </div>
              )}
            </div>
          </div>

          {/* The Matrix */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            
            {([QuadrantType.A, QuadrantType.B, QuadrantType.C, QuadrantType.D] as QuadrantType[]).map((qType) => {
              const config = QUADRANT_CONFIG[qType];
              const qTasks = getTasksByQuadrant(qType);
              
              return (
                <div
                  key={qType}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, qType)}
                  className={`
                    relative min-h-[180px] md:min-h-[300px] rounded-2xl md:rounded-3xl p-4 md:p-6 transition-all duration-300
                    ${config.color}
                    ${qType === QuadrantType.D ? 'bg-opacity-30 hover:bg-opacity-50' : ''}
                  `}
                >
                  <div className="flex justify-between items-start mb-4 md:mb-6">
                    <div>
                      <h3 className="text-base md:text-lg font-medium">{config.title}</h3>
                      <p className="text-[10px] md:text-xs opacity-70 mt-1">{config.subtitle}</p>
                    </div>
                    <span className={`text-lg md:text-xl font-bold opacity-20`}>{qType}</span>
                  </div>

                  <div className="space-y-2">
                    {qTasks.map(task => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        onDragStart={handleDragStart}
                        isClickable={qType === QuadrantType.A}
                        isSelected={selectedMoveTaskId === task.id}
                        onClick={() => {
                          if (qType === QuadrantType.A && !selectedMoveTaskId) {
                            startDeepWork(task);
                          } else {
                            toggleTaskSelection(task.id);
                          }
                        }}
                      />
                    ))}
                    
                    {qTasks.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 text-stone-400/50 text-sm">
                         {qType === QuadrantType.D ? '拖入粉碎' : '暂无任务'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
