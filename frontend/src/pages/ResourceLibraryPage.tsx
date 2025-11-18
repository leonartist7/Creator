import { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { SnippetsManager } from '../components/ContentLibrary/SnippetsManager';
import { PromptTemplatesLibrary } from '../components/AITools/PromptTemplatesLibrary';
import {
  BookOpen,
  Lightbulb,
  Sparkles,
  FileText,
  Zap,
  Target,
} from 'lucide-react';

type TabType = 'snippets' | 'prompts' | 'overview';

export default function ResourceLibraryPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs = [
    {
      id: 'overview' as TabType,
      label: 'Overview',
      icon: BookOpen,
      description: 'Resource hub',
    },
    {
      id: 'snippets' as TabType,
      label: 'Content Snippets',
      icon: FileText,
      description: 'Reusable content',
    },
    {
      id: 'prompts' as TabType,
      label: 'Prompt Templates',
      icon: Lightbulb,
      description: 'AI prompts',
    },
  ];

  const resourceCards = [
    {
      title: 'Content Snippets',
      description: 'Save and reuse your best content pieces - headers, CTAs, intros, and more',
      icon: FileText,
      gradient: 'from-blue-500 to-cyan-500',
      stats: [
        { label: '7 Categories', value: '7' },
        { label: 'Default Snippets', value: '4' },
      ],
      action: () => setActiveTab('snippets'),
    },
    {
      title: 'AI Prompt Templates',
      description: 'Pre-built prompts for common use cases - copy, customize, and generate',
      icon: Lightbulb,
      gradient: 'from-yellow-500 to-orange-500',
      stats: [
        { label: 'Templates', value: '12+' },
        { label: 'Categories', value: '6' },
      ],
      action: () => setActiveTab('prompts'),
    },
    {
      title: 'Writing Styles Guide',
      description: '18 professional writing styles with 10 tone variations for every need',
      icon: Sparkles,
      gradient: 'from-purple-500 to-pink-500',
      stats: [
        { label: 'Styles', value: '18' },
        { label: 'Tones', value: '10' },
      ],
      action: () => {},
    },
    {
      title: 'Export Templates',
      description: '8 professional export templates for PDF, ePub, and DOCX formats',
      icon: Target,
      gradient: 'from-green-500 to-emerald-500',
      stats: [
        { label: 'Templates', value: '8' },
        { label: 'Formats', value: '3' },
      ],
      action: () => {},
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-purple-900/10 dark:to-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Resource Library</h1>
          <p className="text-secondary mt-1">
            Your collection of templates, snippets, and tools
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'glass-strong border-2 border-purple-500 glow-sm'
                    : 'glass hover:glass-strong'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    activeTab === tab.id ? 'text-purple-600' : 'text-muted'
                  }`}
                />
                <div className="text-left">
                  <div
                    className={`font-medium ${
                      activeTab === tab.id ? 'text-primary' : 'text-secondary'
                    }`}
                  >
                    {tab.label}
                  </div>
                  <div className="text-[10px] text-muted">{tab.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Hero Card */}
            <Card className="p-8 glass-strong border-2 border-primary/20 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-500/10">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 btn-gradient rounded-xl flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-primary mb-2">
                    Welcome to Your Resource Library
                  </h2>
                  <p className="text-secondary mb-4">
                    Access powerful tools and templates to accelerate your content creation.
                    From reusable snippets to AI prompts, everything you need is here.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setActiveTab('snippets')}
                      className="px-4 py-2 rounded-lg btn-gradient text-white font-medium hover:scale-105 transition-all"
                    >
                      Browse Snippets
                    </button>
                    <button
                      onClick={() => setActiveTab('prompts')}
                      className="px-4 py-2 rounded-lg glass hover:glass-strong font-medium text-primary transition-all"
                    >
                      Explore Prompts
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Resource Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {resourceCards.map((resource, index) => {
                const Icon = resource.icon;
                return (
                  <Card
                    key={index}
                    className="p-6 glass hover:glass-strong transition-all cursor-pointer hover:scale-[1.02]"
                    onClick={resource.action}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${resource.gradient} flex items-center justify-center`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-primary mb-1">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-secondary">{resource.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {resource.stats.map((stat, idx) => (
                        <div key={idx} className="text-center p-3 rounded glass">
                          <div className="text-xl font-bold text-primary">{stat.value}</div>
                          <div className="text-[10px] text-muted">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Quick Tips Card */}
            <Card className="p-6 glass">
              <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Quick Tips
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <div>
                    <p className="text-sm text-primary font-medium">Save Your Best Work</p>
                    <p className="text-xs text-muted">
                      Create snippets for content you write repeatedly - intros, CTAs, conclusions
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <div>
                    <p className="text-sm text-primary font-medium">Use Prompt Templates</p>
                    <p className="text-xs text-muted">
                      Copy prompt templates and customize the variables for your specific needs
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <div>
                    <p className="text-sm text-primary font-medium">Organize with Tags</p>
                    <p className="text-xs text-muted">
                      Use tags to categorize your snippets and find them instantly
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'snippets' && <SnippetsManager />}
        {activeTab === 'prompts' && <PromptTemplatesLibrary />}
      </div>
    </div>
  );
}
