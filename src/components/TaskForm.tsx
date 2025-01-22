import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, Calendar, Tag } from 'lucide-react';

const schema = z.object({
  title: z.string().min(1, 'Task title is required').max(100, 'Task title is too long'),
  dueDate: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

type FormData = z.infer<typeof schema>;

interface TaskFormProps {
  onSubmit: (data: { title: string; dueDate?: Date; priority: 'low' | 'medium' | 'high' }) => void;
}

const suggestCategory = (title: string): string => {
  const workKeywords = ['report', 'meeting', 'email', 'project', 'presentation'];
  const personalKeywords = ['gym', 'exercise', 'shopping', 'call', 'read'];
  const homeKeywords = ['clean', 'laundry', 'cook', 'dishes', 'groceries'];

  const lowerTitle = title.toLowerCase();
  
  if (workKeywords.some(keyword => lowerTitle.includes(keyword))) return 'Work';
  if (personalKeywords.some(keyword => lowerTitle.includes(keyword))) return 'Personal';
  if (homeKeywords.some(keyword => lowerTitle.includes(keyword))) return 'Home';
  
  return 'Other';
};

export function TaskForm({ onSubmit }: TaskFormProps) {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      priority: 'medium'
    }
  });

  const onFormSubmit = handleSubmit((data) => {
    onSubmit({
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    });
    reset();
  });

  const title = watch('title');
  const suggestedCategory = title ? suggestCategory(title) : '';

  return (
    <form onSubmit={onFormSubmit} className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="space-y-4">
        <div>
          <input
            {...register('title')}
            placeholder="Add a new task..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
          )}
          {suggestedCategory && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Tag size={14} /> Suggested category: {suggestedCategory}
            </p>
          )}
        </div>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
              <Calendar size={16} />
              <label htmlFor="dueDate" className="text-sm">Due Date</label>
            </div>
            <input
              type="datetime-local"
              {...register('dueDate')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <div className="flex-1">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Priority</label>
            <select
              {...register('priority')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <PlusCircle size={20} />
          Add Task
        </button>
      </div>
    </form>
  );
}