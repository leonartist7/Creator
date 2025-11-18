import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  FileType,
  Settings,
  Zap,
  Keyboard,
  X,
} from 'lucide-react';
import '../styles/glassmorphism.css';

interface WelcomeScreenProps {
  onClose: () => void;
}

export const WelcomeScreen = ({ onClose }: WelcomeScreenProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Creator',
      description: 'Your premium personal tool for creating amazing digital products',
      content: (
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center glow-lg">
              <Sparkles size={48} className="text-white" />
            </div>
          </div>
          <div className="space-y-4 text-center">
            <h3 className="text-2xl font-bold text-white">
              Everything you need to create
            </h3>
            <p className="text-white/80 max-w-md mx-auto">
              Create eBooks, courses, guides, and more with the power of AI.
              No login required, all data stored locally.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Powerful Features',
      description: '50+ features to accelerate your content creation',
      content: (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: <Sparkles size={24} />,
              name: '180+ AI Styles',
              description: '18 writing styles × 10 tones',
              gradient: 'from-purple-500 to-pink-500',
            },
            {
              icon: <BookOpen size={24} />,
              name: '5 Pro Templates',
              description: '60,000+ pre-written words',
              gradient: 'from-blue-500 to-cyan-500',
            },
            {
              icon: <FileType size={24} />,
              name: '8 Export Formats',
              description: 'PDF, ePub, DOCX templates',
              gradient: 'from-green-500 to-emerald-500',
            },
            {
              icon: <Zap size={24} />,
              name: 'Quick Command',
              description: 'Ctrl+K for instant actions',
              gradient: 'from-yellow-500 to-orange-500',
            },
            {
              icon: <Keyboard size={24} />,
              name: '26 Shortcuts',
              description: 'Keyboard-driven workflow',
              gradient: 'from-red-500 to-pink-500',
            },
            {
              icon: <GraduationCap size={24} />,
              name: 'Resource Library',
              description: 'Snippets, prompts, templates',
              gradient: 'from-indigo-500 to-purple-500',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="glass p-4 rounded-xl hover:scale-105 transition-all group"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
              >
                <div className="text-white">{feature.icon}</div>
              </div>
              <h4 className="text-white font-semibold mb-1">{feature.name}</h4>
              <p className="text-white/60 text-xs">{feature.description}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Quick Start Templates',
      description: 'Choose a template to get started',
      content: (
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: <BookOpen size={32} />,
              name: 'eBook',
              description: 'Write and publish digital books',
              type: 'ebook',
            },
            {
              icon: <GraduationCap size={32} />,
              name: 'Course',
              description: 'Create online courses',
              type: 'course',
            },
            {
              icon: <FileType size={32} />,
              name: 'Guide',
              description: 'Build comprehensive guides',
              type: 'guide',
            },
          ].map((template) => (
            <button
              key={template.type}
              onClick={() => {
                navigate(`/editor?type=${template.type}`);
                onClose();
              }}
              className="glass p-6 rounded-xl hover:scale-105 transition-all group text-left"
            >
              <div className="text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                {template.icon}
              </div>
              <h4 className="text-white font-semibold mb-1">{template.name}</h4>
              <p className="text-white/60 text-sm">{template.description}</p>
            </button>
          ))}
        </div>
      ),
    },
    {
      title: 'Keyboard Shortcuts',
      description: 'Master these shortcuts for a faster workflow',
      content: (
        <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {[
            { key: '⌘K', action: 'Command Palette' },
            { key: '⌘N', action: 'New Project' },
            { key: '⌘S', action: 'Save' },
            { key: '⌘/', action: 'AI Assistant' },
            { key: '⌘E', action: 'Export' },
            { key: '⌘⇧F', action: 'Focus Mode' },
            { key: '++', action: 'Expand text (in editor)' },
            { key: '>>', action: 'Continue writing (in editor)' },
            { key: '??', action: 'Improve text (in editor)' },
            { key: '//', action: 'Get suggestions (in editor)' },
          ].map((shortcut, i) => (
            <div key={i} className="glass p-4 rounded-lg flex items-center justify-between">
              <span className="text-white/80">{shortcut.action}</span>
              <kbd className="px-3 py-1 bg-white/10 rounded text-white/90 font-mono text-sm">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Configure AI',
      description: 'Add your API keys to unlock AI features',
      content: (
        <div className="space-y-6 max-w-xl mx-auto">
          <div className="glass p-6 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                <Zap size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-2">AI-Powered Features</h4>
                <p className="text-white/70 text-sm mb-4">
                  Get help with brainstorming, writing, editing, and more using
                  OpenAI, Anthropic, or Google AI.
                </p>
                <button
                  onClick={() => {
                    navigate('/settings');
                    onClose();
                  }}
                  className="btn-gradient px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Settings size={18} />
                  Add API Keys
                </button>
              </div>
            </div>
          </div>

          <div className="glass p-4 rounded-lg">
            <p className="text-white/60 text-sm text-center">
              <strong className="text-white">Privacy First:</strong> Your API
              keys are stored locally in your browser and never sent to our
              servers.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-strong w-full max-w-4xl rounded-2xl shadow-2xl glow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{currentStep.title}</h2>
            <p className="text-white/60 mt-1">{currentStep.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={24} className="text-white/60" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">{currentStep.content}</div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex items-center justify-between">
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === step ? 'w-8 bg-purple-500' : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
              >
                Previous
              </button>
            )}

            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="btn-gradient px-6 py-2 rounded-lg"
              >
                Next
              </button>
            ) : (
              <button
                onClick={onClose}
                className="btn-gradient px-6 py-2 rounded-lg"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook to manage welcome screen
export const useWelcomeScreen = () => {
  const [hasSeenWelcome, setHasSeenWelcome] = useState(() => {
    return localStorage.getItem('hasSeenWelcome') === 'true';
  });

  const [isOpen, setIsOpen] = useState(!hasSeenWelcome);

  const close = () => {
    setIsOpen(false);
    setHasSeenWelcome(true);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  const reset = () => {
    setIsOpen(true);
    localStorage.removeItem('hasSeenWelcome');
  };

  return {
    isOpen,
    close,
    reset,
  };
};
