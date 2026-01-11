export enum QuadrantType {
  INBOX = 'INBOX',
  A = 'A', // Do Now (Urgent/Important)
  B = 'B', // Schedule (Not Urgent/Important)
  C = 'C', // Delegate (Urgent/Not Important)
  D = 'D', // Delete (Not Urgent/Not Important)
}

export interface Task {
  id: string;
  content: string;
  quadrant: QuadrantType;
  createdAt: number;
  completed: boolean;
  completedAt?: number;
  isShredding?: boolean; // UI state for animation
}

export interface Quote {
  text: string;
  author: string;
}

export enum AppMode {
  PLANNING = 'PLANNING',
  DEEP_WORK = 'DEEP_WORK',
}