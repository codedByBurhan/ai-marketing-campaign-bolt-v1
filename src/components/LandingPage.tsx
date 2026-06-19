import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../lib/ThemeContext';
import {
  Zap, Sparkles, ArrowRight, Play, ChevronRight, ChevronDown,
  Bot, Palette, PenTool, Megaphone, BarChart3, Target,
  Star, Menu, X, Globe, Shield, Cpu, Sun, Moon,
} from 'lucide-react';

type Tab = 'home' | 'about' | 'demo' | 'auth';

const navItems: { id: Tab; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'demo', label: 'Demo' },
  { id: 'auth', label: 'Sign In' },
];

const features = [
  { icon: <Palette size={24} />, title: 'Brand Studio', desc: 'Define your brand DNA with AI-powered identity generation. Colors, tone, audience -- all crafted by intelligence.', color: 'from-blue-500 to-cyan-400', glow: 'glow-blue' },
  { icon: <PenTool size={24} />, title: 'Content Forge', desc: 'Generate high-impact content for every channel. Social posts, ad copy, emails, blogs -- all on-brand.', color: 'from-cyan-500 to-teal-400', glow: 'glow-emerald' },
  { icon: <Megaphone size={24} />, title: 'Campaign Hub', desc: 'Launch, manage, and optimize campaigns across channels. Track budgets, conversions, and ROAS in real-time.', color: 'from-amber-500 to-orange-400', glow: 'glow-amber' },
  { icon: <BarChart3 size={24} />, title: 'Analytics Engine', desc: 'Deep-dive into performance metrics. AI identifies opportunities and recommends optimizations.', color: 'from-emerald-500 to-green-400', glow: 'glow-emerald' },
  { icon: <Bot size={24} />, title: 'AI Assistant', desc: 'Your always-on marketing strategist. Ask anything -- brand strategy, content ideas, budget allocation.', color: 'from-rose-500 to-pink-400', glow: 'glow-rose' },
  { icon: <Target size={24} />, title: 'Smart Targeting', desc: 'AI-optimized audience segmentation. Reach the right people with the right message at the right time.', color: 'from-teal-500 to-cyan-400', glow: 'glow-emerald' },
];

const stats = [
  { value: '10K+', label: 'Brands Built' },
  { value: '1M+', label: 'Content Pieces' },
  { value: '50K+', label: 'Campaigns Launched' },
  { value: '4.2x', label: 'Avg ROAS Lift' },
];

const trustedBy = [
  'Acme Corp', 'NovaTech', 'Meridian', 'Pulse Digital', 'Skyline Co', 'Vertex Labs',
];

const faqs = [
  { q: 'How does Apex AI learn my brand voice?', a: 'During onboarding, you define your brand DNA -- colors, tone, audience, and differentiators. Our AI uses this as a foundation and continuously refines its understanding based on the content you approve and edit. The more you use it, the more on-brand it becomes.' },
  { q: 'Can I use Apex for multiple brands?', a: 'Yes. Our Professional plan supports 5 brand profiles, and Enterprise offers unlimited brands. Each brand has its own DNA vault, content library, and campaign hub. Switch between brands instantly.' },
  { q: 'What AI models power the platform?', a: 'Apex uses a combination of GPT-4 for creative content generation, custom fine-tuned models for brand voice consistency, and proprietary models for analytics and optimization recommendations. You can select your preferred model in settings.' },
  { q: 'Is my brand data secure?', a: 'Absolutely. We use row-level security, encrypted data at rest and in transit, and role-based access control. Your brand assets and campaigns are isolated and never used to train models for other users. SOC 2 Type II certified.' },
  { q: 'Can I cancel or change plans anytime?', a: 'Yes. All plans are month-to-month with no long-term contracts. Upgrade, downgrade, or cancel anytime from your settings. Your data is always exportable.' },
  { q: 'Do you offer a free trial?', a: 'Yes. Every plan includes a 14-day free trial with full feature access. No credit card required to start. After the trial, you can continue on the free tier or upgrade.' },
];

