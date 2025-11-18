import { Card } from '../ui/Card';
import {
  Lightbulb,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Target,
  Clock,
  Zap,
  Trophy,
  Flame,
} from 'lucide-react';

interface Insight {
  id: string;
  type: 'success' | 'tip' | 'warning' | 'achievement';
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon: typeof Lightbulb;
  priority: 'high' | 'medium' | 'low';
}

interface SmartInsightsProps {
  insights?: Insight[];
}

const defaultInsights: Insight[] = [
  {
    id: '1',
    type: 'success',
    title: 'You\'re on fire! 🔥',
    description:
      'Your writing output is 35% higher than last week. You wrote 8,540 words - that\'s incredible progress!',
    icon: Flame,
    priority: 'high',
  },
  {
    id: '2',
    type: 'tip',
    title: 'Peak Performance Time',
    description:
      'You write best between 8-10 AM. Try scheduling your most important writing sessions during this window.',
    icon: Clock,
    priority: 'medium',
  },
  {
    id: '3',
    type: 'achievement',
    title: 'Milestone Alert!',
    description:
      'You\'re only 4,720 words away from 50,000 total words. At your current pace, you\'ll hit it in 4 days!',
    icon: Trophy,
    priority: 'high',
  },
  {
    id: '4',
    type: 'tip',
    title: 'Consistency Opportunity',
    description:
      'You\'ve written for 5 days straight. Keep going for 2 more days to beat your personal record of 7!',
    icon: Target,
    priority: 'medium',
  },
  {
    id: '5',
    type: 'warning',
    title: 'Weekend Writing Drop',
    description:
      'Your writing output drops 60% on weekends. Consider setting a smaller weekend goal to maintain momentum.',
    icon: AlertCircle,
    priority: 'low',
  },
  {
    id: '6',
    type: 'tip',
    title: 'AI Tool Boost',
    description:
      'Projects where you used AI tools were completed 40% faster. Try using Content Expander for your next outline.',
    icon: Sparkles,
    priority: 'medium',
  },
  {
    id: '7',
    type: 'success',
    title: 'Quality Improvement',
    description:
      'Your average session duration increased from 32m to 42m. Longer sessions = deeper focus!',
    icon: TrendingUp,
    priority: 'low',
  },
];

export const SmartInsights = ({ insights = defaultInsights }: SmartInsightsProps) => {
  const getInsightStyle = (type: Insight['type']) => {
    const styles = {
      success: {
        border: 'border-green-500/30',
        bg: 'from-green-500/10 to-emerald-500/10',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
      },
      tip: {
        border: 'border-blue-500/30',
        bg: 'from-blue-500/10 to-cyan-500/10',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
      },
      warning: {
        border: 'border-orange-500/30',
        bg: 'from-orange-500/10 to-yellow-500/10',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
      },
      achievement: {
        border: 'border-purple-500/30',
        bg: 'from-purple-500/10 to-pink-500/10',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
      },
    };
    return styles[type];
  };

  const getPriorityBadge = (priority: Insight['priority']) => {
    const badges = {
      high: (
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">
          High Priority
        </span>
      ),
      medium: (
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-600 font-medium">
          Medium
        </span>
      ),
      low: (
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
          Low Priority
        </span>
      ),
    };
    return badges[priority];
  };

  // Sort by priority
  const sortedInsights = [...insights].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const highPriorityCount = insights.filter((i) => i.priority === 'high').length;
  const achievementCount = insights.filter((i) => i.type === 'achievement').length;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="p-6 glass-strong border-2 border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Smart Insights
            </h3>
            <p className="text-sm text-secondary mt-1">
              AI-powered recommendations based on your writing patterns
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{insights.length}</div>
            <div className="text-xs text-muted">Total insights</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center p-2 rounded glass">
            <div className="text-lg font-bold text-red-600">{highPriorityCount}</div>
            <div className="text-[10px] text-muted">High Priority</div>
          </div>
          <div className="text-center p-2 rounded glass">
            <div className="text-lg font-bold text-purple-600">{achievementCount}</div>
            <div className="text-[10px] text-muted">Achievements</div>
          </div>
          <div className="text-center p-2 rounded glass">
            <div className="text-lg font-bold text-blue-600">
              {insights.filter((i) => i.type === 'tip').length}
            </div>
            <div className="text-[10px] text-muted">Tips</div>
          </div>
        </div>
      </Card>

      {/* Insights List */}
      <div className="space-y-3">
        {sortedInsights.map((insight) => {
          const style = getInsightStyle(insight.type);
          const Icon = insight.icon;

          return (
            <Card
              key={insight.id}
              className={`p-4 border-2 ${style.border} bg-gradient-to-r ${style.bg} hover:scale-[1.01] transition-all`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-lg ${style.iconBg} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className={`w-5 h-5 ${style.iconColor}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-semibold text-primary">{insight.title}</h4>
                    {getPriorityBadge(insight.priority)}
                  </div>
                  <p className="text-sm text-secondary mb-3">{insight.description}</p>

                  {/* Action Button */}
                  {insight.action && (
                    <button
                      onClick={insight.action.onClick}
                      className="text-xs font-medium text-primary hover:text-purple-600 transition-colors flex items-center gap-1"
                    >
                      {insight.action.label}
                      <Zap className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Daily Recommendation */}
      <Card className="p-5 glass-strong border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-500/10">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 btn-gradient rounded-lg flex items-center justify-center animate-pulse">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
              💡 Today's Recommendation
            </h4>
            <p className="text-sm text-secondary mb-3">
              Based on your patterns, the best time for you to write today is{' '}
              <span className="font-medium text-primary">8:00 AM - 10:00 AM</span>. Block this time in your calendar for maximum productivity!
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-lg glass hover:glass-strong text-xs font-medium text-primary transition-all">
                Set Reminder
              </button>
              <button className="px-3 py-1 rounded-lg glass hover:glass-strong text-xs font-medium text-primary transition-all">
                View Schedule
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Progress Prediction */}
      <Card className="p-4 glass">
        <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Projected Progress
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-secondary">Next 7 days</span>
            <span className="font-medium text-primary">~8,540 words</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-secondary">Next 30 days</span>
            <span className="font-medium text-primary">~36,600 words</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-secondary">50K milestone</span>
            <span className="font-medium text-green-600">In ~4 days</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
