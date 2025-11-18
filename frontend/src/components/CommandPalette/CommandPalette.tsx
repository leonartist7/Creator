import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import {
  Search,
  FileText,
  Home,
  BarChart3,
  Settings,
  BookOpen,
  Sparkles,
  FileDown,
  Plus,
  Clock,
  Target,
  Zap,
  Save,
  Copy,
  Moon,
  Sun,
  Command,
} from 'lucide-react';

interface Command {
  id: string;
  title: string;
  subtitle?: string;
  icon: typeof FileText;
  action: () => void;
  keywords: string[];
  category: 'navigation' | 'actions' | 'ai' | 'settings' | 'recent';
  shortcut?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette = ({ isOpen, onClose }: CommandPaletteProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    // Navigation
    {
      id: 'nav-home',
      title: 'Go to Dashboard',
      subtitle: 'View all your projects',
      icon: Home,
      action: () => {
        navigate('/dashboard');
        onClose();
      },
      keywords: ['home', 'dashboard', 'projects'],
      category: 'navigation',
      shortcut: 'G then H',
    },
    {
      id: 'nav-editor',
      title: 'Open Editor',
      subtitle: 'Start writing',
      icon: FileText,
      action: () => {
        navigate('/editor');
        onClose();
      },
      keywords: ['editor', 'write', 'compose', 'new'],
      category: 'navigation',
      shortcut: 'G then E',
    },
    {
      id: 'nav-analytics',
      title: 'View Analytics',
      subtitle: 'Track your progress',
      icon: BarChart3,
      action: () => {
        navigate('/analytics');
        onClose();
      },
      keywords: ['analytics', 'stats', 'metrics', 'insights'],
      category: 'navigation',
      shortcut: 'G then A',
    },
    {
      id: 'nav-settings',
      title: 'Open Settings',
      subtitle: 'Configure your preferences',
      icon: Settings,
      action: () => {
        navigate('/settings');
        onClose();
      },
      keywords: ['settings', 'preferences', 'config'],
      category: 'navigation',
      shortcut: 'G then S',
    },

    // Actions
    {
      id: 'action-new-project',
      title: 'Create New Project',
      subtitle: 'Start a fresh project',
      icon: Plus,
      action: () => {
        navigate('/editor');
        onClose();
      },
      keywords: ['new', 'create', 'project', 'start'],
      category: 'actions',
      shortcut: 'Ctrl+N',
    },
    {
      id: 'action-save',
      title: 'Save Current Work',
      subtitle: 'Save your progress',
      icon: Save,
      action: () => {
        // Trigger save action
        const event = new KeyboardEvent('keydown', {
          key: 's',
          ctrlKey: true,
          bubbles: true,
        });
        document.dispatchEvent(event);
        onClose();
      },
      keywords: ['save', 'backup'],
      category: 'actions',
      shortcut: 'Ctrl+S',
    },
    {
      id: 'action-export',
      title: 'Export Project',
      subtitle: 'Download as PDF, ePub, or DOCX',
      icon: FileDown,
      action: () => {
        // Open export modal
        onClose();
      },
      keywords: ['export', 'download', 'pdf', 'epub'],
      category: 'actions',
      shortcut: 'Ctrl+E',
    },

    // AI Tools
    {
      id: 'ai-expand',
      title: 'Content Expander',
      subtitle: 'Expand bullet points into full content',
      icon: Sparkles,
      action: () => {
        navigate('/ai-tools/content-expander');
        onClose();
      },
      keywords: ['ai', 'expand', 'content', 'generate'],
      category: 'ai',
    },
    {
      id: 'ai-improve',
      title: 'Text Improver',
      subtitle: 'Enhance and polish your writing',
      icon: Zap,
      action: () => {
        navigate('/ai-tools/text-improver');
        onClose();
      },
      keywords: ['ai', 'improve', 'enhance', 'edit'],
      category: 'ai',
    },
    {
      id: 'ai-title',
      title: 'Title Generator',
      subtitle: 'Create catchy titles',
      icon: Target,
      action: () => {
        navigate('/ai-tools/title-generator');
        onClose();
      },
      keywords: ['ai', 'title', 'headline', 'generate'],
      category: 'ai',
    },
    {
      id: 'ai-outline',
      title: 'Outline Generator',
      subtitle: 'Structure your content',
      icon: BookOpen,
      action: () => {
        navigate('/ai-tools/outline-generator');
        onClose();
      },
      keywords: ['ai', 'outline', 'structure', 'plan'],
      category: 'ai',
    },

    // Recent/Quick Access
    {
      id: 'recent-continue',
      title: 'Continue Last Project',
      subtitle: 'Pick up where you left off',
      icon: Clock,
      action: () => {
        // Load most recent project
        navigate('/editor');
        onClose();
      },
      keywords: ['recent', 'continue', 'last', 'resume'],
      category: 'recent',
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    [cmd.title, cmd.subtitle || '', ...cmd.keywords].some((text) =>
      text.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);

  const allFilteredCommands = filteredCommands;

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < allFilteredCommands.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : allFilteredCommands.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allFilteredCommands[selectedIndex]) {
        allFilteredCommands[selectedIndex].action();
      }
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      navigation: 'Navigation',
      actions: 'Actions',
      ai: 'AI Tools',
      settings: 'Settings',
      recent: 'Recent',
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      navigation: Home,
      actions: Zap,
      ai: Sparkles,
      settings: Settings,
      recent: Clock,
    };
    const Icon = icons[category as keyof typeof icons] || Command;
    return Icon;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="md"
      showCloseButton={false}
    >
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
            className="pl-12 py-3 text-lg"
            autoComplete="off"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="px-2 py-1 text-xs glass rounded">↑</kbd>
            <kbd className="px-2 py-1 text-xs glass rounded">↓</kbd>
            <kbd className="px-2 py-1 text-xs glass rounded">⏎</kbd>
          </div>
        </div>

