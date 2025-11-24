import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../components/ui/Toast';
import { CreateProjectModal } from '../components/Projects/CreateProjectModal';
import { db } from '../lib/storage/db';
import type { Project } from '../lib/storage/db';
import {
  Plus,
  FileText,
  ChevronRight,
} from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-8">
            <div className="h-8 w-48 bg-white/5 rounded mb-2 animate-pulse" />
            <div className="h-4 w-96 bg-white/5 rounded animate-pulse" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Simple Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400 text-lg">Your creative workspace</p>
          </div>
          <Button
            size="lg"
            onClick={() => setShowTemplatesModal(true)}
            className="bg-white text-black hover:bg-gray-200 font-semibold px-6 py-3 rounded-xl transition-all active:scale-95"
          >
            <Plus size={20} className="mr-2" />
            New Project
          </Button>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-white/10 rounded-2xl">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No projects yet</h3>
            <p className="text-gray-400 mb-6">Create your first digital product to get started</p>
            <Button
              onClick={() => setShowTemplatesModal(true)}
              className="bg-white text-black hover:bg-gray-200 font-semibold"
            >
              <Plus size={18} className="mr-2" />
              Create Project
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/editor/${project.id}`}
                className="group block bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-2xl p-6 transition-all hover:shadow-lg hover:shadow-purple-500/10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-400 capitalize">
                      {project.type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    {project.metadata.wordCount.toLocaleString()} words
                  </span>
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
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {new Date(project.metadata.lastEdited).toLocaleDateString()}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-purple-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showTemplatesModal}
        onClose={() => setShowTemplatesModal(false)}
      />
    </div>
  );
}
