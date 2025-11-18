import { Zap } from 'lucide-react';

export interface StylePreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  style: string;
  tone: string;
  gradient: string;
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'blog-casual',
    name: 'Casual Blog',
    description: 'Personal blog with friendly tone',
    icon: '✍️',
    style: 'blog',
    tone: 'casual',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    id: 'business-formal',
    name: 'Business Pro',
    description: 'Professional business writing',
    icon: '💼',
    style: 'professional',
    tone: 'formal',
    gradient: 'from-slate-500/20 to-gray-500/20',
  },
  {
    id: 'marketing-urgent',
    name: 'Sales Pitch',
    description: 'Persuasive with urgency',
    icon: '🚀',
    style: 'persuasive',
    tone: 'urgent',
    gradient: 'from-red-500/20 to-orange-500/20',
  },
  {
    id: 'social-viral',
    name: 'Social Media',
    description: 'Catchy and shareable',
    icon: '🔥',
    style: 'viral',
    tone: 'enthusiastic',
    gradient: 'from-pink-500/20 to-rose-500/20',
  },
  {
    id: 'tutorial-friendly',
    name: 'Tutorial',
    description: 'Educational and approachable',
    icon: '📝',
    style: 'tutorial',
    tone: 'friendly',
    gradient: 'from-green-500/20 to-emerald-500/20',
  },
  {
    id: 'story-playful',
    name: 'Storytelling',
    description: 'Engaging narrative',
    icon: '📖',
    style: 'storytelling',
    tone: 'playful',
    gradient: 'from-purple-500/20 to-indigo-500/20',
  },
  {
    id: 'executive-confident',
    name: 'Executive Brief',
    description: 'Strategic and authoritative',
    icon: '🎯',
    style: 'executive',
    tone: 'confident',
    gradient: 'from-amber-500/20 to-yellow-500/20',
  },
  {
    id: 'inspiration-empathetic',
    name: 'Inspirational',
    description: 'Uplifting and supportive',
    icon: '🌟',
    style: 'inspirational',
    tone: 'empathetic',
    gradient: 'from-teal-500/20 to-cyan-500/20',
  },
  {
    id: 'technical-serious',
    name: 'Technical Doc',
    description: 'Precise and detailed',
    icon: '⚙️',
    style: 'technical',
    tone: 'serious',
    gradient: 'from-gray-500/20 to-zinc-500/20',
  },
  {
    id: 'landing-urgent',
    name: 'Landing Page',
    description: 'Conversion-focused copy',
    icon: '💰',
    style: 'landing',
    tone: 'urgent',
    gradient: 'from-green-500/20 to-lime-500/20',
  },
  {
    id: 'humor-playful',
    name: 'Humorous',
    description: 'Fun and entertaining',
    icon: '😄',
    style: 'humorous',
    tone: 'playful',
    gradient: 'from-yellow-500/20 to-orange-500/20',
  },
  {
    id: 'academic-formal',
    name: 'Academic',
    description: 'Scholarly and research-based',
    icon: '📚',
    style: 'academic',
    tone: 'formal',
    gradient: 'from-indigo-500/20 to-blue-500/20',
  },
];

interface StylePresetsProps {
  onPresetSelect: (preset: StylePreset) => void;
  currentStyle?: string;
  currentTone?: string;
}

export const StylePresets = ({
  onPresetSelect,
  currentStyle,
  currentTone,
}: StylePresetsProps) => {
  const isActive = (preset: StylePreset) =>
    currentStyle === preset.style && currentTone === preset.tone;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-primary">
        <Zap size={16} className="text-purple-500" />
        Quick Presets
        <span className="text-xs text-muted">(Popular Combinations)</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {STYLE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onPresetSelect(preset)}
            className={`p-3 rounded-lg border-2 transition-all text-left ${
              isActive(preset)
                ? 'border-purple-500 glass-strong glow-sm scale-105'
                : 'border-primary/20 glass hover:border-purple-400 hover:scale-102'
            }`}
          >
            <div
              className={`absolute inset-0 rounded-lg bg-gradient-to-br ${preset.gradient} opacity-50 -z-10`}
            />
            <div className="text-2xl mb-1">{preset.icon}</div>
            <div className="font-semibold text-xs text-primary mb-0.5">
              {preset.name}
            </div>
            <div className="text-[10px] text-muted leading-tight line-clamp-2">
              {preset.description}
            </div>
          </button>
        ))}
      </div>

      <div className="text-[10px] text-muted italic text-center pt-1">
        💡 Tip: Select a preset for instant style+tone combination, or customize below
      </div>
    </div>
  );
};
