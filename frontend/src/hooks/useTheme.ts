import { useEffect } from 'react';
import { useSettingsStore } from '../stores/settingsStore';

export const useTheme = () => {
  const { theme } = useSettingsStore();

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;

    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      // Auto mode - detect system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
    }
  }, [theme]);

  return { theme };
};
