import { useState } from 'react';
import {
  LayoutDashboard,
  Palette,
  PenTool,
  Megaphone,
  BarChart3,
  Bot,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Zap,
  LogOut,
} from 'lucide-react';

export type View = 'dashboard' | 'brand-studio' | 'content-forge' | 'campaign-hub' | 'analytics' | 'ai-assistant' | 'settings';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onSignOut: () => void;
}

const navItems: { id: View; label: string; icon: React.ReactNode; badge?: string }[] = [
  { id: 'dashboard', label: 'Command Center', icon: <LayoutDashboard size={20} /> },
  { id: 'brand-studio', label: 'Brand Studio', icon: <Palette size={20} />, badge: 'AI' },
  { id: 'content-forge', label: 'Content Forge', icon: <PenTool size={20} />, badge: 'AI' },
  { id: 'campaign-hub', label: 'Campaign Hub', icon: <Megaphone size={20} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
  { id: 'ai-assistant', label: 'AI Assistant', icon: <Bot size={20} />, badge: 'Live' },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
];

export default function Sidebar({ currentView, onViewChange, onSignOut }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`h-screen bg-theme-base border-r border-theme-default flex flex-col transition-all duration-300 ${collapsed ? 'w-[68px]' : 'w-[240px]'}`}>
      <div className="h-16 flex items-center gap-3 px-4 border-b border-theme-default">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
          <Zap size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-theme-primary tracking-tight">Apex</h1>
            <p className="text-[10px] text-theme-muted font-medium tracking-widest uppercase">AI Command</p>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="ml-auto w-7 h-7 flex items-center justify-center rounded-md text-theme-muted hover:text-theme-primary hover:bg-theme-elevated-50 transition-all">
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                isActive ? 'bg-blue-500/10 text-blue-400 glow-blue' : 'text-theme-tertiary hover:text-theme-secondary hover:bg-theme-elevated-50'
              }`}
            >
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-400 rounded-r-full" />}
              <span className={`flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-theme-muted group-hover:text-theme-tertiary'}`}>{item.icon}</span>
              {!collapsed && (
                <>
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      item.badge === 'Live' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>{item.badge}</span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="mx-3 mb-2 p-3 rounded-lg bg-theme-elevated-50 border border-theme-default">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-cyan-400" />
            <span className="text-xs font-semibold text-theme-secondary">AI Engine</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] text-theme-muted">All systems operational</span>
          </div>
        </div>
      )}

      <button
        onClick={onSignOut}
        className={`mx-2 mb-2 flex items-center gap-2 px-3 py-2 rounded-lg text-theme-muted hover:text-rose-400 hover:bg-rose-500/10 transition-all text-xs font-medium ${collapsed ? 'justify-center' : ''}`}
      >
        <LogOut size={16} />
        {!collapsed && 'Sign Out'}
      </button>
    </aside>
  );
}