const demoSteps = [
  { step: '01', title: 'Define Your Brand', desc: 'Input your brand details or let AI generate a complete brand identity in seconds.', visual: 'brand' },
  { step: '02', title: 'Generate Content', desc: 'AI creates on-brand content for every channel -- social, email, ads, blogs.', visual: 'content' },
  { step: '03', title: 'Launch Campaigns', desc: 'Deploy multi-channel campaigns with AI-optimized targeting and budgets.', visual: 'campaign' },
  { step: '04', title: 'Optimize & Scale', desc: 'Real-time analytics and AI recommendations continuously improve performance.', visual: 'analytics' },
];

function FloatingOrb({ className, color }: { className: string; color: string }) {
  return <div className={`absolute rounded-full blur-3xl animate-pulse-glow ${className}`} style={{ background: color }} />;
}

function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} className="absolute w-1 h-1 rounded-full bg-blue-400/30" style={{
          left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
          animation: `float ${4 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 2}s`,
        }} />
      ))}
    </div>
  );
}

function GridOverlay() {
  return <div className="absolute inset-0 bg-grid-hero opacity-30 pointer-events-none" />;
}

function ScanLine() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-scan" />
    </div>
  );
}

function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

function ScrollReveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function InteractiveBrandDemo() {
  const [selected, setSelected] = useState(0);
  const brandColors = [
    { name: 'Ocean', colors: ['#3B82F6', '#06B6D4', '#0EA5E9'] },
    { name: 'Forest', colors: ['#10B981', '#059669', '#34D399'] },
    { name: 'Sunset', colors: ['#F59E0B', '#EF4444', '#F97316'] },
    { name: 'Berry', colors: ['#EC4899', '#A855F7', '#F43F5E'] },
  ];
  const current = brandColors[selected];

  return (
    <div className="absolute inset-0 p-2 flex flex-col items-center justify-center gap-2">
      <div className="flex gap-1.5">
        {current.colors.map((c, i) => (
          <div key={i} className="w-6 h-6 rounded-full transition-all duration-500 hover:scale-125 cursor-pointer" style={{ backgroundColor: c }} />
        ))}
      </div>
      <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">{current.name}</span>
      <div className="flex gap-1 mt-1">
        {brandColors.map((_, i) => (
          <button key={i} onClick={() => setSelected(i)} className={`w-1.5 h-1.5 rounded-full transition-all ${selected === i ? 'bg-cyan-400 scale-125' : 'bg-slate-600 hover:bg-slate-500'}`} />
        ))}
      </div>
    </div>
  );
}

function InteractiveContentDemo() {
  const [activeLine, setActiveLine] = useState(0);
  const lines = [
    { w: 75, label: 'Headline' },
    { w: 100, label: 'Body copy' },
    { w: 83, label: 'CTA text' },
    { w: 66, label: 'Hashtags' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLine(prev => (prev + 1) % lines.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 p-2.5 space-y-2">
      {lines.map((line, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`h-2 rounded transition-all duration-700 ${i === activeLine ? 'bg-cyan-400/60' : 'bg-slate-600/40'}`} style={{ width: `${line.w}%` }} />
          {i === activeLine && <span className="text-[8px] text-cyan-400 font-bold whitespace-nowrap animate-fade-in-up">{line.label}</span>}
        </div>
      ))}
      <div className="flex gap-1 mt-1">
        {lines.map((_, i) => (
          <div key={i} className={`w-1 h-1 rounded-full transition-all ${i === activeLine ? 'bg-cyan-400' : 'bg-slate-700'}`} />
        ))}
      </div>
    </div>
  );
}

function InteractiveCampaignDemo() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const bars = [
    { label: 'Mon', value: 40, channel: 'Social' },
    { label: 'Tue', value: 70, channel: 'Email' },
    { label: 'Wed', value: 55, channel: 'Ads' },
    { label: 'Thu', value: 85, channel: 'Social' },
    { label: 'Fri', value: 60, channel: 'Email' },
    { label: 'Sat', value: 90, channel: 'Ads' },
  ];

  return (
    <div className="absolute inset-0 flex items-end gap-1 p-2">
      {bars.map((bar, j) => (
        <div key={j} className="flex-1 flex flex-col items-center gap-0.5 relative" onMouseEnter={() => setHoveredBar(j)} onMouseLeave={() => setHoveredBar(null)}>
          {hoveredBar === j && (
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 whitespace-nowrap z-10">
              <span className="text-[7px] text-cyan-400 font-bold">{bar.channel} {bar.value}%</span>
            </div>
          )}
          <div className={`w-full rounded-t transition-all duration-500 cursor-pointer ${hoveredBar === j ? 'bg-cyan-400' : j === 5 ? 'bg-cyan-400/80' : 'bg-cyan-500/40'}`} style={{ height: `${bar.value}%` }} />
          <span className="text-[7px] text-slate-600">{bar.label}</span>
        </div>
      ))}
    </div>
  );
}

