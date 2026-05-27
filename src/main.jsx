import React, { useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import {
  AlertTriangle,
  ArrowUp,
  Bot,
  CheckCircle2,
  Clock3,
  FileImage,
  Film,
  MessageCircle,
  Pause,
  Play,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Zap
} from 'lucide-react';
import { analyzeBrief, createLaunchPlan, REQUIRED_FIELDS } from './agentLogic.js';
import './styles.css';

const reviewTrend = [
  { day: '05-20', spend: 3.8, roi: 3.1, leads: 164 },
  { day: '05-21', spend: 4.2, roi: 3.6, leads: 188 },
  { day: '05-22', spend: 4.0, roi: 3.4, leads: 176 },
  { day: '05-23', spend: 5.3, roi: 4.2, leads: 241 },
  { day: '05-24', spend: 6.1, roi: 4.6, leads: 286 },
  { day: '05-25', spend: 6.8, roi: 5.1, leads: 320 },
  { day: '05-26', spend: 7.2, roi: 5.3, leads: 346 }
];

const initialCampaigns = [
  {
    id: 'RUN-618',
    title: '618 新客线索加速',
    status: '投放中',
    goal: '获取线索',
    channels: ['微信销售', 'App 内广告'],
    spend: 31420,
    budget: 80000,
    roi: 5.3,
    leads: 932,
    insight: '高意向用户分配到微信后，成交率比电话高 21%。'
  },
  {
    id: 'RUN-RET',
    title: '老客复购召回',
    status: '投放中',
    goal: '提升复购',
    channels: ['邮箱', '微信销售'],
    spend: 9860,
    budget: 36000,
    roi: 3.8,
    leads: 278,
    insight: '价格敏感用户更吃券，建议保留 60 元券素材。'
  },
  {
    id: 'HIS-Q2',
    title: '高客单价咨询转化复盘',
    status: '已结束',
    goal: '促进成交',
    channels: ['电话销售', '微信销售'],
    spend: 52200,
    budget: 52000,
    roi: 4.6,
    leads: 611,
    insight: '电话首句提及免费评估，平均通话时长提升 34%。'
  }
];

const quickPrompts = [
  '我想推广一款智能净水器，目标是促进成交，素材有图片和视频，渠道走微信销售和App内广告，点击后加微信私聊。',
  '帮我投放老客召回，产品是会员复购礼包，有海报和详情页，目标提升复购，渠道用邮箱和微信，交互是点击后领取优惠券。',
  '我还没有素材，先帮我列出投放前必须补齐的信息。'
];

const starterMessages = [
  {
    role: 'agent',
    type: 'intro',
    text: '我是云梯广告投放智能体。你不用进后台配一堆表单，直接告诉我要卖什么、目标是什么、素材有哪些、希望用户点击后做什么、投哪些渠道。我会缺什么问什么，信息齐后生成方案，但必须你二次确认后才会开始投放。'
  },
  {
    role: 'agent',
    type: 'question',
    text: REQUIRED_FIELDS[0].question
  }
];

const money = new Intl.NumberFormat('zh-CN');

function App() {
  const [messages, setMessages] = useState(starterMessages);
  const [brief, setBrief] = useState({ rawText: '' });
  const [input, setInput] = useState('');
  const [materials, setMaterials] = useState([]);
  const [pendingPlan, setPendingPlan] = useState(null);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [toast, setToast] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState(initialCampaigns[0]);
  const scrollRef = useRef(null);

  const analysis = useMemo(() => analyzeBrief('', { ...brief, materials }), [brief, materials]);
  const completion = Math.round(((REQUIRED_FIELDS.length - analysis.missing.length) / REQUIRED_FIELDS.length) * 100);

  const pushMessages = (nextMessages) => {
    setMessages((current) => [...current, ...nextMessages]);
    window.setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 50);
  };

  const showToast = (text) => {
    setToast(text);
    window.setTimeout(() => setToast(''), 2400);
  };

  const submitBrief = (text = input) => {
    const value = text.trim();
    if (!value) return;

    const next = analyzeBrief(value, { ...brief, materials });
    setBrief(next.extracted);
    setInput('');
    pushMessages([{ role: 'user', text: value }]);

    if (next.ready) {
      const plan = createLaunchPlan(next.extracted);
      setPendingPlan(plan);
      pushMessages([
        {
          role: 'agent',
          type: 'plan',
          text: '信息已经够了。我生成了一个待确认投放方案，确认后才会真正开始投放。',
          plan
        }
      ]);
      return;
    }

    pushMessages([
      {
        role: 'agent',
        type: 'question',
        text: next.nextQuestion
      }
    ]);
  };

  const addMaterial = (type) => {
    const nextMaterials = [...new Set([...materials, type])];
    setMaterials(nextMaterials);
    const next = analyzeBrief(`${type}素材已上传`, { ...brief, materials: nextMaterials });
    setBrief(next.extracted);
    pushMessages([
      { role: 'user', text: `已上传${type}素材` },
      { role: 'agent', text: next.ready ? '素材已接收，必填信息已齐。我可以生成投放方案了。' : next.nextQuestion }
    ]);
    if (next.ready) setPendingPlan(createLaunchPlan(next.extracted));
  };

  const confirmLaunch = () => {
    if (!pendingPlan) return;
    const newCampaign = {
      id: `RUN-AI-${campaigns.length + 1}`,
      title: pendingPlan.title,
      status: '投放中',
      goal: brief.goal,
      channels: pendingPlan.channels,
      spend: 0,
      budget: pendingPlan.budgetSuggestion,
      roi: 0,
      leads: 0,
      insight: '新计划进入学习期，系统会在 2 小时后生成第一轮复盘。'
    };
    setCampaigns((current) => [newCampaign, ...current]);
    setSelectedCampaign(newCampaign);
    setPendingPlan(null);
    pushMessages([{ role: 'agent', type: 'success', text: `已确认。${newCampaign.title} 已开始投放，我会持续观察数据并在复盘区更新。` }]);
    showToast('投放已开始，右侧复盘区已加入新任务。');
  };

  const toggleCampaign = (id) => {
    setCampaigns((current) => current.map((campaign) => {
      if (campaign.id !== id || campaign.status === '已结束') return campaign;
      const status = campaign.status === '投放中' ? '已暂停' : '投放中';
      if (selectedCampaign.id === id) setSelectedCampaign({ ...campaign, status });
      return { ...campaign, status };
    }));
  };

  const resetConversation = () => {
    setMessages(starterMessages);
    setBrief({ rawText: '' });
    setMaterials([]);
    setPendingPlan(null);
    setInput('');
  };

  return (
    <main className="agent-page">
      <section className="chat-stage">
        <header className="brand-row">
          <div className="brand-lockup">
            <strong>云梯科技</strong>
            <span>YUN TI TECHNOLOGY</span>
          </div>
          <div className="agent-status"><span />广告投放智能体在线</div>
        </header>

        <div className="hero-copy">
          <p>对话式广告 Agent</p>
          <h1>说出投放意图，AI 追问缺失信息，确认后自动开始投放。</h1>
        </div>

        <div className="requirement-strip">
          <div>
            <b>{completion}%</b>
            <span>必填信息完成度</span>
          </div>
          {REQUIRED_FIELDS.map((field) => {
            const value = analysis.extracted[field.key];
            const done = Array.isArray(value) ? value.length > 0 : Boolean(value);
            return <Requirement key={field.key} label={field.label} done={done} />;
          })}
        </div>

        <section className="chat-window">
          <div className="message-list" ref={scrollRef}>
            {messages.map((message, index) => <Message key={`${message.role}-${index}`} message={message} onConfirm={confirmLaunch} />)}
            {pendingPlan && !messages.some((message) => message.plan === pendingPlan) && (
              <Message message={{ role: 'agent', type: 'plan', text: '方案已生成，等待二次确认。', plan: pendingPlan }} onConfirm={confirmLaunch} />
            )}
          </div>

          <div className="composer">
            <div className="material-actions">
              <button onClick={() => addMaterial('图片')}><FileImage size={15} /> 上传图片素材</button>
              <button onClick={() => addMaterial('视频')}><Film size={15} /> 上传视频素材</button>
              <button onClick={() => submitBrief('我还没有素材，先告诉我需要准备哪些图片和视频。')}><UploadCloud size={15} /> 我还没有素材</button>
            </div>
            <div className="prompt-chips">
              {quickPrompts.map((prompt) => <button key={prompt} onClick={() => submitBrief(prompt)}>{prompt}</button>)}
            </div>
            <label className="input-shell">
              <textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="例如：我想推广智能净水器，目标促进成交，有图片和视频，投微信和App，点击后加微信私聊..." onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  submitBrief();
                }
              }} />
              <button onClick={() => submitBrief()}><Send size={17} /></button>
            </label>
          </div>
        </section>
      </section>

      <aside className="review-panel">
        <div className="review-header">
          <div>
            <p>往期数据复盘</p>
            <h2>包含正在投放中的任务</h2>
          </div>
          <button onClick={resetConversation}><RotateCcw size={15} /> 新会话</button>
        </div>

        <div className="campaign-list">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              active={selectedCampaign.id === campaign.id}
              onSelect={() => setSelectedCampaign(campaign)}
              onToggle={() => toggleCampaign(campaign.id)}
            />
          ))}
        </div>

        <section className="recap-card">
          <div className="recap-title">
            <div>
              <p>当前复盘</p>
              <h3>{selectedCampaign.title}</h3>
            </div>
            <StatusBadge status={selectedCampaign.status} />
          </div>
          <div className="kpi-grid">
            <Kpi label="消耗" value={`¥${money.format(selectedCampaign.spend)}`} />
            <Kpi label="预算" value={`¥${money.format(selectedCampaign.budget)}`} />
            <Kpi label="ROI" value={selectedCampaign.roi || '学习中'} />
            <Kpi label="线索" value={selectedCampaign.leads || '生成中'} />
          </div>
          <div className="mini-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reviewTrend}>
                <defs>
                  <linearGradient id="roi" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#16a085" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#16a085" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6edf5" />
                <XAxis dataKey="day" hide />
                <YAxis hide />
                <Tooltip />
                <Area dataKey="roi" stroke="#16a085" fill="url(#roi)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="insight-box">
            <Sparkles size={17} />
            <p>{selectedCampaign.insight}</p>
          </div>
        </section>

        <section className="recap-card compact">
          <div className="recap-title">
            <div>
              <p>渠道贡献</p>
              <h3>近 7 日线索分布</h3>
            </div>
          </div>
          <div className="bar-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: '微信', value: 416 },
                { name: '电话', value: 192 },
                { name: '邮箱', value: 133 },
                { name: 'App', value: 531 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6edf5" />
                <XAxis dataKey="name" />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </aside>

      {toast && <div className="toast"><CheckCircle2 size={16} />{toast}</div>}
    </main>
  );
}

