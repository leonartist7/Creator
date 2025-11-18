import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Link } from 'react-router-dom';
import { Clock, FileText, Edit3, MoreVertical, Trash2 } from 'lucide-react';
import type { Project } from '../../lib/storage/db';

interface RecentProjectsWidgetProps {
  projects: Project[];
  onDeleteProject?: (id: string) => void;
}

export const RecentProjectsWidget = ({
  projects,
  onDeleteProject,
}: RecentProjectsWidgetProps) => {
  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'gray',
      in_progress: 'warning',
      completed: 'success',
      published: 'primary',
    };
    return colors[status as keyof typeof colors] || 'gray';
  };

  const getTypeIcon = (type: string) => {
    return '📚'; // Default icon
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  const getWordCount = (content: string) => {
    const text = content.replace(/<[^>]*>/g, '');
    return text.split(/\s+/).filter(Boolean).length;
  };

  if (projects.length === 0) {
    return (
      <Card className="p-8 text-center glass">
        <FileText className="w-12 h-12 text-muted mx-auto mb-3" />
        <h4 className="font-semibold text-primary mb-2">No recent projects</h4>
        <p className="text-sm text-secondary">
          Your recent work will appear here once you start creating
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="p-4 glass hover:glass-strong transition-all group"
        >
          <Link to={`/editor/${project.id}`} className="block">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 text-xl">
                  {getTypeIcon(project.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-primary group-hover:text-purple-400 transition-colors truncate">
                    {project.title || 'Untitled Project'}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={getStatusColor(project.status) as any} size="sm">
                      {project.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-muted">
                      {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Show actions menu
                }}
                className="p-1 hover:bg-white/10 rounded transition-colors opacity-0 group-hover:opacity-100"
              >
                <MoreVertical size={16} className="text-muted" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-xs text-secondary">
                <FileText size={14} className="text-muted" />
                <span>{getWordCount(project.content || '')} words</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-secondary">
                <Clock size={14} className="text-muted" />
                <span>{formatDate(project.updated_at)}</span>
              </div>
            </div>

            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {project.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary"
                  >
                    {tag}
                  </span>
                ))}
                {project.tags.length > 3 && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary">
                    +{project.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-primary/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-semibold text-white">
                  {(project.title || 'U')[0].toUpperCase()}
                </div>
                <span className="text-muted">Last edited {formatDate(project.updated_at)}</span>
              </div>
              <Edit3 size={14} className="text-muted group-hover:text-purple-400 transition-colors" />
            </div>
          </Link>
        </Card>
      ))}
    </div>
  );
};
