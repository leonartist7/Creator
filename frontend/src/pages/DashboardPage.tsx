import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import api from '../utils/api';
import { Plus, BookOpen, FileText, GraduationCap, Sparkles } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  type: string;
  status: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [projectsRes, analyticsRes] = await Promise.all([
        api.get('/projects'),
        api.get('/analytics/dashboard'),
      ]);

      setProjects(projectsRes.data.data);
      setStats(analyticsRes.data.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening.</p>
          </div>
          <Link to="/editor">
            <Button size="lg">
              <Plus size={20} className="mr-2" />
              New Project
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Projects</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats?.overview?.totalProjects || 0}
                  </p>
                </div>
                <BookOpen className="text-primary-600" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats?.overview?.projectsByStatus?.find((s: any) => s.status === 'in_progress')?.count || 0}
                  </p>
                </div>
                <FileText className="text-accent-600" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats?.overview?.projectsByStatus?.find((s: any) => s.status === 'completed')?.count || 0}
                  </p>
                </div>
                <GraduationCap className="text-green-600" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">AI Generations</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats?.aiUsage?.totalGenerations || 0}
                  </p>
                </div>
                <Sparkles className="text-secondary-600" size={32} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Your latest work and ongoing projects</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first digital product</p>
                <Link to="/editor">
                  <Button>Create Project</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    to={`/editor/${project.id}`}
                    className="block p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{project.title}</h4>
                        <p className="text-sm text-gray-600 capitalize">{project.type}</p>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 capitalize">
                        {project.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
