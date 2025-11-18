import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Card } from '../ui/Card';
import {
  Keyboard,
  Command,
  FileText,
  Save,
  Copy,
  Search,
  Zap,
  Eye,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface KeyboardShortcut {
  keys: string[];
  description: string;
  category: 'general' | 'editor' | 'formatting' | 'ai' | 'navigation';
}

interface KeyboardShortcutsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts: KeyboardShortcut[] = [
  // General
  {
    keys: ['Ctrl', 'K'],
    description: 'Open Command Palette',
    category: 'general',
  },
  {
    keys: ['Ctrl', 'S'],
    description: 'Save current work',
    category: 'general',
  },
  {
    keys: ['Ctrl', 'N'],
    description: 'Create new project',
    category: 'general',
  },
  {
    keys: ['Ctrl', 'E'],
    description: 'Export project',
    category: 'general',
  },
  {
    keys: ['Ctrl', '/'],
    description: 'Toggle Focus Mode',
    category: 'general',
  },
  {
    keys: ['?'],
    description: 'Show this shortcuts panel',
    category: 'general',
  },

  // Navigation
  {
    keys: ['G', 'H'],
    description: 'Go to Dashboard',
    category: 'navigation',
  },
  {
    keys: ['G', 'E'],
    description: 'Go to Editor',
    category: 'navigation',
  },
  {
    keys: ['G', 'A'],
    description: 'Go to Analytics',
    category: 'navigation',
  },
  {
    keys: ['G', 'R'],
    description: 'Go to Resources',
    category: 'navigation',
  },
  {
    keys: ['G', 'S'],
    description: 'Go to Settings',
    category: 'navigation',
  },

  // Editor
  {
    keys: ['Ctrl', 'B'],
    description: 'Bold text',
    category: 'formatting',
  },
  {
    keys: ['Ctrl', 'I'],
    description: 'Italic text',
    category: 'formatting',
  },
  {
    keys: ['Ctrl', 'U'],
    description: 'Underline text',
    category: 'formatting',
  },
  {
    keys: ['Ctrl', 'Z'],
    description: 'Undo',
    category: 'editor',
  },
  {
    keys: ['Ctrl', 'Y'],
    description: 'Redo',
    category: 'editor',
  },
  {
    keys: ['Ctrl', 'F'],
    description: 'Find in page',
    category: 'editor',
  },

  // AI Tools
  {
    keys: ['Ctrl', 'Shift', 'A'],
    description: 'Open AI Assistant',
    category: 'ai',
  },
  {
    keys: ['++'],
    description: 'AI Continue Writing',
    category: 'ai',
  },
  {
    keys: ['>>'],
    description: 'AI Expand Content',
    category: 'ai',
  },
  {
    keys: ['??'],
    description: 'AI Improve Text',
    category: 'ai',
  },
  {
    keys: ['//'],
    description: 'AI Suggest Ideas',
    category: 'ai',
  },
  {
    keys: ['@@'],
    description: 'AI Research Topic',
    category: 'ai',
  },
];

const categories = [
  { id: 'general', label: 'General', icon: Command, color: 'blue' },
  { id: 'navigation', label: 'Navigation', icon: Zap, color: 'purple' },
  { id: 'editor', label: 'Editor', icon: FileText, color: 'green' },
  { id: 'formatting', label: 'Formatting', icon: Sparkles, color: 'pink' },
  { id: 'ai', label: 'AI Tools', icon: Sparkles, color: 'yellow' },
];

export const KeyboardShortcutsPanel = ({ isOpen, onClose }: KeyboardShortcutsPanelProps) => {
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) acc[shortcut.category] = [];
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="lg"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 btn-gradient rounded-2xl flex items-center justify-center">
            <Keyboard className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">Keyboard Shortcuts</h2>
          <p className="text-secondary">
            Master these shortcuts to boost your productivity
          </p>
        </div>

        {/* Platform Info */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted">
          <Command size={12} />
          <span>On Mac, use ⌘ (Cmd) instead of Ctrl</span>
        </div>

        {/* Shortcuts by Category */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {categories.map((category) => {
            const categoryShortcuts = groupedShortcuts[category.id];
            if (!categoryShortcuts || categoryShortcuts.length === 0) return null;

            const Icon = category.icon;

            return (
              <Card key={category.id} className="p-4 glass">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-lg bg-${category.color}-100 flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 text-${category.color}-600`} />
                  </div>
                  <h3 className="font-semibold text-primary">{category.label}</h3>
                </div>

                <div className="space-y-2">
                  {categoryShortcuts.map((shortcut, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 px-3 rounded glass-strong hover:scale-[1.01] transition-all"
                    >
                      <span className="text-sm text-secondary">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIdx) => (
                          <span key={keyIdx} className="flex items-center gap-1">
                            <kbd className="px-2 py-1 text-xs font-mono glass-strong rounded border border-primary/20 text-primary">
                              {key}
                            </kbd>
                            {keyIdx < shortcut.keys.length - 1 && (
                              <span className="text-muted text-xs">+</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Footer Tip */}
        <div className="glass-strong rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-1">Pro Tip</h4>
              <p className="text-sm text-secondary">
                Press <kbd className="px-2 py-0.5 text-xs font-mono glass-strong rounded mx-1">?</kbd>
                anytime to show this shortcuts panel. Press
                <kbd className="px-2 py-0.5 text-xs font-mono glass-strong rounded mx-1">Ctrl</kbd>+
                <kbd className="px-2 py-0.5 text-xs font-mono glass-strong rounded mx-1">K</kbd>
                to open the Command Palette and search for any action.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Reference Card */}
        <div className="grid grid-cols-3 gap-3 p-4 glass rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">{shortcuts.length}</div>
            <div className="text-[10px] text-muted">Total Shortcuts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">{categories.length}</div>
            <div className="text-[10px] text-muted">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {shortcuts.filter((s) => s.category === 'ai').length}
            </div>
            <div className="text-[10px] text-muted">AI Shortcuts</div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg glass hover:glass-strong text-primary font-medium transition-all"
          >
            Got it! (Press Esc to close)
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Hook for showing shortcuts panel with ? key
export const useKeyboardShortcuts = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
        // Only trigger if not in an input/textarea
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !target.isContentEditable) {
          e.preventDefault();
          setIsOpen(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { isOpen, setIsOpen };
};
