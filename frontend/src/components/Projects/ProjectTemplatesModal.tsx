import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';
import { PROJECT_TEMPLATES, type ProjectTemplate } from '../../config/projectTemplates';
import {
  Sparkles,
  Clock,
  FileText,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { db } from '../../lib/storage/db';

interface ProjectTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectTemplatesModal = ({ isOpen, onClose }: ProjectTemplatesModalProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const { success } = useToast();

  const handleCreateFromTemplate = async () => {
    if (!selectedTemplate) return;

    setIsCreating(true);

    try {
      // Create new project with template content
      const projectId = crypto.randomUUID();
      const now = new Date();

      const newProject = {
        id: projectId,
        title: selectedTemplate.name.replace(' Template', ''),
        type: selectedTemplate.type as 'ebook' | 'course' | 'guide' | 'template' | 'workbook',
        content: {
          html: selectedTemplate.content,
          text: selectedTemplate.content.replace(/<[^>]*>/g, ''),
        },
        metadata: {
          wordCount: selectedTemplate.wordCount,
          characterCount: selectedTemplate.content.length,
          lastEdited: now,
          created: now,
          tags: [selectedTemplate.difficulty, selectedTemplate.type],
        },
        status: 'draft' as const,
      };

      await db.saveProject(newProject);

      success(
        'Project Created!',
        `Your ${selectedTemplate.name} is ready to customize`
      );

      // Navigate to editor with new project
      navigate(`/editor/${projectId}`);
      onClose();
    } catch (error) {
      console.error('Error creating project from template:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'success',
      intermediate: 'warning',
      advanced: 'secondary',
    };
    return colors[difficulty as keyof typeof colors] || 'gray';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Choose a Template"
      size="xl"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 btn-gradient rounded-2xl flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">
            Start with a Professional Template
          </h3>
          <p className="text-secondary">
            Pre-built structures to help you create faster
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
          {PROJECT_TEMPLATES.map((template) => {
            const isSelected = selectedTemplate?.id === template.id;

            return (
              <Card
                key={template.id}
                className={`p-5 cursor-pointer transition-all hover:scale-[1.02] ${
                  isSelected
                    ? 'glass-strong border-2 border-purple-500 glow-sm'
                    : 'glass hover:glass-strong'
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${template.gradient} flex items-center justify-center text-3xl flex-shrink-0`}
                  >
                    {template.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-primary">{template.name}</h4>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-secondary mb-2">{template.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={getDifficultyColor(template.difficulty) as any} size="sm">
                        {template.difficulty}
                      </Badge>
                      <Badge variant="gray" size="sm">
                        {template.type}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Template Stats */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center gap-2 text-xs">
                    <Clock size={14} className="text-muted" />
                    <span className="text-secondary">{template.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <FileText size={14} className="text-muted" />
                    <span className="text-secondary">{template.wordCount.toLocaleString()} words</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1">
                  {template.features.slice(0, 3).map((feature, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary"
                    >
                      {feature}
                    </span>
                  ))}
                  {template.features.length > 3 && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary">
                      +{template.features.length - 3} more
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Template Preview */}
        {selectedTemplate && (
          <Card className="p-5 glass-strong border-2 border-primary/20">
            <h4 className="font-semibold text-primary mb-3">Template Outline</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {selectedTemplate.outline.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-sm text-secondary py-1"
                >
                  <span className="text-purple-500 font-mono text-xs">
                    {(idx + 1).toString().padStart(2, '0')}.
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-primary/20">
          <button
            onClick={onClose}
            className="text-secondary hover:text-primary transition-colors"
          >
            Start from Scratch
          </button>
          <Button
            onClick={handleCreateFromTemplate}
            disabled={!selectedTemplate || isCreating}
            isLoading={isCreating}
          >
            {isCreating ? (
              'Creating...'
            ) : (
              <>
                Create from Template
                <ArrowRight size={18} className="ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 p-4 glass rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {PROJECT_TEMPLATES.length}
            </div>
            <div className="text-[10px] text-muted">Templates</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {PROJECT_TEMPLATES.filter((t) => t.difficulty === 'beginner').length}
            </div>
            <div className="text-[10px] text-muted">Beginner</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {PROJECT_TEMPLATES.reduce((sum, t) => sum + t.wordCount, 0).toLocaleString()}
            </div>
            <div className="text-[10px] text-muted">Total Words</div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
