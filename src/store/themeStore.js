import { create } from 'zustand';

const stored = localStorage.getItem('burstday-theme') || 'dark';

const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('burstday-theme', theme);
};

applyTheme(stored);

export const useThemeStore = create((set, get) => ({
  theme: stored,

  toggle: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    set({ theme: next });
  },

  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
}));
