'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-technical-surface/50 dark:bg-technical-surface border border-technical-border hover:border-technical-accent transition-all duration-300"
      title={`Switch to ${theme === 'light' ? 'Technical' : 'Light'} mode`}
    >
      {theme === 'light' ? (
        <Monitor className="w-5 h-5 text-industrial-accent" />
      ) : (
        <Sun className="w-5 h-5 text-technical-accent" />
      )}
    </button>
  );
}
