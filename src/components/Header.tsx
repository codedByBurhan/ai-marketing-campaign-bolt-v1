import { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, Sun, Moon, Settings, LogOut, Check, AlertCircle, TrendingUp, Sparkles } from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';
import type { View } from './Sidebar';

const viewTitles: Record<View, string> = {
  'dashboard': 'Command Center', 'brand-studio': 'Brand Studio', 'content-forge': 'Content Forge',
  'campaign-hub': 'Campaign Hub', 'analytics': 'Analytics', 'ai-assistant': 'AI Assistant', 'settings': 'Settings',
};

const viewDescriptions: Record<View, string> = {
  'dashboard': 'Real-time overview of your marketing operations', 'brand-studio': 'Craft and manage your brand identity with AI',
  'content-forge': 'Generate high-impact marketing content', 'campaign-hub': 'Launch and manage marketing campaigns',
  'analytics': 'Deep-dive into performance metrics', 'ai-assistant': 'Your AI-powered marketing strategist', 'settings': 'Configure your workspace',
};

const notifications = [
  { id: 1, title: 'Campaign launched', desc: '"Summer Collection 2026" is now live', time: '2m ago', icon: <TrendingUp size={14} className="text-blue-400" />, read: false },
  { id: 2, title: 'AI suggestion', desc: 'New tagline variants generated for review', time: '15m ago', icon: <Sparkles size={14} className="text-cyan-400" />, read: false },
  { id: 3, title: 'Budget alert', desc: 'Google Ads at 85% of monthly budget', time: '1h ago', icon: <AlertCircle size={14} className="text-amber-400" />, read: true },
  { id: 4, title: 'Content published', desc: '5 Instagram posts scheduled successfully', time: '2h ago', icon: <Check size={14} className="text-emerald-400" />, read: true },
];

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    function listener(e: MouseEvent) {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    }
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

export default function Header({ currentView, onSignOut }: { currentView: View; onSignOut?: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useClickOutside(notifRef, () => setNotifOpen(false));
  useClickOutside(profileRef, () => setProfileOpen(false));

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 border-b border-theme-default bg-theme-surface-80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50">
      <div>
        <h2 className="text-lg font-bold text-theme-primary">{viewTitles[currentView]}</h2>
        <p className="text-xs text-theme-muted">{viewDescriptions[currentView]}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" />
          <input type="text" placeholder="Search anything..." className="w-56 h-8 pl-9 pr-3 text-xs bg-theme-input border border-theme-default rounded-lg text-theme-primary placeholder:text-theme-faint focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all" />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-theme-faint bg-theme-elevated px-1.5 py-0.5 rounded font-mono">/</kbd>
        </div>
        <button onClick={toggleTheme} className="w-8 h-8 flex items-center justify-center rounded-lg bg-theme-input border border-theme-default text-theme-tertiary hover:text-theme-primary hover:border-theme-muted transition-all hover:scale-105 active:scale-95">
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <div className="relative" ref={notifRef}>
          <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }} className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-theme-input border border-theme-default text-theme-tertiary hover:text-theme-primary hover:border-theme-muted transition-all hover:scale-105 active:scale-95">
            <Bell size={15} />
            {unreadCount > 0 && <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full" />}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-theme-surface border border-theme-default rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-theme-default flex items-center justify-between">
                <h3 className="text-sm font-bold text-theme-primary">Notifications</h3>
                {unreadCount > 0 && <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">{unreadCount} NEW</span>}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-theme-default">
                {notifications.map((n) => (
                  <div key={n.id} className={`px-4 py-3 hover:bg-theme-elevated-50 transition-colors cursor-pointer ${!n.read ? 'bg-blue-500/5' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 w-6 h-6 rounded-lg bg-theme-elevated flex items-center justify-center flex-shrink-0">{n.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-theme-primary">{n.title}</p>
                          {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />}
                        </div>
                        <p className="text-[11px] text-theme-muted truncate">{n.desc}</p>
                      </div>
                      <span className="text-[10px] text-theme-faint whitespace-nowrap">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-theme-default">
                <button className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors w-full text-center">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }} className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold hover:scale-105 active:scale-95 transition-all">
            <User size={14} />
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-12 w-64 bg-theme-surface border border-theme-default rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-theme-default">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-sm font-bold"><User size={16} /></div>
                  <div>
                    <p className="text-sm font-bold text-theme-primary">Marketing Team</p>
                    <p className="text-[11px] text-theme-muted">team@company.com</p>
                  </div>
                </div>
              </div>
              <div className="py-1">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-theme-secondary hover:bg-theme-elevated-50 transition-colors"><User size={14} className="text-theme-muted" /> Profile</button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-theme-secondary hover:bg-theme-elevated-50 transition-colors"><Settings size={14} className="text-theme-muted" /> Settings</button>
              </div>
              <div className="border-t border-theme-default py-1">
                <button onClick={onSignOut} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"><LogOut size={14} /> Sign Out</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
