import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { db, updateWordCount } from '../lib/storage/db';
import type { Project } from '../lib/storage/db';
import {
  Save,
  ChevronRight,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  List,
  Wand2,
  Minimize2,
} from 'lucide-react';

interface Section {
  id: string;
  title: string;
  content: string;
  level: number;
}

type ToneType = 'professional' | 'casual' | 'friendly' | 'formal' | 'persuasive' | 'educational';

export default function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error: showError } = useToast();

  const [project, setProject] = useState<Project | null>(null);
  const [title, setTitle] = useState('');
  const [sections, setSections] = useState<Section[]>([
    { id: 'intro', title: 'Introduction', content: '', level: 1 },
    { id: 'chapter-1', title: 'Chapter 1', content: '', level: 1 },
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('intro');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAIProcessing, setIsAIProcessing] = useState<string | null>(null);
  const [showToneSelector, setShowToneSelector] = useState(false);
  const [selectedSectionForTone, setSelectedSectionForTone] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadProject(id);
    }
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (project && title) {
        saveProjectSilent();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [project, title, sections]);

  const loadProject = async (projectId: string) => {
    try {
      const proj = await db.getProject(projectId);
      if (proj) {
        setProject(proj);
        setTitle(proj.title);
        const parsed = parseContentIntoSections(proj.content?.html || '');
        if (parsed.length > 0) {
          setSections(parsed);
          setActiveSection(parsed[0].id);
        }
      } else {
        showError('Not Found', 'Project not found');
        navigate('/');
      }
    } catch (error) {
      showError('Load Failed', 'Failed to load project');
    }
  };

  const parseContentIntoSections = (html: string): Section[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const headings = doc.querySelectorAll('h1, h2');
    const sections: Section[] = [];

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.substring(1));
      const sectionContent: string[] = [];
      let next = heading.nextSibling;

      while (next && !['H1', 'H2'].includes((next as Element).tagName)) {
        if (next.textContent) {
          sectionContent.push(next.textContent);
        }
        next = next.nextSibling;
      }

      sections.push({
        id: `section-${index}`,
        title: heading.textContent || `Section ${index + 1}`,
        content: sectionContent.join('\n'),
        level,
      });
    });

    return sections;
  };

  const saveProjectSilent = async () => {
    try {
      await saveProjectInternal();
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const saveProject = async () => {
    try {
      setIsSaving(true);
      await saveProjectInternal();
      success('Saved!', 'Project saved successfully');
    } catch (error) {
      showError('Save Failed', 'Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  const saveProjectInternal = async () => {
    if (!project) return;

    const html = sections.map(s => {
      const tag = `h${s.level}`;
      return `<${tag}>${s.title}</${tag}><p>${s.content.replace(/\n/g, '</p><p>')}</p>`;
    }).join('\n');

    const updatedProject = {
      ...project,
      title: title || 'Untitled Project',
      content: {
        html,
        text: sections.map(s => `${s.title}\n${s.content}`).join('\n\n')
      },
    };

    const saved = updateWordCount(updatedProject);
    await db.saveProject(saved);
    setProject(saved);
  };

  const callAI = async (prompt: string): Promise<string | null> => {
    try {
      const response = await fetch('http://localhost:3001/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.content || null;
      }
    } catch (error) {
      console.error('AI call failed:', error);
    }
    return null;
  };

  const handleExpand = async (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section || !section.content.trim()) return;

    setIsAIProcessing(sectionId);
    const prompt = `Expand and elaborate on the following content. Add more details, examples, and explanations while maintaining the original meaning and tone:

${section.content}

Please provide the expanded version with at least 50% more content.`;

    const result = await callAI(prompt);

    if (result) {
      updateSectionContent(sectionId, result);
      success('Expanded!', 'Content has been expanded with AI');
    } else {
      showError('AI Failed', 'Could not expand content');
    }

    setIsAIProcessing(null);
  };

  const handleRephrase = async (sectionId: string, tone?: ToneType) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section || !section.content.trim()) return;

    if (!tone) {
      // Show tone selector
      setSelectedSectionForTone(sectionId);
      setShowToneSelector(true);
      return;
    }

    setIsAIProcessing(sectionId);
    setShowToneSelector(false);

    const toneDescriptions = {
      professional: 'professional and polished',
      casual: 'casual and conversational',
      friendly: 'warm and friendly',
      formal: 'formal and academic',
      persuasive: 'persuasive and compelling',
      educational: 'clear and educational'
    };

    const prompt = `Rephrase the following content in a ${toneDescriptions[tone]} tone. Keep the same information but adjust the writing style:

${section.content}

Provide the rephrased version maintaining the ${tone} tone throughout.`;

    const result = await callAI(prompt);

    if (result) {
      updateSectionContent(sectionId, result);
      success('Rephrased!', `Content rephrased in ${tone} tone`);
    } else {
      showError('AI Failed', 'Could not rephrase content');
    }

    setIsAIProcessing(null);
    setSelectedSectionForTone(null);
  };

  const handleShorten = async (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section || !section.content.trim()) return;

    setIsAIProcessing(sectionId);
    const prompt = `Make the following content more concise while keeping all key information:

${section.content}

Provide a shorter, more direct version.`;

    const result = await callAI(prompt);

    if (result) {
      updateSectionContent(sectionId, result);
      success('Shortened!', 'Content has been condensed');
    } else {
      showError('AI Failed', 'Could not shorten content');
    }

    setIsAIProcessing(null);
  };

  const handleImprove = async (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section || !section.content.trim()) return;

    setIsAIProcessing(sectionId);
    const prompt = `Improve the following content by making it clearer, more engaging, and better structured. Fix any grammar or style issues:

${section.content}

Provide the improved version.`;

    const result = await callAI(prompt);

    if (result) {
      updateSectionContent(sectionId, result);
      success('Improved!', 'Content has been enhanced');
    } else {
      showError('AI Failed', 'Could not improve content');
    }

    setIsAIProcessing(null);
  };

  const updateSectionContent = (sectionId: string, content: string) => {
    setSections(prev => prev.map(s =>
      s.id === sectionId ? { ...s, content } : s
    ));
  };

  const updateSectionTitle = (sectionId: string, newTitle: string) => {
    setSections(prev => prev.map(s =>
      s.id === sectionId ? { ...s, title: newTitle } : s
    ));
  };

  const addSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      content: '',
      level: 1,
    };
    setSections(prev => [...prev, newSection]);
    setActiveSection(newSection.id);
  };

  const deleteSection = (sectionId: string) => {
    if (sections.length === 1) return;
    setSections(prev => prev.filter(s => s.id !== sectionId));
    if (activeSection === sectionId) {
      setActiveSection(sections[0]?.id || '');
    }
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    const index = sections.findIndex(s => s.id === sectionId);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const newSections = [...sections];
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    setSections(newSections);
  };

  const totalWords = sections.reduce((sum, s) => {
    const words = (s.title + ' ' + s.content).trim().split(/\s+/).filter(Boolean);
    return sum + words.length;
  }, 0);

  const tones: { value: ToneType; label: string; description: string }[] = [
    { value: 'professional', label: 'Professional', description: 'Polished and business-appropriate' },
    { value: 'casual', label: 'Casual', description: 'Relaxed and conversational' },
    { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
    { value: 'formal', label: 'Formal', description: 'Academic and structured' },
    { value: 'persuasive', label: 'Persuasive', description: 'Compelling and convincing' },
    { value: 'educational', label: 'Educational', description: 'Clear and informative' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <div className="flex pt-16">
        {/* Sidebar - Outline */}
        {sidebarOpen && (
          <div className="w-64 bg-[#1a1a1a] border-r border-white/10 fixed left-0 top-16 bottom-0 overflow-y-auto z-10">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <List size={18} />
                  Outline
                </h3>
                <button
                  onClick={addSection}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                  title="Add Section"
                >
                  <Plus size={16} className="text-gray-400" />
                </button>
              </div>
              <p className="text-xs text-gray-500">{totalWords.toLocaleString()} words</p>
            </div>

            <div className="pb-4">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-3 border-l-2 transition-all ${activeSection === section.id
                      ? 'bg-purple-500/10 border-purple-500 text-white'
                      : 'border-transparent text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  style={{ paddingLeft: `${section.level + 0.5}rem` }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium truncate text-sm">{section.title}</span>
                    <ChevronRight size={14} className={activeSection === section.id ? 'text-purple-400' : 'text-gray-600'} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Editor Area */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="max-w-4xl mx-auto p-8">
            {/* Header */}
            <div className="mb-8">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Project Title"
                className="text-4xl font-bold bg-transparent border-none outline-none text-white placeholder-gray-600 w-full mb-4"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{sections.length} sections</span>
                  <span>•</span>
                  <span>{totalWords.toLocaleString()} words</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    <List size={16} className="inline mr-2" />
                    {sidebarOpen ? 'Hide' : 'Show'} Outline
                  </button>
                  <Button
                    onClick={saveProject}
                    isLoading={isSaving}
                    className="bg-white text-black hover:bg-gray-200 font-semibold"
                  >
                    <Save size={16} className="mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-6">
              {sections.map((section, index) => {
                const isProcessing = isAIProcessing === section.id;

                return (
                  <div
                    key={section.id}
                    className={`bg-white/5 border border-white/10 rounded-2xl p-6 transition-all ${activeSection === section.id ? 'ring-2 ring-purple-500/50' : ''
                      } ${isProcessing ? 'opacity-75' : ''}`}
                  >
                    {/* Section Header */}
                    <div className="flex items-start justify-between mb-4">
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                        className="text-2xl font-bold bg-transparent border-none outline-none text-white flex-1"
                        placeholder="Section Title"
                        disabled={isProcessing}
                      />

                      <div className="flex gap-1">
                        <button
                          onClick={() => moveSection(section.id, 'up')}
                          disabled={index === 0 || isProcessing}
                          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30"
                          title="Move Up"
                        >
                          <ArrowUp size={16} className="text-gray-400" />
                        </button>
                        <button
                          onClick={() => moveSection(section.id, 'down')}
                          disabled={index === sections.length - 1 || isProcessing}
                          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30"
                          title="Move Down"
                        >
                          <ArrowDown size={16} className="text-gray-400" />
                        </button>
                        <button
                          onClick={() => deleteSection(section.id)}
                          disabled={sections.length === 1 || isProcessing}
                          className="p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors disabled:opacity-30"
                          title="Delete Section"
                        >
                          <Trash2 size={16} className="text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Section Content */}
                    <textarea
                      value={section.content}
                      onChange={(e) => updateSectionContent(section.id, e.target.value)}
                      onClick={() => setActiveSection(section.id)}
                      placeholder="Start writing..."
                      disabled={isProcessing}
                      className="w-full min-h-[200px] bg-transparent border-none outline-none text-white placeholder-gray-600 resize-none text-lg leading-relaxed disabled:opacity-50"
                      style={{ fontFamily: 'inherit' }}
                    />

                    {/* Section Actions */}
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
                      <button
                        onClick={() => handleExpand(section.id)}
                        disabled={isProcessing || !section.content.trim()}
                        className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg text-sm transition-colors disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <Sparkles size={14} className="animate-spin" />
                        ) : (
                          <Sparkles size={14} />
                        )}
                        Expand
                      </button>
                      <button
                        onClick={() => handleRephrase(section.id)}
                        disabled={isProcessing || !section.content.trim()}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg text-sm transition-colors disabled:opacity-50"
                      >
                        <Wand2 size={14} />
                        Rephrase
                      </button>
                      <button
                        onClick={() => handleShorten(section.id)}
                        disabled={isProcessing || !section.content.trim()}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg text-sm transition-colors disabled:opacity-50"
                      >
                        <Minimize2 size={14} />
                        Shorten
                      </button>
                      <button
                        onClick={() => handleImprove(section.id)}
                        disabled={isProcessing || !section.content.trim()}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg text-sm transition-colors disabled:opacity-50"
                      >
                        <Sparkles size={14} />
                        Improve
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Section Button */}
            <button
              onClick={addSection}
              className="w-full py-4 border-2 border-dashed border-white/10 hover:border-purple-500/50 rounded-2xl text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2 mt-6"
            >
              <Plus size={20} />
              Add Section
            </button>
          </div>
        </div>
      </div>

      {/* Tone Selector Modal */}
      {showToneSelector && selectedSectionForTone && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold text-white mb-4">Select Tone</h3>
            <p className="text-gray-400 text-sm mb-6">Choose how you want to rephrase this section</p>

            <div className="grid grid-cols-2 gap-3">
              {tones.map((tone) => (
                <button
                  key={tone.value}
                  onClick={() => handleRephrase(selectedSectionForTone, tone.value)}
                  className="p-4 bg-white/5 hover:bg-purple-500/10 border border-white/10 hover:border-purple-500/50 rounded-xl text-left transition-all"
                >
                  <div className="font-semibold text-white mb-1">{tone.label}</div>
                  <div className="text-xs text-gray-400">{tone.description}</div>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setShowToneSelector(false);
                setSelectedSectionForTone(null);
              }}
              className="mt-6 w-full py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
