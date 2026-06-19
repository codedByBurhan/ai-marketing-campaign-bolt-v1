import { useState, useEffect } from 'react';
import { Megaphone, Plus, Play, Pause, CheckCircle2, X, Calendar, DollarSign, Target, Eye, MousePointerClick, TrendingUp, Clock, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Campaign {
  id: string; name: string; description: string; status: 'draft' | 'active' | 'paused' | 'completed';
  budget: number; spent: number; channels: string[]; start_date: string | null; end_date: string | null;
  impressions: number; clicks: number; conversions: number; revenue: number;
}

const statusConfig = {
  draft: { label: 'Draft', color: 'text-theme-tertiary', bg: 'bg-slate-500/20', icon: <Clock size={12} /> },
  active: { label: 'Active', color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: <Play size={12} /> },
  paused: { label: 'Paused', color: 'text-amber-400', bg: 'bg-amber-500/20', icon: <Pause size={12} /> },
  completed: { label: 'Completed', color: 'text-blue-400', bg: 'bg-blue-500/20', icon: <CheckCircle2 size={12} /> },
};

const channelOptions = ['Instagram', 'Google Ads', 'LinkedIn', 'Facebook', 'TikTok', 'Email', 'YouTube', 'Twitter/X'];

export default function CampaignHub() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [formData, setFormData] = useState({ name: '', description: '', budget: 0, channels: [] as string[], start_date: '', end_date: '' });

  useEffect(() => { fetchCampaigns(); }, []);

  async function fetchCampaigns() {
    const { data } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false });
    if (data) setCampaigns(data as Campaign[]);
  }

  async function createCampaign() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('campaigns').insert({ user_id: user.id, name: formData.name, description: formData.description, budget: formData.budget, channels: formData.channels, start_date: formData.start_date || null, end_date: formData.end_date || null, status: 'draft' }).select().single();
    if (data) { setCampaigns([data as Campaign, ...campaigns]); setShowCreate(false); setFormData({ name: '', description: '', budget: 0, channels: [], start_date: '', end_date: '' }); }
  }

  async function updateStatus(campaign: Campaign, newStatus: Campaign['status']) {
    const { data } = await supabase.from('campaigns').update({ status: newStatus }).eq('id', campaign.id).select().single();
    if (data) setCampaigns(campaigns.map(c => c.id === campaign.id ? data as Campaign : c));
  }

  function toggleChannel(channel: string) {
    setFormData(f => ({ ...f, channels: f.channels.includes(channel) ? f.channels.filter(c => c !== channel) : [...f.channels, channel] }));
  }

  const filtered = statusFilter === 'all' ? campaigns : campaigns.filter(c => c.status === statusFilter);
  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const totalBudget = campaigns.reduce((s, c) => s + Number(c.budget), 0);
  const totalSpent = campaigns.reduce((s, c) => s + Number(c.spent), 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);

  return (
    <div className="p-6 bg-grid min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-theme-primary">Campaign Hub</h2>
          <p className="text-sm text-theme-muted">Launch, manage, and optimize your marketing campaigns</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-theme-primary text-sm font-semibold rounded-lg hover:from-blue-400 hover:to-cyan-400 transition-all glow-blue">
          <Plus size={15} /> New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-theme-surface-80 border border-theme-default rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Megaphone size={14} className="text-blue-400" /><span className="text-xs text-theme-muted font-medium">Active Campaigns</span></div>
          <p className="text-2xl font-bold text-theme-primary">{activeCampaigns.length}</p>
        </div>
        <div className="bg-theme-surface-80 border border-theme-default rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><DollarSign size={14} className="text-emerald-400" /><span className="text-xs text-theme-muted font-medium">Total Budget</span></div>
          <p className="text-2xl font-bold text-theme-primary">${totalBudget.toLocaleString()}</p>
        </div>
        <div className="bg-theme-surface-80 border border-theme-default rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingUp size={14} className="text-amber-400" /><span className="text-xs text-theme-muted font-medium">Total Spent</span></div>
          <p className="text-2xl font-bold text-theme-primary">${totalSpent.toLocaleString()}</p>
          <div className="mt-2 h-1.5 bg-theme-elevated rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full" style={{ width: totalBudget > 0 ? `${(totalSpent / totalBudget) * 100}%` : '0%' }} />
          </div>
        </div>
        <div className="bg-theme-surface-80 border border-theme-default rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Target size={14} className="text-cyan-400" /><span className="text-xs text-theme-muted font-medium">Conversions</span></div>
          <p className="text-2xl font-bold text-theme-primary">{totalConversions.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Filter size={14} className="text-theme-muted" />
        {['all', 'draft', 'active', 'paused', 'completed'].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 text-xs font-medium rounded-full capitalize transition-all ${statusFilter === s ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-theme-elevated text-theme-tertiary border border-theme-muted'}`}>{s}</button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-theme-surface-80 border border-theme-default rounded-xl p-12 text-center">
            <Megaphone size={32} className="text-theme-faint mx-auto mb-3" />
            <p className="text-sm text-theme-tertiary font-medium">No campaigns yet</p>
          </div>
        )}
        {filtered.map((campaign) => {
          const config = statusConfig[campaign.status];
          const budgetUsed = campaign.budget > 0 ? (Number(campaign.spent) / Number(campaign.budget)) * 100 : 0;
          const ctr = campaign.impressions > 0 ? ((campaign.clicks / campaign.impressions) * 100).toFixed(2) : '0.00';
          const cpa = campaign.conversions > 0 ? (Number(campaign.spent) / campaign.conversions).toFixed(2) : '--';
          return (
            <div key={campaign.id} className="bg-theme-surface-80 border border-theme-default rounded-xl p-5 hover:border-theme-muted-50 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-sm font-bold text-theme-primary">{campaign.name}</h3>
                    <span className={`flex items-center gap-1 text-[10px] font-bold ${config.color} ${config.bg} px-2 py-0.5 rounded-full`}>{config.icon} {config.label}</span>
                  </div>
                  {campaign.description && <p className="text-xs text-theme-muted">{campaign.description}</p>}
                </div>
                <div className="flex items-center gap-1">
                  {campaign.status === 'draft' && <button onClick={() => updateStatus(campaign, 'active')} className="p-1.5 text-theme-muted hover:text-emerald-400 transition-colors" title="Launch"><Play size={14} /></button>}
                  {campaign.status === 'active' && <button onClick={() => updateStatus(campaign, 'paused')} className="p-1.5 text-theme-muted hover:text-amber-400 transition-colors" title="Pause"><Pause size={14} /></button>}
                  {campaign.status === 'paused' && <button onClick={() => updateStatus(campaign, 'active')} className="p-1.5 text-theme-muted hover:text-emerald-400 transition-colors" title="Resume"><Play size={14} /></button>}
                  {(campaign.status === 'active' || campaign.status === 'paused') && <button onClick={() => updateStatus(campaign, 'completed')} className="p-1.5 text-theme-muted hover:text-blue-400 transition-colors" title="Complete"><CheckCircle2 size={14} /></button>}
                </div>
              </div>
              {campaign.channels.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {campaign.channels.map((ch) => <span key={ch} className="text-[10px] font-bold text-theme-tertiary bg-theme-elevated px-2 py-0.5 rounded-full">{ch}</span>)}
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-theme-elevated-50 rounded-lg p-2.5">
                  <div className="flex items-center gap-1 mb-0.5"><DollarSign size={10} className="text-theme-muted" /><span className="text-[10px] text-theme-muted">Budget</span></div>
                  <p className="text-xs font-bold text-theme-primary">${Number(campaign.budget).toLocaleString()}</p>
                  <div className="mt-1 h-1 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: `${Math.min(budgetUsed, 100)}%` }} /></div>
                </div>
                <div className="bg-theme-elevated-50 rounded-lg p-2.5">
                  <div className="flex items-center gap-1 mb-0.5"><Eye size={10} className="text-theme-muted" /><span className="text-[10px] text-theme-muted">Impressions</span></div>
                  <p className="text-xs font-bold text-theme-primary">{campaign.impressions.toLocaleString()}</p>
                </div>
                <div className="bg-theme-elevated-50 rounded-lg p-2.5">
                  <div className="flex items-center gap-1 mb-0.5"><MousePointerClick size={10} className="text-theme-muted" /><span className="text-[10px] text-theme-muted">CTR</span></div>
                  <p className="text-xs font-bold text-theme-primary">{ctr}%</p>
                </div>
                <div className="bg-theme-elevated-50 rounded-lg p-2.5">
                  <div className="flex items-center gap-1 mb-0.5"><Target size={10} className="text-theme-muted" /><span className="text-[10px] text-theme-muted">Conversions</span></div>
                  <p className="text-xs font-bold text-theme-primary">{campaign.conversions.toLocaleString()}</p>
                </div>
                <div className="bg-theme-elevated-50 rounded-lg p-2.5">
                  <div className="flex items-center gap-1 mb-0.5"><TrendingUp size={10} className="text-theme-muted" /><span className="text-[10px] text-theme-muted">CPA</span></div>
                  <p className="text-xs font-bold text-theme-primary">${cpa}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowCreate(false)}>
          <div className="bg-theme-surface border border-theme-default rounded-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-theme-primary">New Campaign</h3>
              <button onClick={() => setShowCreate(false)} className="text-theme-muted hover:text-theme-primary"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-theme-tertiary font-medium mb-1.5 block">Campaign Name</label>
                <input value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} className="w-full h-9 px-3 text-sm bg-theme-elevated border border-theme-muted rounded-lg text-theme-primary focus:outline-none focus:border-blue-500/50" placeholder="e.g. Summer Launch" />
              </div>
              <div>
                <label className="text-xs text-theme-tertiary font-medium mb-1.5 block">Description</label>
                <textarea value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} className="w-full h-20 px-3 py-2 text-sm bg-theme-elevated border border-theme-muted rounded-lg text-theme-primary focus:outline-none focus:border-blue-500/50 resize-none" placeholder="Campaign goals..." />
              </div>
              <div>
                <label className="text-xs text-theme-tertiary font-medium mb-1.5 block">Budget ($)</label>
                <input type="number" value={formData.budget || ''} onChange={e => setFormData(f => ({ ...f, budget: Number(e.target.value) }))} className="w-full h-9 px-3 text-sm bg-theme-elevated border border-theme-muted rounded-lg text-theme-primary focus:outline-none focus:border-blue-500/50" placeholder="0" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-theme-tertiary font-medium mb-1.5 flex items-center gap-1"><Calendar size={10} /> Start Date</label>
                  <input type="date" value={formData.start_date} onChange={e => setFormData(f => ({ ...f, start_date: e.target.value }))} className="w-full h-9 px-3 text-sm bg-theme-elevated border border-theme-muted rounded-lg text-theme-primary focus:outline-none focus:border-blue-500/50" />
                </div>
                <div>
                  <label className="text-xs text-theme-tertiary font-medium mb-1.5 flex items-center gap-1"><Calendar size={10} /> End Date</label>
                  <input type="date" value={formData.end_date} onChange={e => setFormData(f => ({ ...f, end_date: e.target.value }))} className="w-full h-9 px-3 text-sm bg-theme-elevated border border-theme-muted rounded-lg text-theme-primary focus:outline-none focus:border-blue-500/50" />
                </div>
              </div>
              <div>
                <label className="text-xs text-theme-tertiary font-medium mb-1.5 block">Channels</label>
                <div className="flex flex-wrap gap-2">
                  {channelOptions.map((ch) => (
                    <button key={ch} onClick={() => toggleChannel(ch)} className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${formData.channels.includes(ch) ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-theme-elevated text-theme-tertiary border border-theme-muted'}`}>{ch}</button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={createCampaign} disabled={!formData.name} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-theme-primary text-sm font-semibold rounded-lg hover:from-blue-400 hover:to-cyan-400 transition-all disabled:opacity-50">Create Campaign</button>
                <button onClick={() => setShowCreate(false)} className="px-5 py-2.5 bg-theme-elevated text-theme-tertiary text-sm font-semibold rounded-lg hover:bg-slate-700 transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
