import { useState, useEffect } from 'react';
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
  User,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import { useToast } from '../components/ui/Toast';
import '../styles/glassmorphism.css';

export default function SettingsPage() {
  const settings = useSettingsStore();
  const { success, error: showError } = useToast();

  // Default to 'api' tab so users can easily add their keys
  const [activeTab, setActiveTab] = useState<'personalization' | 'api' | 'ui' | 'writing' | 'shortcuts'>('api');
  const [showKeys, setShowKeys] = useState(false);

  // API Keys state - Initialize from persisted settings
  const [openaiKey, setOpenaiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [googleKey, setGoogleKey] = useState('');

  // Load persisted API keys on mount
  useEffect(() => {
    setOpenaiKey(settings.apiKeys.openai || '');
    setAnthropicKey(settings.apiKeys.anthropic || '');
    setGoogleKey(settings.apiKeys.google || '');
  }, [settings.apiKeys]);

  const handleSaveAPIKeys = () => {
    let savedCount = 0;

    if (openaiKey.trim()) {
      settings.setAPIKey('openai', openaiKey.trim());
      savedCount++;
    }
    if (anthropicKey.trim()) {
      settings.setAPIKey('anthropic', anthropicKey.trim());
      savedCount++;
    }
    if (googleKey.trim()) {
      settings.setAPIKey('google', googleKey.trim());
      savedCount++;
    }

    if (savedCount > 0) {
      success('API Keys Saved!', `${savedCount} API key${savedCount > 1 ? 's' : ''} saved successfully. You can now use AI tools!`);
    } else {
      showError('No Keys to Save', 'Please enter at least one API key');
    }
  };

  const tabs = [
    { id: 'personalization', label: 'Personalization', icon: User },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'ui', label: 'Editor', icon: Palette },
    { id: 'writing', label: 'Writing', icon: Zap },
    { id: 'shortcuts', label: 'Shortcuts', icon: KeyboardIcon },
  ] as const;

  // Count configured API keys
  const configuredKeysCount = Object.values(settings.apiKeys).filter(key => key && key.length > 0).length;

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">Settings</h1>
              <p className="text-secondary">
                Customize your workspace and configure AI providers
              </p>
            </div>
            {/* API Keys Status Badge */}
            {configuredKeysCount > 0 && (
              <div className="glass px-4 py-2 rounded-lg border-2 border-green-500/30">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-white">
                    {configuredKeysCount} API Key{configuredKeysCount > 1 ? 's' : ''} Configured
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap border-2 ${
                  activeTab === tab.id
                    ? 'border-purple-500 bg-purple-500/10 text-purple-500'
                    : 'border-transparent glass text-secondary hover:border-purple-500/50'
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
          {/* Personalization Tab */}
          {activeTab === 'personalization' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-primary mb-2">
                  Personalization
                </h2>
                <p className="text-secondary text-sm">
                  Customize the look and feel of your workspace
                </p>
              </div>

              {/* Theme Selection */}
              <div className="glass p-4 rounded-xl">
                <label className="block text-sm font-medium text-primary mb-3">
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => settings.setTheme('light')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      settings.theme === 'light'
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-transparent glass hover:border-purple-500/50'
                    }`}
                  >
                    <Sun size={24} className={settings.theme === 'light' ? 'text-purple-500' : 'text-muted'} />
                    <span className={`text-sm font-medium ${settings.theme === 'light' ? 'text-purple-500' : 'text-secondary'}`}>
                      Light
                    </span>
                  </button>

                  <button
                    onClick={() => settings.setTheme('dark')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      settings.theme === 'dark'
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-transparent glass hover:border-purple-500/50'
                    }`}
                  >
                    <Moon size={24} className={settings.theme === 'dark' ? 'text-purple-500' : 'text-muted'} />
                    <span className={`text-sm font-medium ${settings.theme === 'dark' ? 'text-purple-500' : 'text-secondary'}`}>
                      Dark
                    </span>
                  </button>

                  <button
                    onClick={() => settings.setTheme('auto')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      settings.theme === 'auto'
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-transparent glass hover:border-purple-500/50'
                    }`}
                  >
                    <Monitor size={24} className={settings.theme === 'auto' ? 'text-purple-500' : 'text-muted'} />
                    <span className={`text-sm font-medium ${settings.theme === 'auto' ? 'text-purple-500' : 'text-secondary'}`}>
                      Auto
                    </span>
                  </button>
                </div>
                <p className="text-xs text-muted mt-3">
                  Auto mode follows your system preferences
                </p>
              </div>

              {/* Accent Color (future feature) */}
              <div className="glass p-4 rounded-xl opacity-50 pointer-events-none">
                <label className="block text-sm font-medium text-primary mb-3">
                  Accent Color
                </label>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white" />
                  <div className="w-8 h-8 rounded-full bg-blue-500" />
                  <div className="w-8 h-8 rounded-full bg-green-500" />
                  <div className="w-8 h-8 rounded-full bg-amber-500" />
                  <div className="w-8 h-8 rounded-full bg-red-500" />
                </div>
                <p className="text-xs text-muted mt-3">
                  Coming soon - Custom accent colors
                </p>
              </div>
            </div>
          )}

          {/* API Keys Tab */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  AI Provider API Keys
                </h2>
                <p className="text-white/60 text-sm mb-4">
                  Your API keys are stored locally in your browser and never sent to our servers
                </p>

                {/* Info Box */}
                <div className="glass p-4 rounded-xl border-2 border-blue-500/30 bg-blue-500/5">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-white/90 font-medium mb-1">How it works:</p>
                      <ul className="text-white/70 space-y-1 text-xs">
                        <li>✅ Add your API key from OpenAI, Anthropic, or Google</li>
                        <li>✅ Keys are saved automatically to your browser's localStorage</li>
                        <li>✅ AI tools will use your keys to make direct API calls</li>
                        <li>✅ Choose which provider to use below</li>
                      </ul>
                    </div>
                  </div>
                </div>
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

              {/* Model Selection */}
              <div className="glass p-4 rounded-xl">
                <label className="block text-sm font-medium text-white mb-2">
                  Model
                </label>
                <select
                  value={settings.selectedModel}
                  onChange={(e) => settings.setSelectedModel(e.target.value as any)}
                  className="input-glass"
                >
                  {settings.activeProvider === 'openai' && (
                    <>
                      <option value="gpt-4-turbo">GPT-4 Turbo</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    </>
                  )}
                  {settings.activeProvider === 'anthropic' && (
                    <>
                      <option value="claude-3-opus-20240229">Claude 3 Opus</option>
                      <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
                      <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
                    </>
                  )}
                  {settings.activeProvider === 'google' && (
                    <>
                      <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                      <option value="gemini-pro">Gemini Pro</option>
                    </>
                  )}
                </select>
                <p className="text-xs text-white/50 mt-2">
                  Choose which model to use for AI generation
                </p>
              </div>

              {/* Save Button */}
              <div className="glass p-6 rounded-xl border-2 border-purple-500/30 bg-purple-500/5">
                <button
                  onClick={handleSaveAPIKeys}
                  className="btn-gradient px-8 py-4 rounded-lg flex items-center justify-center gap-2 w-full text-lg font-semibold hover:scale-105 transition-transform"
                >
                  <Save size={20} />
                  Save API Keys
                </button>
                <p className="text-center text-xs text-white/60 mt-3">
                  Your keys will be saved to your browser's localStorage and persist across sessions
                </p>
              </div>
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
