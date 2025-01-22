export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export type Theme = 'light' | 'dark';
export type Language = 'en' | 'ar';

export interface TaskStats {
  completed: number;
  total: number;
  streak: number;
  todayCompleted: number;
}

export interface Translations {
  taskManager: string;
  addTask: string;
  noTasks: string;
  dueDate: string;
  priority: string;
  low: string;
  medium: string;
  high: string;
  progress: string;
  today: string;
  streak: string;
  tasksCompleted: string;
  dueToday: string;
  dueTomorrow: string;
  dueInDays: string;
  overdue: string;
  work: string;
  personal: string;
  home: string;
  other: string;
  suggestedCategory: string;
  taskTitle: string;
  stayOrganized: string;
  addTaskPlaceholder: string;
  ofTasks: string;
  dayStreak: string;
  completedToday: string;
}