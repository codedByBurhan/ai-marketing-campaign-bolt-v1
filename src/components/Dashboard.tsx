import { useState, useEffect } from 'react';
import {
  Eye, MousePointerClick, DollarSign, Users,
  ArrowUpRight, ArrowDownRight, Sparkles, Target, Zap, Globe, Activity,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const kpis = [
  { label: 'Total Impressions', value: '2.4M', change: 12.5, icon: <Eye size={20} />, color: 'text-blue-400' },
  { label: 'Click Rate', value: '4.8%', change: 3.2, icon: <MousePointerClick size={20} />, color: 'text-cyan-400' },
  { label: 'Conversions', value: '12,847', change: -2.1, icon: <Target size={20} />, color: 'text-emerald-400' },
  { label: 'Revenue', value: '$84.2K', change: 18.7, icon: <DollarSign size={20} />, color: 'text-amber-400' },
  { label: 'Active Users', value: '34,291', change: 5.4, icon: <Users size={20} />, color: 'text-rose-400' },
  { label: 'Engagement', value: '8.3%', change: 1.8, icon: <Activity size={20} />, color: 'text-teal-400' },
];

const aiInsights = [
  { title: 'Optimal Posting Window', desc: 'Your audience engagement peaks between 2-4 PM EST on Tuesdays and Thursdays. Consider shifting 30% of your budget to these slots.', impact: 'high' },
  { title: 'Content Gap Detected', desc: 'Competitors are dominating "sustainable packaging" keywords. Creating 3-5 blog posts could capture 12K monthly searches.', impact: 'high' },
  { title: 'Budget Reallocation', desc: 'Meta Ads are outperforming Google Ads 2.3x on ROAS. Consider shifting 15% budget from Google to Meta.', impact: 'medium' },
  { title: 'Audience Segment Growth', desc: 'The 25-34 eco-conscious segment grew 23% this month. Tailor messaging to sustainability themes.', impact: 'medium' },
];

const channelData = [
  { name: 'Instagram', value: 38, color: 'bg-pink-500' },
  { name: 'Google Ads', value: 24, color: 'bg-blue-500' },
  { name: 'LinkedIn', value: 18, color: 'bg-cyan-500' },
  { name: 'Email', value: 12, color: 'bg-emerald-500' },
  { name: 'TikTok', value: 8, color: 'bg-amber-500' },
];

const recentActivity = [
  { action: 'Campaign launched', detail: '"Summer Collection 2026" is now live', time: '2m ago', icon: <Zap size={14} className="text-blue-400" /> },
  { action: 'Content published', detail: '5 Instagram posts scheduled', time: '15m ago', icon: <Globe size={14} className="text-emerald-400" /> },
  { action: 'Budget alert', detail: 'Google Ads at 85% of monthly budget', time: '1h ago', icon: <DollarSign size={14} className="text-amber-400" /> },
  { action: 'AI suggestion', detail: 'New tagline variants generated', time: '2h ago', icon: <Sparkles size={14} className="text-cyan-400" /> },
];

export default function Dashboard() {
  const [campaignCount, setCampaignCount] = useState(0);
  const [contentCount, setContentCount] = useState(0);

  useEffect(() => {
    async function fetchCounts() {
      const { count: cCount } = await supabase.from('campaigns').select('*', { count: 'exact', head: true });
      const { count: pCount } = await supabase.from('content_pieces').select('*', { count: 'exact', head: true });
      setCampaignCount(cCount ?? 0);
      setContentCount(pCount ?? 0);
    }
    fetchCounts();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-grid min-h-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="relative bg-theme-surface-80 border border-theme-default rounded-xl p-4 hover:border-theme-muted-50 transition-all duration-300 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-theme-surface-50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className={kpi.color}>{kpi.icon}</span>
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${kpi.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {kpi.change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {Math.abs(kpi.change)}%
                </span>
              </div>
              <p className="text-xl font-bold text-theme-primary mb-0.5">{kpi.value}</p>
              <p className="text-[11px] text-theme-muted font-medium">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-theme-surface-80 border border-theme-default rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-theme-default flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-cyan-400" />
              <h3 className="text-sm font-bold text-theme-primary">AI Insights</h3>
            </div>
            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-full">4 NEW</span>
          </div>
          <div className="divide-y divide-theme-default">
            {aiInsights.map((insight, i) => (
              <div key={i} className="px-5 py-4 hover:bg-theme-elevated-50 transition-colors group cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${insight.impact === 'high' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-theme-primary">{insight.title}</h4>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${insight.impact === 'high' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {insight.impact.toUpperCase()} IMPACT
                      </span>
                    </div>
                    <p className="text-xs text-theme-tertiary leading-relaxed">{insight.desc}</p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-blue-400 hover:text-blue-300 font-semibold whitespace-nowrap">Apply</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-theme-surface-80 border border-theme-default rounded-xl p-5">
            <h3 className="text-sm font-bold text-theme-primary mb-4">Channel Distribution</h3>
            <div className="space-y-3">
              {channelData.map((ch) => (
                <div key={ch.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-theme-secondary font-medium">{ch.name}</span>
                    <span className="text-xs text-theme-muted font-mono">{ch.value}%</span>
                  </div>
                  <div className="h-1.5 bg-theme-elevated rounded-full overflow-hidden">
                    <div className={`h-full ${ch.color} rounded-full transition-all duration-1000`} style={{ width: `${ch.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-theme-surface-80 border border-theme-default rounded-xl p-5">
            <h3 className="text-sm font-bold text-theme-primary mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((act, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 w-6 h-6 rounded-lg bg-theme-elevated flex items-center justify-center flex-shrink-0">{act.icon}</div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-theme-secondary">{act.action}</p>
                    <p className="text-[11px] text-theme-muted truncate">{act.detail}</p>
                  </div>
                  <span className="text-[10px] text-theme-faint whitespace-nowrap ml-auto">{act.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-theme-surface-80 border border-theme-default rounded-xl p-5">
            <h3 className="text-sm font-bold text-theme-primary mb-3">Workspace</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-theme-elevated-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-theme-primary">{campaignCount}</p>
                <p className="text-[10px] text-theme-muted font-medium">Campaigns</p>
              </div>
              <div className="bg-theme-elevated-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-theme-primary">{contentCount}</p>
                <p className="text-[10px] text-theme-muted font-medium">Content Pieces</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
