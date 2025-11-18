import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import api from '../utils/api';
import { Plus, Search, Clock } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data.data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">All Projects</h1>
            <p className="text-secondary">Manage and organize your creative projects</p>
          </div>
          <Link to="/editor">
            <Button variant="primary">
              <Plus size={20} className="mr-2" />
              New Project
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted pointer-events-none" size={20} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-glass w-full pl-12 pr-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-xl p-6 h-40 animate-pulse" />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <EmptyState
            variant={searchQuery ? 'search' : 'default'}
            title={searchQuery ? 'No projects found' : 'No projects yet'}
            description={
              searchQuery
                ? 'Try adjusting your search query'
                : 'Start creating your first project to get started'
            }
            action={
              !searchQuery
                ? {
                    label: 'Create Project',
                    onClick: () => (window.location.href = '/editor'),
                  }
                : undefined
            }
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Link key={project.id} to={`/editor/${project.id}`}>
                <Card className="hover:border-purple-500 hover:glow-sm transition-all cursor-pointer h-full">
                  <div className="flex flex-col h-full">
                    <h3 className="font-semibold text-xl text-primary mb-2 line-clamp-2">
                      {project.title || 'Untitled Project'}
                    </h3>
                    <p className="text-sm text-secondary capitalize mb-4 flex-grow">
                      {project.type}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-primary/10">
                      <span className="text-xs px-3 py-1.5 rounded-full glass border border-primary/20 text-primary capitalize font-medium">
                        {project.status}
                      </span>
                      <span className="text-xs text-muted flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
