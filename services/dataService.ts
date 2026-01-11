
import { Task } from '../types';

export const exportTasksToJson = (tasks: Task[]) => {
  const dataStr = JSON.stringify(tasks, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `InnerOrder_Backup_${new Date().toISOString().split('T')[0]}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
  linkElement.remove();
};

export const importTasksFromJson = (file: File): Promise<Task[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const tasks = JSON.parse(content) as Task[];
        
        // Basic validation: check if it's an array and has at least some common fields
        if (Array.isArray(tasks) && (tasks.length === 0 || tasks[0].id)) {
          resolve(tasks);
        } else {
          reject(new Error("无效的备份文件格式"));
        }
      } catch (err) {
        reject(new Error("文件解析失败"));
      }
    };
    reader.onerror = () => reject(new Error("文件读取失败"));
    reader.readAsText(file);
  });
};