        {/* Commands List */}
        <div className="max-h-[400px] overflow-y-auto space-y-3">
          {Object.entries(groupedCommands).map(([category, cmds]) => {
            const CategoryIcon = getCategoryIcon(category);
            return (
              <div key={category}>
                <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted uppercase tracking-wide">
                  <CategoryIcon className="w-3 h-3" />
                  {getCategoryLabel(category)}
                </div>
                <div className="space-y-1">
                  {cmds.map((cmd, idx) => {
                    const globalIndex = allFilteredCommands.indexOf(cmd);
                    const isSelected = globalIndex === selectedIndex;
                    const Icon = cmd.icon;

                    return (
                      <button
                        key={cmd.id}
                        onClick={() => {
                          cmd.action();
                        }}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all ${
                          isSelected
                            ? 'glass-strong border-2 border-purple-500'
                            : 'glass hover:glass-strong'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isSelected ? 'btn-gradient' : 'bg-primary/10'
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 ${
                              isSelected ? 'text-white' : 'text-primary'
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-primary">{cmd.title}</div>
                          {cmd.subtitle && (
                            <div className="text-xs text-muted">{cmd.subtitle}</div>
                          )}
                        </div>
                        {cmd.shortcut && (
                          <div className="flex items-center gap-1">
                            {cmd.shortcut.split(' ').map((key, i) => (
                              <kbd
                                key={i}
                                className="px-2 py-1 text-xs glass rounded font-mono"
                              >
                                {key}
                              </kbd>
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {filteredCommands.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-muted mx-auto mb-3" />
            <p className="text-secondary">No commands found</p>
            <p className="text-xs text-muted mt-1">Try a different search term</p>
          </div>
        )}

        {/* Footer Hint */}
        <div className="pt-3 border-t border-primary/20 text-xs text-muted text-center">
          <kbd className="px-2 py-1 glass rounded">Ctrl+K</kbd> to open •{' '}
          <kbd className="px-2 py-1 glass rounded">Esc</kbd> to close •{' '}
          <kbd className="px-2 py-1 glass rounded">↑↓</kbd> to navigate •{' '}
          <kbd className="px-2 py-1 glass rounded">⏎</kbd> to select
        </div>
      </div>
    </Modal>
  );
};

// Global keyboard listener hook
export const useCommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { isOpen, setIsOpen };
};
