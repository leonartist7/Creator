import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  Download,
  Settings,
  Search,
  Plus,
  Zap,
  Moon,
  Sun,
  Focus,
  BookOpen,
  GraduationCap,
  FileType,
} from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';
import '../styles/glassmorphism.css';

interface Command {
  id: string;
  title: string;
  shortcut?: string;
  icon: React.ReactNode;
  action: () => void;
  category: 'project' | 'ai' | 'navigation' | 'settings' | 'tools';
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette = ({ isOpen, onClose }: CommandPaletteProps) => {
  const navigate = useNavigate();
  const { toggleFocusMode, toggleZenMode, setTheme, theme } = useSettingsStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: Command[] = [
    // Project Commands
    {
      id: 'new-project',
      title: 'New Project',
      shortcut: '⌘N',
      icon: <Plus size={18} />,
      action: () => {
        navigate('/editor');
        onClose();
      },
      category: 'project',
    },
    {
      id: 'new-ebook',
      title: 'New eBook',
      icon: <BookOpen size={18} />,
      action: () => {
        navigate('/editor?type=ebook');
        onClose();
      },
      category: 'project',
    },
    {
      id: 'new-course',
      title: 'New Course',
      icon: <GraduationCap size={18} />,
      action: () => {
        navigate('/editor?type=course');
        onClose();
      },
      category: 'project',
    },
    {
      id: 'new-guide',
      title: 'New Guide',
      icon: <FileType size={18} />,
      action: () => {
        navigate('/editor?type=guide');
        onClose();
      },
      category: 'project',
    },

    // AI Commands
    {
      id: 'ai-assistant',
      title: 'Open AI Assistant',
      shortcut: '⌘/',
      icon: <Sparkles size={18} />,
      action: () => {
        // Toggle AI panel
        onClose();
      },
      category: 'ai',
    },
    {
      id: 'generate-ideas',
      title: 'Generate Ideas',
      icon: <Zap size={18} />,
      action: () => {
        // Open AI ideas panel
        onClose();
      },
      category: 'ai',
    },

    // Navigation
    {
      id: 'go-dashboard',
      title: 'Go to Dashboard',
      icon: <FileText size={18} />,
      action: () => {
        navigate('/');
        onClose();
      },
      category: 'navigation',
    },
    {
      id: 'go-settings',
      title: 'Open Settings',
      shortcut: '⌘,',
      icon: <Settings size={18} />,
      action: () => {
        navigate('/settings');
        onClose();
      },
      category: 'settings',
    },

    // Tools
    {
      id: 'export',
      title: 'Export Project',
      shortcut: '⌘E',
      icon: <Download size={18} />,
      action: () => {
        // Open export modal
        onClose();
      },
      category: 'tools',
    },
    {
      id: 'focus-mode',
      title: 'Toggle Focus Mode',
      shortcut: '⌘⇧F',
      icon: <Focus size={18} />,
      action: () => {
        toggleFocusMode();
        onClose();
      },
      category: 'tools',
    },
    {
      id: 'zen-mode',
      title: 'Toggle Zen Mode',
      icon: <Moon size={18} />,
      action: () => {
        toggleZenMode();
        onClose();
      },
      category: 'tools',
    },
    {
      id: 'toggle-theme',
      title: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      icon: theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />,
      action: () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
        onClose();
      },
      category: 'settings',
    },
  ];

  const filteredCommands = query
    ? commands.filter(
        (cmd) =>
          cmd.title.toLowerCase().includes(query.toLowerCase()) ||
          cmd.category.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) =>
          i < filteredCommands.length - 1 ? i + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) =>
          i > 0 ? i - 1 : filteredCommands.length - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        filteredCommands[selectedIndex]?.action();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  if (!isOpen) return null;

  const categories = [
    { id: 'project', label: 'Projects' },
    { id: 'ai', label: 'AI Tools' },
    { id: 'navigation', label: 'Navigation' },
    { id: 'tools', label: 'Tools' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Command Palette */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
        <div className="glass-strong w-full max-w-2xl mx-4 rounded-2xl shadow-2xl glow-lg overflow-hidden">
          {/* Search Input */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Search size={20} className="text-white/60" />
              <input
                type="text"
                placeholder="Type a command or search..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder:text-white/40"
                autoFocus
              />
              <kbd className="px-2 py-1 text-xs rounded bg-white/10 text-white/60">
                ESC
              </kbd>
            </div>
          </div>

          {/* Commands List */}
          <div className="max-h-96 overflow-y-auto p-2">
            {categories.map((category) => {
              const categoryCommands = filteredCommands.filter(
                (cmd) => cmd.category === category.id
              );

              if (categoryCommands.length === 0) return null;

              return (
                <div key={category.id} className="mb-4">
                  <div className="px-3 py-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
                    {category.label}
                  </div>
                  <div className="space-y-1">
                    {categoryCommands.map((command, index) => {
                      const globalIndex = filteredCommands.indexOf(command);
                      const isSelected = globalIndex === selectedIndex;

                      return (
                        <button
                          key={command.id}
                          onClick={command.action}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                            isSelected
                              ? 'bg-white/10 glow-sm'
                              : 'hover:bg-white/5'
                          }`}
                        >
                          <div
                            className={`transition-colors ${
                              isSelected
                                ? 'text-purple-400'
                                : 'text-white/60'
                            }`}
                          >
                            {command.icon}
                          </div>
                          <span
                            className={`flex-1 text-left transition-colors ${
                              isSelected ? 'text-white' : 'text-white/80'
                            }`}
                          >
                            {command.title}
                          </span>
                          {command.shortcut && (
                            <kbd className="px-2 py-1 text-xs rounded bg-white/5 text-white/40">
                              {command.shortcut}
                            </kbd>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {filteredCommands.length === 0 && (
              <div className="text-center py-12 text-white/40">
                No commands found
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/5">↑</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-white/5">↓</kbd>
                <span className="ml-1">Navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/5">↵</kbd>
                <span className="ml-1">Select</span>
              </div>
            </div>
            <div>⌘K to open</div>
          </div>
        </div>
      </div>
    </>
  );
};

// Hook for managing command palette
export const useCommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((open) => !open),
  };
};
