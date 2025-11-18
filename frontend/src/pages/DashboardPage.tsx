import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { LoadingSkeleton, CardSkeleton } from '../components/ui/LoadingSkeleton';
import { useToast } from '../components/ui/Toast';
import api from '../utils/api';
import {
  Plus,
  BookOpen,
  FileText,
  Sparkles,
  TrendingUp,
  Clock,
  Target,
  Zap,
  Award,
  ChevronRight,
  BarChart3,
  Download,
  Edit3,
  Rocket,
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  type: string;
  status: string;
  updatedAt: string;
  createdAt: string;
}

interface DashboardStats {
  overview: {
    totalProjects: number;
    projectsByStatus: Array<{ status: string; count: number }>;
    recentProjects: Project[];
  };
  aiUsage: {
    totalGenerations: number;
    totalTokensUsed: number;
  };
}

interface QuickAction {
  title: string;
  description: string;
  icon: typeof Plus;
  action: () => void;
  color: string;
  bgColor: string;
}

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  type: 'ebook' | 'course' | 'guide';
  icon: typeof BookOpen;
  color: string;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { error: showError } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [projectsRes, analyticsRes] = await Promise.all([
        api.get('/projects'),
        api.get('/analytics/dashboard'),
      ]);

      setProjects(projectsRes.data.data);
      setStats(analyticsRes.data.data);
    } catch (error) {
      showError('Load Failed', 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions: QuickAction[] = [
    {
      title: 'New Project',
      description: 'Start from scratch',
      icon: Plus,
      action: () => navigate('/editor'),
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
    },
    {
      title: 'AI Tools',
      description: 'Generate content',
      icon: Sparkles,
      action: () => navigate('/editor'),
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-100',
    },
    {
      title: 'Analytics',
      description: 'View insights',
      icon: BarChart3,
      action: () => navigate('/analytics'),
      color: 'text-accent-600',
      bgColor: 'bg-accent-100',
    },
  ];

  const projectTemplates: ProjectTemplate[] = [
    {
      id: 'ebook',
      name: 'eBook',
      description: 'Digital book or guide',
      type: 'ebook',
      icon: BookOpen,
      color: 'primary',
    },
    {
      id: 'course',
      name: 'Online Course',
      description: 'Educational content',
      type: 'course',
      icon: Target,
      color: 'secondary',
    },
    {
      id: 'guide',
      name: 'Guide',
      description: 'How-to or tutorial',
      type: 'guide',
      icon: FileText,
      color: 'accent',
    },
  ];

  const handleCreateFromTemplate = (type: 'ebook' | 'course' | 'guide') => {
    navigate('/editor', { state: { templateType: type } });
  };

  const getStatusCount = (status: string): number => {
    return stats?.overview?.projectsByStatus?.find((s) => s.status === status)?.count || 0;
  };

  const getRecentActivity = () => {
    if (!projects || projects.length === 0) return [];

    return projects
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
      .map((project) => ({
        id: project.id,
        title: project.title,
        action: 'Updated',
        time: new Date(project.updatedAt),
        status: project.status,
      }));
  };

  const getProductivityScore = (): number => {
    if (!stats) return 0;
    const totalProjects = stats.overview.totalProjects;
    const completedProjects = getStatusCount('completed');
    const aiGenerations = stats.aiUsage.totalGenerations;

    // Simple scoring algorithm
    const projectScore = Math.min(totalProjects * 10, 40);
    const completionScore = Math.min(completedProjects * 15, 30);
    const aiScore = Math.min(aiGenerations * 2, 30);

    return Math.min(projectScore + completionScore + aiScore, 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSkeleton height="2.5rem" width="300px" className="mb-2" />
          <LoadingSkeleton height="1.5rem" width="400px" className="mb-8" />
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CardSkeleton />
            </div>
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  const productivityScore = getProductivityScore();
  const recentActivity = getRecentActivity();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's your creative workspace.</p>
          </div>
          <Link to="/editor">
            <Button size="lg" className="shadow-lg">
              <Plus size={20} className="mr-2" />
              New Project
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Projects"
            value={stats?.overview?.totalProjects || 0}
            change={{ value: 12, isPositive: true }}
            icon={BookOpen}
            iconColor="text-primary-600"
            iconBg="bg-primary-100"
          />

          <StatCard
            title="In Progress"
            value={getStatusCount('in_progress')}
            description="Active projects"
            icon={FileText}
            iconColor="text-warning-600"
            iconBg="bg-warning-100"
          />

          <StatCard
            title="Completed"
            value={getStatusCount('completed')}
            change={{ value: 8, isPositive: true }}
            icon={Award}
            iconColor="text-success-600"
            iconBg="bg-success-100"
          />

          <StatCard
            title="AI Generations"
            value={stats?.aiUsage?.totalGenerations || 0}
            description="Content created"
            icon={Sparkles}
            iconColor="text-secondary-600"
            iconBg="bg-secondary-100"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Projects & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Card
                    key={action.title}
                    className="p-5 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-gray-200"
                    onClick={action.action}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg ${action.bgColor} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-6 h-6 ${action.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                        <p className="text-sm text-gray-500">{action.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Recent Projects */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
                  <p className="text-sm text-gray-500">Your latest work</p>
                </div>
                <Link to="/projects">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                  <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                  <p className="text-gray-600 mb-6">Get started by creating your first digital product</p>
                  <Link to="/editor">
                    <Button>
                      <Plus size={18} className="mr-2" />
                      Create Project
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.slice(0, 5).map((project) => (
                    <Link
                      key={project.id}
                      to={`/editor/${project.id}`}
                      className="block p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                              {project.title}
                            </h4>
                            <p className="text-sm text-gray-500 capitalize">{project.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
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
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </Card>

            {/* Recent Activity Timeline */}
            {recentActivity.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                </div>

                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={activity.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <Edit3 className="w-4 h-4 text-primary-600" />
                        </div>
                        {index < recentActivity.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.action} • {activity.time.toLocaleDateString()} at{' '}
                          {activity.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Insights & Templates */}
          <div className="space-y-6">
            {/* Productivity Score */}
            <Card className="p-6 bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Productivity Score</h3>
                  <div className="flex items-end gap-2 mb-3">
                    <span className="text-4xl font-bold text-gray-900">{productivityScore}</span>
                    <span className="text-lg text-gray-600 mb-1">/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className="bg-gradient-to-r from-primary-600 to-secondary-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${productivityScore}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-700">
                    {productivityScore >= 80
                      ? '🎉 Excellent work! You\'re crushing it!'
                      : productivityScore >= 50
                      ? '💪 Great progress! Keep it up!'
                      : '🚀 Get started creating more projects!'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Project Templates */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Rocket className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">Quick Start</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">Choose a template to begin</p>

              <div className="space-y-3">
                {projectTemplates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <button
                      key={template.id}
                      onClick={() => handleCreateFromTemplate(template.type)}
                      className="w-full p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-${template.color}-100 flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 text-${template.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                            {template.name}
                          </h4>
                          <p className="text-sm text-gray-500">{template.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Tips & Insights */}
            <Card className="p-6 bg-gradient-to-br from-secondary-50 to-accent-50 border-secondary-200">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-secondary-600 to-accent-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Pro Tips</h3>
                  <p className="text-sm text-gray-600">Boost your productivity</p>
                </div>
              </div>

              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-secondary-600 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span>Use AI tools to generate outlines and save time</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-secondary-600 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span>Export your projects in multiple formats (PDF, ePub, DOCX)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-secondary-600 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span>Track your progress in the Analytics dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-secondary-600 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span>Save regularly to avoid losing your work</span>
                </li>
              </ul>

              <Link to="/analytics">
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View Full Analytics
                  <ChevronRight size={16} className="ml-2" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
