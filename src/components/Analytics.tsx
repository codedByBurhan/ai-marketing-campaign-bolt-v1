import { useState } from 'react';
import { BarChart3, TrendingUp, Eye, MousePointerClick, Target, DollarSign, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';

const monthlyData = [
  { month: 'Sep', impressions: 180000, clicks: 7200, conversions: 360, revenue: 14400 },
  { month: 'Oct', impressions: 220000, clicks: 9900, conversions: 495, revenue: 19800 },
  { month: 'Nov', impressions: 195000, clicks: 8775, conversions: 439, revenue: 17560 },
  { month: 'Dec', impressions: 310000, clicks: 15500, conversions: 775, revenue: 31000 },
  { month: 'Jan', impressions: 280000, clicks: 14000, conversions: 700, revenue: 28000 },
  { month: 'Feb', impressions: 350000, clicks: 17500, conversions: 875, revenue: 35000 },
  { month: 'Mar', impressions: 420000, clicks: 21000, conversions: 1050, revenue: 42000 },
  { month: 'Apr', impressions: 480000, clicks: 24000, conversions: 1200, revenue: 48000 },
];

const channelPerformance = [
  { name: 'Instagram', impressions: 480000, spend: 12000, roas: 4.0, color: '#E1306C' },
  { name: 'Google Ads', impressions: 320000, spend: 18000, roas: 2.7, color: '#4285F4' },
  { name: 'LinkedIn', impressions: 180000, spend: 8000, roas: 2.3, color: '#0A66C2' },
  { name: 'Email', impressions: 120000, spend: 2000, roas: 12.6, color: '#10B981' },
  { name: 'TikTok', impressions: 280000, spend: 6000, roas: 2.8, color: '#F59E0B' },
];

const topContent = [
  { title: 'Summer Collection Launch', type: 'Instagram Post', impressions: 125000, engagement: 8.4 },
  { title: 'Sustainability Blog Series', type: 'Blog Post', impressions: 89000, engagement: 6.2 },
  { title: 'Flash Sale Email', type: 'Email', impressions: 45000, engagement: 12.1 },
  { title: 'Product Demo Reel', type: 'TikTok', impressions: 210000, engagement: 5.8 },
  { title: 'Brand Story Carousel', type: 'LinkedIn', impressions: 67000, engagement: 4.3 },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('6m');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const maxImpressions = Math.max(...monthlyData.map(d => d.impressions));
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));
  const totalImpressions = monthlyData.reduce((s, d) => s + d.impressions, 0);
  const totalClicks = monthlyData.reduce((s, d) => s + d.clicks, 0);
  const totalConversions = monthlyData.reduce((s, d) => s + d.conversions, 0);
  const totalRevenue = monthlyData.reduce((s, d) => s + d.revenue, 0);
  const avgCTR = ((totalClicks / totalImpressions) * 100).toFixed(2);
  const avgCPA = (totalRevenue / totalConversions).toFixed(2);

  return (
    <div className="p-6 bg-grid min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-theme-primary">Analytics</h2>
          <p className="text-sm text-theme-muted">Performance insights across all channels</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-theme-surface border border-theme-default rounded-lg p-0.5">
            {['1m', '3m', '6m', '1y'].map((range) => (
              <button key={range} onClick={() => setTimeRange(range)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${timeRange === range ? 'bg-theme-elevated text-theme-primary' : 'text-theme-muted hover:text-theme-secondary'}`}>{range}</button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-theme-elevated border border-theme-muted text-theme-secondary text-xs font-semibold rounded-lg hover:bg-slate-700 transition-colors"><Download size={12} /> Export</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {[
          { label: 'Impressions', value: (totalImpressions / 1000000).toFixed(1) + 'M', change: 14.2, icon: <Eye size={16} />, color: 'text-blue-400' },
          { label: 'Clicks', value: (totalClicks / 1000).toFixed(1) + 'K', change: 8.7, icon: <MousePointerClick size={16} />, color: 'text-cyan-400' },
          { label: 'CTR', value: avgCTR + '%', change: 2.1, icon: <TrendingUp size={16} />, color: 'text-teal-400' },
          { label: 'Conversions', value: totalConversions.toLocaleString(), change: -1.3, icon: <Target size={16} />, color: 'text-emerald-400' },
          { label: 'Revenue', value: '$' + (totalRevenue / 1000).toFixed(0) + 'K', change: 22.4, icon: <DollarSign size={16} />, color: 'text-amber-400' },
          { label: 'Avg CPA', value: '$' + avgCPA, change: -5.8, icon: <BarChart3 size={16} />, color: 'text-rose-400' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-theme-surface-80 border border-theme-default rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className={kpi.color}>{kpi.icon}</span>
              <span className={`flex items-center gap-0.5 text-[10px] font-bold ${kpi.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {kpi.change >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}{Math.abs(kpi.change)}%
              </span>
            </div>
            <p className="text-lg font-bold text-theme-primary">{kpi.value}</p>
            <p className="text-[10px] text-theme-muted font-medium">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-theme-surface-80 border border-theme-default rounded-xl p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-theme-primary">Performance Over Time</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500" /><span className="text-[10px] text-theme-muted">Impressions</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span className="text-[10px] text-theme-muted">Revenue</span></div>
            </div>
          </div>
          <div className="flex items-end gap-3 h-48">
            {monthlyData.map((d, i) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1 relative" onMouseEnter={() => setHoveredBar(i)} onMouseLeave={() => setHoveredBar(null)}>
                {hoveredBar === i && (
                  <div className="absolute -top-16 bg-theme-elevated border border-theme-muted rounded-lg px-3 py-2 text-xs z-10 whitespace-nowrap">
                    <p className="text-theme-secondary font-semibold">{d.month}</p>
                    <p className="text-blue-400">{(d.impressions / 1000).toFixed(0)}K imp</p>
                    <p className="text-emerald-400">${(d.revenue / 1000).toFixed(0)}K rev</p>
                  </div>
                )}
                <div className="w-full flex gap-0.5 items-end h-full">
                  <div className="flex-1 bg-blue-500/60 rounded-t-sm transition-all duration-300 hover:bg-blue-400/80" style={{ height: `${(d.impressions / maxImpressions) * 100}%` }} />
                  <div className="flex-1 bg-emerald-500/60 rounded-t-sm transition-all duration-300 hover:bg-emerald-400/80" style={{ height: `${(d.revenue / maxRevenue) * 100}%` }} />
                </div>
                <span className="text-[10px] text-theme-faint font-medium">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-theme-surface-80 border border-theme-default rounded-xl p-5">
          <h3 className="text-sm font-bold text-theme-primary mb-4">Channel Performance</h3>
          <div className="space-y-4">
            {channelPerformance.map((ch) => (
              <div key={ch.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-theme-secondary font-medium">{ch.name}</span>
                  <span className="text-xs font-bold text-emerald-400">{ch.roas}x ROAS</span>
                </div>
                <div className="h-1.5 bg-theme-elevated rounded-full overflow-hidden mb-1">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(ch.impressions / 480000) * 100}%`, backgroundColor: ch.color }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-theme-faint">{(ch.impressions / 1000).toFixed(0)}K impressions</span>
                  <span className="text-[10px] text-theme-faint">${ch.spend.toLocaleString()} spent</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-theme-surface-80 border border-theme-default rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-theme-default"><h3 className="text-sm font-bold text-theme-primary">Top Performing Content</h3></div>
        <div className="divide-y divide-theme-default">
          {topContent.map((item, i) => (
            <div key={i} className="px-5 py-3 flex items-center gap-4 hover:bg-theme-elevated-50 transition-colors">
              <span className="text-xs font-bold text-theme-faint w-5">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-theme-primary truncate">{item.title}</p>
                <p className="text-[11px] text-theme-muted">{item.type}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-theme-primary">{(item.impressions / 1000).toFixed(0)}K</p>
                <p className="text-[10px] text-theme-muted">impressions</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-emerald-400">{item.engagement}%</p>
                <p className="text-[10px] text-theme-muted">engagement</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
