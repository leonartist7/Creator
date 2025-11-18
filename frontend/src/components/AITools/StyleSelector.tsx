import { useState } from 'react';
import {
  WRITING_STYLES,
  WRITING_TONES,
  STYLE_CATEGORIES,
  type WritingStyle,
} from '../../config/writingStyles';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface StyleSelectorProps {
  selectedStyle: string;
  selectedTone: string;
  onStyleChange: (style: string) => void;
  onToneChange: (tone: string) => void;
  showTone?: boolean;
  showCategories?: boolean;
}

export const StyleSelector = ({
  selectedStyle,
  selectedTone,
  onStyleChange,
  onToneChange,
  showTone = true,
  showCategories = true,
}: StyleSelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const filteredStyles =
    selectedCategory === 'all'
      ? WRITING_STYLES
      : WRITING_STYLES.filter((style) => style.category === selectedCategory);

  const selectedStyleObj = WRITING_STYLES.find((s) => s.value === selectedStyle);
  const selectedToneObj = WRITING_TONES.find((t) => t.value === selectedTone);

  return (
    <div className="space-y-4">
      {/* Style Selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-primary">
            <Sparkles size={16} className="inline mr-1" />
            Writing Style
          </label>
          {showCategories && (
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-secondary hover:text-primary transition-colors flex items-center gap-1"
            >
              {showAdvanced ? (
                <>
                  Simple View <ChevronUp size={14} />
                </>
              ) : (
                <>
                  Advanced <ChevronDown size={14} />
                </>
              )}
            </button>
          )}
        </div>

        {showAdvanced && showCategories ? (
          // Advanced View with Categories
          <div className="space-y-3">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'glass text-secondary hover:text-primary'
                }`}
              >
                All Styles
              </button>
              {STYLE_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === cat.value
                      ? 'bg-primary-500 text-white'
                      : 'glass text-secondary hover:text-primary'
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            {/* Style Grid */}
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {filteredStyles.map((style) => (
                <button
                  key={style.value}
                  type="button"
                  onClick={() => onStyleChange(style.value)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    selectedStyle === style.value
                      ? 'border-primary-500 glass-strong glow-sm'
                      : 'border-primary/20 glass hover:border-purple-500'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xl">{style.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-primary truncate">
                        {style.label}
                      </div>
                      <div className="text-xs text-muted line-clamp-2">
                        {style.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Simple Dropdown View
          <select
            value={selectedStyle}
            onChange={(e) => onStyleChange(e.target.value)}
            className="input"
          >
            {WRITING_STYLES.map((style) => (
              <option key={style.value} value={style.value}>
                {style.icon} {style.label}
              </option>
            ))}
          </select>
        )}

        {selectedStyleObj && (
          <div className="mt-2 p-2 glass rounded-lg">
            <p className="text-xs text-secondary">
              <span className="text-xl mr-2">{selectedStyleObj.icon}</span>
              {selectedStyleObj.description}
            </p>
          </div>
        )}
      </div>

      {/* Tone Selection */}
      {showTone && (
        <div>
          <label className="block text-sm font-medium text-primary mb-3">
            Tone
          </label>

          <div className="grid grid-cols-2 gap-2">
            {WRITING_TONES.map((tone) => (
              <button
                key={tone.value}
                type="button"
                onClick={() => onToneChange(tone.value)}
                className={`p-2 rounded-lg border-2 text-left transition-all ${
                  selectedTone === tone.value
                    ? 'border-primary-500 glass-strong'
                    : 'border-primary/20 glass hover:border-purple-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{tone.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-xs text-primary">
                      {tone.label}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {selectedToneObj && (
            <div className="mt-2 p-2 glass rounded-lg">
              <p className="text-xs text-secondary">{selectedToneObj.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
