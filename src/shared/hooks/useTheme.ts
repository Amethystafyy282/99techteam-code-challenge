import { useState } from 'react';
import { THEME_STORAGE_KEY, type Theme } from '../constants/theme';

const getAppliedTheme = (): Theme => (document.documentElement.classList.contains('dark') ? 'dark' : 'light');

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(getAppliedTheme);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    setTheme(nextTheme);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {}
  };

  return { theme, toggleTheme };
};
