import React from 'react';
import { Trophy, Zap, Target } from 'lucide-react';
import type { TaskStats } from '../types';

interface ProgressStatsProps {
  stats: TaskStats;
}

export function ProgressStats({ stats }: ProgressStatsProps) {
  const progress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <Target className="text-blue-500" size={20} />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Progress</h3>
        </div>
        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {stats.completed} of {stats.total} tasks completed
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="text-yellow-500" size={20} />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Today</h3>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {stats.todayCompleted}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">tasks completed today</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="text-orange-500" size={20} />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Streak</h3>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {stats.streak}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">day streak</p>
      </div>
    </div>
  );
}