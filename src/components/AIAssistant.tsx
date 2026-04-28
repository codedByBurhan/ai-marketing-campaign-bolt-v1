import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Plus, Trash2, Target, TrendingUp, PenTool, Megaphone } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Message { id: string; role: 'user' | 'assistant'; content: string; }
interface Conversation { id: string; title: string; }

const quickPrompts = [
  { label: 'Analyze my brand positioning', icon: <Target size={14} />, prompt: 'Analyze my current brand positioning and suggest improvements based on market trends.' },
  { label: 'Create a content calendar', icon: <PenTool size={14} />, prompt: 'Create a 30-day content calendar for my brand across all social channels.' },
  { label: 'Optimize my ad spend', icon: <TrendingUp size={14} />, prompt: 'Review my current ad spend allocation and suggest optimizations for better ROAS.' },
  { label: 'Launch campaign strategy', icon: <Megaphone size={14} />, prompt: 'Help me develop a go-to-market strategy for a new product launch campaign.' },
];

const aiResponses: Record<string, string> = {
  'brand': `Great question! Let me analyze your brand positioning:\n\n**Current State Assessment:**\nYour brand sits in a competitive space where differentiation is key.\n\n1. **Strengths:** Your tone of voice is distinctive and your visual identity is cohesive.\n\n2. **Opportunities:**\n   - The sustainability-conscious segment is growing 23% YoY\n   - Competitors are under-serving the 25-34 demographic\n   - Video content in your niche has 3.2x higher engagement\n\n3. **Recommended Actions:**\n   - Shift 15% of budget to video-first platforms\n   - Develop a "sustainability story" content series\n   - Create a brand manifesto\n   - A/B test two tone variations\n\nWant me to draft the brand manifesto or create the content series outline?`,
  'content': `Here's your 30-day content calendar:\n\n**Week 1: Brand Story**\n- Mon: Brand origin story (Instagram Carousel)\n- Tue: Customer spotlight (Video Reel)\n- Wed: Behind-the-scenes (Stories)\n- Thu: Industry insight (LinkedIn Article)\n- Fri: Weekend engagement post (Poll/Quiz)\n\n**Week 2: Product Focus**\n- Mon: Feature deep-dive (Blog Post)\n- Tue: Use case showcase (TikTok)\n- Wed: Comparison content (Infographic)\n- Thu: User-generated content repost\n- Fri: Flash deal announcement\n\n**Week 3: Social Proof**\n- Mon: Testimonial highlight (Video)\n- Tue: Case study (LinkedIn)\n- Wed: Before/After transformation\n- Thu: Expert interview snippet\n- Fri: Community challenge\n\n**Week 4: Conversion Push**\n- Mon: Limited offer announcement\n- Tue: FAQ/objection handler\n- Wed: Social proof roundup\n- Thu: Last chance urgency\n- Fri: Month recap + next month teaser\n\nShall I generate the actual copy for any of these?`,
  'ad': `Let me optimize your ad spend allocation:\n\n**Current vs. Recommended:**\n\n| Channel | Current | Recommended | Change |\n|---------|---------|-------------|--------|\n| Google Ads | 35% | 22% | -13% |\n| Meta Ads | 25% | 35% | +10% |\n| LinkedIn | 15% | 12% | -3% |\n| TikTok | 10% | 18% | +8% |\n| Email | 15% | 13% | -2% |\n\n**Rationale:**\n- Meta Ads are delivering 2.3x ROAS vs Google's 1.4x\n- TikTok CPMs are 40% lower with 2.8x ROAS\n- Google Ads are hitting diminishing returns\n- Email remains highest ROAS (12.6x) but volume-limited\n\n**Projected Impact:**\n- Overall ROAS improvement: +28%\n- Monthly conversions: +340\n- Cost per acquisition: -$4.20`,
  'campaign': `Here's your go-to-market strategy framework:\n\n**Phase 1: Pre-Launch (2 weeks)**\n- Teaser content across all channels\n- Email list warm-up sequence\n- Influencer seeding program\n- Landing page with early access signup\n\n**Phase 2: Launch Week**\n- Day 1: Official announcement (all channels)\n- Day 2: Product demo video\n- Day 3: PR push + media outreach\n- Day 4: Influencer content goes live\n- Day 5: Flash launch offer\n\n**Phase 3: Sustain (2 weeks)**\n- Retargeting ads for site visitors\n- Email nurture sequence\n- Content marketing push\n- Community engagement campaign\n\n**Budget Allocation:**\n- Paid Media: 45%\n- Influencer: 20%\n- Content: 20%\n- PR: 10%\n- Tools: 5%`,
};

function getAIResponse(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes('brand') || lower.includes('position')) return aiResponses['brand'];
  if (lower.includes('content') || lower.includes('calendar')) return aiResponses['content'];
  if (lower.includes('ad') || lower.includes('spend') || lower.includes('budget') || lower.includes('roas')) return aiResponses['ad'];
  if (lower.includes('campaign') || lower.includes('launch') || lower.includes('strategy')) return aiResponses['campaign'];
  return `I'd be happy to help with that! Based on your marketing data and brand DNA, here are my recommendations:\n\n1. **Quick Win:** Your current engagement rate of 8.3% is above industry average (5.2%). Double down on the content formats driving this.\n\n2. **Growth Opportunity:** The 25-34 demographic segment shows the highest growth potential.\n\n3. **Efficiency Play:** Your email channel has the highest ROAS at 12.6x. Even a 10% increase in email volume could add $4.2K monthly revenue.\n\nWould you like me to dive deeper into any of these areas?`;
}

