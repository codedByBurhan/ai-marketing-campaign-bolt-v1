import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { ThemeProvider } from './lib/ThemeContext';
import Sidebar, { type View } from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import BrandStudio from './components/BrandStudio';
import ContentForge from './components/ContentForge';
import CampaignHub from './components/CampaignHub';
import Analytics from './components/Analytics';
import AIAssistant from './components/AIAssistant';
import Settings from './components/Settings';
import LandingPage from './components/LandingPage';

function AppInner() {
  const [session, setSession] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<View>('dashboard');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(!!session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-base flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center animate-pulse">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
          </div>
          <p className="text-sm text-theme-muted">Loading Apex AI...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <LandingPage />;
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'brand-studio': return <BrandStudio />;
      case 'content-forge': return <ContentForge />;
      case 'campaign-hub': return <CampaignHub />;
      case 'analytics': return <Analytics />;
      case 'ai-assistant': return <AIAssistant />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-theme-base text-theme-primary font-sans overflow-hidden">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} onSignOut={handleSignOut} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header currentView={currentView} onSignOut={handleSignOut} />
        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
