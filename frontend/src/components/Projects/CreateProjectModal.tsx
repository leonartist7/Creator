import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { PROJECT_TEMPLATES, type ProjectTemplate } from '../../config/projectTemplates';
import {
    BookOpen,
    Brain,
    FileText,
    ArrowRight,
    ArrowLeft,
    CheckCircle,
    Sparkles,
    Lightbulb,
} from 'lucide-react';
import { db } from '../../lib/storage/db';

interface Masterwork {
    id: string;
    title: string;
    author: string | null;
    format: string;
    word_count: number;
    analysis_status: string;
}

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type TabType = 'templates' | 'vault' | 'blank';
type StepType = 'select' | 'customize';

export const CreateProjectModal = ({ isOpen, onClose }: CreateProjectModalProps) => {
    const [step, setStep] = useState<StepType>('select');
    const [activeTab, setActiveTab] = useState<TabType>('templates');
    const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
    const [selectedMasterwork, setSelectedMasterwork] = useState<Masterwork | null>(null);
    const [masterworks, setMasterworks] = useState<Masterwork[]>([]);
    const [isCreating, setIsCreating] = useState(false);

    // AI Customization fields
    const [projectTopic, setProjectTopic] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [projectGoal, setProjectGoal] = useState('');
    const [additionalContext, setAdditionalContext] = useState('');

    const navigate = useNavigate();
    const { success, error: showError } = useToast();

    useEffect(() => {
        if (isOpen && activeTab === 'vault') {
            fetchMasterworks();
        }
    }, [isOpen, activeTab]);

    useEffect(() => {
        if (!isOpen) {
            // Reset on close
            setStep('select');
            setSelectedTemplate(null);
            setSelectedMasterwork(null);
            setProjectTopic('');
            setTargetAudience('');
            setProjectGoal('');
            setAdditionalContext('');
        }
    }, [isOpen]);

    const fetchMasterworks = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/masterworks');
            if (response.ok) {
                const data = await response.json();
                setMasterworks(data.filter((m: Masterwork) => m.analysis_status === 'completed'));
            }
        } catch (error) {
            console.error('Failed to fetch masterworks:', error);
        }
    };

    const handleNext = () => {
        if (activeTab === 'blank') {
            // Blank projects skip customization
            handleCreate();
        } else {
            setStep('customize');
        }
    };

    const handleBack = () => {
        setStep('select');
    };

    const generateAIContent = async () => {
        // Build prompt for AI
        const prompt = `Create an outline and introduction for a ${selectedTemplate?.type || 'ebook'} with the following details:

Topic: ${projectTopic}
Target Audience: ${targetAudience}
Primary Goal: ${projectGoal}
${additionalContext ? `Additional Context: ${additionalContext}` : ''}

Please generate:
1. A compelling title
2. An outline with 5-7 main sections
3. A brief introduction paragraph

Format as HTML with h1 for title, h2 for sections, and p tags for content.`;

        try {
            const response = await fetch('http://localhost:3001/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            if (response.ok) {
                const data = await response.json();
                return data.content || selectedTemplate?.content || '<h1>Introduction</h1><p>Start writing...</p>';
            }
        } catch (error) {
            console.error('AI generation failed:', error);
        }

        // Fallback to template content
        return selectedTemplate?.content || '<h1>Introduction</h1><p>Start writing...</p>';
    };

    const handleCreate = async () => {
        setIsCreating(true);

        try {
            const projectId = crypto.randomUUID();
            const now = new Date();

            let newProject;
            let generatedContent = '';

            if (step === 'customize' && (projectTopic || targetAudience || projectGoal)) {
                // Use AI to generate customized content
                generatedContent = await generateAIContent();
            }

            if (activeTab === 'templates' && selectedTemplate) {
                // Create from template with AI customization
                const content = generatedContent || selectedTemplate.content;
                const title = projectTopic || selectedTemplate.name.replace(' Template', '');

                newProject = {
                    id: projectId,
                    title,
                    type: selectedTemplate.type as 'ebook' | 'course' | 'guide',
                    content: {
                        html: content,
                        text: content.replace(/<[^>]*>/g, ''),
                    },
                    metadata: {
                        wordCount: content.split(/\s+/).length,
                        characterCount: content.length,
                        lastEdited: now,
                        created: now,
                        tags: [selectedTemplate.type, targetAudience || 'general'].filter(Boolean),
                    },
                    status: 'draft' as const,
                };
            } else if (activeTab === 'vault' && selectedMasterwork) {
                // Create inspired by masterwork
                newProject = {
                    id: projectId,
                    title: projectTopic || `New Project inspired by ${selectedMasterwork.title}`,
                    type: 'ebook' as const,
                    content: {
                        html: generatedContent || '<h1>Introduction</h1><p>Start writing your content here...</p>',
                        text: 'Introduction\nStart writing your content here...',
                    },
                    metadata: {
                        wordCount: 0,
                        characterCount: 0,
                        lastEdited: now,
                        created: now,
                        tags: ['inspired-by', selectedMasterwork.title],
                        sourceMasterworkId: selectedMasterwork.id,
                    },
                    status: 'draft' as const,
                };
            } else {
                // Create blank
                newProject = {
                    id: projectId,
                    title: projectTopic || 'Untitled Project',
                    type: 'ebook' as const,
                    content: {
                        html: '<h1>Chapter 1</h1><p>Start writing...</p>',
                        text: 'Chapter 1\nStart writing...',
                    },
                    metadata: {
                        wordCount: 0,
                        characterCount: 0,
                        lastEdited: now,
                        created: now,
                        tags: [],
                    },
                    status: 'draft' as const,
                };
            }

            await db.saveProject(newProject);

            success('Project Created!', 'Your AI-customized project is ready');
            navigate(`/editor/${projectId}`);
            onClose();
        } catch (error) {
            console.error('Error creating project:', error);
            showError('Creation Failed', 'Failed to create project');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={step === 'select' ? 'Create New Project' : 'Customize Your Project'} size="xl">
            <div className="space-y-6">
                {step === 'select' && (
                    <>
                        {/* Tabs */}
                        <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
                            <button
                                onClick={() => setActiveTab('templates')}
                                className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'templates'
                                        ? 'bg-white text-black'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <BookOpen size={18} className="inline mr-2" />
                                Templates
                            </button>
                            <button
                                onClick={() => setActiveTab('vault')}
                                className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'vault'
                                        ? 'bg-white text-black'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <Brain size={18} className="inline mr-2" />
                                Knowledge Vault
                            </button>
                            <button
                                onClick={() => setActiveTab('blank')}
                                className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'blank'
                                        ? 'bg-white text-black'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <FileText size={18} className="inline mr-2" />
                                Blank
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="min-h-[400px]">
                            {/* Templates Tab */}
                            {activeTab === 'templates' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Lightbulb className="w-4 h-4 text-yellow-500" />
                                        <p className="text-gray-400">Select a template, then customize it with AI</p>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
                                        {PROJECT_TEMPLATES.map((template) => {
                                            const isSelected = selectedTemplate?.id === template.id;
                                            return (
                                                <div
                                                    key={template.id}
                                                    onClick={() => setSelectedTemplate(template)}
                                                    className={`p-4 rounded-xl cursor-pointer transition-all ${isSelected
                                                            ? 'bg-purple-500/20 border-2 border-purple-500'
                                                            : 'bg-white/5 border-2 border-white/10 hover:border-purple-500/50'
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${template.gradient} flex items-center justify-center text-2xl`}>
                                                                {template.icon}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-white">{template.name}</h4>
                                                                <p className="text-xs text-gray-400">{template.description}</p>
                                                            </div>
                                                        </div>
                                                        {isSelected && <CheckCircle className="w-5 h-5 text-purple-400" />}
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        {template.wordCount.toLocaleString()} words • {template.estimatedTime}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Knowledge Vault Tab */}
                            {activeTab === 'vault' && (
                                <div className="space-y-4">
                                    <p className="text-gray-400 text-sm">
                                        Create with AI using style DNA from your masterworks
                                    </p>
                                    {masterworks.length === 0 ? (
                                        <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-xl">
                                            <Brain className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                            <p className="text-gray-400">No analyzed masterworks yet</p>
                                            <p className="text-sm text-gray-500 mt-2">Upload documents in Knowledge Vault first</p>
                                        </div>
                                    ) : (
                                        <div className="grid md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
                                            {masterworks.map((work) => {
                                                const isSelected = selectedMasterwork?.id === work.id;
                                                return (
                                                    <div
                                                        key={work.id}
                                                        onClick={() => setSelectedMasterwork(work)}
                                                        className={`p-4 rounded-xl cursor-pointer transition-all ${isSelected
                                                                ? 'bg-purple-500/20 border-2 border-purple-500'
                                                                : 'bg-white/5 border-2 border-white/10 hover:border-purple-500/50'
                                                            }`}
                                                    >
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div>
                                                                <h4 className="font-semibold text-white line-clamp-1">{work.title}</h4>
                                                                <p className="text-xs text-gray-400">
                                                                    {work.author || 'Unknown'} • {work.format}
                                                                </p>
                                                            </div>
                                                            {isSelected && <CheckCircle className="w-5 h-5 text-purple-400" />}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-3">
                                                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                                                            <span className="text-xs text-gray-400">Style DNA analyzed</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Blank Tab */}
                            {activeTab === 'blank' && (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                                        <FileText className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Start from Scratch</h3>
                                    <p className="text-gray-400 text-center max-w-md">
                                        Create a blank project and build your content from the ground up
                                    </p>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {step === 'customize' && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                            <Sparkles className="w-6 h-6 text-purple-400" />
                            <div>
                                <h4 className="font-semibold text-white">AI-Powered Customization</h4>
                                <p className="text-sm text-gray-400">Answer a few questions to generate personalized content</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    What's your project about? *
                                </label>
                                <input
                                    type="text"
                                    value={projectTopic}
                                    onChange={(e) => setProjectTopic(e.target.value)}
                                    placeholder="e.g., Beginner's Guide to Digital Marketing"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Who is your target audience?
                                </label>
                                <input
                                    type="text"
                                    value={targetAudience}
                                    onChange={(e) => setTargetAudience(e.target.value)}
                                    placeholder="e.g., Small business owners, Beginners, Professionals"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    What's the main goal?
                                </label>
                                <input
                                    type="text"
                                    value={projectGoal}
                                    onChange={(e) => setProjectGoal(e.target.value)}
                                    placeholder="e.g., Teach fundamentals, Provide actionable strategies"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Additional context (optional)
                                </label>
                                <textarea
                                    value={additionalContext}
                                    onChange={(e) => setAdditionalContext(e.target.value)}
                                    placeholder="Any specific requirements, tone, style, or topics to cover..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    {step === 'customize' ? (
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={18} />
                            Back
                        </button>
                    ) : (
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                    )}

                    <Button
                        onClick={step === 'select' ? handleNext : handleCreate}
                        disabled={
                            isCreating ||
                            (step === 'select' && activeTab === 'templates' && !selectedTemplate) ||
                            (step === 'select' && activeTab === 'vault' && !selectedMasterwork) ||
                            (step === 'customize' && !projectTopic.trim())
                        }
                        isLoading={isCreating}
                        className="bg-white text-black hover:bg-gray-200 font-semibold"
                    >
                        {isCreating ? (
                            'Creating...'
                        ) : step === 'customize' ? (
                            <>
                                <Sparkles size={18} className="mr-2" />
                                Generate with AI
                            </>
                        ) : (
                            <>
                                {activeTab === 'blank' ? 'Create Project' : 'Next: Customize'}
                                <ArrowRight size={18} className="ml-2" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