function Requirement({ label, done }) {
  return (
    <div className={`requirement ${done ? 'done' : ''}`}>
      {done ? <CheckCircle2 size={15} /> : <Clock3 size={15} />}
      <span>{label}</span>
    </div>
  );
}

function Message({ message, onConfirm }) {
  return (
    <article className={`message ${message.role} ${message.type || ''}`}>
      <div className="avatar">{message.role === 'agent' ? <Bot size={17} /> : <MessageCircle size={17} />}</div>
      <div className="bubble">
        <p>{message.text}</p>
        {message.plan && <PlanCard plan={message.plan} onConfirm={onConfirm} />}
      </div>
    </article>
  );
}

function PlanCard({ plan, onConfirm }) {
  return (
    <div className="plan-card">
      <div className="plan-head">
        <div>
          <span>{plan.status}</span>
          <h3>{plan.title}</h3>
        </div>
        <ShieldCheck size={22} />
      </div>
      <div className="plan-grid">
        <Kpi label="建议预算" value={`¥${money.format(plan.budgetSuggestion)}`} />
        <Kpi label="预计曝光" value={plan.forecast.impressions} />
        <Kpi label="预计转化" value={plan.forecast.conversions} />
        <Kpi label="预计 ROI" value={plan.forecast.roi} />
      </div>
      <ul>
        {plan.steps.map((step) => <li key={step}>{step}</li>)}
      </ul>
      <div className="plan-actions">
        <button onClick={onConfirm}><Zap size={16} /> {plan.confirmButton}</button>
        <button className="ghost"><AlertTriangle size={16} /> 先不要投，继续修改</button>
      </div>
    </div>
  );
}

function CampaignCard({ campaign, active, onSelect, onToggle }) {
  const running = campaign.status === '投放中';
  return (
    <article className={`campaign-card ${active ? 'active' : ''}`} onClick={onSelect}>
      <div className="campaign-main">
        <StatusBadge status={campaign.status} />
        <h3>{campaign.title}</h3>
        <p>{campaign.goal} · {campaign.channels.join(' / ')}</p>
      </div>
      {campaign.status !== '已结束' && (
        <button className="pause-btn" onClick={(event) => { event.stopPropagation(); onToggle(); }}>
          {running ? <Pause size={15} /> : <Play size={15} />}
          {running ? '暂停' : '继续'}
        </button>
      )}
    </article>
  );
}

function StatusBadge({ status }) {
  return <span className={`status ${status === '投放中' ? 'running' : status === '已暂停' ? 'paused' : 'ended'}`}>{status}</span>;
}

function Kpi({ label, value }) {
  return <div className="kpi"><span>{label}</span><strong>{value}</strong></div>;
}

createRoot(document.getElementById('root')).render(<App />);
