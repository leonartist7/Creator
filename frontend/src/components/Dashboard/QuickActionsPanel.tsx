import { Card } from '../ui/Card';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  FileText,
  Sparkles,
  BookOpen,
  FileDown,
  BarChart3,
  Lightbulb,
  Copy,
  Rocket,
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: typeof Zap;
  action: () => void;
  color: string;
  gradient: string;
}

interface QuickActionsPanelProps {
  onOpenTemplates?: () => void;
}

export const QuickActionsPanel = ({ onOpenTemplates }: QuickActionsPanelProps) => {
  const navigate = useNavigate();

  const quickActions: QuickAction[] = [
    {
      id: 'new-blank',
      title: 'New Blank Project',
      description: 'Start with a clean slate',
      icon: FileText,
      action: () => navigate('/editor'),
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'templates',
      title: 'Browse Templates',
      description: '5 professional templates',
      icon: Sparkles,
      action: () => onOpenTemplates?.(),
      color: 'text-purple-600',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      id: 'resources',
      title: 'Resource Library',
      description: 'Snippets & prompts',
      icon: BookOpen,
      action: () => navigate('/resources'),
      color: 'text-green-600',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      id: 'ai-tools',
      title: 'AI Writing Tools',
      description: 'Expand, improve, ideate',
      icon: Lightbulb,
      action: () => navigate('/resources?tab=prompts'),
      color: 'text-yellow-600',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      id: 'analytics',
      title: 'View Analytics',
      description: 'Track your progress',
      icon: BarChart3,
      action: () => navigate('/analytics'),
      color: 'text-red-600',
      gradient: 'from-red-500 to-pink-500',
    },
    {
      id: 'snippets',
      title: 'Content Snippets',
      description: 'Reusable content library',
      icon: Copy,
      action: () => navigate('/resources?tab=snippets'),
      color: 'text-indigo-600',
      gradient: 'from-indigo-500 to-purple-500',
    },
  ];

  return (
    <Card className="p-6 glass-strong border-2 border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <Rocket className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-primary">Quick Actions</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.action}
              className="p-4 rounded-lg glass hover:glass-strong hover:scale-105 transition-all text-left group"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-sm text-primary mb-1">{action.title}</h4>
              <p className="text-xs text-muted">{action.description}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-4 p-3 glass rounded-lg">
        <p className="text-xs text-secondary">
          💡 <strong>Pro Tip:</strong> Press{' '}
          <kbd className="px-1.5 py-0.5 text-xs font-mono glass-strong rounded mx-1">Ctrl+K</kbd>
          to open the command palette for even faster access
        </p>
      </div>
    </Card>
  );
};
