import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import api from '../utils/api';
import { Plus, Search } from 'lucide-react';
import { Input } from '../components/ui/Input';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data.data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Projects</h1>
          <Link to="/editor">
            <Button>
              <Plus size={20} className="mr-2" />
              New Project
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link key={project.id} to={`/editor/${project.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{project.title}</h3>
                <p className="text-sm text-gray-600 capitalize mb-4">{project.type}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 capitalize">
                    {project.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
