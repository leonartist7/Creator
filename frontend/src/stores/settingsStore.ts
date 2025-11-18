import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AIProvider = 'openai' | 'anthropic' | 'google';

export type AIModel =
  | 'gpt-4-turbo'
  | 'gpt-3.5-turbo'
  | 'claude-3-opus-20240229'
  | 'claude-3-sonnet-20240229'
  | 'claude-3-haiku-20240307'
  | 'gemini-1.5-pro'
  | 'gemini-pro';

interface APIKeys {
  openai?: string;
  anthropic?: string;
  google?: string;
}

interface Settings {
  // API Configuration
  apiKeys: APIKeys;
  activeProvider: AIProvider;
  selectedModel: AIModel;

  // UI Preferences
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'sm' | 'md' | 'lg';
  editorWidth: 'narrow' | 'medium' | 'wide';
  showLineNumbers: boolean;

  // Writing Preferences
  autoSave: boolean;
  autoSaveInterval: number; // in seconds
  spellCheck: boolean;
  wordGoal: number;

  // Focus Mode
  focusMode: boolean;
  zenMode: boolean;
  ambientSound: 'none' | 'lofi' | 'rain' | 'cafe' | 'nature';

  // Advanced
  enableAnimations: boolean;
  enableGlow: boolean;
  keyboardShortcuts: Record<string, string>;
}

interface SettingsActions {
  // API Keys
  setAPIKey: (provider: AIProvider, key: string) => void;
  removeAPIKey: (provider: AIProvider) => void;
  setActiveProvider: (provider: AIProvider) => void;
  setSelectedModel: (model: AIModel) => void;

  // UI
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;
  setEditorWidth: (width: 'narrow' | 'medium' | 'wide') => void;
  toggleLineNumbers: () => void;

  // Writing
  setAutoSave: (enabled: boolean) => void;
  setAutoSaveInterval: (interval: number) => void;
  setWordGoal: (goal: number) => void;

  // Focus Mode
  toggleFocusMode: () => void;
  toggleZenMode: () => void;
  setAmbientSound: (sound: Settings['ambientSound']) => void;

  // Advanced
  toggleAnimations: () => void;
  toggleGlow: () => void;
  updateShortcut: (action: string, shortcut: string) => void;

  // Utility
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  apiKeys: {},
  activeProvider: 'openai',
  selectedModel: 'gpt-4-turbo',

  theme: 'dark',
  fontSize: 'md',
  editorWidth: 'medium',
  showLineNumbers: false,

  autoSave: true,
  autoSaveInterval: 30,
  spellCheck: true,
  wordGoal: 1000,

  focusMode: false,
  zenMode: false,
  ambientSound: 'none',

  enableAnimations: true,
  enableGlow: true,
  keyboardShortcuts: {
    'newProject': 'mod+n',
    'save': 'mod+s',
    'export': 'mod+e',
    'commandPalette': 'mod+k',
    'aiAssistant': 'mod+/',
    'focusMode': 'mod+shift+f',
    'search': 'mod+f',
  },
};

export const useSettingsStore = create<Settings & SettingsActions>()(
  persist(
    (set) => ({
      ...defaultSettings,

      // API Keys
      setAPIKey: (provider, key) =>
        set((state) => ({
          apiKeys: { ...state.apiKeys, [provider]: key },
        })),

      removeAPIKey: (provider) =>
        set((state) => {
          const { [provider]: _, ...rest } = state.apiKeys;
          return { apiKeys: rest };
        }),

      setActiveProvider: (provider) =>
        set((state) => {
          // Auto-select compatible model when provider changes
          let selectedModel: AIModel = state.selectedModel;
          if (provider === 'openai' && !selectedModel.startsWith('gpt')) {
            selectedModel = 'gpt-4-turbo';
          } else if (provider === 'anthropic' && !selectedModel.startsWith('claude')) {
            selectedModel = 'claude-3-sonnet-20240229';
          } else if (provider === 'google' && !selectedModel.startsWith('gemini')) {
            selectedModel = 'gemini-pro';
          }
          return { activeProvider: provider, selectedModel };
        }),

      setSelectedModel: (model) => set({ selectedModel: model }),

      // UI
      setTheme: (theme) => set({ theme }),

      setFontSize: (size) => set({ fontSize: size }),

      setEditorWidth: (width) => set({ editorWidth: width }),

      toggleLineNumbers: () =>
        set((state) => ({ showLineNumbers: !state.showLineNumbers })),

      // Writing
      setAutoSave: (enabled) => set({ autoSave: enabled }),

      setAutoSaveInterval: (interval) => set({ autoSaveInterval: interval }),

      setWordGoal: (goal) => set({ wordGoal: goal }),

      // Focus Mode
      toggleFocusMode: () =>
        set((state) => ({ focusMode: !state.focusMode })),

      toggleZenMode: () =>
        set((state) => ({ zenMode: !state.zenMode })),

      setAmbientSound: (sound) => set({ ambientSound: sound }),

      // Advanced
      toggleAnimations: () =>
        set((state) => ({ enableAnimations: !state.enableAnimations })),

      toggleGlow: () =>
        set((state) => ({ enableGlow: !state.enableGlow })),

      updateShortcut: (action, shortcut) =>
        set((state) => ({
          keyboardShortcuts: {
            ...state.keyboardShortcuts,
            [action]: shortcut,
          },
        })),

      // Utility
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'creator-settings',
    }
  )
);