export default function AIAssistant() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchConversations(); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function fetchConversations() {
    const { data } = await supabase.from('ai_conversations').select('*').order('created_at', { ascending: false });
    if (data) setConversations(data as Conversation[]);
  }

  async function createConversation() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('ai_conversations').insert({ user_id: user.id, title: 'New Conversation' }).select().single();
    if (data) { setConversations([data as Conversation, ...conversations]); setActiveConversation(data.id); setMessages([]); }
  }

  async function sendMessage() {
    if (!input.trim()) return;
    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    const promptText = input.trim();
    setInput('');
    setIsTyping(true);

    if (activeConversation) {
      await supabase.from('ai_messages').insert({ conversation_id: activeConversation, role: 'user', content: promptText });
    }

    const fullResponse = getAIResponse(promptText);
    let i = 0;
    const assistantMessage: Message = { id: crypto.randomUUID(), role: 'assistant', content: '' };
    setMessages(prev => [...prev, assistantMessage]);

    const interval = setInterval(() => {
      const chunk = fullResponse.slice(0, i + 5);
      setMessages(prev => { const updated = [...prev]; updated[updated.length - 1] = { ...assistantMessage, content: chunk }; return updated; });
      i += 5;
      if (i >= fullResponse.length) {
        clearInterval(interval);
        setIsTyping(false);
        if (activeConversation) {
          supabase.from('ai_messages').insert({ conversation_id: activeConversation, role: 'assistant', content: fullResponse });
          if (messages.length === 0) {
            const title = promptText.slice(0, 40) + (promptText.length > 40 ? '...' : '');
            supabase.from('ai_conversations').update({ title }).eq('id', activeConversation);
            setConversations(prev => prev.map(c => c.id === activeConversation ? { ...c, title } : c));
          }
        }
      }
    }, 10);
  }

  async function deleteConversation(id: string) {
    await supabase.from('ai_conversations').delete().eq('id', id);
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversation === id) { setActiveConversation(null); setMessages([]); }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-grid">
      <div className="w-64 border-r border-theme-default bg-theme-surface-60 flex flex-col">
        <div className="p-3 border-b border-theme-default">
          <button onClick={createConversation} className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-semibold rounded-lg hover:from-blue-400 hover:to-cyan-400 transition-all">
            <Plus size={14} /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map((conv) => (
            <div key={conv.id} onClick={() => setActiveConversation(conv.id)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer transition-all group ${activeConversation === conv.id ? 'bg-blue-500/10 text-blue-400' : 'text-theme-tertiary hover:bg-theme-elevated-50 hover:text-theme-secondary'}`}>
              <Bot size={12} className="flex-shrink-0" />
              <span className="truncate flex-1">{conv.title}</span>
              <button onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }} className="opacity-0 group-hover:opacity-100 text-theme-faint hover:text-rose-400 transition-all"><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {activeConversation || messages.length > 0 ? (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4"><Sparkles size={28} className="text-cyan-400" /></div>
                  <h3 className="text-lg font-bold text-theme-primary mb-2">AI Marketing Strategist</h3>
                  <p className="text-sm text-theme-muted mb-6 max-w-md mx-auto">I can help with brand strategy, content creation, campaign optimization, and more.</p>
                  <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
                    {quickPrompts.map((qp) => (
                      <button key={qp.label} onClick={() => setInput(qp.prompt)} className="flex items-center gap-2 px-4 py-3 bg-theme-surface-80 border border-theme-default rounded-xl text-xs text-theme-secondary font-medium hover:border-cyan-500/30 hover:text-theme-primary transition-all text-left">
                        <span className="text-cyan-400">{qp.icon}</span>{qp.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5"><Bot size={14} className="text-white" /></div>
                  )}
                  <div className={`max-w-2xl rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-blue-500/20 border border-blue-500/20 text-blue-100' : 'bg-theme-elevated-50 border border-theme-default text-theme-secondary'}`}>
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                  </div>
                </div>
              ))}
              {isTyping && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0"><Bot size={14} className="text-white" /></div>
                  <div className="bg-theme-elevated-50 border border-theme-default rounded-2xl px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 typing-dot-1" />
                      <div className="w-2 h-2 rounded-full bg-cyan-400 typing-dot-2" />
                      <div className="w-2 h-2 rounded-full bg-cyan-400 typing-dot-3" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-theme-default bg-theme-surface-60">
              <div className="flex items-center gap-3 max-w-3xl mx-auto">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()} className="flex-1 h-10 px-4 text-sm bg-theme-input border border-theme-default rounded-xl text-theme-primary placeholder:text-theme-faint focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20" placeholder="Ask me anything about your marketing..." />
                <button onClick={sendMessage} disabled={!input.trim() || isTyping} className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl flex items-center justify-center hover:from-blue-400 hover:to-cyan-400 transition-all disabled:opacity-50"><Send size={16} /></button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-5 animate-float"><Bot size={36} className="text-cyan-400" /></div>
              <h3 className="text-xl font-bold text-theme-primary mb-2">AI Marketing Assistant</h3>
              <p className="text-sm text-theme-muted mb-6 max-w-md">Your AI-powered marketing strategist. Get insights, generate content, optimize campaigns.</p>
              <button onClick={createConversation} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold rounded-xl hover:from-blue-400 hover:to-cyan-400 transition-all glow-blue mx-auto">
                <Sparkles size={16} /> Start a Conversation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
