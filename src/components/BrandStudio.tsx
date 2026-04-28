import { useState, useEffect } from 'react';
import { Palette, Plus, Sparkles, Type, Target, Users, Save, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Brand {
  id: string; name: string; industry: string; tagline: string; description: string;
  primary_color: string; secondary_color: string; accent_color: string;
  font_heading: string; font_body: string; tone_of_voice: string;
  target_audience: string; competitive_diff: string;
}

const toneOptions = ['professional', 'casual', 'bold', 'friendly', 'luxurious', 'playful', 'authoritative', 'empathetic'];

const aiBrandSuggestions = [
  { name: 'Nexora', tagline: 'Where innovation meets impact', industry: 'Technology', tone: 'bold' },
  { name: 'Verdant Co.', tagline: 'Sustainable by design', industry: 'Sustainability', tone: 'friendly' },
  { name: 'Luminary', tagline: 'Illuminate your potential', industry: 'Education', tone: 'authoritative' },
  { name: 'CraftHaus', tagline: 'Built different, by design', industry: 'Design', tone: 'playful' },
];

export default function BrandStudio() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', industry: '', tagline: '', description: '',
    primary_color: '#3B82F6', secondary_color: '#10B981', accent_color: '#F59E0B',
    font_heading: 'Inter', font_body: 'Inter', tone_of_voice: 'professional',
    target_audience: '', competitive_diff: '',
  });

  useEffect(() => { fetchBrands(); }, []);

  async function fetchBrands() {
    const { data } = await supabase.from('brands').select('*').order('created_at', { ascending: false });
    if (data) setBrands(data as Brand[]);
  }

  async function createBrand() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const { data } = await supabase.from('brands').insert({ ...formData, user_id: user.id }).select().single();
    if (data) { setBrands([data as Brand, ...brands]); setSelectedBrand(data as Brand); setShowCreate(false); resetForm(); }
    setLoading(false);
  }

  async function updateBrand() {
    if (!selectedBrand) return;
    setLoading(true);
    const { data } = await supabase.from('brands').update({ ...formData, updated_at: new Date().toISOString() }).eq('id', selectedBrand.id).select().single();
    if (data) { setSelectedBrand(data as Brand); setBrands(brands.map(b => b.id === selectedBrand.id ? data as Brand : b)); }
    setLoading(false);
  }

  function resetForm() {
    setFormData({ name: '', industry: '', tagline: '', description: '', primary_color: '#3B82F6', secondary_color: '#10B981', accent_color: '#F59E0B', font_heading: 'Inter', font_body: 'Inter', tone_of_voice: 'professional', target_audience: '', competitive_diff: '' });
  }

  function selectBrand(brand: Brand) {
    setSelectedBrand(brand);
    setFormData({ name: brand.name, industry: brand.industry, tagline: brand.tagline, description: brand.description, primary_color: brand.primary_color, secondary_color: brand.secondary_color, accent_color: brand.accent_color, font_heading: brand.font_heading, font_body: brand.font_body, tone_of_voice: brand.tone_of_voice, target_audience: brand.target_audience, competitive_diff: brand.competitive_diff });
    setShowCreate(false);
  }

  function applyAISuggestion(s: typeof aiBrandSuggestions[0]) {
    setFormData(f => ({ ...f, name: s.name, tagline: s.tagline, industry: s.industry, tone_of_voice: s.tone }));
    setShowAIGenerator(false); setShowCreate(true);
  }

  return (
    <div className="p-6 bg-grid min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-theme-primary">Brand DNA Vault</h2>
          <p className="text-sm text-theme-muted">Define, refine, and deploy your brand identity</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAIGenerator(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-theme-primary text-sm font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all glow-blue">
            <Sparkles size={15} /> AI Generate
          </button>
          <button onClick={() => { resetForm(); setShowCreate(true); setSelectedBrand(null); }} className="flex items-center gap-2 px-4 py-2 bg-theme-elevated border border-theme-muted text-theme-secondary text-sm font-semibold rounded-lg hover:bg-slate-700 transition-colors">
            <Plus size={15} /> New Brand
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          {brands.length === 0 && !showCreate && (
            <div className="bg-theme-surface-80 border border-theme-default rounded-xl p-8 text-center">
              <Palette size={32} className="text-theme-faint mx-auto mb-3" />
              <p className="text-sm text-theme-tertiary font-medium">No brands yet</p>
              <p className="text-xs text-theme-faint mt-1">Create your first brand or use AI to generate one</p>
            </div>
          )}
          {brands.map((brand) => (
            <button key={brand.id} onClick={() => selectBrand(brand)} className={`w-full text-left bg-theme-surface-80 border rounded-xl p-4 transition-all hover:border-theme-muted-50 ${selectedBrand?.id === brand.id ? 'border-blue-500/50 glow-blue' : 'border-theme-default'}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: brand.primary_color }} />
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: brand.secondary_color }} />
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: brand.accent_color }} />
                </div>
                <h4 className="text-sm font-bold text-theme-primary truncate">{brand.name}</h4>
              </div>
              <p className="text-xs text-theme-muted truncate">{brand.tagline || brand.industry || 'No tagline set'}</p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2">
          {(showCreate || selectedBrand) ? (
            <div className="bg-theme-surface-80 border border-theme-default rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-theme-default flex items-center justify-between">
                <h3 className="text-sm font-bold text-theme-primary">{selectedBrand && !showCreate ? 'Edit Brand' : 'Create Brand'}</h3>
                <button onClick={() => { setShowCreate(false); setSelectedBrand(null); }} className="text-theme-muted hover:text-theme-primary"><X size={16} /></button>
              </div>
              <div className="p-5 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-theme-tertiary font-medium mb-1.5 block">Brand Name</label>
                    <input value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} className="w-full h-9 px-3 text-sm bg-theme-elevated border border-theme-muted rounded-lg text-theme-primary focus:outline-none focus:border-blue-500/50" placeholder="e.g. Nexora" />
                  </div>
                  <div>
                    <label className="text-xs text-theme-tertiary font-medium mb-1.5 block">Industry</label>
                    <input value={formData.industry} onChange={e => setFormData(f => ({ ...f, industry: e.target.value }))} className="w-full h-9 px-3 text-sm bg-theme-elevated border border-theme-muted rounded-lg text-theme-primary focus:outline-none focus:border-blue-500/50" placeholder="e.g. Technology" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-theme-tertiary font-medium mb-1.5 block">Tagline</label>
                  <input value={formData.tagline} onChange={e => setFormData(f => ({ ...f, tagline: e.target.value }))} className="w-full h-9 px-3 text-sm bg-theme-elevated border border-theme-muted rounded-lg text-theme-primary focus:outline-none focus:border-blue-500/50" placeholder="Your brand's one-liner" />
                </div>
                <div>
                  <label className="text-xs text-theme-tertiary font-medium mb-1.5 block">Brand Colors</label>
                  <div className="flex gap-4">
                    {(['primary_color', 'secondary_color', 'accent_color'] as const).map((key) => (
                      <div key={key} className="flex items-center gap-2">
                        <input type="color" value={formData[key]} onChange={e => setFormData(f => ({ ...f, [key]: e.target.value }))} className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent" />
                        <div>
                          <p className="text-[10px] text-theme-muted capitalize">{key.replace('_color', '')}</p>
                          <p className="text-xs text-theme-secondary font-mono">{formData[key]}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-theme-tertiary font-medium mb-1.5 flex items-center gap-1.5"><Type size={12} /> Tone of Voice</label>
                  <div className="flex flex-wrap gap-2">
                    {toneOptions.map((tone) => (
                      <button key={tone} onClick={() => setFormData(f => ({ ...f, tone_of_voice: tone }))} className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${formData.tone_of_voice === tone ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-theme-elevated text-theme-tertiary border border-theme-muted hover:border-theme-faint'}`}>{tone}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-theme-tertiary font-medium mb-1.5 flex items-center gap-1.5"><Users size={12} /> Target Audience</label>
                  <textarea value={formData.target_audience} onChange={e => setFormData(f => ({ ...f, target_audience: e.target.value }))} className="w-full h-20 px-3 py-2 text-sm bg-theme-elevated border border-theme-muted rounded-lg text-theme-primary focus:outline-none focus:border-blue-500/50 resize-none" placeholder="Describe your ideal customer..." />
                </div>
                <div>
                  <label className="text-xs text-theme-tertiary font-medium mb-1.5 flex items-center gap-1.5"><Target size={12} /> Competitive Differentiator</label>
                  <textarea value={formData.competitive_diff} onChange={e => setFormData(f => ({ ...f, competitive_diff: e.target.value }))} className="w-full h-20 px-3 py-2 text-sm bg-theme-elevated border border-theme-muted rounded-lg text-theme-primary focus:outline-none focus:border-blue-500/50 resize-none" placeholder="What makes you different..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={selectedBrand && !showCreate ? updateBrand : createBrand} disabled={loading || !formData.name} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-theme-primary text-sm font-semibold rounded-lg hover:from-blue-400 hover:to-cyan-400 transition-all disabled:opacity-50">
                    <Save size={14} /> {loading ? 'Saving...' : selectedBrand && !showCreate ? 'Update Brand' : 'Create Brand'}
                  </button>
                  <button onClick={() => { setShowCreate(false); setSelectedBrand(null); }} className="px-5 py-2.5 bg-theme-elevated text-theme-tertiary text-sm font-semibold rounded-lg hover:bg-slate-700 transition-colors">Cancel</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-theme-surface-80 border border-theme-default rounded-xl p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4"><Palette size={28} className="text-blue-400" /></div>
              <h3 className="text-lg font-bold text-theme-primary mb-2">Select a Brand</h3>
              <p className="text-sm text-theme-muted">Choose a brand from the list or create a new one</p>
            </div>
          )}
        </div>
      </div>

      {showAIGenerator && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowAIGenerator(false)}>
          <div className="bg-theme-surface border border-theme-default rounded-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2"><Sparkles size={18} className="text-cyan-400" /><h3 className="text-base font-bold text-theme-primary">AI Brand Generator</h3></div>
              <button onClick={() => setShowAIGenerator(false)} className="text-theme-muted hover:text-theme-primary"><X size={16} /></button>
            </div>
            <p className="text-xs text-theme-tertiary mb-4">AI-generated brand concepts. Click to use as a starting point.</p>
            <div className="space-y-3">
              {aiBrandSuggestions.map((s, i) => (
                <button key={i} onClick={() => applyAISuggestion(s)} className="w-full text-left bg-theme-elevated-50 border border-theme-muted-50 rounded-xl p-4 hover:border-cyan-500/30 hover:bg-theme-elevated transition-all group">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-theme-primary">{s.name}</h4>
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">{s.tone}</span>
                  </div>
                  <p className="text-xs text-theme-tertiary italic">"{s.tagline}"</p>
                  <p className="text-[11px] text-theme-faint mt-1">{s.industry}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
