import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { RichTextEditor } from '../components/Editor/RichTextEditor';
import { FocusMode } from '../components/FocusMode';
import { ExportModal } from '../components/Export/ExportModal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useToast } from '../components/ui/Toast';
import { useAI } from '../hooks/useAI';
import { useSettingsStore } from '../stores/settingsStore';
import { db, createProject, updateWordCount } from '../lib/storage/db';
import type { Project } from '../lib/storage/db';
import {
  Save,
  Sparkles,
  FileDown,
  Focus,
  Clock,
  BarChart3,
} from 'lucide-react';
import '../styles/glassmorphism.css';

export default function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { success, error: showError } = useToast();
  const ai = useAI();
  const { focusMode, toggleFocusMode } = useSettingsStore();

  const [project, setProject] = useState<Project | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<Project['type']>('ebook');
  const [isSaving, setIsSaving] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [isAIProcessing, setIsAIProcessing] = useState(false);

  useEffect(() => {
    const templateType = searchParams.get('type') as Project['type'];
    if (templateType) {
      setType(templateType);
    }
  }, [searchParams]);

  useEffect(() => {
    if (id) {
      loadProject(id);
    }
  }, [id]);

  useEffect(() => {
    // Auto-save
    const interval = setInterval(() => {
      if (project && title && content) {
        saveProjectSilent();
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [project, title, content]);

  useEffect(() => {
    // Update word count
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  }, [content]);

  const loadProject = async (projectId: string) => {
    try {
      const proj = await db.getProject(projectId);
      if (proj) {
        setProject(proj);
        setTitle(proj.title);
        setType(proj.type);
        setContent(proj.content?.html || '');
      } else {
        showError('Not Found', 'Project not found');
        navigate('/');
      }
    } catch (error) {
      showError('Load Failed', 'Failed to load project');
    }
  };

  const saveProjectSilent = async () => {
    try {
      let updatedProject: Project;

      if (project) {
        updatedProject = {
          ...project,
          title: title || 'Untitled Project',
          content: { html: content, text: content.replace(/<[^>]*>/g, '') },
        };
      } else {
        updatedProject = createProject(title || 'Untitled Project', type);
        updatedProject.content = {
          html: content,
          text: content.replace(/<[^>]*>/g, ''),
        };
      }

      updatedProject = updateWordCount(updatedProject);
      await db.saveProject(updatedProject);

      if (!project) {
        setProject(updatedProject);
        navigate(`/editor/${updatedProject.id}`, { replace: true });
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const saveProject = async () => {
    try {
      setIsSaving(true);

      let updatedProject: Project;

      if (project) {
        updatedProject = {
          ...project,
          title: title || 'Untitled Project',
          content: { html: content, text: content.replace(/<[^>]*>/g, '') },
        };
      } else {
        updatedProject = createProject(title || 'Untitled Project', type);
        updatedProject.content = {
          html: content,
          text: content.replace(/<[^>]*>/g, ''),
        };
      }

      updatedProject = updateWordCount(updatedProject);
      await db.saveProject(updatedProject);

      if (!project) {
        setProject(updatedProject);
        navigate(`/editor/${updatedProject.id}`, { replace: true });
        success('Created!', 'Project created successfully');
      } else {
        success('Saved!', 'Project saved successfully');
      }
    } catch (error) {
      showError('Save Failed', 'Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInlineAI = async (trigger: string, selectedText: string) => {
    if (isAIProcessing) return;

    setIsAIProcessing(true);
    try {
      let result;

      switch (trigger) {
        case 'expand':
          result = await ai.expand(selectedText);
          break;
        case 'continue':
          result = await ai.continue(selectedText);
          break;
        case 'improve':
          result = await ai.improve(selectedText);
          break;
        case 'suggest':
          result = await ai.suggest(selectedText);
          break;
        case 'research':
          result = await ai.research(selectedText);
          break;
        default:
          return;
      }

      if (result.success && result.text) {
        // Insert AI-generated text into editor
        setContent((prev) => prev + '\n\n' + result.text);
        success('AI Generated!', `Content ${trigger}ed successfully`);
      } else {
        showError('AI Failed', result.error || 'Failed to generate content');
      }
    } catch (error) {
      showError('AI Error', 'An error occurred while processing');
    } finally {
      setIsAIProcessing(false);
    }
  };

  return (
    <>
      {focusMode ? (
        <FocusMode
          isActive={focusMode}
          onClose={toggleFocusMode}
          currentWordCount={wordCount}
        />
      ) : (
        <div className="min-h-screen">
          <Navbar />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 max-w-2xl">
                <Input
                  placeholder="Project Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-2xl font-semibold border-0 focus:ring-0 px-0 bg-transparent text-white"
                />
                <div className="flex items-center gap-4 mt-2">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="text-sm border-0 focus:ring-0 text-white/60 bg-transparent"
                  >
                    <option value="ebook">Ebook</option>
                    <option value="course">Course</option>
                    <option value="guide">Guide</option>
                    <option value="template">Template</option>
                    <option value="workbook">Workbook</option>
                  </select>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Clock size={16} />
                    <span>{wordCount.toLocaleString()} words</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={toggleFocusMode}
                  className="glass hover:glow-sm"
                >
                  <Focus size={18} className="mr-2" />
                  Focus Mode
                </Button>

                <Button
                  onClick={saveProject}
                  isLoading={isSaving}
                  className="btn-gradient"
                >
                  <Save size={18} className="mr-2" />
                  Save
                </Button>
              </div>
            </div>

            {/* Editor */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="glass-strong p-6">
                  <RichTextEditor
                    content={content}
                    onChange={setContent}
                    onAIAssist={() => {}}
                    onAITrigger={handleInlineAI}
                  />
                </Card>

                {/* AI Trigger Hints */}
                <div className="glass mt-4 p-4 rounded-xl">
                  <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <Sparkles size={16} className={isAIProcessing ? 'text-purple-400 animate-spin' : 'text-purple-400'} />
                    {isAIProcessing ? 'AI Processing...' : 'AI Triggers'}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                    <div className="flex items-center gap-1 text-white/60">
                      <code className="px-1 py-0.5 bg-purple-500/20 rounded text-purple-400">
                        ++
                      </code>
                      <span>Expand</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/60">
                      <code className="px-1 py-0.5 bg-purple-500/20 rounded text-purple-400">
                        &gt;&gt;
                      </code>
                      <span>Continue</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/60">
                      <code className="px-1 py-0.5 bg-purple-500/20 rounded text-purple-400">
                        ??
                      </code>
                      <span>Improve</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/60">
                      <code className="px-1 py-0.5 bg-purple-500/20 rounded text-purple-400">
                        //
                      </code>
                      <span>Suggest</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/60">
                      <code className="px-1 py-0.5 bg-purple-500/20 rounded text-purple-400">
                        @@
                      </code>
                      <span>Research</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card className="glass-strong p-6">
                  <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start glass hover:glow-sm"
                      onClick={() => setShowExportModal(true)}
                    >
                      <FileDown size={18} className="mr-2" />
                      Export Project
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start glass hover:glow-sm"
                      onClick={() => navigate('/analytics')}
                    >
                      <BarChart3 size={18} className="mr-2" />
                      View Analytics
                    </Button>
                  </div>
                </Card>

                <Card className="glass-strong p-6">
                  <h3 className="font-semibold text-white mb-2">Project Stats</h3>
                  <div className="text-sm text-white/60 space-y-1">
                    <p>Words: {wordCount.toLocaleString()}</p>
                    <p>Characters: {content.replace(/<[^>]*>/g, '').length.toLocaleString()}</p>
                    <p>Type: {type}</p>
                    {project && (
                      <p className="text-xs mt-2 pt-2 border-t border-white/10">
                        Last saved: {new Date(project.metadata.lastEdited).toLocaleString()}
                      </p>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Export Modal */}
          <ExportModal
            isOpen={showExportModal}
            onClose={() => setShowExportModal(false)}
            projectId={project?.id || ''}
            projectTitle={title}
          />
        </div>
      )}
    </>
  );
}
