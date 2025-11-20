// Keyboard Shortcuts Hook for Knowledge Vault
import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  action: () => void;
  description: string;
  category?: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[], enabled: boolean = true) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger if user is typing in an input/textarea
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      shortcuts.forEach(shortcut => {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const metaMatch = shortcut.meta ? event.metaKey : !event.metaKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault();
          shortcut.action();
        }
      });
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};

// Predefined shortcuts for Knowledge Vault
export const KNOWLEDGE_VAULT_SHORTCUTS: KeyboardShortcut[] = [
  {
    key: 'u',
    ctrl: true,
    action: () => {
      // Upload new masterwork
      const uploadBtn = document.querySelector('[data-action="upload"]') as HTMLElement;
      uploadBtn?.click();
    },
    description: 'Upload new masterwork',
    category: 'General',
  },
  {
    key: 's',
    ctrl: true,
    action: () => {
      // Focus search
      const searchInput = document.querySelector('[data-action="search"]') as HTMLInputElement;
      searchInput?.focus();
    },
    description: 'Focus search',
    category: 'Navigation',
  },
  {
    key: 'k',
    ctrl: true,
    action: () => {
      // Open keyboard shortcuts panel
      const shortcutsPanel = document.querySelector('[data-action="shortcuts"]') as HTMLElement;
      shortcutsPanel?.click();
    },
    description: 'Show keyboard shortcuts',
    category: 'General',
  },
  {
    key: '/',
    action: () => {
      // Quick search
      const searchInput = document.querySelector('[data-action="search"]') as HTMLInputElement;
      searchInput?.focus();
    },
    description: 'Quick search',
    category: 'Navigation',
  },
  {
    key: 'Escape',
    action: () => {
      // Close modal/overlay
      const closeBtn = document.querySelector('[data-action="close"]') as HTMLElement;
      closeBtn?.click();
    },
    description: 'Close modal/dialog',
    category: 'Navigation',
  },
];

export default useKeyboardShortcuts;
