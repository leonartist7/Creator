import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import {
  Target,
  CheckCircle,
  Circle,
  Trophy,
  TrendingUp,
  Calendar,
  Zap,
} from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  category: 'words' | 'projects' | 'streak' | 'ai' | 'exports';
  deadline?: string;
  completed: boolean;
  icon: typeof Target;
}

interface MilestonesTrackerProps {
  milestones?: Milestone[];
}

const defaultMilestones: Milestone[] = [
  {
    id: '1',
    title: 'First 50,000 Words',
    description: 'Write your first 50K words',
    target: 50000,
    current: 45280,
    unit: 'words',
    category: 'words',
    deadline: '2025-12-31',
    completed: false,
    icon: Target,
  },
  {
    id: '2',
    title: 'Complete 10 Projects',
    description: 'Finish 10 digital products',
    target: 10,
    current: 8,
    unit: 'projects',
    category: 'projects',
    completed: false,
    icon: CheckCircle,
  },
  {
    id: '3',
    title: '30-Day Writing Streak',
    description: 'Write every day for 30 days',
    target: 30,
    current: 5,
    unit: 'days',
    category: 'streak',
    completed: false,
    icon: Zap,
  },
  {
    id: '4',
    title: 'AI Power User',
    description: 'Use AI tools 100 times',
    target: 100,
    current: 87,
    unit: 'uses',
    category: 'ai',
    completed: false,
    icon: TrendingUp,
  },
  {
    id: '5',
    title: 'Export Your First eBook',
    description: 'Generate your first ePub file',
    target: 1,
    current: 1,
    unit: 'export',
    category: 'exports',
    completed: true,
    icon: Trophy,
  },
];

export const MilestonesTracker = ({
  milestones = defaultMilestones,
}: MilestonesTrackerProps) => {
  const activeMilestones = milestones.filter((m) => !m.completed);
  const completedMilestones = milestones.filter((m) => m.completed);
  const completionRate = Math.round(
    (completedMilestones.length / milestones.length) * 100
  );

  const getCategoryColor = (category: Milestone['category']) => {
    const colors = {
      words: 'from-blue-500 to-cyan-500',
      projects: 'from-purple-500 to-pink-500',
      streak: 'from-orange-500 to-red-500',
      ai: 'from-green-500 to-emerald-500',
      exports: 'from-yellow-500 to-amber-500',
    };
    return colors[category];
  };

  const getCategoryBadgeColor = (category: Milestone['category']) => {
    const colors = {
      words: 'primary' as const,
      projects: 'primary' as const,
      streak: 'warning' as const,
      ai: 'success' as const,
      exports: 'gray' as const,
    };
    return colors[category];
  };

  const getProgress = (milestone: Milestone) => {
    return Math.min((milestone.current / milestone.target) * 100, 100);
  };

  const getDaysUntilDeadline = (deadline?: string) => {
    if (!deadline) return null;
    const days = Math.ceil(
      (new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card className="p-6 glass-strong border-2 border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Your Milestones
            </h3>
            <p className="text-sm text-secondary mt-1">
              {completedMilestones.length} of {milestones.length} completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{completionRate}%</div>
            <div className="text-xs text-muted">Complete</div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="relative">
          <div className="h-3 bg-primary/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 transition-all duration-500 shadow-lg"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-2 rounded glass">
            <div className="text-lg font-bold text-primary">{activeMilestones.length}</div>
            <div className="text-[10px] text-muted">Active</div>
          </div>
          <div className="text-center p-2 rounded glass">
            <div className="text-lg font-bold text-green-600">
              {completedMilestones.length}
            </div>
            <div className="text-[10px] text-muted">Completed</div>
          </div>
          <div className="text-center p-2 rounded glass">
            <div className="text-lg font-bold text-orange-600">
              {activeMilestones.filter((m) => getProgress(m) >= 50).length}
            </div>
            <div className="text-[10px] text-muted">Halfway</div>
          </div>
        </div>
      </Card>

      {/* Active Milestones */}
      {activeMilestones.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Active Milestones
          </h4>
          <div className="space-y-3">
            {activeMilestones.map((milestone) => {
              const Icon = milestone.icon;
              const progress = getProgress(milestone);
              const daysLeft = getDaysUntilDeadline(milestone.deadline);

              return (
                <Card
                  key={milestone.id}
                  className="p-4 glass hover:glass-strong transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getCategoryColor(
                        milestone.category
                      )} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <h5 className="font-semibold text-primary">{milestone.title}</h5>
                          <p className="text-xs text-muted mt-1">{milestone.description}</p>
                        </div>
                        <Badge variant={getCategoryBadgeColor(milestone.category)} size="sm">
                          {milestone.category}
                        </Badge>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-secondary">
                            {milestone.current.toLocaleString()} / {milestone.target.toLocaleString()} {milestone.unit}
                          </span>
                          <span className="font-medium text-primary">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${getCategoryColor(
                              milestone.category
                            )} transition-all duration-500`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Deadline */}
                      {daysLeft !== null && (
                        <div className="flex items-center gap-1 text-xs">
                          <Calendar className="w-3 h-3" />
                          <span
                            className={
                              daysLeft <= 7
                                ? 'text-red-600 font-medium'
                                : daysLeft <= 30
                                ? 'text-orange-600'
                                : 'text-muted'
                            }
                          >
                            {daysLeft > 0
                              ? `${daysLeft} days left`
                              : daysLeft === 0
                              ? 'Due today!'
                              : 'Overdue'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Milestones */}
      {completedMilestones.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Completed ({completedMilestones.length})
          </h4>
          <div className="space-y-2">
            {completedMilestones.map((milestone) => {
              const Icon = milestone.icon;

              return (
                <Card
                  key={milestone.id}
                  className="p-3 glass border-2 border-green-500/20 bg-gradient-to-r from-green-500/5 to-emerald-500/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-primary text-sm">
                        {milestone.title}
                      </h5>
                      <p className="text-xs text-muted">{milestone.description}</p>
                    </div>
                    <Trophy className="w-5 h-5 text-yellow-500" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Motivational Card */}
      <Card className="p-4 glass-strong border-2 border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 btn-gradient rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-primary mb-1">Keep Going!</h4>
            <p className="text-sm text-secondary">
              You're just {50000 - 45280} words away from your next milestone.
              That's only about {Math.ceil((50000 - 45280) / 1220)} more days at your current pace!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
