'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'technical';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('technical');

  useEffect(() => {
    const savedTheme = localStorage.getItem('workengine-theme') as Theme;
    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'technical');
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'technical');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'technical' : 'light';
    setThemeState(newTheme);
    localStorage.setItem('workengine-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'technical');
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('workengine-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'technical');
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
