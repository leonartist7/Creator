import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { RichTextEditor } from '../components/Editor/RichTextEditor';
import { ProductIdeator } from '../components/AITools/ProductIdeator';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import api from '../utils/api';
import { Save, Sparkles, FileDown, Settings } from 'lucide-react';

export default function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'ebook' | 'course' | 'guide'>('ebook');
  const [isSaving, setIsSaving] = useState(false);
  const [showAITools, setShowAITools] = useState(false);
  const [activeAITool, setActiveAITool] = useState<'ideator' | 'outline' | 'expand' | null>(null);

  useEffect(() => {
    if (id) {
      loadProject(id);
    }
  }, [id]);

  const loadProject = async (projectId: string) => {
    try {
      const response = await api.get(`/projects/${projectId}`);
      const proj = response.data.data;
      setProject(proj);
      setTitle(proj.title);
      setType(proj.type);
      setContent(proj.content?.html || '');
    } catch (error) {
      console.error('Failed to load project:', error);
    }
  };

  const saveProject = async () => {
    try {
      setIsSaving(true);

      const data = {
        title: title || 'Untitled Project',
        type,
        content: { html: content },
      };

      if (id) {
        await api.put(`/projects/${id}`, data);
      } else {
        const response = await api.post('/projects', data);
        navigate(`/editor/${response.data.data.id}`);
      }
    } catch (error) {
      console.error('Failed to save project:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAIAssist = () => {
    setShowAITools(true);
    setActiveAITool('ideator');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 max-w-2xl">
            <Input
              placeholder="Project Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-semibold border-0 focus:ring-0 px-0"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="mt-2 text-sm border-0 focus:ring-0 text-gray-600 bg-transparent"
            >
              <option value="ebook">Ebook</option>
              <option value="course">Course</option>
              <option value="guide">Guide</option>
              <option value="template">Template</option>
              <option value="workbook">Workbook</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowAITools(true)}
            >
              <Sparkles size={18} className="mr-2" />
              AI Tools
            </Button>

            <Button onClick={saveProject} isLoading={isSaving}>
              <Save size={18} className="mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Editor */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <RichTextEditor
                content={content}
                onChange={setContent}
                onAIAssist={handleAIAssist}
              />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setShowAITools(true);
                    setActiveAITool('ideator');
                  }}
                >
                  <Sparkles size={18} className="mr-2" />
                  Generate Ideas
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {}}
                >
                  <FileDown size={18} className="mr-2" />
                  Export Project
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {}}
                >
                  <Settings size={18} className="mr-2" />
                  Project Settings
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Project Stats</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Words: {content.split(/\s+/).filter(Boolean).length}</p>
                <p>Characters: {content.length}</p>
                <p>Type: {type}</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Tools Modal */}
      <Modal
        isOpen={showAITools}
        onClose={() => setShowAITools(false)}
        title="AI Tools"
        size="xl"
      >
        <div className="space-y-4">
          <div className="flex gap-2 border-b border-gray-200 pb-4">
            <Button
              size="sm"
              variant={activeAITool === 'ideator' ? 'primary' : 'outline'}
              onClick={() => setActiveAITool('ideator')}
            >
              Product Ideator
            </Button>
            <Button
              size="sm"
              variant={activeAITool === 'outline' ? 'primary' : 'outline'}
              onClick={() => setActiveAITool('outline')}
            >
              Outline Generator
            </Button>
            <Button
              size="sm"
              variant={activeAITool === 'expand' ? 'primary' : 'outline'}
              onClick={() => setActiveAITool('expand')}
            >
              Content Expander
            </Button>
          </div>

          {activeAITool === 'ideator' && <ProductIdeator />}
          {activeAITool === 'outline' && (
            <div className="text-center py-8 text-gray-600">
              Outline Generator coming soon...
            </div>
          )}
          {activeAITool === 'expand' && (
            <div className="text-center py-8 text-gray-600">
              Content Expander coming soon...
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
