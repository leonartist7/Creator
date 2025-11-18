import { useState, useEffect } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { PieChart } from '../components/charts/PieChart';
import { LoadingSkeleton, CardSkeleton } from '../components/ui/LoadingSkeleton';
import { useToast } from '../components/ui/Toast';
import api from '../utils/api';
import {
  FileText,
  Sparkles,
  TrendingUp,
  Zap,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Award,
  Target,
  Lightbulb,
} from 'lucide-react';
import { WritingPerformanceMetrics } from '../components/Analytics/WritingPerformanceMetrics';
import { MilestonesTracker } from '../components/Analytics/MilestonesTracker';
import { SmartInsights } from '../components/Analytics/SmartInsights';

interface DashboardData {
  overview: {
    totalProjects: number;
    projectsByStatus: Array<{ status: string; count: number }>;
    recentProjects: any[];
  };
  aiUsage: {
    totalGenerations: number;
    totalTokensUsed: number;
  };
}

export default function AnalyticsPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const { error } = useToast();

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/analytics/dashboard');
      setData(response.data.data);
    } catch (err) {
      error('Load Failed', 'Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  // Process data for charts
  const getProjectStatusData = () => {
    if (!data) return [];
    return data.overview.projectsByStatus.map((item) => ({
      name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
      value: item.count,
    }));
  };

  const getProjectStatusColors = () => [
    '#6366f1', // draft - primary
    '#f59e0b', // in_progress - warning
    '#10b981', // completed - success
    '#8b5cf6', // published - secondary
  ];

  // Mock data for trends (in a real app, this would come from the backend)
  const mockTrendData = [
    { date: 'Week 1', projects: 2, aiGenerations: 15, tokensUsed: 5000 },
    { date: 'Week 2', projects: 5, aiGenerations: 28, tokensUsed: 8500 },
    { date: 'Week 3', projects: 8, aiGenerations: 42, tokensUsed: 12000 },
    { date: 'Week 4', projects: 12, aiGenerations: 56, tokensUsed: 16500 },
  ];

  const mockAIToolsData = [
    { name: 'Product Ideator', count: 45 },
    { name: 'Outline Generator', count: 32 },
    { name: 'Content Expander', count: 28 },
    { name: 'Title Generator', count: 25 },
    { name: 'Sales Copy', count: 18 },
    { name: 'Text Improver', count: 22 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSkeleton height="2rem" width="200px" className="mb-8" />
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Analytics</h1>
            <p className="text-secondary mt-1">Track your productivity and AI usage</p>
          </div>

          {/* Time Range Filter */}
          <div className="flex items-center gap-2 glass rounded-xl p-1">
            {(['7d', '30d', '90d', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === range
                    ? 'btn-gradient text-white'
                    : 'text-secondary hover:text-primary hover:glow-sm'
                }`}
              >
                {range === 'all' ? 'All Time' : range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Projects"
            value={data?.overview.totalProjects || 0}
            change={{ value: 12, isPositive: true }}
            icon={FileText}
            iconColor="text-primary-600"
            iconBg="bg-primary-100"
          />

          <StatCard
            title="AI Generations"
            value={data?.aiUsage.totalGenerations || 0}
            change={{ value: 24, isPositive: true }}
            icon={Sparkles}
            iconColor="text-secondary-600"
            iconBg="bg-secondary-100"
          />

          <StatCard
            title="Tokens Used"
            value={(data?.aiUsage.totalTokensUsed || 0).toLocaleString()}
            description="Across all AI tools"
            icon={Zap}
            iconColor="text-warning-600"
            iconBg="bg-warning-100"
          />

          <StatCard
            title="Avg. per Project"
            value={
              data && data.overview.totalProjects > 0
                ? Math.round(data.aiUsage.totalGenerations / data.overview.totalProjects)
                : 0
            }
            description="AI generations"
            icon={TrendingUp}
            iconColor="text-success-600"
            iconBg="bg-success-100"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Activity Trend */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-primary">Activity Trend</h3>
                <p className="text-sm text-secondary">Projects and AI usage over time</p>
              </div>
              <BarChart3 className="w-5 h-5 text-muted" />
            </div>
            <LineChart
              data={mockTrendData}
              xAxisKey="date"
              dataKeys={[
                { key: 'projects', color: '#6366f1', name: 'Projects' },
                { key: 'aiGenerations', color: '#8b5cf6', name: 'AI Generations' },
              ]}
              height={280}
            />
          </Card>

          {/* Project Status Distribution */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-primary">Project Status</h3>
                <p className="text-sm text-secondary">Distribution by status</p>
              </div>
              <PieChartIcon className="w-5 h-5 text-muted" />
            </div>
            {getProjectStatusData().length > 0 ? (
              <PieChart
                data={getProjectStatusData()}
                colors={getProjectStatusColors()}
                height={280}
              />
            ) : (
              <div className="flex items-center justify-center h-[280px] text-muted">
                No projects yet
              </div>
            )}
          </Card>

          {/* AI Tools Usage */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-primary">AI Tools Usage</h3>
                <p className="text-sm text-secondary">Most used AI generators</p>
              </div>
              <Sparkles className="w-5 h-5 text-muted" />
            </div>
            <BarChart
              data={mockAIToolsData}
              xAxisKey="name"
              dataKeys={[
                { key: 'count', color: '#6366f1', name: 'Uses' },
              ]}
              height={280}
            />
          </Card>

          {/* Token Usage Trend */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-primary">Token Usage</h3>
                <p className="text-sm text-secondary">AI token consumption</p>
              </div>
              <Zap className="w-5 h-5 text-muted" />
            </div>
            <LineChart
              data={mockTrendData}
              xAxisKey="date"
              dataKeys={[
                { key: 'tokensUsed', color: '#f59e0b', name: 'Tokens Used' },
              ]}
              height={280}
            />
          </Card>
        </div>

        {/* Recent Projects */}
        {data && data.overview.recentProjects && data.overview.recentProjects.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-primary">Recent Projects</h3>
                <p className="text-sm text-secondary">Your latest work</p>
              </div>
              <Calendar className="w-5 h-5 text-muted" />
            </div>

            <div className="space-y-4">
              {data.overview.recentProjects.map((project: any) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 rounded-lg glass border border-primary/10 hover:border-purple-500 hover:glow-sm transition-all"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-primary">{project.title}</h4>
                    <p className="text-sm text-secondary mt-1">
                      {project.type.charAt(0).toUpperCase() + project.type.slice(1)} •{' '}
                      Updated {new Date(project.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={
                      project.status === 'published'
                        ? 'success'
                        : project.status === 'completed'
                        ? 'primary'
                        : project.status === 'in_progress'
                        ? 'warning'
                        : 'gray'
                    }
                  >
                    {project.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Insights */}
        <Card className="p-6 mt-6 glass-strong border-2 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 btn-gradient rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-primary mb-2">Productivity Insights</h3>
              <ul className="space-y-2 text-sm text-secondary">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                  You're using AI tools {data?.aiUsage.totalGenerations || 0} times - great for productivity!
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                  Your most productive tool: Outline Generator
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                  {data && data.overview.totalProjects > 5
                    ? '🎉 You\'re building a great portfolio of products!'
                    : 'Tip: Create more projects to unlock deeper insights'}
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Enhanced Analytics Tabs */}
        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          {/* Writing Performance */}
          <div>
            <WritingPerformanceMetrics />
          </div>

          {/* Milestones */}
          <div>
            <MilestonesTracker />
          </div>

          {/* Smart Insights */}
          <div>
            <SmartInsights />
          </div>
        </div>
      </div>
    </div>
  );
}