function InteractiveMiniGraph() {
  const [hoveredX, setHoveredX] = useState<number | null>(null);
  const w = 200;
  const h = 80;
  const pad = 4;

  const dataPoints = [20, 35, 28, 50, 42, 65, 55, 78, 70, 88, 82, 95];
  const max = Math.max(...dataPoints);
  const min = Math.min(...dataPoints);

  const points = dataPoints.map((v, i) => ({
    x: pad + (i / (dataPoints.length - 1)) * (w - pad * 2),
    y: h - pad - ((v - min) / (max - min)) * (h - pad * 2),
    value: v,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${h - pad} L ${points[0].x} ${h - pad} Z`;

  const hoveredPoint = hoveredX !== null
    ? points.reduce((closest, p) =>
        Math.abs(p.x - hoveredX) < Math.abs(closest.x - hoveredX) ? p : closest
      )
    : null;

  return (
    <div className="absolute inset-0 p-2">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" onMouseMove={e => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * w;
        setHoveredX(x);
      }} onMouseLeave={() => setHoveredX(null)}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#areaGrad)" />
        <path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {hoveredPoint && (
          <>
            <line x1={hoveredPoint.x} y1={pad} x2={hoveredPoint.x} y2={h - pad} stroke="#3B82F6" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5" />
            <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="3" fill="#06B6D4" stroke="#fff" strokeWidth="1" />
            <rect x={hoveredPoint.x - 14} y={hoveredPoint.y - 16} width="28" height="12" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />
            <text x={hoveredPoint.x} y={hoveredPoint.y - 9} textAnchor="middle" fill="#fff" fontSize="7" fontWeight="bold">{hoveredPoint.value}K</text>
          </>
        )}
      </svg>
    </div>
  );
}

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { theme, toggleTheme } = useTheme();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navOpacity = Math.min(scrollY / 100, 1);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300" style={{
        backgroundColor: `rgba(2, 6, 23, ${0.3 + navOpacity * 0.7})`,
        backdropFilter: navOpacity > 0.1 ? 'blur(20px)' : 'none',
        borderBottom: navOpacity > 0.3 ? '1px solid rgba(51, 65, 85, 0.3)' : '1px solid transparent',
      }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight">Apex <span className="text-gradient-blue">AI</span></span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => {
                if (item.id === 'auth') { setActiveTab('auth'); }
                else { setActiveTab(item.id); const el = document.getElementById(item.id === 'home' ? 'hero' : item.id); el?.scrollIntoView({ behavior: 'smooth' }); }
              }} className={`px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${activeTab === item.id ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={toggleTheme} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all">
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button onClick={() => setActiveTab('auth')} className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white transition-colors">Sign In</button>
            <button onClick={() => setActiveTab('auth')} className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-semibold rounded-lg hover:from-blue-400 hover:to-cyan-400 transition-all glow-blue hover:scale-105 active:scale-95">
              Get Started <ArrowRight size={12} />
            </button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button onClick={toggleTheme} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400">{theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}</button>
            <button className="text-slate-400" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-6 py-4 space-y-2">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); if (item.id !== 'auth') { const el = document.getElementById(item.id === 'home' ? 'hero' : item.id); el?.scrollIntoView({ behavior: 'smooth' }); } }} className="block w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/50">{item.label}</button>
            ))}
            <button onClick={() => setActiveTab('auth')} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold rounded-lg mt-2">Get Started <ArrowRight size={14} /></button>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      {activeTab === 'auth' && <AuthModal onClose={() => setActiveTab('home')} />}

      {/* HERO */}
      <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-16">
        <GridOverlay />
        <ParticleField />
        <ScanLine />
        <FloatingOrb className="w-[600px] h-[600px] -top-48 -left-48" color="#3B82F6" />
        <FloatingOrb className="w-[500px] h-[500px] -bottom-32 -right-32" color="#06B6D4" />
        <FloatingOrb className="w-[300px] h-[300px] top-1/3 right-1/4" color="#10B981" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="animate-orbit"><div className="w-3 h-3 rounded-full bg-blue-400/40 blur-sm" /></div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="animate-orbit-reverse"><div className="w-2 h-2 rounded-full bg-cyan-400/30 blur-sm" /></div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="animate-orbit-slow"><div className="w-2.5 h-2.5 rounded-full bg-emerald-400/30 blur-sm" /></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full mb-8 animate-fade-in-up">
            <Sparkles size={14} className="text-cyan-400" />
            <span className="text-xs font-semibold text-blue-300">AI-Powered Marketing Command Center</span>
            <ChevronRight size={12} className="text-blue-400/50" />
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-[0.95] animate-fade-in-up-d1">
            <span className="text-gradient-hero">Build Brands</span>
            <br />
            <span className="text-gradient-hero">That </span>
            <span className="text-gradient-dominate">Dominate</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up-d2">
            The all-in-one AI platform that crafts your brand identity, generates content, launches campaigns, and optimizes performance -- all from one command center.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in-up-d3">
            <button onClick={() => setActiveTab('auth')} className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:from-blue-400 hover:to-cyan-400 transition-all glow-blue text-sm hover:scale-105 active:scale-95">
              Start Building Free <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => { setActiveTab('demo'); document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' }); }} className="flex items-center gap-2 px-8 py-4 bg-slate-800/50 border border-slate-700/50 text-slate-300 font-semibold rounded-xl hover:bg-slate-800 hover:border-slate-600 transition-all text-sm hover:scale-105 active:scale-95">
              <Play size={16} className="text-blue-400" /> Watch Demo
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto animate-fade-in-up-d4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center group cursor-default">
                <p className="text-2xl md:text-3xl font-black text-white group-hover:text-gradient-blue transition-all duration-300">{stat.value}</p>
                <p className="text-xs text-slate-500 font-medium mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 animate-fade-in-up-d4">
            <div className="flex items-center justify-center gap-1.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
              ))}
              <span className="text-xs text-slate-400 ml-2 font-medium">4.9/5 from 2,000+ reviews</span>
            </div>
            <p className="text-xs text-slate-500 mb-4 font-medium">Trusted by leading marketing teams</p>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              {trustedBy.map((name) => (
                <span key={name} className="text-xs text-slate-600 font-semibold tracking-wider uppercase hover:text-slate-400 transition-colors cursor-default">{name}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
      </section>

      {/* FEATURES */}
      <section id="about" className="relative py-24">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
                <Cpu size={12} className="text-emerald-400" />
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Platform</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
                Everything You Need to <span className="text-gradient-dominate">Dominate</span>
              </h2>
              <p className="text-base text-slate-400 max-w-xl mx-auto">Six powerful modules, one unified command center. Each powered by AI that learns your brand.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 80}>
                <div className="group relative bg-slate-900/60 border border-slate-800/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-500 overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/5">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="demo" className="relative py-24">
        <FloatingOrb className="w-[400px] h-[400px] top-0 right-0" color="#3B82F6" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
                <Play size={12} className="text-blue-400" />
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">How It Works</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
                From Zero to <span className="text-gradient-dominate">Launch</span> in Minutes
              </h2>
              <p className="text-base text-slate-400 max-w-xl mx-auto">Four steps. One platform. AI handles the heavy lifting.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {demoSteps.map((step, i) => (
              <ScrollReveal key={step.step} delay={i * 100}>
                <div className="relative group">
                  {i < demoSteps.length - 1 && <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-slate-700 to-transparent z-0" />}
                  <div className="relative bg-slate-900/60 border border-slate-800/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl font-black text-gradient-blue">{step.step}</span>
                      <div className="flex-1 h-px bg-slate-800" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>

                    <div className="mt-4 h-24 bg-slate-800/50 rounded-lg border border-slate-700/30 overflow-hidden relative">
                      {step.visual === 'brand' && <InteractiveBrandDemo />}
                      {step.visual === 'content' && <InteractiveContentDemo />}
                      {step.visual === 'campaign' && <InteractiveCampaignDemo />}
                      {step.visual === 'analytics' && <InteractiveMiniGraph />}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-24">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
                Frequently Asked <span className="text-gradient-blue">Questions</span>
              </h2>
              <p className="text-base text-slate-400">Everything you need to know about Apex AI.</p>
            </div>
          </ScrollReveal>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <div className="bg-slate-900/60 border border-slate-800/50 rounded-xl overflow-hidden hover:border-slate-700/50 transition-all">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left group">
                    <span className="text-sm font-semibold text-white pr-4">{faq.q}</span>
                    <ChevronDown size={16} className={`text-slate-500 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="px-5 pb-4 text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24">
        <FloatingOrb className="w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" color="#3B82F6" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <ScrollReveal>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-3xl p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-grid opacity-20" />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mx-auto mb-6 animate-float">
                  <Zap size={28} className="text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                  Ready to <span className="text-gradient-dominate">Dominate</span>?
                </h2>
                <p className="text-base text-slate-400 max-w-md mx-auto mb-8">Join thousands of marketing teams building brands that stand out. Start free, no credit card required.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button onClick={() => setActiveTab('auth')} className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:from-blue-400 hover:to-cyan-400 transition-all glow-blue text-sm hover:scale-105 active:scale-95">
                    Get Started Free <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button onClick={() => setActiveTab('auth')} className="flex items-center gap-2 px-8 py-4 bg-slate-800/50 border border-slate-700/50 text-slate-300 font-semibold rounded-xl hover:bg-slate-800 transition-all text-sm hover:scale-105 active:scale-95">
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center"><Zap size={14} className="text-white" /></div>
                <span className="text-sm font-bold">Apex AI</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">AI-powered marketing command center for modern teams.</p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-300 mb-3 uppercase tracking-wider">Product</h4>
              <div className="space-y-2">{['Brand Studio', 'Content Forge', 'Campaign Hub', 'Analytics'].map((item) => (<p key={item} className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">{item}</p>))}</div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-300 mb-3 uppercase tracking-wider">Company</h4>
              <div className="space-y-2">{['About', 'Blog', 'Careers', 'Contact'].map((item) => (<p key={item} className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">{item}</p>))}</div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-300 mb-3 uppercase tracking-wider">Legal</h4>
              <div className="space-y-2">{['Privacy', 'Terms', 'Security', 'GDPR'].map((item) => (<p key={item} className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">{item}</p>))}</div>
            </div>
          </div>
          <div className="border-t border-slate-800/50 pt-6 flex items-center justify-between">
            <p className="text-[11px] text-slate-600">{new Date().getFullYear()} Apex AI. All rights reserved.</p>
            <div className="flex items-center gap-1"><Globe size={12} className="text-slate-600" /><Shield size={12} className="text-slate-600" /></div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* Auth Modal */
function AuthModal({ onClose }: { onClose: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-8 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"><X size={18} /></button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center"><Zap size={18} className="text-white" /></div>
          <div>
            <h2 className="text-lg font-bold text-white">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-xs text-slate-500">{isLogin ? 'Sign in to your command center' : 'Start your marketing journey'}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 font-medium mb-1.5 block">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full h-10 px-3 text-sm bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-medium mb-1.5 block">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full h-10 px-3 text-sm bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all" placeholder="Min. 6 characters" required minLength={6} />
          </div>
          {error && <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg"><p className="text-xs text-rose-400">{error}</p></div>}
          <button type="submit" disabled={loading} className="w-full h-10 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold rounded-lg hover:from-blue-400 hover:to-cyan-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{isLogin ? 'Sign In' : 'Create Account'}<ArrowRight size={14} /></>}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
