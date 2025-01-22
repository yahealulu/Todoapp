import React, { useState, useCallback, useEffect } from 'react';
import Confetti from 'react-confetti';
import { ListTodo } from 'lucide-react';
import { TaskForm } from './components/TaskForm';
import { TaskItem } from './components/TaskItem';
import { ProgressStats } from './components/ProgressStats';
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageToggle } from './components/LanguageToggle';
import { translations } from './i18n/translations';
import type { Task, Theme, TaskStats, Language } from './types';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedLanguage = localStorage.getItem('language') as Language;
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
    
    if (savedLanguage) {
      setLanguage(savedLanguage);
      document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
  };

  const t = translations[language];

  const calculateStats = (): TaskStats => {
    const completed = tasks.filter(t => t.completed).length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayCompleted = tasks.filter(t => 
      t.completed && new Date(t.createdAt) >= today
    ).length;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    while (true) {
      const tasksForDay = tasks.filter(t => {
        const taskDate = new Date(t.createdAt);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === currentDate.getTime() && t.completed;
      });

      if (tasksForDay.length === 0) break;
      
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return {
      completed,
      total: tasks.length,
      streak,
      todayCompleted
    };
  };

  const addTask = (data: { title: string; dueDate?: Date; priority: 'low' | 'medium' | 'high' }) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: data.title,
      completed: false,
      createdAt: new Date(),
      dueDate: data.dueDate,
      priority: data.priority,
      category: suggestCategory(data.title),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const completeTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const suggestCategory = (title: string): string => {
    const workKeywords = ['report', 'meeting', 'email', 'project', 'presentation'];
    const personalKeywords = ['gym', 'exercise', 'shopping', 'call', 'read'];
    const homeKeywords = ['clean', 'laundry', 'cook', 'dishes', 'groceries'];

    const lowerTitle = title.toLowerCase();
    
    if (workKeywords.some(keyword => lowerTitle.includes(keyword))) return t.work;
    if (personalKeywords.some(keyword => lowerTitle.includes(keyword))) return t.personal;
    if (homeKeywords.some(keyword => lowerTitle.includes(keyword))) return t.home;
    
    return t.other;
  };

  const stats = calculateStats();

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <LanguageToggle language={language} onToggle={toggleLanguage} />
      
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ListTodo size={40} className="text-blue-500" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{t.taskManager}</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{t.stayOrganized}</p>
        </div>

        <ProgressStats stats={stats} translations={t} />
        <TaskForm onSubmit={addTask} translations={t} />

        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">{t.noTasks}</p>
            </div>
          ) : (
            tasks
              .sort((a, b) => {
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
                if (priorityDiff !== 0) return priorityDiff;
                
                if (a.dueDate && b.dueDate) {
                  return a.dueDate.getTime() - b.dueDate.getTime();
                }
                
                return b.createdAt.getTime() - a.createdAt.getTime();
              })
              .map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onComplete={completeTask}
                  onDelete={deleteTask}
                  translations={t}
                />
              ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;