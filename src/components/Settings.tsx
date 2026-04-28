import { useState } from 'react';
import { User, Bell, Zap, Palette, Sun, Moon } from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';

const aiModels = [
  { id: 'claude-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', desc: 'Best for nuanced brand voice & creative copy', badge: 'Recommended' },
  { id: 'claude-opus', name: 'Claude 3 Opus', provider: 'Anthropic', desc: 'Deepest reasoning for complex strategy', badge: '' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', desc: 'Fast & versatile for all content types', badge: '' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', desc: 'Balanced speed and creativity', badge: '' },
  { id: 'gemini-pro', name: 'Gemini 1.5 Pro', provider: 'Google', desc: 'Strong at data-driven marketing analysis', badge: '' },
  { id: 'llama-3', name: 'Llama 3.1 70B', provider: 'Meta', desc: 'Open-source, fast iteration for drafts', badge: '' },
];

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [selectedModel, setSelectedModel] = useState('claude-sonnet');
  const [creativity, setCreativity] = useState(7);
  const [notifications, setNotifications] = useState([
    { id: 'insights', label: 'AI insights and recommendations', enabled: true },
    { id: 'campaign', label: 'Campaign performance alerts', enabled: true },
    { id: 'budget', label: 'Budget threshold warnings', enabled: true },
    { id: 'publish', label: 'Content publishing confirmations', enabled: false },
  ]);

  function toggleNotification(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n));
  }

  return (
    <div className="p-6 bg-grid min-h-full max-w-3xl">
      <h2 className="text-xl font-bold text-theme-primary mb-6">Settings</h2>
      <div className="space-y-6">
        <div className="bg-theme-surface-80 border border-theme-default rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4"><User size={16} className="text-blue-400" /><h3 className="text-sm font-bold text-theme-primary">Profile</h3></div>
          <div className="space-y-4">
            <div><label className="text-xs text-theme-muted font-medium mb-1.5 block">Display Name</label><input className="w-full h-9 px-3 text-sm bg-theme-input border border-theme-default rounded-lg text-theme-primary focus:outline-none focus:border-blue-500/50 transition-all" placeholder="Your name" /></div>
            <div><label className="text-xs text-theme-muted font-medium mb-1.5 block">Email</label><input className="w-full h-9 px-3 text-sm bg-theme-input border border-theme-default rounded-lg text-theme-primary focus:outline-none focus:border-blue-500/50 transition-all" placeholder="you@example.com" /></div>
          </div>
        </div>

        <div className="bg-theme-surface-80 border border-theme-default rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4"><Zap size={16} className="text-cyan-400" /><h3 className="text-sm font-bold text-theme-primary">AI Preferences</h3></div>
          <div className="space-y-5">
            <div>
              <label className="text-xs text-theme-muted font-medium mb-2 block">Default AI Model</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {aiModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      selectedModel === model.id
                        ? 'bg-blue-500/10 border-blue-500/30 ring-1 ring-blue-500/20'
                        : 'bg-theme-elevated-50 border-theme-default hover:border-theme-muted'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-theme-primary">{model.name}</span>
                      {model.badge && <span className="text-[9px] font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded-full">{model.badge}</span>}
                    </div>
                    <p className="text-[10px] text-theme-muted">{model.provider} &middot; {model.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-theme-muted font-medium mb-2 block">Content Creativity Level</label>
              <input type="range" min="1" max="10" value={creativity} onChange={e => setCreativity(Number(e.target.value))} className="w-full accent-blue-500" />
              <div className="flex justify-between text-[10px] text-theme-faint mt-1">
                <span>Conservative</span>
                <span>Creative</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-theme-surface-80 border border-theme-default rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4"><Bell size={16} className="text-amber-400" /><h3 className="text-sm font-bold text-theme-primary">Notifications</h3></div>
          <div className="space-y-3">
            {notifications.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <span className="text-xs text-theme-secondary">{item.label}</span>
                <button onClick={() => toggleNotification(item.id)} className={`w-9 h-5 rounded-full transition-colors cursor-pointer ${item.enabled ? 'bg-blue-500' : 'bg-theme-elevated'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white mt-0.5 transition-transform ${item.enabled ? 'translate-x-4.5 ml-0.5' : 'ml-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-theme-surface-80 border border-theme-default rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4"><Palette size={16} className="text-emerald-400" /><h3 className="text-sm font-bold text-theme-primary">Appearance</h3></div>
          <div className="flex gap-3">
            <button onClick={() => { if (theme === 'light') toggleTheme(); }} className={`flex-1 p-3 rounded-xl text-center transition-all hover:scale-105 active:scale-95 ${theme === 'dark' ? 'bg-theme-elevated border-2 border-blue-500' : 'bg-slate-200 border-2 border-transparent opacity-50'}`}>
              <div className="w-full h-8 bg-slate-950 rounded-lg mb-2" />
              <div className="flex items-center justify-center gap-1.5">
                <Moon size={12} className="text-slate-400" />
                <span className="text-xs text-white font-medium">Dark</span>
              </div>
            </button>
            <button onClick={() => { if (theme === 'dark') toggleTheme(); }} className={`flex-1 p-3 rounded-xl text-center transition-all hover:scale-105 active:scale-95 ${theme === 'light' ? 'bg-white border-2 border-blue-500' : 'bg-slate-200 border-2 border-transparent opacity-50'}`}>
              <div className="w-full h-8 bg-white rounded-lg mb-2" />
              <div className="flex items-center justify-center gap-1.5">
                <Sun size={12} className="text-slate-600" />
                <span className="text-xs text-slate-700 font-medium">Light</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
