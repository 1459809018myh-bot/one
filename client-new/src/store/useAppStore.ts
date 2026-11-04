import { create } from 'zustand';
import type { UserSettings } from '@shared/types';

interface AppState {
  // UI状态
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'auto';

  // 用户设置
  settings: UserSettings | null;

  // 操作方法
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setSettings: (settings: UserSettings) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  theme: 'auto',
  settings: null,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setTheme: (theme) => {
    set({ theme });
    // 应用主题
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // auto - 根据系统设置
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  },

  setSettings: (settings) => set({ settings }),
}));
