import { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Lightbulb,
  Wand2,
  FileText,
  CheckCircle,
  Globe,
  Zap,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import '../styles/glassmorphism.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const FloatingAI = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // TODO: Integrate with actual AI API
    setTimeout(() => {
      const aiResponse: Message = {
        role: 'assistant',
        content: 'This is a placeholder response. Connect your AI API keys in Settings to enable AI features.',
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const quickActions = [
    {
      icon: <Lightbulb size={16} />,
      label: 'Ideas',
      action: () => {
        setInput('Generate content ideas for my project');
      },
    },
    {
      icon: <Wand2 size={16} />,
      label: 'Improve',
      action: () => {
        setInput('Improve the selected text');
      },
    },
    {
      icon: <FileText size={16} />,
      label: 'Expand',
      action: () => {
        setInput('Expand this into more detail');
      },
    },
    {
      icon: <CheckCircle size={16} />,
      label: 'Check',
      action: () => {
        setInput('Check grammar and spelling');
      },
    },
    {
      icon: <Globe size={16} />,
      label: 'Translate',
      action: () => {
        setInput('Translate to...');
      },
    },
    {
      icon: <Zap size={16} />,
      label: 'Outline',
      action: () => {
        setInput('Create an outline for...');
      },
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isExpanded ? (
        // Collapsed - Floating Button
        <button
          onClick={() => setIsExpanded(true)}
          className="w-16 h-16 rounded-full gradient-primary shadow-2xl glow-lg hover:scale-110 transition-transform flex items-center justify-center pulse-glow group"
        >
          <Sparkles className="text-white group-hover:rotate-12 transition-transform" size={28} />
        </button>
      ) : (
        // Expanded - AI Panel
        <div className="glass-strong rounded-2xl shadow-2xl glow-lg w-[400px] h-[600px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">AI Assistant</h3>
                <p className="text-xs text-white/60">Always here to help</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Minimize2 size={18} className="text-white/60" />
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={18} className="text-white/60" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-3 border-b border-white/10">
            <div className="grid grid-cols-3 gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 transition-colors group"
                >
                  <div className="text-white/60 group-hover:text-purple-400 transition-colors">
                    {action.icon}
                  </div>
                  <span className="text-xs text-white/60 group-hover:text-white transition-colors">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-full gradient-primary/20 flex items-center justify-center mb-4">
                  <Sparkles size={32} className="text-purple-400" />
                </div>
                <h4 className="text-white font-medium mb-2">
                  How can I help you create?
                </h4>
                <p className="text-sm text-white/60 max-w-xs">
                  Use quick actions above or chat with me to brainstorm, write,
                  and improve your content.
                </p>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'gradient-primary text-white'
                          : 'bg-white/10 text-white/90'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="btn-gradient px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles size={18} />
              </button>
            </form>
            <p className="text-xs text-white/40 mt-2 text-center">
              Configure AI providers in Settings
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
