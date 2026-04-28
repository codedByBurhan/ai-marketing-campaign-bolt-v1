import { useState, useEffect } from 'react';
import { PenTool, Sparkles, Copy, Check, X, Instagram, Mail, FileText, Megaphone, Package, Newspaper, RefreshCw, Wand2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

type ContentType = 'social_post' | 'blog_post' | 'ad_copy' | 'email' | 'tagline' | 'product_desc' | 'press_release';
type Platform = '' | 'instagram' | 'twitter' | 'linkedin' | 'facebook' | 'tiktok' | 'youtube' | 'blog' | 'email' | 'google_ads' | 'meta_ads';

interface ContentPiece { id: string; title: string; content_type: ContentType; platform: Platform; body: string; status: string; }

const contentTypes: { value: ContentType; label: string; icon: React.ReactNode }[] = [
  { value: 'social_post', label: 'Social Post', icon: <Instagram size={14} /> },
  { value: 'blog_post', label: 'Blog Post', icon: <FileText size={14} /> },
  { value: 'ad_copy', label: 'Ad Copy', icon: <Megaphone size={14} /> },
  { value: 'email', label: 'Email', icon: <Mail size={14} /> },
  { value: 'tagline', label: 'Tagline', icon: <Wand2 size={14} /> },
  { value: 'product_desc', label: 'Product Desc', icon: <Package size={14} /> },
  { value: 'press_release', label: 'Press Release', icon: <Newspaper size={14} /> },
];

const aiTemplates = [
  { name: 'Product Launch Post', type: 'social_post' as ContentType, platform: 'instagram' as Platform, prompt: 'Write an engaging Instagram post for a new product launch.' },
  { name: 'Blog Article Outline', type: 'blog_post' as ContentType, platform: 'blog' as Platform, prompt: 'Create a detailed blog post outline with H2s and H3s.' },
  { name: 'Google Ads Copy', type: 'ad_copy' as ContentType, platform: 'google_ads' as Platform, prompt: 'Write 3 Google Ads headline and description variations.' },
  { name: 'Welcome Email Sequence', type: 'email' as ContentType, platform: 'email' as Platform, prompt: 'Write a 3-email welcome sequence.' },
  { name: 'Brand Tagline Set', type: 'tagline' as ContentType, platform: '' as Platform, prompt: 'Generate 5 unique tagline options.' },
  { name: 'Press Release', type: 'press_release' as ContentType, platform: '' as Platform, prompt: 'Write a professional press release.' },
];

const generatedSamples: Record<string, string> = {
  'Product Launch Post': `Introducing something that changes everything.\n\nWe didn't just build a product. We built a movement.\n\nAfter 18 months of relentless iteration, [PRODUCT] is finally here -- and it's designed for the people who refuse to settle.\n\nHere's what makes it different:\n- [Feature 1]: Because you deserve better than "good enough"\n- [Feature 2]: Built for the way you actually work\n- [Feature 3]: The detail that competitors keep skipping\n\nThis isn't an upgrade. It's a new standard.\n\nEarly adopters get [OFFER]. The clock starts now.\n\nLink in bio. #LaunchDay #Innovation`,
  'Blog Article Outline': `# [Topic]: The Complete Guide for 2026\n\n## Introduction\n- Hook: The problem your audience faces\n- Why this matters NOW\n\n## Section 1: Understanding the Fundamentals\n### What is [Topic]?\n### Why Traditional Approaches Fall Short\n\n## Section 2: 5 Strategies That Actually Work\n### Strategy 1: [Name]\n### Strategy 2: [Name]\n\n## Section 3: Measuring Success\n### Key Metrics to Track\n\n## Conclusion\n- Key takeaways\n- Next steps`,
  'Google Ads Copy': `Headline Options (30 chars):\n1. Transform Your Workflow\n2. Stop Settling for Less\n3. Built for Modern Teams\n\nDescription Options (90 chars):\n1. Join 10,000+ teams who switched to a smarter way to work. Start your free trial today.\n2. The all-in-one platform that eliminates busywork. See why top teams choose us.`,
  'Welcome Email Sequence': `EMAIL 1: Welcome & Value\nSubject: You're in. Here's what happens next.\nBody: Welcome aboard! You just joined [X] professionals who are [benefit]...\n\nEMAIL 2: Social Proof (Day 2)\nSubject: How [Customer] achieved [result] in 30 days\nBody: When [Customer] first tried [Brand], they were skeptical...\n\nEMAIL 3: First Action (Day 4)\nSubject: Your next move (takes 2 minutes)\nBody: You've seen the value. Now it's time to take your first real step...`,
  'Brand Tagline Set': `1. "Where ambition meets execution"\n2. "Built different. By design."\n3. "Your edge, amplified"\n4. "The standard, redefined"\n5. "Progress, powered"`,
  'Press Release': `FOR IMMEDIATE RELEASE\n\n[BRAND] Launches [PRODUCT]: A New Standard in [INDUSTRY]\n\n[City, State] -- [Date] -- [Brand] today announced the launch of [Product], a groundbreaking solution designed to [key benefit].\n\n"[Quote from CEO]," said [Name], CEO of [Brand].\n\n[Product] features [3 key features], addressing the growing demand for [market need].\n\nContact: [Name] | [Email] | [Phone]`,
};

export default function ContentForge() {
  const [contents, setContents] = useState<ContentPiece[]>([]);
  const [showGenerator, setShowGenerator] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<typeof aiTemplates[0] | null>(null);
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState<ContentType | 'all'>('all');

  useEffect(() => { fetchContent(); }, []);

  async function fetchContent() {
    const { data } = await supabase.from('content_pieces').select('*').order('created_at', { ascending: false });
    if (data) setContents(data as ContentPiece[]);
  }

  async function generateContent(template: typeof aiTemplates[0]) {
    setSelectedTemplate(template); setGenerating(true); setShowGenerator(true); setGeneratedContent('');
    const fullText = generatedSamples[template.name] || `Generated content for: ${template.name}`;
    let i = 0;
    const interval = setInterval(() => {
      setGeneratedContent(fullText.slice(0, i + 3)); i += 3;
      if (i >= fullText.length) { clearInterval(interval); setGenerating(false); }
    }, 15);
  }

  async function saveContent() {
    if (!selectedTemplate || !generatedContent) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('content_pieces').insert({ user_id: user.id, title: selectedTemplate.name, content_type: selectedTemplate.type, platform: selectedTemplate.platform, body: generatedContent, ai_model: 'gpt-4' }).select().single();
    if (data) { setContents([data as ContentPiece, ...contents]); setShowGenerator(false); setGeneratedContent(''); setSelectedTemplate(null); }
  }

  function copyToClipboard(text: string) { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }

  const filtered = filter === 'all' ? contents : contents.filter(c => c.content_type === filter);

  return (
    <div className="p-6 bg-grid min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-theme-primary">Content Forge</h2>
          <p className="text-sm text-theme-muted">AI-powered content generation for every channel</p>
        </div>
        <button onClick={() => setShowGenerator(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-theme-primary text-sm font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all glow-blue">
          <Sparkles size={15} /> Generate Content
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {aiTemplates.map((template) => (
          <button key={template.name} onClick={() => generateContent(template)} className="bg-theme-surface-80 border border-theme-default rounded-xl p-3 text-left hover:border-cyan-500/30 hover:bg-slate-800/80 transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-theme-muted group-hover:text-cyan-400 transition-colors">{contentTypes.find(t => t.value === template.type)?.icon}</span>
              <span className="text-[10px] font-bold text-theme-faint group-hover:text-cyan-400/60 uppercase transition-colors">{template.type.replace('_', ' ')}</span>
            </div>
            <p className="text-xs font-semibold text-theme-secondary group-hover:text-theme-primary transition-colors truncate">{template.name}</p>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <button onClick={() => setFilter('all')} className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${filter === 'all' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-theme-elevated text-theme-tertiary border border-theme-muted'}`}>All</button>
        {contentTypes.map((ct) => (
          <button key={ct.value} onClick={() => setFilter(ct.value)} className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all flex items-center gap-1.5 ${filter === ct.value ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-theme-elevated text-theme-tertiary border border-theme-muted'}`}>{ct.icon} {ct.label}</button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-theme-surface-80 border border-theme-default rounded-xl p-12 text-center">
            <PenTool size={32} className="text-theme-faint mx-auto mb-3" />
            <p className="text-sm text-theme-tertiary font-medium">No content yet</p>
            <p className="text-xs text-theme-faint mt-1">Use AI templates above to generate your first piece</p>
          </div>
        )}
        {filtered.map((piece) => (
          <div key={piece.id} className="bg-theme-surface-80 border border-theme-default rounded-xl p-4 hover:border-theme-muted-50 transition-all group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-theme-muted">{contentTypes.find(t => t.value === piece.content_type)?.icon}</span>
                <h4 className="text-sm font-semibold text-theme-primary">{piece.title}</h4>
                <span className="text-[10px] font-bold text-theme-muted bg-theme-elevated px-2 py-0.5 rounded-full uppercase">{piece.content_type.replace('_', ' ')}</span>
              </div>
              <button onClick={() => copyToClipboard(piece.body)} className="opacity-0 group-hover:opacity-100 transition-opacity text-theme-muted hover:text-theme-primary p-1">
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
            <p className="text-xs text-theme-tertiary line-clamp-2 whitespace-pre-wrap">{piece.body}</p>
          </div>
        ))}
      </div>

      {showGenerator && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => { if (!generating) setShowGenerator(false); }}>
          <div className="bg-theme-surface border border-theme-default rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-theme-default flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2"><Sparkles size={16} className="text-cyan-400" /><h3 className="text-sm font-bold text-theme-primary">{generating ? 'Generating...' : selectedTemplate ? selectedTemplate.name : 'Generate Content'}</h3></div>
              {!generating && <button onClick={() => setShowGenerator(false)} className="text-theme-muted hover:text-theme-primary"><X size={16} /></button>}
            </div>
            {!selectedTemplate && !generating && !generatedContent ? (
              <div className="p-5 space-y-3 overflow-y-auto">
                <p className="text-xs text-theme-muted font-medium mb-2">Choose a template:</p>
                {aiTemplates.map((template) => (
                  <button key={template.name} onClick={() => generateContent(template)} className="w-full text-left bg-theme-elevated-50 border border-theme-muted-50 rounded-xl p-4 hover:border-cyan-500/30 transition-all">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-theme-muted">{contentTypes.find(t => t.value === template.type)?.icon}</span>
                      <h4 className="text-sm font-semibold text-theme-primary">{template.name}</h4>
                    </div>
                    <p className="text-xs text-theme-muted">{template.prompt.slice(0, 80)}...</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-5">
                <div className="bg-theme-elevated-50 border border-theme-default rounded-xl p-4">
                  {generating && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 typing-dot-1" />
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 typing-dot-2" />
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 typing-dot-3" />
                      </div>
                      <span className="text-[10px] text-cyan-400 font-medium">AI is writing...</span>
                    </div>
                  )}
                  <pre className="text-sm text-theme-secondary whitespace-pre-wrap font-sans leading-relaxed">{generatedContent}</pre>
                </div>
              </div>
            )}
            {generatedContent && !generating && (
              <div className="px-5 py-4 border-t border-theme-default flex items-center gap-3 flex-shrink-0">
                <button onClick={saveContent} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-theme-primary text-sm font-semibold rounded-lg hover:from-blue-400 hover:to-cyan-400 transition-all">Save to Library</button>
                <button onClick={() => copyToClipboard(generatedContent)} className="flex items-center gap-2 px-4 py-2 bg-theme-elevated text-theme-secondary text-sm font-semibold rounded-lg hover:bg-slate-700 transition-colors">
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy'}
                </button>
                <button onClick={() => selectedTemplate && generateContent(selectedTemplate)} className="flex items-center gap-2 px-4 py-2 bg-theme-elevated text-theme-secondary text-sm font-semibold rounded-lg hover:bg-slate-700 transition-colors ml-auto">
                  <RefreshCw size={14} /> Regenerate
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
