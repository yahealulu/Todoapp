import React from 'react';
import { Languages } from 'lucide-react';
import type { Language } from '../types';

interface LanguageToggleProps {
  language: Language;
  onToggle: () => void;
}

export function LanguageToggle({ language, onToggle }: LanguageToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-4 left-4 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
      aria-label="Toggle language"
    >
      <Languages className="text-blue-500" size={24} />
      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
        {language === 'en' ? 'العربية' : 'English'}
      </span>
    </button>
  );
}