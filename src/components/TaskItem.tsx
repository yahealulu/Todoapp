import React from 'react';
import { CheckCircle, Circle, Trash2, Calendar, AlertTriangle } from 'lucide-react';
import type { Task, Translations } from '../types';

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  translations: Translations;
}

const getPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'high': return 'text-red-500';
    case 'medium': return 'text-yellow-500';
    case 'low': return 'text-green-500';
  }
};

const formatDueDate = (date: Date, translations: Translations) => {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return translations.overdue;
  if (days === 0) return translations.dueToday;
  if (days === 1) return translations.dueTomorrow;
  if (days < 7) return translations.dueInDays.replace('{days}', days.toString());
  
  // Format date in English
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export function TaskItem({ task, onComplete, onDelete, translations }: TaskItemProps) {
  const isOverdue = task.dueDate && new Date() > task.dueDate && !task.completed;
  
  return (
    <div className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${
      task.completed ? 'bg-green-50 dark:bg-green-900/20' : 
      isOverdue ? 'bg-red-50 dark:bg-red-900/20' : 
      'bg-white dark:bg-gray-800'
    }`}>
      <div className="flex items-center space-x-3 flex-1">
        <button
          onClick={() => onComplete(task.id)}
          className={`transition-colors duration-200 ${
            task.completed ? 'text-green-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          {task.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
        </button>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-lg ${
              task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 
              'text-gray-800 dark:text-gray-200'
            }`}>
              {task.title}
            </span>
            <span className={`text-sm ${getPriorityColor(task.priority)}`}>
              {translations[task.priority.toLowerCase() as keyof Translations]}
            </span>
          </div>
          
          {task.category && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {task.category}
            </span>
          )}
          
          {task.dueDate && (
            <div className="flex items-center gap-1 text-sm mt-1">
              <Calendar size={14} className="text-gray-400" />
              <span className={`${
                isOverdue ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {formatDueDate(task.dueDate, translations)}
              </span>
              {isOverdue && <AlertTriangle size={14} className="text-red-500" />}
            </div>
          )}
        </div>
      </div>
      
      <button
        onClick={() => onDelete(task.id)}
        className="text-gray-400 hover:text-red-500 transition-colors duration-200 ml-4"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}