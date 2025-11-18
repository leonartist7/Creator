import { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import {
  Key,
  Palette,
  Keyboard as KeyboardIcon,
  Zap,
  Volume2,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import { useToast } from '../components/ui/Toast';
import '../styles/glassmorphism.css';

export default function SettingsPage() {
  const settings = useSettingsStore();
  const { success, error: showError } = useToast();

  const [activeTab, setActiveTab] = useState<'api' | 'ui' | 'writing' | 'shortcuts'>('api');
  const [showKeys, setShowKeys] = useState(false);

  // API Keys state
  const [openaiKey, setOpenaiKey] = useState(settings.apiKeys.openai || '');
  const [anthropicKey, setAnthropicKey] = useState(settings.apiKeys.anthropic || '');
  const [googleKey, setGoogleKey] = useState(settings.apiKeys.google || '');

  const handleSaveAPIKeys = () => {
    if (openaiKey) settings.setAPIKey('openai', openaiKey);
    if (anthropicKey) settings.setAPIKey('anthropic', anthropicKey);
    if (googleKey) settings.setAPIKey('google', googleKey);

    success('Saved!', 'API keys saved successfully');
  };

  const tabs = [
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'ui', label: 'Appearance', icon: Palette },
    { id: 'writing', label: 'Writing', icon: Zap },
    { id: 'shortcuts', label: 'Shortcuts', icon: KeyboardIcon },
  ] as const;

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Settings</h1>
          <p className="text-white/60">
            Customize your workspace and configure AI providers
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'glass glow-sm'
                    : 'bg-white/5 hover:bg-white/10 text-white/60'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="glass-strong p-6 rounded-2xl">
          {/* API Keys Tab */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  AI Provider API Keys
                </h2>
                <p className="text-white/60 text-sm">
                  Your API keys are stored locally and never sent to our servers
                </p>
              </div>

              {/* OpenAI */}
              <div className="glass p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                    <Key size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">OpenAI</h3>
                    <p className="text-xs text-white/60">GPT-4, GPT-3.5, DALL-E</p>
                  </div>
                  {settings.apiKeys.openai && (
                    <CheckCircle className="ml-auto text-green-400" size={20} />
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showKeys ? 'text' : 'password'}
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    placeholder="sk-..."
                    className="input-glass pr-10 font-mono text-sm"
                  />
                  <button
                    onClick={() => setShowKeys(!showKeys)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                  >
                    {showKeys ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-purple-400 hover:text-purple-300 mt-2 inline-block"
                >
                  Get API key →
                </a>
              </div>

              {/* Anthropic */}
              <div className="glass p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Key size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Anthropic</h3>
                    <p className="text-xs text-white/60">Claude 3 Opus, Sonnet</p>
                  </div>
                  {settings.apiKeys.anthropic && (
                    <CheckCircle className="ml-auto text-green-400" size={20} />
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showKeys ? 'text' : 'password'}
                    value={anthropicKey}
                    onChange={(e) => setAnthropicKey(e.target.value)}
                    placeholder="sk-ant-..."
                    className="input-glass pr-10 font-mono text-sm"
                  />
                </div>
                <a
                  href="https://console.anthropic.com/settings/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-purple-400 hover:text-purple-300 mt-2 inline-block"
                >
                  Get API key →
                </a>
              </div>

              {/* Google */}
              <div className="glass p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Key size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Google AI</h3>
                    <p className="text-xs text-white/60">Gemini Pro</p>
                  </div>
                  {settings.apiKeys.google && (
                    <CheckCircle className="ml-auto text-green-400" size={20} />
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showKeys ? 'text' : 'password'}
                    value={googleKey}
                    onChange={(e) => setGoogleKey(e.target.value)}
                    placeholder="AIza..."
                    className="input-glass pr-10 font-mono text-sm"
                  />
                </div>
                <a
                  href="https://makersuite.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-purple-400 hover:text-purple-300 mt-2 inline-block"
                >
                  Get API key →
                </a>
              </div>

              {/* Active Provider */}
              <div className="glass p-4 rounded-xl">
                <label className="block text-sm font-medium text-white mb-2">
                  Active Provider
                </label>
                <select
                  value={settings.activeProvider}
                  onChange={(e) => settings.setActiveProvider(e.target.value as any)}
                  className="input-glass"
                >
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="google">Google AI</option>
                </select>
              </div>

              <button
                onClick={handleSaveAPIKeys}
                className="btn-gradient px-6 py-3 rounded-lg flex items-center gap-2"
              >
                <Save size={18} />
                Save API Keys
              </button>
            </div>
          )}

          {/* UI Tab */}
          {activeTab === 'ui' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">Appearance</h2>

              {/* Font Size */}
              <div className="glass p-4 rounded-xl">
                <label className="block text-sm font-medium text-white mb-3">
                  Font Size
                </label>
                <div className="flex gap-2">
                  {(['sm', 'md', 'lg'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => settings.setFontSize(size)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        settings.fontSize === size
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                      }`}
                    >
                      {size.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editor Width */}
              <div className="glass p-4 rounded-xl">
                <label className="block text-sm font-medium text-white mb-3">
                  Editor Width
                </label>
                <div className="flex gap-2">
                  {(['narrow', 'medium', 'wide'] as const).map((width) => (
                    <button
                      key={width}
                      onClick={() => settings.setEditorWidth(width)}
                      className={`px-4 py-2 rounded-lg transition-all capitalize ${
                        settings.editorWidth === width
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                      }`}
                    >
                      {width}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="glass p-4 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Line Numbers</h4>
                    <p className="text-xs text-white/60">Show line numbers in editor</p>
                  </div>
                  <button
                    onClick={settings.toggleLineNumbers}
                    className={`w-12 h-6 rounded-full transition-all ${
                      settings.showLineNumbers ? 'bg-purple-500' : 'bg-white/20'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.showLineNumbers ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="divider-glass" />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Animations</h4>
                    <p className="text-xs text-white/60">Enable smooth animations</p>
                  </div>
                  <button
                    onClick={settings.toggleAnimations}
                    className={`w-12 h-6 rounded-full transition-all ${
                      settings.enableAnimations ? 'bg-purple-500' : 'bg-white/20'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.enableAnimations ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="divider-glass" />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Glow Effects</h4>
                    <p className="text-xs text-white/60">Enable glowing elements</p>
                  </div>
                  <button
                    onClick={settings.toggleGlow}
                    className={`w-12 h-6 rounded-full transition-all ${
                      settings.enableGlow ? 'bg-purple-500' : 'bg-white/20'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.enableGlow ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Writing Tab */}
          {activeTab === 'writing' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">Writing Preferences</h2>

              {/* Word Goal */}
              <div className="glass p-4 rounded-xl">
                <label className="block text-sm font-medium text-white mb-2">
                  Daily Word Goal
                </label>
                <input
                  type="number"
                  value={settings.wordGoal}
                  onChange={(e) => settings.setWordGoal(Number(e.target.value))}
                  className="input-glass"
                  min="100"
                  step="100"
                />
              </div>

              {/* Auto Save */}
              <div className="glass p-4 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-white font-medium">Auto Save</h4>
                    <p className="text-xs text-white/60">Automatically save your work</p>
                  </div>
                  <button
                    onClick={() => settings.setAutoSave(!settings.autoSave)}
                    className={`w-12 h-6 rounded-full transition-all ${
                      settings.autoSave ? 'bg-purple-500' : 'bg-white/20'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {settings.autoSave && (
                  <div>
                    <label className="block text-sm text-white/80 mb-2">
                      Save Interval (seconds)
                    </label>
                    <input
                      type="number"
                      value={settings.autoSaveInterval}
                      onChange={(e) => settings.setAutoSaveInterval(Number(e.target.value))}
                      className="input-glass"
                      min="10"
                      step="10"
                    />
                  </div>
                )}
              </div>

              {/* Ambient Sound */}
              <div className="glass p-4 rounded-xl">
                <label className="block text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <Volume2 size={18} />
                  Ambient Sound (Focus Mode)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['none', 'lofi', 'rain', 'cafe', 'nature'] as const).map((sound) => (
                    <button
                      key={sound}
                      onClick={() => settings.setAmbientSound(sound)}
                      className={`px-4 py-2 rounded-lg transition-all capitalize ${
                        settings.ambientSound === sound
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                      }`}
                    >
                      {sound}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Shortcuts Tab */}
          {activeTab === 'shortcuts' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">Keyboard Shortcuts</h2>

              <div className="space-y-2">
                {Object.entries(settings.keyboardShortcuts).map(([action, shortcut]) => (
                  <div
                    key={action}
                    className="glass p-4 rounded-lg flex items-center justify-between"
                  >
                    <span className="text-white/90 capitalize">
                      {action.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <kbd className="px-3 py-1 bg-white/10 rounded text-white/90 font-mono text-sm">
                      {shortcut}
                    </kbd>
                  </div>
                ))}
              </div>

              <div className="glass p-4 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-white/70">
                  Keyboard shortcuts are currently fixed. Custom shortcut editing coming soon!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
