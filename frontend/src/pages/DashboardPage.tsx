import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSkeleton, CardSkeleton } from '../components/ui/LoadingSkeleton';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';
import { db } from '../lib/storage/db';
import type { Project } from '../lib/storage/db';
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
  Edit3,
  Rocket,
  GraduationCap,
  FileType,
} from 'lucide-react';
import '../styles/glassmorphism.css';

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
  const [isLoading, setIsLoading] = useState(true);
  const { error: showError } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const allProjects = await db.getAllProjects();
      setProjects(allProjects);
    } catch (error) {
      showError('Load Failed', 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const projectTemplates: ProjectTemplate[] = [
    {
      id: 'ebook',
      name: 'eBook',
      description: 'Digital book or comprehensive guide',
      type: 'ebook',
      icon: BookOpen,
      color: 'primary',
    },
    {
      id: 'course',
      name: 'Online Course',
      description: 'Step-by-step educational content',
      type: 'course',
      icon: GraduationCap,
      color: 'secondary',
    },
    {
      id: 'guide',
      name: 'How-To Guide',
      description: 'Practical tutorials and instructions',
      type: 'guide',
      icon: FileType,
      color: 'accent',
    },
  ];

  const handleCreateFromTemplate = (type: 'ebook' | 'course' | 'guide') => {
    navigate(`/editor?type=${type}`);
  };

  const getStatusCount = (status: string): number => {
    return projects.filter((p) => p.status === status).length;
  };

  const getRecentActivity = () => {
    return projects
      .sort((a, b) => new Date(b.metadata.lastEdited).getTime() - new Date(a.metadata.lastEdited).getTime())
      .slice(0, 5)
      .map((project) => ({
        id: project.id,
        title: project.title,
        action: 'Updated',
        time: new Date(project.metadata.lastEdited),
        status: project.status,
      }));
  };

  const getProductivityScore = (): number => {
    const totalProjects = projects.length;
    const completedProjects = getStatusCount('completed');
    const totalWords = projects.reduce((sum, p) => sum + p.metadata.wordCount, 0);

    const projectScore = Math.min(totalProjects * 10, 40);
    const completionScore = Math.min(completedProjects * 15, 30);
    const wordScore = Math.min(Math.floor(totalWords / 1000) * 2, 30);

    return Math.min(projectScore + completionScore + wordScore, 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
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
        </div>
      </div>
    );
  }

  const productivityScore = getProductivityScore();
  const recentActivity = getRecentActivity();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Dashboard</h1>
            <p className="text-secondary">Welcome back! Here's your creative workspace.</p>
          </div>
          <Link to="/editor">
            <Button size="lg" className="btn-gradient shadow-lg glow">
              <Plus size={20} className="mr-2" />
              New Project
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-strong p-6 hover:glow-sm transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary mb-1">Total Projects</p>
                <p className="text-3xl font-bold text-primary">{projects.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center">
                <BookOpen className="text-primary-400" size={24} />
              </div>
            </div>
          </Card>

          <Card className="glass-strong p-6 hover:glow-sm transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary mb-1">In Progress</p>
                <p className="text-3xl font-bold text-primary">{getStatusCount('in_progress')}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-warning-500/20 flex items-center justify-center">
                <FileText className="text-warning-400" size={24} />
              </div>
            </div>
          </Card>

          <Card className="glass-strong p-6 hover:glow-sm transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary mb-1">Completed</p>
                <p className="text-3xl font-bold text-primary">{getStatusCount('completed')}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-success-500/20 flex items-center justify-center">
                <Award className="text-success-400" size={24} />
              </div>
            </div>
          </Card>

          <Card className="glass-strong p-6 hover:glow-sm transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary mb-1">Total Words</p>
                <p className="text-3xl font-bold text-primary">
                  {projects.reduce((sum, p) => sum + p.metadata.wordCount, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary-500/20 flex items-center justify-center">
                <Sparkles className="text-secondary-400" size={24} />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Projects & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Projects */}
            <Card className="glass-strong p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-primary">Recent Projects</h3>
                  <p className="text-sm text-secondary">Your latest work</p>
                </div>
                <Link to="/projects">
                  <Button variant="outline" size="sm" className="glass">
                    View All
                  </Button>
                </Link>
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-primary/20 rounded-lg">
                  <BookOpen size={48} className="text-muted mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-primary mb-2">No projects yet</h3>
                  <p className="text-secondary mb-6">Get started by creating your first digital product</p>
                  <Link to="/editor">
                    <Button className="btn-gradient">
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
                      className="block p-4 rounded-lg glass hover:glass-strong hover:glow-sm transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-primary group-hover:text-purple-300 transition-colors truncate">
                              {project.title}
                            </h4>
                            <p className="text-sm text-secondary capitalize">
                              {project.type} • {project.metadata.wordCount.toLocaleString()} words
                            </p>
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
                            {project.status.replace('_', ' ')}
                          </Badge>
                          <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-purple-400 transition-colors" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </Card>

            {/* Recent Activity Timeline */}
            {recentActivity.length > 0 && (
              <Card className="glass-strong p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="w-5 h-5 text-secondary" />
                  <h3 className="text-lg font-semibold text-primary">Recent Activity</h3>
                </div>

                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={activity.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <Edit3 className="w-4 h-4 text-purple-400" />
                        </div>
                        {index < recentActivity.length - 1 && (
                          <div className="w-0.5 h-full bg-white/10 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-medium text-primary">{activity.title}</p>
                        <p className="text-xs text-secondary mt-1">
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
            <Card className="glass-strong p-6 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border-primary-500/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-primary mb-2">Productivity Score</h3>
                  <div className="flex items-end gap-2 mb-3">
                    <span className="text-4xl font-bold text-primary">{productivityScore}</span>
                    <span className="text-lg text-secondary mb-1">/100</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 mb-3">
                    <div
                      className="bg-gradient-to-r from-primary-400 to-secondary-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${productivityScore}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-secondary">
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
            <Card className="glass-strong p-6">
              <div className="flex items-center gap-2 mb-4">
                <Rocket className="w-5 h-5 text-secondary" />
                <h3 className="text-lg font-semibold text-primary">Quick Start</h3>
              </div>
              <p className="text-sm text-secondary mb-4">Choose a template to begin</p>

              <div className="space-y-3">
                {projectTemplates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <button
                      key={template.id}
                      onClick={() => handleCreateFromTemplate(template.type)}
                      className="w-full p-4 rounded-lg glass hover:glass-strong hover:glow-sm transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-${template.color}-500/20 flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 text-${template.color}-400`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-primary group-hover:text-purple-300 transition-colors">
                            {template.name}
                          </h4>
                          <p className="text-sm text-secondary">{template.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-purple-400 transition-colors" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Tips & Insights */}
            <Card className="glass-strong p-6 bg-gradient-to-br from-secondary-500/10 to-accent-500/10 border-secondary-500/20">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-secondary-600 to-accent-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-1">Pro Tips</h3>
                  <p className="text-sm text-secondary">Boost your productivity</p>
                </div>
              </div>

              <ul className="space-y-3 text-sm text-secondary">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-secondary-400 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span>Use ⌘K command palette for quick navigation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-secondary-400 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span>Type ++ in editor to expand text with AI</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-secondary-400 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span>Enable Focus Mode for distraction-free writing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-secondary-400 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span>Projects auto-save every 30 seconds</span>
                </li>
              </ul>

              <Link to="/analytics">
                <Button variant="outline" size="sm" className="w-full mt-4 glass">
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
