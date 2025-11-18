import { Card } from '../ui/Card';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Target,
  Zap,
  Award,
  Calendar,
} from 'lucide-react';

interface WritingMetrics {
  totalWords: number;
  wordsThisWeek: number;
  avgWordsPerDay: number;
  totalSessions: number;
  avgSessionDuration: number; // minutes
  longestStreak: number;
  currentStreak: number;
  productivityScore: number; // 0-100
  weeklyTrend: number; // percentage change
}

interface WritingPerformanceMetricsProps {
  metrics?: WritingMetrics;
}

const defaultMetrics: WritingMetrics = {
  totalWords: 45280,
  wordsThisWeek: 8540,
  avgWordsPerDay: 1220,
  totalSessions: 34,
  avgSessionDuration: 42,
  longestStreak: 12,
  currentStreak: 5,
  productivityScore: 78,
  weeklyTrend: 15,
};

export const WritingPerformanceMetrics = ({
  metrics = defaultMetrics,
}: WritingPerformanceMetricsProps) => {
  const getTrendIcon = (trend: number) => {
    if (trend > 0)
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend < 0)
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-blue-500 to-cyan-500';
    if (score >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    return 'Needs Work';
  };

  const performanceCards = [
    {
      label: 'Total Words',
      value: metrics.totalWords.toLocaleString(),
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      subtitle: 'All time',
    },
    {
      label: 'This Week',
      value: metrics.wordsThisWeek.toLocaleString(),
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      subtitle: `${metrics.weeklyTrend > 0 ? '+' : ''}${metrics.weeklyTrend}% vs last week`,
      trend: metrics.weeklyTrend,
    },
    {
      label: 'Daily Average',
      value: metrics.avgWordsPerDay.toLocaleString(),
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      subtitle: 'Words per day',
    },
    {
      label: 'Avg. Session',
      value: `${metrics.avgSessionDuration}m`,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      subtitle: `${metrics.totalSessions} sessions total`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Productivity Score Card */}
      <Card className="p-6 glass-strong border-2 border-primary/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
              <Award className="w-5 h-5" />
              Writing Productivity Score
            </h3>
            <p className="text-sm text-secondary mt-1">
              Based on consistency, output, and engagement
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{metrics.productivityScore}</div>
            <div className="text-xs text-muted">/ 100</div>
          </div>
        </div>

        {/* Score Progress Bar */}
        <div className="relative">
          <div className="h-4 bg-primary/10 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getScoreColor(
                metrics.productivityScore
              )} transition-all duration-500 shadow-lg`}
              style={{ width: `${metrics.productivityScore}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-muted">0</span>
            <span className="text-xs font-medium text-primary">
              {getScoreLabel(metrics.productivityScore)}
            </span>
            <span className="text-xs text-muted">100</span>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{metrics.currentStreak}</div>
            <div className="text-xs text-muted mt-1">Current Streak</div>
            {metrics.currentStreak >= metrics.longestStreak && (
              <div className="text-[10px] text-green-600 mt-1">🔥 New Record!</div>
            )}
          </div>
          <div className="text-center border-l border-r border-primary/20">
            <div className="text-2xl font-bold text-primary">{metrics.longestStreak}</div>
            <div className="text-xs text-muted mt-1">Best Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{metrics.totalSessions}</div>
            <div className="text-xs text-muted mt-1">Total Sessions</div>
          </div>
        </div>
      </Card>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card
              key={index}
              className="p-4 glass hover:glass-strong transition-all hover:scale-105 cursor-default"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                {card.trend !== undefined && getTrendIcon(card.trend)}
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-1">{card.value}</div>
                <div className="text-xs font-medium text-secondary mb-1">{card.label}</div>
                <div className="text-[10px] text-muted">{card.subtitle}</div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Writing Pattern Insights */}
      <Card className="p-5 glass">
        <h4 className="text-sm font-semibold text-primary mb-3">📊 Writing Patterns</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between p-2 rounded glass-strong">
            <span className="text-secondary">Most Productive Time</span>
            <span className="font-medium text-primary">Mornings (8-10 AM)</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded glass-strong">
            <span className="text-secondary">Favorite Writing Day</span>
            <span className="font-medium text-primary">Tuesday</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded glass-strong">
            <span className="text-secondary">Avg. Words per Session</span>
            <span className="font-medium text-primary">
              {Math.round(metrics.totalWords / metrics.totalSessions).toLocaleString()}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};
